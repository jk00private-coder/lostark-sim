/**
 * @/engine/pipeline/run-pipeline.ts
 *
 * 데미지 계산 파이프라인 전체 실행 진입점
 *
 * [실행 순서]
 *   0단계: resolveSkillMeta  — 스킬 특성 확정 (overrides 적용)
 *   1단계: buildStaticBuffer — Static 버퍼 구성 + 로그 분류
 *   2단계: buildDynamicBuffers — 스킬별 Dynamic 버퍼
 *   3단계: processAllSpecials — Special 처리
 *   확정 : finalizeAllBuffers — BufferMap → DamageModifiers
 *   후처리: buildSkillDetailLogs — UI 상세 로그 생성
 *
 * [반환값]
 *   { results, debug }
 *   results : SkillDamageResult[]  — 스킬별 최종 피해량
 *   debug   : PipelineDebugData   — 각 단계 중간값 + UI 소비용 데이터
 *
 * [로그 분류 설계]
 *   공격력 로그(ATK_RELATED_TYPES): 스킬 계산과 무관, 공격력 계산 전용
 *   → atkDetailLogs로 분리, buildStaticBuffer 투입에서 제외
 *
 *   나머지 로그는 buildStaticBuffer에서 static/dynamic/special로 분류
 *   → 각각 디버그 데이터에 저장 (useSimulatorStore에서 재분류 불필요)
 *
 * [변경 이력]
 *   - ATK_RELATED_TYPES 상수 및 splitAtkLogs() 추가
 *   - buildStaticBuffer 반환값(dynamicLogs, specialLogs)을 debug에 직접 저장
 *   - buildSkillDetailLogs() 추가: 최종 버퍼 → EffectRow[] 생성
 *   - PipelineDebugData에 atkDetailLogs, staticLogs, dynamicLogs,
 *     specialLogs, skillDetailLogs 추가
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
  SkillDetailLog,
  EffectRow,
  BufferMap,
  SkillStatsBuffer,
} from './types';

import { getSkillIdMap } from '@/data/_class-registry';


// ============================================================
// 공격력 관련 로그 타입 상수
// ============================================================

/**
 * 공격력 계산에만 사용되는 effectType 목록
 *
 * [분리 이유]
 *   이 타입들은 스킬별 DamageModifiers가 아닌 StatModifiers에 누산되며,
 *   calcAllAtk()에서 최종 공격력을 계산하는 데만 쓰입니다.
 *   buildStaticBuffer에 투입하면 스킬 버퍼에 불필요하게 포함되므로 분리합니다.
 *
 * [UI 활용]
 *   분리된 로그는 atkDetailLogs로 저장되어
 *   공격력 수치 호버 시 표시됩니다.
 */
const ATK_RELATED_TYPES = new Set([
  'WEAPON_ATK_C', 'WEAPON_ATK_P',
  'MAIN_STAT_C',  'MAIN_STAT_P',
  'ATK_C',        'ATK_P',
  'BASE_ATK_P',
  'STAT_HP_C', 'STAT_HP_P',
]);

/**
 * allEffectLogs를 공격력 로그 / 스킬 계산 로그로 분리
 *
 * @returns
 *   atkLogs      : 공격력 계산 전용 (StatModifiers 누산용)
 *   skillCalcLogs: 스킬별 버퍼 구성에 투입될 로그
 */
const splitAtkLogs = (
  allLogs: PipelineEffectLog[],
): {
  atkLogs      : PipelineEffectLog[];
  skillCalcLogs: PipelineEffectLog[];
} => {
  const atkLogs       : PipelineEffectLog[] = [];
  const skillCalcLogs : PipelineEffectLog[] = [];

  allLogs.forEach(log => {
    if (ATK_RELATED_TYPES.has(log.type)) {
      atkLogs.push(log);
    } else {
      skillCalcLogs.push(log);
    }
  });

  return { atkLogs, skillCalcLogs };
};


// ============================================================
// 헬퍼: 선택된 트라이포드 DB 매핑
// ============================================================

const resolveSelectedTripods = (
  skillDb       : SkillData,
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
        label   : `${skillDb.name}-${tripod.name}`,
        type    : eff.type,
        value   : eff.value[0] ?? 0,
        subGroup: eff.subGroup,
        target  : eff.target,
        overrides: tripod.overrides ? tripod.overrides : undefined,
        special : (eff as any).special,
      });
    });
  });

  return logs;
};


// ============================================================
// 헬퍼: BufferMap 깊은 복사 (스냅샷용)
// ============================================================

const snapshotBufferMap = (source: BufferMap): BufferMap => {
  const snap: BufferMap = {};
  for (const type in source) {
    snap[type] = {};
    for (const group in source[type]) {
      snap[type][group] = source[type][group].map(item => ({ ...item }));
    }
  }
  return snap;
};


// ============================================================
// 헬퍼: 0단계 디버그 데이터 생성
// ============================================================

