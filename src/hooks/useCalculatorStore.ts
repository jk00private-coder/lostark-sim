/**
 * @/hooks/useCalculatorStore.ts
 *
 * CharacterDisplayData + DB → CalcData 생성
 *
 * [처리 범위 - Phase 1]
 *   악세서리 연마효과 / 팔찌 랜덤옵션 / 아바타 주스탯
 *   각인 (effects 고정 + bonus 레벨별 합산)
 *   보석 공증 / 카드 / 아크그리드
 *
 * [미처리 - Phase 2 연결 예정]
 *   아크패시브 카르마/노드 효과
 *   직업 특수 효과 (GK_QI_DMG, GK_QI_COST)
 */
"use client";

import { useState, useEffect } from 'react';
import { CharacterDisplayData } from '@/types/character-types';
import {
  CombatStats,
  StatModifiers,
  DamageModifiers,
  CommonEffectTypeId,
  EFFECT_MAP,
  SUB_GROUPS,
} from '@/types/sim-types';
import { ENGRAVINGS_DB } from '@/data/engravings';


// ============================================================
// EffectLog 타입
// ============================================================

/**
 * 효과 적용 기록 단위
 * effectLog에 누적 후 calcModifiersFromLog에서 일괄 계산
 *
 * @param label    - 출처 이름 (예: "원한", "목걸이 추가피해")
 * @param type     - EffectTypeId
 * @param value    - 적용 수치 (소수)
 * @param subGroup - 그룹 합산 키 (같은 subGroup끼리 합산 후 1회 곱연산)
 */
export interface EffectLog {
  label    : string;
  type     : string;
  value    : number;
  subGroup?: string;
}


// ============================================================
// CalcData 타입
// ============================================================

/**
 * 계산 엔진이 소비하는 수치 묶음
 *
 * classEffectLog: GK_QI_DMG 등 직업 특수 효과 로그
 *   Phase 2에서 직업별 계산 엔진에 전달
 */
export interface CalcData {
  combatStats    : CombatStats;
  statModifiers  : StatModifiers;
  damageModifiers: DamageModifiers;
  effectLog      : EffectLog[];
  classEffectLog : EffectLog[];  // 직업 특수 효과 별도 보관
}


// ============================================================
// 초기값 생성
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
  mainStatC : 0,
  mainStatP : 0,
  weaponAtkC: 0,
  weaponAtkP: 0,
  baseAtkP  : 0,
  atkC      : 0,
  atkP      : 0,
  critC     : 0,
  specC     : 0,
  swiftC    : 0,
  domC      : 0,
  endC      : 0,
  expC      : 0,
  hpC       : 0,
  hpP       : 0,
});

/**
 * DamageModifiers 초기값
 *
 * MULTIPLY 계열 (damageInc, critDamageInc) : 1.0
 * ADD 계열                                  : 0
 * critDamage 기본값                         : 2.0 (기본 치명타 200%)
 */
const createEmptyDamageModifiers = (): DamageModifiers => ({
  damageInc      : 1.0,
  critDamageInc  : 1.0,
  evoDamage      : 0,
  addDamage      : 0,
  critChance     : 0,
  critDamage     : 2.0,
  defPenetration : 0,
  enemyDamageTaken: 0,
  cdrC           : 0,
  cdrP           : 0,
  spdAtk         : 0,
  spdMov         : 0,
});

export const createEmptyCalcData = (): CalcData => ({
  combatStats    : createEmptyCombatStats(),
  statModifiers  : createEmptyStatModifiers(),
  damageModifiers: createEmptyDamageModifiers(),
  effectLog      : [],
  classEffectLog : [],
});


// ============================================================
// 공격력 계산 함수
// ============================================================

/**
 * 최종 무기 공격력
 * = 무기공격력 고정증가 합산 * (1 + 무기공격력 % 증가)
 */
const calcWeaponAtk = (weaponAtkC: number, weaponAtkP: number): number =>
  weaponAtkC * (1 + weaponAtkP);

/**
 * 주스탯 역산
 * API에 주스탯이 없으므로 기본공격력에서 역산
 * = ((baseAtk / (1 + baseAtkP))^2 * 6) / weaponAtk
 */
