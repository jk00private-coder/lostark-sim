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
  EffectTarget,
  EffectTypeId,
} from '@/types/sim-types';
import { ENGRAVINGS_DB } from '@/data/engravings';
import { calcAllAtk }    from '@/engine/atk-calculator';
import { COMBAT_EQUIP_DB } from '@/data/equipment/combat-equip';


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
  target?  : EffectTarget;
}
/**
 * 효과의 성격을 규정하는 타입
 * RAW: 계산의 재료 (스탯, 스택 등)
 * FINAL: 최종 연산에 곱해지는 수치 (피해 증가 등)
 */
// export interface EffectLog {
//   id       : number;
//   name     : string;
//   kind     : 'RAW' | 'FINAL'
//   type     : EffectTypeId;
//   value    : number;
//   target?  : EffectTarget;
//   subGroup?: string;
//   desc?    : string;
// }


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
  classEffectLog : EffectLog[];
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
  damageInc       : 1.0,
  critDamageInc   : 1,
  evoDamage       : 1,
  addDamage       : 1,
  critChance      : 1,
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

  /**
   * 설명: 여기저기 흩어져 있는 로그들을 **종류별(type)**로 모읍니다.
   * 예: "공격력 %" 로그 3개, "추가 피해" 로그 2개가 있다면,
   *     이를 ATK_P: [로그1, 로그2, 로그3], ADD_DMG: [로그4, 로그5] 식으로 정리하는 과정입니다.
   */ 
  const typeMap: Record<string, EffectLog[]> = {};
  logs.forEach(log => {
    if (!typeMap[log.type]) typeMap[log.type] = [];
    typeMap[log.type].push(log);
  });

  console.log("=== 모든 효과 분류 결과 (typeMap) ===");
  console.dir(typeMap);

  /**
   * 설명: 분류된 각 타입이 statModifiers의 어떤 필드(예: mainStatC, damageInc)에 영향을 주는지
   *      EFFECT_MAP에서 정보를 가져옵니다. 정보가 없으면 무시합니다.
   */ 
  Object.entries(typeMap).forEach(([type, typeLogs]) => {
    const entry = EFFECT_MAP[type as CommonEffectTypeId];
    if (!entry) return;

    /**
     * 설명: 지금 처리하는 효과가 스탯(statMods) 쪽인지, 데미지(damageMods) 쪽인지 판단합니다.
     * 로직: statMods 객체 안에 해당 필드 이름이 있으면 statMod를, 없으면 damageMod를 수정 대상으로 잡습니다.
     */ 
    const statMod   = statMods   as unknown as Record<string, number>;
    const damageMod = damageMods as unknown as Record<string, number>;
    const targetMod = Object.prototype.hasOwnProperty.call(statMods, entry.field)
      ? statMod
      : damageMod;

    /**
     * 설명: 같은 타입 안에서도 **"합연산 후 곱연산"**을 할 그룹들을 나눕니다.
     * 핵심: subGroup이 같으면 한 그룹으로 묶고, 없으면(null) 중복되지 않는
     *      고유 키(__solo_숫자)를 주어 각각 독립된 그룹으로 만듭니다.
     */ 
    const groupMap: Record<string, number[]> = {};
    typeLogs.forEach((log, idx) => {
      const key = log.subGroup ?? `__solo_${idx}`;
      if (!groupMap[key]) groupMap[key] = [];
      groupMap[key].push(log.value);
    });

    /**
     * const groupSum = ...: 같은 그룹에 속한 값들을 먼저 싹 다 더합니다. (합연산)
     * targetMod[...] *= (1 + groupSum): 그 합산된 결과를 현재 수치에 곱합니다. (독립 곱연산)
     */ 
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
 *   effects[i].value[0]               → 기본 고정값 (레벨 무관)
 *   bonus.relic.value[level-1]        → 유물/전설 레벨별 추가
 *   bonus.ability.value[stoneLevel-1] → 어빌리티스톤 레벨별 추가
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
    });
  });

  return logs;
};


// ============================================================
// extractCalcData
// ============================================================

