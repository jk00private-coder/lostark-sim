/**
 * @/engine/pipeline/run-pipeline.ts
 *
 * 데미지 계산 파이프라인 전체 실행 진입점
 *
 * [실행 순서]
 *   0단계: resolveSkillMeta  — 스킬 특성 확정 (overrides 적용)
 *   1단계: buildStaticBuffer — Static 버퍼 구성
 *   2단계: buildDynamicBuffers — 스킬별 Dynamic 버퍼
 *   3단계: processAllSpecials — Special 처리
 *   확정 : finalizeAllBuffers — BufferMap → DamageModifiers
 *
 * [반환값]
 *   { results, debug }
 *   results : SkillDamageResult[]  — 스킬별 최종 피해량
 *   debug   : PipelineDebugData   — 각 단계 중간값 (디버깅용)
 */

import { CharacterDisplayData, SkillDisplay } from '@/types/character-types';
import { StatModifiers } from '@/types/sim-types';
import { SkillData, TripodData } from '@/types/skill-types';

import { resolveSkillMeta } from './0-resolve-skill';
import { buildStaticBuffer } from './1-static-buffer';
import { buildDynamicBuffers } from './2-dynamic-buffer';
import { processAllSpecials } from './3-special/index';
import { finalizeAllBuffers } from './finalize-buffer';
import { calcAllAtk } from '@/engine/calc/atk-calculator';
import { calcSkillDamage, SkillDamageResult } from '@/engine/calc/damage-calculator';
import {
  PipelineEffectLog,
  ResolvedSkillMeta,
  PipelineDebugData,
  SkillMetaDebug,
  BufferMap,
} from './types';

import { SKILLS_GUARDIAN_KNIGHT_DB } from '@/data/skills/guardian-knight-skills';


// ============================================================
// 직업 → 스킬 DB 매핑
// ============================================================

const CLASS_SKILL_DB: Record<string, SkillData[]> = {
  '가디언나이트': SKILLS_GUARDIAN_KNIGHT_DB,
};


// ============================================================
// 헬퍼: 선택된 트라이포드 DB 매핑
// ============================================================

const resolveSelectedTripods = (
  skillDb      : SkillData,
  displayTripods: SkillDisplay['selectedTripods'],
): TripodData[] => {
  if (!skillDb.tripods) return [];

  return displayTripods
    .map(dt => skillDb.tripods!.find(
      t => t.slot === dt.slot && t.name === dt.name
    ))
    .filter((t): t is TripodData => t !== undefined);
};


// ============================================================
// 헬퍼: 트라이포드 effects → PipelineEffectLog 변환
// ============================================================

/**
 * 선택된 트라이포드의 effects를 PipelineEffectLog로 변환
 */
const collectTripodEffectLogs = (
  skillDb        : SkillData,
  selectedTripods: TripodData[],
): PipelineEffectLog[] => {
  const logs: PipelineEffectLog[] = [];

  selectedTripods.forEach(tripod => {
    // link 조건 확인
    if (tripod.link) {
      const linked = selectedTripods.find(t => t.slot === tripod.link!.slot);
      if (!linked) return;
    }

    if (!tripod.effects) return;

    tripod.effects.forEach(eff => {
      if (!eff.value) return;

      // target.skillIds 필터: 이 스킬 ID가 포함된 경우만
      if (eff.target?.skillIds && !eff.target.skillIds.includes(skillDb.id)) return;

      logs.push({
        label   : `${skillDb.name} ${tripod.name}`,
        type    : eff.type,
        value   : eff.value[0] ?? 0,
        subGroup: eff.subGroup,
        target  : eff.target,
        special : (eff as any).special,
      });
    });
  });

  return logs;
};


// ============================================================
// 헬퍼: BufferMap 깊은 복사 (스냅샷용)
// ============================================================

/**
 * 디버그 스냅샷용 BufferMap 깊은 복사
 * 파이프라인 진행 중 버퍼가 계속 변하므로
 * 각 단계 완료 직후 반드시 복사해야 함
 */
