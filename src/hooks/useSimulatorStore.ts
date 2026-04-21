/**
 * @/hooks/useSimulatorStore.ts
 *
 * 파이프라인 기반 캐릭터 계산 Store
 *
 * [역할]
 *   1. CharacterDisplayData → PipelineEffectLog[] 수집
 *   2. StatModifiers 구성 (장비 기본 스탯 합산)
 *   3. runPipeline() 호출
 *   4. SkillDamageResult[] 저장
 *
 * [콘솔 디버그 출력]
 *   🔵 [1단계] StaticBuffer   — target 없는 공통 효과
 *   🟡 [1단계] DynamicLogs    — target 있는 조건부 효과
 *   🔴 [1단계] SpecialLogs    — special=true 효과
 *   🟢 [2단계] SkillBuffer    — 스킬별 버퍼 (Dynamic 추가 후)
 *   🟣 [3단계] FinalMods      — 스킬별 확정 DamageModifiers
 *   ⚪ [결과]  SkillDamage    — 최종 피해량
 */

"use client";

import { useState, useEffect } from 'react';
import { CharacterDisplayData } from '@/types/character-types';
import {
  StatModifiers,
  CommonEffectTypeId,
  EFFECT_MAP,
  SUB_GROUPS,
  DamageModifiers,
} from '@/types/sim-types';
import { PipelineEffectLog } from '@/engine/pipeline/types';
import { runPipeline } from '@/engine/pipeline/run-pipeline';
import { SkillDamageResult } from '@/engine/calc/damage-calculator';
import { ENGRAVINGS_DB } from '@/data/engravings';
import { COMBAT_EQUIP_DB } from '@/data/equipment/combat-equip';


// ============================================================
// StatModifiers 초기값
// ============================================================

const createEmptyStatModifiers = (): StatModifiers => ({
  mainStatC : 0,  mainStatP : 0,
  weaponAtkC: 0,  weaponAtkP: 0,
  baseAtkP  : 0,
  atkC      : 0,  atkP      : 0,
  critC     : 0,  specC     : 0,
  swiftC    : 0,  domC      : 0,
  endC      : 0,  expC      : 0,
  hpC       : 0,  hpP       : 0,
});


// ============================================================
// 각인 효과 → PipelineEffectLog 변환
// ============================================================

const resolveEngravingLogs = (
  name      : string,
  grade     : string,
  level     : number,
  stoneLevel: number | null,
): PipelineEffectLog[] => {
  const db = ENGRAVINGS_DB.find(e => e.name === name);
  if (!db?.effects) return [];

  const logs: PipelineEffectLog[] = [];

  db.effects.forEach(eff => {
    if (!eff.value) return;

    const baseValue = eff.value[0] ?? 0;
    let bonusValue = 0;

    if ((grade === '유물' || grade === '전설') && db.bonus?.relic?.value) {
      bonusValue += db.bonus.relic.value[level - 1] ?? 0;
    }
    if (stoneLevel !== null && db.bonus?.ability?.value) {
      bonusValue += db.bonus.ability.value[stoneLevel - 1] ?? 0;
    }

    const total = baseValue + bonusValue;
    if (total === 0) return;

    logs.push({
      label   : name,
      type    : eff.type,
      value   : total,
      subGroup: eff.subGroup,
      target  : eff.target,
      special : (db as any).special,
    });
  });

  return logs;
};


// ============================================================
// 악세서리 연마효과 label → effectType
// ============================================================

const ACCESSORY_LABEL_MAP: Array<[string, string]> = [
  ['힘', 'MAIN_STAT_C'], ['민첩', 'MAIN_STAT_C'], ['지능', 'MAIN_STAT_C'],
  ['적에게 주는 피해', 'DMG_INC'],
  ['추가 피해'       , 'ADD_DMG'],
  ['무기 공격력'     , 'WEAPON_ATK_P'],
  ['치명타 피해'     , 'CRIT_DMG'],
  ['치명타 적중률'   , 'CRIT_CHANCE'],
];

