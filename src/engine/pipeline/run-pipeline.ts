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
 * [입력]
 *   - CharacterDisplayData (스킬 목록, 직업명 등)
 *   - PipelineEffectLog[] (각인/카드/장비/아크그리드 등 전체 효과)
 *   - StatModifiers (공격력 계산용)
 *   - CombatStats (baseAtk, finalAtk, specialization 등)
 *
 * [출력]
 *   SkillDamageResult[] (스킬별 피해량)
 */

import { CharacterDisplayData, SkillDisplay } from '@/types/character-types';
import { StatModifiers } from '@/types/sim-types';
import { SkillData, TripodData } from '@/types/skill';

import { resolveSkillMeta } from './0-resolve-skill';
import { buildStaticBuffer } from './1-static-buffer';
import { buildDynamicBuffers } from './2-dynamic-buffer';
import { processAllSpecials } from './3-special/index';
import { finalizeAllBuffers } from './finalize-buffer';
import { calcAllAtk } from '@/engine/calc/atk-calculator';
import { calcSkillDamage, SkillDamageResult } from '@/engine/calc/damage-calculator';
import { PipelineEffectLog, ResolvedSkillMeta } from './types';

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
      t => t.slot === dt.slot && t.name === dt.name.text
    ))
    .filter((t): t is TripodData => t !== undefined);
};


// ============================================================
// 헬퍼: 트라이포드 effects → PipelineEffectLog 변환
// ============================================================

/**
 * 선택된 트라이포드의 effects를 PipelineEffectLog로 변환
 * (스킬 전용 효과 — target.skillIds로 이 스킬에 대한 타겟 지정)
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
// 메인: runPipeline
// ============================================================

/**
 * 파이프라인 전체 실행
 *
 * @param display     - CharacterDisplayData
 * @param effectLogs  - 캐릭터 전체 효과 로그 (각인/카드/장비 등)
 * @param statMods    - StatModifiers (공격력 계산용)
 * @param combatInfo  - { baseAtk, specialization } API에서 받아온 수치
 */
export const runPipeline = (
  display    : CharacterDisplayData,
  effectLogs : PipelineEffectLog[],
  statMods   : StatModifiers,
  combatInfo : { baseAtk: number; specialization: number },
): SkillDamageResult[] => {
  const { className } = display.profile;
  const skillDb = CLASS_SKILL_DB[className];
  if (!skillDb) return [];

  // ── 0단계: 스킬 메타 + 트라이포드 effectLog 수집 ──────────
  const resolvedSkills : ResolvedSkillMeta[] = [];
  const allEffectLogs  : PipelineEffectLog[] = [...effectLogs];

  display.skills.forEach(displaySkill => {
    const dbSkill = skillDb.find(s => s.name === displaySkill.name);
    if (!dbSkill) return;

    const selectedTripods = resolveSelectedTripods(dbSkill, displaySkill.selectedTripods);

    // 스킬 특성 확정
    const meta = resolveSkillMeta(dbSkill, displaySkill.level, selectedTripods);
    resolvedSkills.push(meta);

    // 트라이포드 효과 로그 수집 → 전체 effectLogs에 합산
    const tripodLogs = collectTripodEffectLogs(dbSkill, selectedTripods);
    allEffectLogs.push(...tripodLogs);
  });

  if (resolvedSkills.length === 0) return [];

  // ── 1단계: Static 버퍼 ────────────────────────────────────
  const { staticBuffer, dynamicLogs, specialLogs } =
    buildStaticBuffer(allEffectLogs);

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

  // ── 3단계: Special 처리 ────────────────────────────────────
  processAllSpecials(
    skillStatsBuffer,
    resolvedSkills,
    specialLogs,
    className,
    combatInfo.specialization,
  );

  // ── 최종 확정: BufferMap → DamageModifiers ─────────────────
  finalizeAllBuffers(skillStatsBuffer);

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

  return results;
};