const snapshotBufferMap = (source: BufferMap): BufferMap => {
  const snap: BufferMap = {};
  for (const type in source) {
    snap[type] = {};
    for (const group in source[type]) {
      snap[type][group] = [...source[type][group]];
    }
  }
  return snap;
};


// ============================================================
// 헬퍼: 0단계 디버그 데이터 생성
// ============================================================

/**
 * resolveSkillMeta 결과 + 원본 스킬 DB에서 디버그 데이터 수집
 *
 * [수집 항목]
 *   - 스킬 레벨, 쿨타임, 카테고리, typeId, attackId, qiCost
 *   - 적용된 트라이포드 이름 목록
 *   - 피해원(sources)의 상수/계수 (override 및 레벨 적용 후 값)
 */
const buildSkillMetaDebug = (
  meta          : ResolvedSkillMeta,
  skillDb       : SkillData,
  selectedTripods: TripodData[],
  skillLevel    : number,
): SkillMetaDebug => ({
  skillId       : meta.skillId,
  skillName     : meta.skillName,
  level         : skillLevel,
  categories    : meta.categories,
  typeId        : meta.typeId,
  attackId      : meta.attackId,
  cooldown      : skillDb.cooldown,
  resourceType  : meta.resourceType,
  qiCost        : meta.qiCost,
  appliedTripods: selectedTripods.map(t => t.name),
  sources       : meta.sources.map(s => ({
    name       : s.name,
    isCombined : s.isCombined,
    hits       : s.hits,
    constant   : s.constant,
    coefficient: s.coefficient,
  })),
});


// ============================================================
// 메인: runPipeline
// ============================================================

/**
 * 파이프라인 전체 실행
 *
 * @param display     - CharacterDisplayData
 * @param effectLogs  - 캐릭터 전체 효과 로그 (각인/카드/장비 등)
 * @param statMods    - StatModifiers (공격력 계산용)
 * @param combatInfo  - { baseAtk, specialization } API에서 받아온 수치
 * @returns           { results, debug }
 */