const calcMainStat = (
  baseAtk  : number,
  baseAtkP : number,
  weaponAtk: number,
): number => {
  if (weaponAtk === 0) return 0;
  const base = baseAtk / (1 + baseAtkP);
  return (base * base * 6) / weaponAtk;
};

/**
 * 최종 공격력 (인게임 표시 공격력)
 * = (baseAtk + atkC) * (1 + atkP합산)
 *
 * ATK_P는 subGroup 없이 각각 독립 곱연산이므로
 * effectLog에서 ATK_P 항목을 꺼내 직접 계산
 */
const calcFinalAtk = (
  baseAtk   : number,
  atkC      : number,
  atkPLogs  : EffectLog[],
): number => {
  // ATK_P 항목을 subGroup별로 합산 후 독립 곱연산
  const groupMap: Record<string, number[]> = {};
  atkPLogs.forEach((log, idx) => {
    const key = log.subGroup ?? `__solo_${idx}`;
    if (!groupMap[key]) groupMap[key] = [];
    groupMap[key].push(log.value);
  });

  let multiplier = 1;
  Object.values(groupMap).forEach(values => {
    multiplier *= (1 + values.reduce((s, v) => s + v, 0));
  });

  return (baseAtk + atkC) * multiplier;
};


// ============================================================
// effectLog → Modifiers 일괄 계산
// ============================================================

/**
 * effectLog를 순회하며 StatModifiers / DamageModifiers에 반영
 *
 * [연산 규칙]
 *   subGroup 없음             → 독립 곱연산
 *   같은 type + 같은 subGroup → 합산 후 1회 곱연산
 */
const calcModifiersFromLog = (
  logs      : EffectLog[],
  statMods  : StatModifiers,
  damageMods: DamageModifiers,
): void => {
  // type별 그룹핑
  const typeMap: Record<string, EffectLog[]> = {};
  logs.forEach(log => {
    if (!typeMap[log.type]) typeMap[log.type] = [];
    typeMap[log.type].push(log);
  });

  Object.entries(typeMap).forEach(([type, typeLogs]) => {
    const entry = EFFECT_MAP[type as CommonEffectTypeId];
    if (!entry) return;

    // StatModifiers / DamageModifiers 중 해당 필드가 있는 쪽 선택
    const statMod   = statMods   as unknown as Record<string, number>;
    const damageMod = damageMods as unknown as Record<string, number>;
    const targetMod = Object.prototype.hasOwnProperty.call(statMods, entry.field)
      ? statMod
      : damageMod;

    // subGroup별 재그룹핑 → 합산 후 독립 곱연산
    const groupMap: Record<string, number[]> = {};
    typeLogs.forEach((log, idx) => {
      const key = log.subGroup ?? `__solo_${idx}`;
      if (!groupMap[key]) groupMap[key] = [];
      groupMap[key].push(log.value);
    });

    Object.values(groupMap).forEach(values => {
      const groupSum = values.reduce((s, v) => s + v, 0);
      targetMod[entry.field] *= (1 + groupSum);
    });
  });
};


// ============================================================
// 각인 효과 합산 헬퍼
// ============================================================

/**
 * 각인 하나의 최종 EffectLog 목록 생성
 *
 * [합산 규칙]
 *   effects[i].value[0]           → 기본 고정값 (레벨 무관)
 *   bonus.relic.value[level-1]    → 유물 레벨별 추가 (index 0 = 레벨1)
 *   bonus.ability.value[stoneLevel-1] → 어빌리티스톤 레벨별 추가
 *
 * @param name       - 각인 이름 (DB 조회 키)
 * @param grade      - "유물" | "전설" 등
 * @param level      - 각인 레벨 (1~4)
 * @param stoneLevel - 어빌리티 스톤 레벨 (null = 미적용)
 */
