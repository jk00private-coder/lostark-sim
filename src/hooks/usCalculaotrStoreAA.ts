/**
 * @/hooks/useCalculatorStore.ts
 *
 * CharacterDisplayData → CalcData + SkillDamageResult[]
 *
 * [변경 이력]
 *   - extractCalcData 내부 로직을 파이프라인(0~3단계)으로 교체
 *   - skillDamageResults 계산을 store 내부로 이동 (page.tsx의 useMemo 제거 가능)
 *   - 기존 반환 인터페이스(displayData, setDisplayData, calcData, overrideCalcData) 유지
 *   - 콘솔 디버그 추가
 *
 * [외부 인터페이스 — 변경 없음]
 *   displayData, setDisplayData, calcData, overrideCalcData
 *   + skillDamageResults (신규 추가)
 */
"use client";

import { useState, useEffect } from 'react';
import { CharacterDisplayData } from '@/types/character-types';
import {
  CombatStats,
  StatModifiers,
  DamageModifiers,
  CommonEffectTypeId,
  SUB_GROUPS,
  EffectTarget,
} from '@/types/sim-types';
import { PipelineEffectLog } from '@/engine/pipeline/types';
import { runPipeline } from '@/engine/pipeline/run-pipeline';
import { SkillDamageResult } from '@/engine/calc/damage-calculator';
import { ENGRAVINGS_DB }    from '@/data/engravings';
import { COMBAT_EQUIP_DB }  from '@/data/equipment/combat-equip';


// ============================================================
// EffectLog 타입 (기존 유지)
// ============================================================

export interface EffectLog {
  label    : string;
  type     : string;
  value    : number;
  subGroup?: string;
  target?  : EffectTarget;
}


// ============================================================
// CalcData 타입 (기존 유지)
// ============================================================

export interface CalcData {
  combatStats    : CombatStats;
  statModifiers  : StatModifiers;
  damageModifiers: DamageModifiers;
  effectLog      : EffectLog[];
  classEffectLog : EffectLog[];
}


// ============================================================
// 초기값 (기존 유지)
// ============================================================

const createEmptyCombatStats = (): CombatStats => ({
  baseAtk       : 0,
  mainStat      : 0,
  weaponAtk     : 0,
  finalAtk      : 0,
  critical      : 0,
  specialization: 0,
  swiftness     : 0,
  hp            : 0,
  domination    : 0,
  endurance     : 0,
  expertise     : 0,
});

const createEmptyStatModifiers = (): StatModifiers => ({
  mainStatC : 0, mainStatP : 0,
  weaponAtkC: 0, weaponAtkP: 0,
  baseAtkP  : 0,
  atkC      : 0, atkP      : 0,
  critC     : 0, specC     : 0,
  swiftC    : 0, domC      : 0,
  endC      : 0, expC      : 0,
  hpC       : 0, hpP       : 0,
});

const createEmptyDamageModifiers = (): DamageModifiers => ({
  damageInc       : 1.0,
  critDamageInc   : 1.0,
  evoDamage       : 1.0,
  addDamage       : 1.0,
  critChance      : 0,
  critDamage      : 2.0,
  defPenetration  : 0,
  enemyDamageTaken: 0,
  cdrC            : 0,
  cdrP            : 0,
  spdAtk          : 1.0,
  spdMov          : 1.0,
});