const detectPolishEffectType = (label: string, value: number): string => {
  if (label.includes('공격력') && !label.includes('무기')) {
    return value >= 1 ? 'ATK_C' : 'ATK_P';
  }
  for (const [key, typeId] of ACCESSORY_LABEL_MAP) {
    if (label.includes(key)) return typeId;
  }
  return 'UNKNOWN';
};


// ============================================================
// 팔찌 label → effectType
// ============================================================

const BRACELET_LABEL_MAP: Array<[string, string]> = [
  ['추가 피해'      , 'ADD_DMG'      ],
  ['치명타로 적중 시', 'CRIT_DMG_INC'],
  ['치명타 피해'    , 'CRIT_DMG'     ],
  ['헤드어택'       , 'DMG_INC'      ],
  ['무기 공격력'    , 'WEAPON_ATK_C' ],
];

const detectBraceletEffectType = (label: string): string => {
  for (const [key, typeId] of BRACELET_LABEL_MAP) {
    if (label.includes(key)) return typeId;
  }
  return 'UNKNOWN';
};


// ============================================================
// 카드 키워드 → effectType
// ============================================================

const CARD_EFFECT_LIST: Array<[string, CommonEffectTypeId | null]> = [
  ['피해 감소'  , null          ],
  ['피해'       , 'DMG_INC'    ],
  ['공격력'     , 'ATK_P'      ],
  ['치명타 피해', 'CRIT_DMG'   ],
  ['치명타 확률', 'CRIT_CHANCE'],
];

const ARK_GRID_EFFECT_MAP: Record<string, CommonEffectTypeId> = {
  '공격력'  : 'ATK_P',
  '보스 피해': 'DMG_INC',
  '추가 피해': 'ADD_DMG',
};

// API 장비 타입명 → DB name 매핑
const API_TYPE_TO_DB_NAME: Record<string, string> = {
  '무기': '무기', '투구': '투구', '어깨': '견갑',
  '상의': '상의', '하의': '하의', '장갑': '장갑',
};


// ============================================================
// 전체 effectLog 수집
// ============================================================