/** 카드 효과 키워드 → EffectTypeId 매핑 (순서 중요) */
const CARD_EFFECT_LIST: Array<[string, CommonEffectTypeId | null]> = [
  ['피해 감소'  , null          ],
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
const ACCESSORY_LABEL_MAP: Array<[string, string]> = [
  ['힘', 'MAIN_STAT_C'],
  ['민첩', 'MAIN_STAT_C'],
  ['지능', 'MAIN_STAT_C'],
  ['적에게 주는 피해', 'DMG_INC'     ],
  ['추가 피해'       , 'ADD_DMG'     ],
  ['무기 공격력'     , 'WEAPON_ATK_P'],
  ['치명타 피해'     , 'CRIT_DMG'    ],
  ['치명타 적중률'   , 'CRIT_CHANCE' ],
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


const extractCalcData = (display: CharacterDisplayData): CalcData => {

  const combatStats     = createEmptyCombatStats();
  const statModifiers   = createEmptyStatModifiers();
  const damageModifiers = createEmptyDamageModifiers();
  const effectLog       : EffectLog[] = [];
  const classEffectLog  : EffectLog[] = [];

  const applyEffect = (
    label   : string,
    type    : string,
    value   : number,
    subGroup?: string,
    target? : import('@/types/sim-types').EffectTarget,
  ) => {
    if (type === 'GK_QI_DMG' || type === 'GK_QI_COST') {
      classEffectLog.push({ label, type, value, subGroup, target });
      return;
    }
    effectLog.push({ label, type, value, subGroup, target });
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

  // ── 0. 장비 기본 스탯 수집 ───────────────────────────────────
  //   무기    → WEAPON_ATK_C
  //   방어구  → MAIN_STAT_C, STAT_HP_C

  // API 장비 타입명 → DB name 매핑 (API는 '어깨', DB는 '견갑')
  const API_TYPE_TO_DB_NAME: Record<string, string> = {
    '무기': '무기', '투구': '투구', '어깨': '견갑',
    '상의': '상의', '하의': '하의', '장갑': '장갑',
  };

  display.equipment.forEach(eq => {
    const dbName  = API_TYPE_TO_DB_NAME[eq.type];
    if (!dbName) return;

    const dbEntry = COMBAT_EQUIP_DATA.find(db => db.name === dbName);
    if (!dbEntry?.effects) return;

    // setType → DB 등급 키 결정
    const gradeKey: 'ancient' | 'serca' | 'relic' =
      eq.setType === 'SERCA_ANCIENT' ? 'serca'   :
      eq.setType === 'AEGIR_ANCIENT' ? 'ancient'  : 'relic';

    dbEntry.effects.forEach(eff => {
      // multiValues 타입만 처리 (value, grades 타입은 품질/상재련 계산 단계에서 처리)
      if (!('multiValues' in eff) || !eff.multiValues) return;

      const values = eff.multiValues[gradeKey];
      if (!values || values.length === 0) return;

      // refineStep: +25 → index 24 / 0강이면 첫 번째 값 사용
      const idx   = Math.max(0, eq.refineStep - 1);
      const value = values[Math.min(idx, values.length - 1)] ?? 0;
      if (value === 0) return;

      applyEffect(`${eq.type} 기본스탯`, eff.type, value);
    });
  });

  // ── 0-1. 악세서리 주스탯 수집 ─────────────────────────────────
  //   normalizer가 파싱한 baseEffects를 effectLog에 추가
  //   힘/민첩/지능 → MAIN_STAT_C
  //   체력         → STAT_HP_C

  display.accessories.forEach(acc => {
    acc.baseEffects.forEach(eff => {
      const effectType = eff.statType.text === '체력' ? 'STAT_HP_C' : 'MAIN_STAT_C';
      if (eff.value.value > 0)
        applyEffect(`${acc.type} 주스탯`, effectType, eff.value.value);
    });
  });

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
    if (eff.isFixed) return;
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
      applyEffect(log.label, log.type, log.value, log.subGroup, log.target)
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

  // ── 11. 공격력 4종 계산 (engine/atk-calculator) ──────────
  const { weaponAtk, mainStat, baseAtk, finalAtk } = calcAllAtk(
    statModifiers,
    effectLog.filter(l => l.type === 'ATK_P'),
  );
  combatStats.weaponAtk = weaponAtk;
  combatStats.mainStat  = mainStat;
  combatStats.baseAtk   = baseAtk;
  combatStats.finalAtk  = finalAtk;

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