export const createEmptyCalcData = (): CalcData => ({
  combatStats    : createEmptyCombatStats(),
  statModifiers  : createEmptyStatModifiers(),
  damageModifiers: createEmptyDamageModifiers(),
  effectLog      : [],
  classEffectLog : [],
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

    const baseValue  = eff.value[0] ?? 0;
    let   bonusValue = 0;

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
// label → effectType 매핑 헬퍼
// ============================================================

const ACCESSORY_LABEL_MAP: Array<[string, string]> = [
  ['힘'             , 'MAIN_STAT_C' ],
  ['민첩'           , 'MAIN_STAT_C' ],
  ['지능'           , 'MAIN_STAT_C' ],
  ['적에게 주는 피해', 'DMG_INC'    ],
  ['추가 피해'      , 'ADD_DMG'     ],
  ['무기 공격력'    , 'WEAPON_ATK_P'],
  ['치명타 피해'    , 'CRIT_DMG'    ],
  ['치명타 적중률'  , 'CRIT_CHANCE' ],
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

const API_TYPE_TO_DB_NAME: Record<string, string> = {
  '무기': '무기', '투구': '투구', '어깨': '견갑',
  '상의': '상의', '하의': '하의', '장갑': '장갑',
};

/** StatModifiers 직접 누산 대상 타입 → 필드 매핑 */
const STAT_MOD_FIELD_MAP: Record<string, keyof StatModifiers> = {
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
};


// ============================================================
// effectLog 수집 (파이프라인용 PipelineEffectLog[])
// ============================================================

const collectEffectLogs = (
  display: CharacterDisplayData,
): { pipelineLogs: PipelineEffectLog[]; statMods: StatModifiers; legacyLog: EffectLog[] } => {
  const pipelineLogs: PipelineEffectLog[] = [];
  const legacyLog   : EffectLog[]         = []; // calcData.effectLog 호환용
  const statMods      = createEmptyStatModifiers();

  const push = (
    label   : string,
    type    : string,
    value   : number,
    subGroup?: string,
    target? : EffectTarget,
    special?: boolean,
  ) => {
    if (type === 'UNKNOWN' || value === 0) return;

    // StatModifiers 직접 누산
    const statField = STAT_MOD_FIELD_MAP[type];
    if (statField) (statMods as any)[statField] += value;

    // 파이프라인용
    pipelineLogs.push({ label, type, value, subGroup, target, special });

    // 기존 CalcData.effectLog 호환 (GK_QI_DMG 등 classEffectLog 분리는 pipeline 내부에서 처리)
    legacyLog.push({ label, type, value, subGroup, target });
  };

  // ── 1. 장비 기본 스탯 ────────────────────────────────────
  display.equipment.forEach(eq => {
    const dbName  = API_TYPE_TO_DB_NAME[eq.type];
    if (!dbName) return;
    const dbEntry = COMBAT_EQUIP_DB[dbName];
    if (!dbEntry?.effects) return;

    const gradeKey: string =
      eq.setType === 'ANCIENT_2' ? 'ANCIENT_2' :
      eq.setType === 'ANCIENT'   ? 'ANCIENT'   : 'RELIC';

    dbEntry.effects.forEach(eff => {
      if (!('multiValues' in eff) || !eff.multiValues) return;
      const values = (eff.multiValues as any)[gradeKey];
      if (!values?.length) return;

      const idx   = Math.max(0, (eq.refineLv ?? 1) - 1);
      const value = values[Math.min(idx, values.length - 1)] ?? 0;
      if (!value) return;

      push(`${eq.type} 기본스탯`, eff.type, value);
    });
  });

  // ── 2. 악세서리 주스탯/체력 ──────────────────────────────
  display.accessories.forEach(acc => {
    acc.baseEffects.forEach((eff: any) => {
      const effectType = eff.statType?.text === '체력' ? 'STAT_HP_C' : 'MAIN_STAT_C';
      if (eff.value?.value > 0)
        push(`${acc.type} 주스탯`, effectType, eff.value.value);
    });
  });

  // ── 3. 악세서리 연마효과 ─────────────────────────────────
  display.accessories.forEach(acc => {
    acc.polishEffects?.forEach((eff: any) => {
      const effectType = detectPolishEffectType(
        eff.label?.text ?? eff.label ?? '',
        eff.value?.value ?? 0,
      );
      if (effectType !== 'UNKNOWN')
        push(`${acc.type} ${eff.label?.text ?? eff.label}`, effectType, eff.value?.value ?? 0);
    });
  });

  // ── 4. 팔찌 ─────────────────────────────────────────────
  display.bracelet?.effects?.forEach((eff: any) => {
    if (eff.isFixed) return;
    const labelText  = eff.label?.text ?? eff.label ?? '';
    const effectType = detectBraceletEffectType(labelText);
    if (effectType !== 'UNKNOWN')
      push(`팔찌 ${labelText}`, effectType, eff.value?.value ?? 0);
  });

  // ── 5. 아바타 ────────────────────────────────────────────
  const totalAvatarBonus = display.avatars.reduce(
    (sum, av) => sum + (av.mainStatBonus ?? 0), 0,
  );
  if (totalAvatarBonus > 0) push('아바타', 'MAIN_STAT_P', totalAvatarBonus);

  // ── 6. 각인 ──────────────────────────────────────────────
  display.engravings.forEach(eng => {
    // name/grade: ColoredText({ text, color }) 또는 string 모두 대응
    const nameText  = typeof eng.name  === 'string' ? eng.name  : (eng.name  as any).text  ?? '';
    const gradeText = typeof eng.grade === 'string' ? eng.grade : (eng.grade as any).text ?? '';

    const engLogs = resolveEngravingLogs(
      nameText,
      gradeText,
      eng.level,
      eng.abilityStoneLevel,
    );
    engLogs.forEach(log =>
      push(log.label, log.type, log.value, log.subGroup, log.target, log.special)
    );
  });

  // ── 7. 보석 공증 ─────────────────────────────────────────
  // gems가 배열인 경우(구버전)와 래퍼 구조인 경우(신버전) 모두 대응
  const gemsData = display.gems as any;
  const totalBaseAtkValue: number =
    gemsData?.totalBaseAtk?.value  // 신버전: { gems, totalBaseAtk }
    ?? gemsData?.reduce?.((sum: number, g: any) => sum + (g.baseAtkBonus ?? 0), 0) // 구버전: 배열
    ?? 0;
  if (totalBaseAtkValue > 0) push('보석 공증', 'BASE_ATK_P', totalBaseAtkValue);

  // ── 8. 카드 ──────────────────────────────────────────────
  const cardItems: any[] =
    (display.cards as any)?.activeItems   // 신버전
    ?? [];
  cardItems.forEach((item: any) => {
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
    const labelText  = eff.label?.text ?? eff.label ?? '';
    const effectType = ARK_GRID_EFFECT_MAP[labelText];
    if (effectType) push(`아크그리드 ${labelText}`, effectType, eff.value?.value ?? 0);
  });

  return { pipelineLogs, statMods, legacyLog };
};


// ============================================================
// 콘솔 디버그
// ============================================================

const debugPipeline = (
  logs    : PipelineEffectLog[],
  statMods: StatModifiers,
  results : SkillDamageResult[],
): void => {
  console.group('🚀 [파이프라인 디버그]');

  const staticLogs  = logs.filter(l => !l.special && !l.target);
  const dynamicLogs = logs.filter(l => !l.special && !!l.target);
  const specialLogs = logs.filter(l => !!l.special);

  console.group(`🔵 StaticBuffer (${staticLogs.length}개) — target 없음`);
  console.table(staticLogs.map(l => ({
    출처: l.label, 타입: l.type, 값: l.value, 서브그룹: l.subGroup ?? '-',
  })));
  console.groupEnd();

  console.group(`🟡 DynamicLogs (${dynamicLogs.length}개) — target 있음`);
  console.table(dynamicLogs.map(l => ({
    출처      : l.label,
    타입      : l.type,
    값        : l.value,
    서브그룹  : l.subGroup ?? '-',
    skillIds  : l.target?.skillIds?.join(',')   ?? '-',
    categories: l.target?.categories?.join(',') ?? '-',
    skillTypes: l.target?.skillTypes?.join(',') ?? '-',
    attackType: l.target?.attackType?.join(',') ?? '-',
  })));
  console.groupEnd();

  console.group(`🔴 SpecialLogs (${specialLogs.length}개)`);
  specialLogs.length > 0
    ? console.table(specialLogs.map(l => ({ 출처: l.label, 타입: l.type, 값: l.value })))
    : console.log('(없음)');
  console.groupEnd();

  console.group('📊 StatModifiers');
  const nonZero = Object.entries(statMods).filter(([, v]) => v !== 0);
  nonZero.length > 0
    ? console.table(nonZero.map(([k, v]) => ({ 필드: k, 값: v })))
    : console.log('(모두 0 — 장비 DB 매칭 확인 필요)');
  console.groupEnd();

  console.group(`⚪ 스킬 피해량 (${results.length}개)`);
  console.table(
    results
      .sort((a, b) => b.totalDamage - a.totalDamage)
      .map(r => ({
        스킬명  : r.skillName,
        총피해량: r.totalDamage.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        피해원수: r.sources.length,
      }))
  );
  results.forEach(r => {
    if (!r.sources.length) return;
    console.group(`  📌 ${r.skillName}`);
    console.table(r.sources.map(s => ({
      피해원  : s.name,
      피해량  : s.damage.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      합산여부: s.isCombined ? '✅' : '❌',
    })));
    console.groupEnd();
  });
  console.groupEnd();

  console.groupEnd();
};


// ============================================================
// useCalculatorStore (기존 인터페이스 유지)
// ============================================================

export const useCalculatorStore = () => {
  const [displayData, setDisplayDataState] =
    useState<CharacterDisplayData | null>(null);

  const [calcData, setCalcData] =
    useState<CalcData>(createEmptyCalcData());

  // 신규: 스킬 피해량 결과
  const [skillDamageResults, setSkillDamageResults] =
    useState<SkillDamageResult[]>([]);

  useEffect(() => {
    if (!displayData) {
      setCalcData(createEmptyCalcData());
      setSkillDamageResults([]);
      return;
    }

    // ── effectLog 수집 ────────────────────────────────────
    const { pipelineLogs, statMods, legacyLog } = collectEffectLogs(displayData);

    // ── combatStats API 직접 할당 ────────────────────────
    const combatStats = createEmptyCombatStats();
    combatStats.critical       = displayData.combatStats.critical;
    combatStats.specialization = displayData.combatStats.specialization;
    combatStats.swiftness      = displayData.combatStats.swiftness;
    combatStats.domination     = displayData.combatStats.domination;
    combatStats.endurance      = displayData.combatStats.endurance;
    combatStats.expertise      = displayData.combatStats.expertise;
    combatStats.hp             = displayData.combatStats.maxHp;
    combatStats.baseAtk        = displayData.combatStats.attackPower;

    // ── CalcData 구성 (기존 호환) ─────────────────────────
    const newCalcData: CalcData = {
      combatStats,
      statModifiers  : statMods,
      damageModifiers: createEmptyDamageModifiers(),
      effectLog      : legacyLog,
      classEffectLog : legacyLog.filter(l => l.type === 'GK_QI_DMG' || l.type === 'GK_QI_COST'),
    };
    setCalcData(newCalcData);

    // ── 파이프라인 실행 → 스킬 피해량 ──────────────────────
    const combatInfo = {
      baseAtk       : displayData.combatStats.attackPower,
      specialization: displayData.combatStats.specialization,
    };
    const results = runPipeline(displayData, pipelineLogs, statMods, combatInfo);
    setSkillDamageResults(results);

    // ── 콘솔 디버그 ──────────────────────────────────────
    debugPipeline(pipelineLogs, statMods, results);

  }, [displayData]);

  const setDisplayData = (data: CharacterDisplayData) =>
    setDisplayDataState(data);

  /** 시뮬레이터에서 특정 수치만 덮어쓸 때 사용 (Phase 4) */
  const overrideCalcData = (partial: Partial<CalcData>) =>
    setCalcData(prev => ({ ...prev, ...partial }));

  // 기존 반환 + skillDamageResults 추가
  return { displayData, setDisplayData, calcData, overrideCalcData, skillDamageResults };
};