const collectEffectLogs = (
  display: CharacterDisplayData,
): { logs: PipelineEffectLog[]; statMods: StatModifiers } => {
  const logs   : PipelineEffectLog[] = [];
  const statMods = createEmptyStatModifiers();

  const push = (
    label   : string,
    type    : string,
    value   : number,
    subGroup?: string,
    target? : PipelineEffectLog['target'],
    special?: boolean,
  ) => {
    // StatModifiers 직접 할당 계열 (C 타입)
    const statField = ({
      MAIN_STAT_C : 'mainStatC',
      WEAPON_ATK_C: 'weaponAtkC',
      WEAPON_ATK_P: 'weaponAtkP',
      BASE_ATK_P  : 'baseAtkP',
      ATK_C       : 'atkC',
      STAT_CRIT   : 'critC',
      STAT_SPEC   : 'specC',
      STAT_SWIFT  : 'swiftC',
      STAT_DOM    : 'domC',
      STAT_END    : 'endC',
      STAT_EXP    : 'expC',
      STAT_HP_C   : 'hpC',
      STAT_HP_P   : 'hpP',
    } as Record<string, keyof StatModifiers>)[type];

    if (statField) {
      // StatModifiers는 누산
      (statMods as any)[statField] += value;
    }

    // effectLog에도 추가 (파이프라인이 EFFECT_MAP으로 처리)
    if (type !== 'UNKNOWN') {
      logs.push({ label, type, value, subGroup, target, special });
    }
  };

  // ── 1. 장비 기본 스탯 ────────────────────────────────────
  display.equipment.forEach(eq => {
    const dbName  = API_TYPE_TO_DB_NAME[eq.type];
    if (!dbName) return;
    const dbEntry = COMBAT_EQUIP_DB[dbName];
    if (!dbEntry?.effects) return;

    const gradeKey = eq.eqGrade === 'ANCIENT_2' ? 'ANCIENT_2' :
                     eq.eqGrade === 'ANCIENT'    ? 'ANCIENT'   : 'RELIC';

    dbEntry.effects.forEach(eff => {
      if (!('multiValues' in eff) || !eff.multiValues) return;
      const values = (eff.multiValues as any)[gradeKey];
      if (!values?.length) return;

      const idx   = Math.max(0, (eq.refineLv ?? 1) - 1);
      const value = values[Math.min(idx, values.length - 1)] ?? 0;
      if (value === 0) return;

      push(`${eq.type} 기본스탯`, eff.type, value);
    });
  });

  // ── 2. 악세서리 주스탯 ───────────────────────────────────
  display.accessories.forEach(acc => {
    acc.baseEffects?.forEach((eff: any) => {
      const effectType = eff.statType?.text === '체력' ? 'STAT_HP_C' : 'MAIN_STAT_C';
      if (eff.value?.value > 0)
        push(`${acc.type} 주스탯`, effectType, eff.value.value);
    });
  });

  // ── 3. 악세서리 연마효과 ─────────────────────────────────
  display.accessories.forEach(acc =>
    acc.polishEffects?.forEach((eff: any) => {
      const effectType = detectPolishEffectType(eff.label?.text ?? '', eff.value?.value ?? 0);
      if (effectType !== 'UNKNOWN')
        push(`${acc.type} ${eff.label?.text}`, effectType, eff.value?.value ?? 0);
    })
  );

  // ── 4. 팔찌 ─────────────────────────────────────────────
  display.bracelet?.effects?.forEach((eff: any) => {
    if (eff.isFixed) return;
    const effectType = detectBraceletEffectType(eff.label?.text ?? '');
    if (effectType !== 'UNKNOWN')
      push(`팔찌 ${eff.label?.text}`, effectType, eff.value?.value ?? 0);
  });

  // ── 5. 아바타 ────────────────────────────────────────────
  const totalAvatarBonus = display.avatars.reduce(
    (sum, av) => sum + (av.mainStatBonus ?? 0), 0
  );
  if (totalAvatarBonus > 0)
    push('아바타', 'MAIN_STAT_P', totalAvatarBonus);

  // ── 6. 각인 ──────────────────────────────────────────────
  display.engravings.forEach(eng => {
    const engLogs = resolveEngravingLogs(
      eng.name.text,
      eng.grade.text,
      eng.level,
      eng.abilityStoneLevel,
    );
    engLogs.forEach(log =>
      push(log.label, log.type, log.value, log.subGroup, log.target, log.special)
    );
  });

  // ── 7. 보석 공증 ─────────────────────────────────────────
  if (display.gems.totalBaseAtk?.value > 0)
    push('보석 공증', 'BASE_ATK_P', display.gems.totalBaseAtk.value);

  // ── 8. 카드 ──────────────────────────────────────────────
  display.cards?.activeItems?.forEach((item: any) => {
    if (!item.value) return;
    for (const [keyword, effectType] of CARD_EFFECT_LIST) {
      if (item.description?.includes(keyword)) {
        if (effectType !== null) {
          const subGroup = effectType === 'DMG_INC' ? SUB_GROUPS.CARD : undefined;
          push(`카드 ${keyword}`, effectType, item.value.value, subGroup);
        }
        break;
      }
    }
  });

  // ── 9. 아크그리드 ────────────────────────────────────────
  display.arkGrid?.effects?.forEach((eff: any) => {
    const effectType = ARK_GRID_EFFECT_MAP[eff.label?.text ?? ''];
    if (effectType)
      push(`아크그리드 ${eff.label?.text}`, effectType, eff.value?.value ?? 0);
  });

  return { logs, statMods };
};


// ============================================================
// 콘솔 디버그 출력
// ============================================================

/**
 * 파이프라인 각 단계 결과를 콘솔에 출력
 * 실제 runPipeline 내부에 직접 접근이 어려우므로
 * effectLog 수집 결과 + 최종 결과를 출력
 */