const resolveEngravingEffects = (
  name      : string,
  grade     : string,
  level     : number,
  stoneLevel: number | null,
): EffectLog[] => {
  const db = ENGRAVINGS_DB.find(e => e.name === name);
  if (!db?.effects) return [];

  const logs: EffectLog[] = [];

  db.effects.forEach(eff => {
    if (!eff.value) return;

    // 기본 고정값
    const baseValue = eff.value[0] ?? 0;

    // 등급별 bonus
    let bonusValue = 0;
    if (grade === '유물' && db.bonus?.relic?.value) {
      bonusValue += db.bonus.relic.value[level - 1] ?? 0;
    }
    if (grade === '전설' && db.bonus?.relic?.value) {
      // 전설도 relic bonus 적용 (게임 내 동일 테이블)
      bonusValue += db.bonus.relic.value[level - 1] ?? 0;
    }

    // 어빌리티 스톤 bonus
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
    });
  });

  return logs;
};


// ============================================================
// extractCalcData
// ============================================================

/** 카드 효과 키워드 → EffectTypeId 매핑 (순서 중요) */
const CARD_EFFECT_LIST: Array<[string, CommonEffectTypeId | null]> = [
  ['피해 감소'  , null          ],  // 딜 계산 무관
  ['피해'       , 'DMG_INC'    ],
  ['공격력'     , 'ATK_P'      ],
  ['치명타 피해', 'CRIT_DMG'   ],
  ['치명타 확률', 'CRIT_CHANCE'],
];

/** 아크그리드 효과명 → EffectTypeId 매핑 */
const ARK_GRID_EFFECT_MAP: Record<string, CommonEffectTypeId> = {
  '공격력'  : 'ATK_P',
  '보스 피해': 'DMG_INC',
  '추가 피해': 'ADD_DMG',
};

/** 팔찌 label → effectType 복원 */
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

/** 악세서리 연마효과 label → effectType 복원 */
const POLISH_LABEL_MAP: Array<[string, string]> = [
  ['적에게 주는 피해', 'DMG_INC'     ],
  ['추가 피해'       , 'ADD_DMG'     ],
  ['무기 공격력'     , 'WEAPON_ATK_P'],
  ['치명타 피해'     , 'CRIT_DMG'    ],
  ['치명타 적중률'   , 'CRIT_CHANCE' ],
];

const detectPolishEffectType = (label: string, value: number): string => {
  // 공격력 C/P 구분: value >= 1 이면 고정값(C)
  if (label.includes('공격력') && !label.includes('무기')) {
    return value >= 1 ? 'ATK_C' : 'ATK_P';
  }
  for (const [key, typeId] of POLISH_LABEL_MAP) {
    if (label.includes(key)) return typeId;
  }
  return 'UNKNOWN';
};