export const runPipeline = (
  display    : CharacterDisplayData,
  effectLogs : PipelineEffectLog[],
  statMods   : StatModifiers,
  combatInfo : { baseAtk: number; specialization: number },
): { results: SkillDamageResult[]; debug: PipelineDebugData } => {

  const { className } = display.profile;
  const skillDb = CLASS_SKILL_DB[className];

  // 등록되지 않은 직업이면 빈 결과 반환
  if (!skillDb) {
    return {
      results: [],
      debug  : {
        inputLogs           : effectLogs,
        step0_resolvedSkills: [],
        step1_staticBuffer  : {},
        step2_dynamicBuffers: {},
        step3_specialBuffers: {},
        atkStats            : { weaponAtk: 0, mainStat: 0, baseAtk: 0, finalAtk: 0 },
        finalMods           : {},
        skillNameMap        : {},
      },
    };
  }

  // ── 0단계: 스킬 메타 + 트라이포드 effectLog 수집 ──────────
  const resolvedSkills   : ResolvedSkillMeta[] = [];
  const allEffectLogs    : PipelineEffectLog[] = [...effectLogs];
  const step0Debug       : SkillMetaDebug[]    = [];

  display.skills.forEach(displaySkill => {
    const dbSkill = skillDb.find(s => s.name === displaySkill.name);
    if (!dbSkill) return;

    const selectedTripods = resolveSelectedTripods(dbSkill, displaySkill.selectedTripods);

    // 스킬 특성 확정 (overrides 적용 후)
    const meta = resolveSkillMeta(dbSkill, displaySkill.level, selectedTripods);
    resolvedSkills.push(meta);

    // ── 0단계 디버그: resolveSkillMeta 완료 직후 수집 ──────
    step0Debug.push(buildSkillMetaDebug(meta, dbSkill, selectedTripods, displaySkill.level));

    // 트라이포드 효과 로그 수집 → 전체 effectLogs에 합산
    const tripodLogs = collectTripodEffectLogs(dbSkill, selectedTripods);
    allEffectLogs.push(...tripodLogs);
  });

  if (resolvedSkills.length === 0) {
    return {
      results: [],
      debug  : {
        inputLogs           : allEffectLogs,
        step0_resolvedSkills: step0Debug,
        step1_staticBuffer  : {},
        step2_dynamicBuffers: {},
        step3_specialBuffers: {},
        atkStats            : { weaponAtk: 0, mainStat: 0, baseAtk: 0, finalAtk: 0 },
        finalMods           : {},
        skillNameMap        : {},
      },
    };
  }

  // ── 1단계: Static 버퍼 ────────────────────────────────────
  const { staticBuffer, dynamicLogs, specialLogs } =
    buildStaticBuffer(allEffectLogs);

  // ── 1단계 디버그: buildStaticBuffer 완료 직후 스냅샷 ──────
  const step1Snapshot = snapshotBufferMap(staticBuffer);

  // ── 공격력 4종 계산 ────────────────────────────────────────
  // ATK_P는 staticBuffer에서 읽음
  const { weaponAtk, mainStat, baseAtk, finalAtk } =
    calcAllAtk(statMods, staticBuffer);

  // ── 2단계: Dynamic 버퍼 (스킬별) ────────────────────────────
  const skillStatsBuffer = buildDynamicBuffers(
    resolvedSkills,
    staticBuffer,
    dynamicLogs,
  );

  // ── 2단계 디버그: buildDynamicBuffers 완료 직후 스냅샷 ─────
  // 스킬별 BufferMap을 각각 깊은 복사
  const step2Snapshot: Record<number, BufferMap> = {};
  Object.entries(skillStatsBuffer).forEach(([id, buf]) => {
    step2Snapshot[Number(id)] = snapshotBufferMap(buf.bufferMap);
  });

  // ── 3단계: Special 처리 ────────────────────────────────────
  processAllSpecials(
    skillStatsBuffer,
    resolvedSkills,
    specialLogs,
    className,
    combatInfo.specialization,
  );

  // ── 3단계 디버그: processAllSpecials 완료 직후 스냅샷 ──────
  const step3Snapshot: Record<number, BufferMap> = {};
  Object.entries(skillStatsBuffer).forEach(([id, buf]) => {
    step3Snapshot[Number(id)] = snapshotBufferMap(buf.bufferMap);
  });

  // ── 최종 확정: BufferMap → DamageModifiers ─────────────────
  finalizeAllBuffers(skillStatsBuffer);

  // ── 확정 디버그: finalMods 수집 ────────────────────────────
  const finalModsDebug: Record<number, import('@/types/sim-types').DamageModifiers> = {};
  Object.entries(skillStatsBuffer).forEach(([id, buf]) => {
    if (buf.finalMods) finalModsDebug[Number(id)] = { ...buf.finalMods };
  });

  // 스킬 이름 역참조 맵 생성 (id → name)
  const skillNameMap: Record<number, string> = {};
  resolvedSkills.forEach(m => { skillNameMap[m.skillId] = m.skillName; });

  // ── 피해량 계산 ──────────────────────────────────────────────
  const results: SkillDamageResult[] = [];

  resolvedSkills.forEach(meta => {
    const skillBuffer = skillStatsBuffer[meta.skillId];
    if (!skillBuffer?.finalMods) return;

    const result = calcSkillDamage(
      meta.skillName,
      meta.categories,
      meta.sources,
      skillBuffer.finalMods,
      finalAtk,
      baseAtk,
    );

    results.push(result);
  });

  // ── 디버그 데이터 조립 및 반환 ─────────────────────────────
  const debug: PipelineDebugData = {
    inputLogs           : allEffectLogs,
    step0_resolvedSkills: step0Debug,
    step1_staticBuffer  : step1Snapshot,
    step2_dynamicBuffers: step2Snapshot,
    step3_specialBuffers: step3Snapshot,
    atkStats            : { weaponAtk, mainStat, baseAtk, finalAtk },
    finalMods           : finalModsDebug,
    skillNameMap,
  };

  return { results, debug };
};