const debugPipeline = (
  logs            : PipelineEffectLog[],
  statMods        : StatModifiers,
  skillDamageResults: SkillDamageResult[],
): void => {
  console.group('🚀 [파이프라인 디버그]');

  // ── effectLog 전체 ────────────────────────────────────────
  const staticLogs  = logs.filter(l => !l.special && !l.target);
  const dynamicLogs = logs.filter(l => !l.special && !!l.target);
  const specialLogs = logs.filter(l => !!l.special);

  console.group('🔵 [1단계] StaticBuffer 대상 로그 (target 없음)');
  console.table(staticLogs.map(l => ({
    label   : l.label,
    type    : l.type,
    value   : l.value,
    subGroup: l.subGroup ?? '-',
  })));
  console.groupEnd();

  console.group('🟡 [1단계] DynamicLogs (target 있음)');
  console.table(dynamicLogs.map(l => ({
    label      : l.label,
    type       : l.type,
    value      : l.value,
    subGroup   : l.subGroup ?? '-',
    skillIds   : l.target?.skillIds?.join(',') ?? '-',
    categories : l.target?.categories?.join(',') ?? '-',
    skillTypes : l.target?.skillTypes?.join(',') ?? '-',
    attackType : l.target?.attackType?.join(',') ?? '-',
  })));
  console.groupEnd();

  console.group('🔴 [1단계] SpecialLogs (special=true)');
  console.table(specialLogs.map(l => ({
    label: l.label,
    type : l.type,
    value: l.value,
  })));
  console.groupEnd();

  // ── StatModifiers ─────────────────────────────────────────
  console.group('📊 StatModifiers (장비/악세 기본 스탯 누산)');
  console.table(
    Object.entries(statMods)
      .filter(([, v]) => v !== 0)
      .map(([k, v]) => ({ field: k, value: v }))
  );
  console.groupEnd();

  // ── 최종 피해량 ───────────────────────────────────────────
  console.group('⚪ [결과] 스킬별 피해량');
  console.table(
    skillDamageResults
      .sort((a, b) => b.totalDamage - a.totalDamage)
      .map(r => ({
        스킬명    : r.skillName,
        총피해량  : r.totalDamage.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        피해원수  : r.sources.length,
      }))
  );

  // 스킬별 상세 피해원
  skillDamageResults.forEach(r => {
    console.group(`  📌 ${r.skillName} 피해원 상세`);
    console.table(r.sources.map(s => ({
      피해원    : s.name,
      피해량    : s.damage.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      합산여부  : s.isCombined ? '✅' : '❌',
    })));
    console.groupEnd();
  });

  console.groupEnd();
  console.groupEnd();
};


// ============================================================
// Store 타입
// ============================================================

export interface SimulatorStore {
  displayData       : CharacterDisplayData | null;
  skillDamageResults: SkillDamageResult[];
  setDisplayData    : (data: CharacterDisplayData) => void;
}


// ============================================================
// useSimulatorStore
// ============================================================

export const useSimulatorStore = (): SimulatorStore => {
  const [displayData, setDisplayDataState] =
    useState<CharacterDisplayData | null>(null);

  const [skillDamageResults, setSkillDamageResults] =
    useState<SkillDamageResult[]>([]);

  useEffect(() => {
    if (!displayData) {
      setSkillDamageResults([]);
      return;
    }

    // effectLog 수집 + StatModifiers 구성
    const { logs, statMods } = collectEffectLogs(displayData);

    // combatInfo: API에서 받아온 수치
    const combatInfo = {
      baseAtk       : displayData.combatStats.attackPower,
      specialization: displayData.combatStats.specialization,
    };

    // 파이프라인 실행
    const results = runPipeline(displayData, logs, statMods, combatInfo);

    setSkillDamageResults(results);

    // 콘솔 디버그 출력
    debugPipeline(logs, statMods, results);

  }, [displayData]);

  const setDisplayData = (data: CharacterDisplayData) =>
    setDisplayDataState(data);

  return { displayData, setDisplayData, skillDamageResults };
};