const extractCalcData = (display: CharacterDisplayData): CalcData => {

  const combatStats     = createEmptyCombatStats();
  const statModifiers   = createEmptyStatModifiers();
  const damageModifiers = createEmptyDamageModifiers();
  const effectLog       : EffectLog[] = [];
  const classEffectLog  : EffectLog[] = [];  // GK_QI_DMG 등 별도 보관

  /**
   * 효과 로그 수집
   * 직업 특수 타입(ClassEffectTypeId)은 classEffectLog로 분리
   */
  const applyEffect = (
    label   : string,
    type    : string,
    value   : number,
    subGroup?: string,
  ) => {
    // GK_QI_DMG, GK_QI_COST 등 직업 특수 효과는 별도 보관
    if (type === 'GK_QI_DMG' || type === 'GK_QI_COST') {
      classEffectLog.push({ label, type, value, subGroup });
      return;
    }
    effectLog.push({ label, type, value, subGroup });
  };

  // ── 1. 전투 특성 (API 직접 할당) ─────────────────────────
  combatStats.critical       = display.combatStats.critical;
  combatStats.specialization = display.combatStats.specialization;
  combatStats.swiftness      = display.combatStats.swiftness;
  combatStats.domination     = display.combatStats.domination;
  combatStats.endurance      = display.combatStats.endurance;
  combatStats.expertise      = display.combatStats.expertise;
  combatStats.hp             = display.combatStats.maxHp;
  combatStats.baseAtk        = display.combatStats.attackPower;

  // ── 2. 악세서리 연마효과 ─────────────────────────────────
  display.accessories.forEach(acc =>
    acc.polishEffects.forEach(eff => {
      const effectType = detectPolishEffectType(eff.label.text, eff.value.value);
      if (effectType !== 'UNKNOWN')
        applyEffect(`${acc.type} ${eff.label.text}`, effectType, eff.value.value);
    })
  );

  // ── 3. 팔찌 랜덤 옵션 ───────────────────────────────────
  display.bracelet?.effects.forEach(eff => {
    if (eff.isFixed) return;  // 고정 특성(신속/특화 등)은 전투특성에 이미 포함
    const effectType = detectBraceletEffectType(eff.label.text);
    if (effectType !== 'UNKNOWN')
      applyEffect(`팔찌 ${eff.label.text}`, effectType, eff.value.value);
  });

  // ── 4. 아바타 주스탯 보너스 ─────────────────────────────
  const totalAvatarBonus = display.avatars.reduce(
    (sum, av) => sum + av.mainStatBonus, 0
  );
  if (totalAvatarBonus > 0)
    applyEffect('아바타', 'MAIN_STAT_P', totalAvatarBonus);

  // ── 5. 각인 (고정 + 레벨별 bonus 합산) ──────────────────
  display.engravings.forEach(eng => {
    const logs = resolveEngravingEffects(
      eng.name.text,
      eng.grade.text,
      eng.level,
      eng.abilityStoneLevel,
    );
    logs.forEach(log =>
      applyEffect(log.label, log.type, log.value, log.subGroup)
    );
  });

  // ── 6. 보석 공증 ─────────────────────────────────────────
  if (display.gems.totalBaseAtk.value > 0)
    applyEffect('보석 공증', 'BASE_ATK_P', display.gems.totalBaseAtk.value);

  // ── 7. 카드 효과 ─────────────────────────────────────────
  display.cards?.activeItems.forEach(item => {
    if (!item.value) return;
    for (const [keyword, effectType] of CARD_EFFECT_LIST) {
      if (item.description.includes(keyword)) {
        if (effectType !== null) {
          const subGroup = effectType === 'DMG_INC' ? SUB_GROUPS.CARD : undefined;
          applyEffect(`카드 ${keyword}`, effectType, item.value.value, subGroup);
        }
        break;
      }
    }
  });

  // ── 8. 아크그리드 ────────────────────────────────────────
  display.arkGrid.effects.forEach(eff => {
    const effectType = ARK_GRID_EFFECT_MAP[eff.label.text];
    if (effectType)
      applyEffect(`아크그리드 ${eff.label.text}`, effectType, eff.value.value);
  });

  // ── 9. 아크패시브 (TODO: Phase 2 연결 예정) ──────────────

  // ── 10. effectLog → Modifiers 일괄 계산 ─────────────────
  calcModifiersFromLog(effectLog, statModifiers, damageModifiers);

  // ── 11. 공격력 3종 계산 ──────────────────────────────────
  combatStats.weaponAtk = calcWeaponAtk(
    statModifiers.weaponAtkC,
    statModifiers.weaponAtkP,
  );
  combatStats.mainStat = calcMainStat(
    combatStats.baseAtk,
    statModifiers.baseAtkP,
    combatStats.weaponAtk,
  );
  combatStats.finalAtk = calcFinalAtk(
    combatStats.baseAtk,
    statModifiers.atkC,
    effectLog.filter(l => l.type === 'ATK_P'),
  );

  return {
    combatStats,
    statModifiers,
    damageModifiers,
    effectLog,
    classEffectLog,
  };
};


// ============================================================
// useCalculatorStore hook
// ============================================================

export const useCalculatorStore = () => {
  const [displayData, setDisplayDataState] =
    useState<CharacterDisplayData | null>(null);

  const [calcData, setCalcData] =
    useState<CalcData>(createEmptyCalcData());

  // displayData 변경 시 calcData 자동 재계산
  useEffect(() => {
    if (!displayData) {
      setCalcData(createEmptyCalcData());
      return;
    }
    setCalcData(extractCalcData(displayData));
  }, [displayData]);

  const setDisplayData = (data: CharacterDisplayData) =>
    setDisplayDataState(data);

  /** 시뮬레이터에서 특정 수치만 덮어쓸 때 사용 (Phase 4) */
  const overrideCalcData = (partial: Partial<CalcData>) =>
    setCalcData(prev => ({ ...prev, ...partial }));

  return { displayData, setDisplayData, calcData, overrideCalcData };
};