const buildSkillMetaDebug = (
  meta           : ResolvedSkillMeta,
  skillDb        : SkillData,
  selectedTripods: TripodData[],
  skillLevel     : number,
): SkillMetaDebug => ({
  skillId       : meta.skillId,
  skillName     : meta.skillName,
  level         : skillLevel,
  categories    : meta.categories,
  typeId        : meta.typeId,
  attackId      : meta.attackId,
  cooldown      : skillDb.cooldown,
  resourceType  : meta.resourceType,
  cost          : meta.cost,
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
// 헬퍼: 최종 버퍼 → EffectRow[] 생성 (UI 상세 로그용)
// ============================================================
const buildEffectRows = (
  bufferMap     : BufferMap,
  skillCalcLogs : PipelineEffectLog[],
): EffectRow[] => {
  const rows: EffectRow[] = [];

  Object.entries(bufferMap).forEach(([type, subGroups]) => {
    Object.entries(subGroups).forEach(([group, items]) => {
      const displayGroup = group.startsWith('__solo_') ? '-' : group;

      items.forEach(item => {
        // item.i에 이미 원본 인덱스가 들어있으므로 즉시 참조[cite: 1, 3]
        // dynamic 로그 오프셋(10000) 처리가 필요하다면 여기서 수행
        const logIdx = item.i >= 10000 ? item.i - 10000 : item.i;
        const log = skillCalcLogs[logIdx];

        if (log) {
          rows.push({
            label   : log.label,
            type,
            value   : item.v, // .v 사용[cite: 2]
            subGroup: displayGroup,
            desc    : log.desc ?? '-',
          });
        } else {
          rows.push({
            label   : '(계산됨)',
            type,
            value   : item.v,
            subGroup: displayGroup,
            desc    : '-',
          });
        }
      });
    });
  });

  return rows;
};

/**
 * 전체 스킬의 SkillDetailLog 생성
 *
 * [호출 시점]
 *   finalizeAllBuffers 완료 후 (step3 버퍼가 확정된 상태)
 *
 * @param resolvedSkills  - 0단계 스킬 메타 목록
 * @param skillCalcLogs   - 공격력 로그 제외 후 스킬 계산에 투입된 로그
 */
const DETAIL_CATEGORIES = [
  { key: 'damageInc',        label: '피해 증가',         types: ['DMG_INC'] },
  { key: 'evoDamage',        label: '진화형 피해',       types: ['EVO_DMG'] },
  { key: 'addDamage',        label: '추가 피해',         types: ['ADD_DMG'] },
  { key: 'critChance',       label: '치명타 확률',       types: ['CRIT_CHANCE'] },
  { key: 'critDamage',       label: '치명타 피해',       types: ['CRIT_DMG'] },
  { key: 'critDamageInc',    label: '치명타시 피해 증가', types: ['CRIT_DMG_INC'] },
  { key: 'defPenetration',   label: '방어력 관통',       types: ['DEF_PENETRATION'] },
  { key: 'enemyDamageTaken', label: '적 받는 피해 증가',  types: ['ENEMY_DMG_TAKEN'] },
  { key: 'cooldownRed',      label: '쿨타임 감소',       types: ['CDR_C', 'CDR_P'] },
  { key: 'speed',            label: '공격/이동 속도',    types: ['SPEED_ATK', 'SPEED_MOV'] },
];

/**
 * 스킬별 상세 로그 생성 (분류 및 수치 포함)[cite: 3, 8]
 */
const buildSkillDetailLogs = (
  resolvedSkills : ResolvedSkillMeta[],
  skillStatsBuffer: SkillStatsBuffer,
  staticLogs: PipelineEffectLog[],
  dynamicLogs: PipelineEffectLog[],
  specialLogs: PipelineEffectLog[]
): Record<number, SkillDetailLog> => {
  const result: Record<number, SkillDetailLog> = {};

  resolvedSkills.forEach(meta => {
    const sb = skillStatsBuffer[meta.skillId];
    if (!sb) return;

    const groups: Record<string, any> = {};

    // 카테고리별로 순회하며 데이터 분류
    DETAIL_CATEGORIES.forEach(cat => {
      const rows: EffectRow[] = [];
      
      // bufferMap에서 해당 카테고리에 속하는 타입들 추출[cite: 4]
      cat.types.forEach(type => {
        const subGroups = sb.bufferMap[type];
        if (!subGroups) return;

        Object.entries(subGroups).forEach(([groupKey, items]) => {
          items.forEach(item => {
            let log: PipelineEffectLog | undefined;

            if (item.i >= 20000) { log = specialLogs[item.i - 20000]; }
            else if (item.i >= 10000) { log = dynamicLogs[item.i - 10000]; }
            else { log = staticLogs[item.i]; }

            rows.push({
              label: log?.label ?? '(계산됨)',
              type,
              value: item.v,
              subGroup: groupKey.startsWith('__solo_') ? '-' : groupKey,
              desc: log?.desc ?? '-',
            });
          });
        });
      });

      if (rows.length > 0) {
        // 해당 카테고리의 최종 합산 수치 (DamageModifiers에서 가져옴)
        const finalValue = (sb.finalMods as any)?.[cat.key] ?? 0;
        groups[cat.key] = {
          label: cat.label,
          finalValue,
          rows
        };
      }
    });

    result[meta.skillId] = {
      skillId: meta.skillId,
      skillName: meta.skillName,
      groups, // 분류된 데이터 덩어리[cite: 8]
    } as any;
  });

  return result;
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
 * @param combatInfo  - { baseAtk, specialization }
 * @returns           { results, debug }
 */
export const runPipeline = (
  display    : CharacterDisplayData,
  effectLogs : PipelineEffectLog[],
  statMods   : StatModifiers,
  combatInfo : { baseAtk: number; specialization: number },
): { results: SkillDamageResult[]; debug: PipelineDebugData } => {

  const className = display.profile.className;
  const skillIdMap = getSkillIdMap(className);

  // ── 0단계: 스킬 메타 + 트라이포드 effectLog 수집 ──────────
  const resolvedSkills : ResolvedSkillMeta[] = [];
  const allEffectLogs  : PipelineEffectLog[] = [...effectLogs];
  const step0Debug     : SkillMetaDebug[]    = [];

  display.skills.forEach(displaySkill => {
    const dbSkill = skillIdMap.get(displaySkill.id);
    if (!dbSkill) return;

    const selectedTripods = resolveSelectedTripods(dbSkill, displaySkill.selectedTripods);

    const meta = resolveSkillMeta(dbSkill, displaySkill.level, selectedTripods, allEffectLogs);
    resolvedSkills.push(meta);

    step0Debug.push(buildSkillMetaDebug(meta, dbSkill, selectedTripods, displaySkill.level));

    const tripodLogs = collectTripodEffectLogs(dbSkill, selectedTripods);
    allEffectLogs.push(...tripodLogs);
  });

  // ── 공격력 로그 분리 ───────────────────────────────────────
  // allEffectLogs 전체를 공격력 전용 / 스킬 계산 전용으로 분리
  // skillCalcLogs만 buildStaticBuffer에 투입하여 스킬 버퍼 오염 방지
  const { atkLogs: atkDetailLogs, skillCalcLogs } = splitAtkLogs(allEffectLogs);

  // ── 1단계: Static 버퍼 ────────────────────────────────────
  const { staticBuffer, dynamicLogs, specialLogs } = buildStaticBuffer(skillCalcLogs);

  // staticLogs: skillCalcLogs 중 target 없음 + special 아님 (= staticBuffer에 들어간 것들)
  const staticLogs = skillCalcLogs.filter(l => !l.special && !l.target);

  // ── 공격력 4종 계산 ────────────────────────────────────────
  // ATK_P는 staticBuffer에서 읽음 (공격력 로그를 분리했으므로 staticBuffer엔 없음)
  // StatModifiers는 collectEffectLogs에서 이미 누산됨
  const { weaponAtk, mainStat, baseAtk, finalAtk } =
    calcAllAtk(statMods, staticBuffer);

  // ── 2단계: Dynamic 버퍼 (스킬별) ─────────────────────────
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

  // finalMods 수집
  const finalModsDebug: Record<number, import('@/types/sim-types').DamageModifiers> = {};
  Object.entries(skillStatsBuffer).forEach(([id, buf]) => {
    if (buf.finalMods) finalModsDebug[Number(id)] = { ...buf.finalMods };
  });
  console.log('최종 스킬별 buffer', skillStatsBuffer);

  // 스킬 이름 역참조 맵
  const skillNameMap: Record<number, string> = {};
  resolvedSkills.forEach(m => { skillNameMap[m.skillId] = m.skillName; });

  // ── UI 상세 로그 생성 ──────────────────────────────────────
  // 3단계 스냅샷(최종 버퍼)을 기반으로 스킬별 EffectRow[] 생성
  // skillCalcLogs를 원본으로 역탐색하여 출처(label) 복원
  const skillDetailLogs = buildSkillDetailLogs(
    resolvedSkills,
    skillStatsBuffer,
    skillCalcLogs,
    dynamicLogs,
    specialLogs
  );

  // ── 피해량 계산 ───────────────────────────────────────────
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

  // ── 디버그 데이터 조립 ─────────────────────────────────────
  const debug: PipelineDebugData = {
    inputLogs           : allEffectLogs,
    atkDetailLogs,
    staticLogs,
    dynamicLogs,
    specialLogs,
    step0_resolvedSkills: step0Debug,
    atkStats            : { weaponAtk, mainStat, baseAtk, finalAtk },
    finalMods           : finalModsDebug,
    skillDetailLogs,
    skillNameMap,
  };

  return { results, debug };
};