// @/hooks/useCalculatorStore.ts
"use client";

import { useState, useEffect } from 'react';
import { CharacterDisplayData } from '@/types/character-types';
import {
  CombatStats, StatModifiers, DamageModifiers,
  CommonEffectTypeId, EFFECT_MAP,
} from '@/types/sim-types';
import {
  GkClassModifiers, GkEffectTypeId, GK_EFFECT_MAP,
  ClassEffectMapEntry, createEmptyGkClassModifiers,
} from '@/types/skills/guardian-knight-effects';
import { ENGRAVINGS_DB } from '@/data/engravings';
import {
  calcWeaponAtk,
  calcMainStat,
  calcFinalAtk,
} from '@/utils/atk-calculator';


// ============================================================
// EffectLog 타입
// ============================================================

/**
 * 개별 효과 적용 기록
 *
 * applyEffect() 호출 시마다 이 형태로 로그를 쌓습니다.
 * 디버그 패널에서 effectType 별로 그룹핑하여 표시합니다.
 *
 * @param label     - 출처 이름 (예: "원한", "목걸이 추가피해", "보석 공증")
 * @param type      - EffectTypeId (예: "DMG_INC", "CRIT_DMG")
 * @param value     - 적용된 수치 (소수, 예: 0.21)
 * @param operation - 연산 방식 (ADD | MULTIPLY)
 */
export interface EffectLog {
  label    : string;
  type     : string;
  value    : number;
  operation: 'ADD' | 'MULTIPLY';
  subGroup?: string;  // calcFinalAtk 의 그룹핑에 사용
}


// ============================================================
// CalcData 타입
// ============================================================

/**
 * 계산 엔진이 소비하는 수치 묶음
 *
 * effectLog: 효과 적용 이력 (디버그 패널 표시용)
 *   type 별로 그룹핑하면 출처별 내역 확인 가능
 * classModifiers: 직업별 특수 보정치
 *   현재는 가디언나이트만 구현
 *   추후 직업별 유니온으로 확장 가능
 */
export interface CalcData {
  combatStats    : CombatStats;
  statModifiers  : StatModifiers;
  damageModifiers: DamageModifiers;
  classModifiers : GkClassModifiers | null;
  effectLog      : EffectLog[];  // ← 추가
  // 추후: | SorcClassModifiers | null 등 유니온 확장
}


// ============================================================
// 초기값 생성 함수
// ============================================================

const createEmptyCombatStats = (): CombatStats => ({
  baseAtk: 0, mainStat: 0, weaponAtk: 0, finalAtk: 0,
  critical: 0, specialization: 0, swiftness: 0,
  hp: 0, domination: 0, endurance: 0, expertise: 0,
});

const createEmptyStatModifiers = (): StatModifiers => ({
  mainStatC: 0, mainStatP: 0,
  weaponAtkC: 0, weaponAtkP: 0,
  baseAtkP: 0, atkC: 0, atkP: 0,
});

/**
 * DamageModifiers 초기값
 * MULTIPLY 계열(damageInc, critDamageInc)은 1.0
 * ADD 계열은 0
 * critDamage 기본값 2.0 (기본 치명타 피해 200%)
 */
const createEmptyDamageModifiers = (): DamageModifiers => ({
  damageInc    : 1.0,  // MULTIPLY 초기값
  critDamageInc: 1.0,  // MULTIPLY 초기값
  cdrC    : 0,
  cdrP    : 0,
  evoDamage        : 0,
  addDamage        : 0,
  critChance       : 0,
  critDamage       : 2.0,  // 기본 치명타 피해 200%
  defPenetration   : 0,
  enemyDamageTaken : 0,
  atkSpeed: 0,
  movSpeed: 0,
});

const createEmptyCalcData = (): CalcData => ({
  combatStats    : createEmptyCombatStats(),
  statModifiers  : createEmptyStatModifiers(),
  damageModifiers: createEmptyDamageModifiers(),
  classModifiers : createEmptyGkClassModifiers(),
  effectLog      : [],  // ← 추가
});


// ============================================================
// extractCalcData
// ============================================================

/** 
 * Record → 순서 보장 배열로 변경
 * '피해 감소'를 '피해'보다 먼저 검사해서 오매칭 방지
 * 속성명(성/암/화 등)이 앞에 붙어도 키워드 포함 여부로 판단하므로
 * '피해 감소' 먼저 체크 → 매칭 시 스킵, 이후 '피해' 체크
 */
const CARD_EFFECT_LIST: Array<[string, CommonEffectTypeId | null]> = [
  ['피해 감소'  , null          ],  // null = 딜 계산 무관, 무시
  ['피해'       , 'DMG_INC'    ],
  ['공격력'     , 'ATK_P'      ],
  ['치명타 피해', 'CRIT_DMG'   ],
  ['치명타 확률', 'CRIT_CHANCE'],
];

/** 아크그리드 효과명 → EffectTypeId 매핑 */
const ARK_GRID_EFFECT_MAP: Record<string, CommonEffectTypeId> = {
  '공격력': 'ATK_P',
  '보스 피해': 'DMG_INC',
  '추가 피해': 'ADD_DMG',
};

/**
 * CharacterDisplayData → CalcData 추출
 *
 * [applyEffect 처리 순서]
 *   1. EFFECT_MAP 공통 타입 → statModifiers / damageModifiers 누적
 *   2. GK_EFFECT_MAP 가디언나이트 타입 → classModifiers 누적
 *   3. effectLog 에 출처 이름(label) + 타입 + 수치 기록
 *   4. 둘 다 없는 타입 → 무시 (특수 계산은 계산 엔진에서 처리)
 */
const extractCalcData = (display: CharacterDisplayData): CalcData => {

  const combatStats     = createEmptyCombatStats();
  const statModifiers   = createEmptyStatModifiers();
  const damageModifiers = createEmptyDamageModifiers();
  const classModifiers  = createEmptyGkClassModifiers();
  const effectLog       : EffectLog[] = [];  // ← 로그 배열


  // ------------------------------------------------------------
  // applyCommonEffect: EFFECT_MAP 기반 공통 효과 누적
  // ------------------------------------------------------------
  /**
   * MULTIPLY 계열: *= (1 + value)  초기값 1.0 기준
   * ADD 계열     : += value
   */
  const applyCommonEffect = (
    type     : string,
    value    : number,
    operation: 'ADD' | 'MULTIPLY',
    subGroup?: string,
  ) => {
    const entry = EFFECT_MAP[type as CommonEffectTypeId];
    if (!entry) return;

    // subGroup 있는 ADD → effectLog 에만 기록, 여기서는 누적 안 함
    // extractCalcData 마지막의 후처리에서 그룹별 합산 후 곱연산으로 반영
    if (operation === 'ADD' && subGroup) return;

    const statMod   = statModifiers   as unknown as Record<string, number>;
    const damageMod = damageModifiers as unknown as Record<string, number>;
    const targetMod = Object.prototype.hasOwnProperty.call(statModifiers, entry.field)
      ? statMod : damageMod;

    if (operation === 'ADD') {
      targetMod[entry.field] += value;
    } else {
      targetMod[entry.field] *= (1 + value);
    }
  };


  // ------------------------------------------------------------
  // applyClassEffect: GK_EFFECT_MAP 기반 직업 특수 효과 누적
  // ------------------------------------------------------------
  const applyClassEffect = (
    type     : string,
    value    : number,
    operation: 'ADD' | 'MULTIPLY',
  ) => {
    const entry = GK_EFFECT_MAP[type as GkEffectTypeId] as ClassEffectMapEntry | undefined;
    if (!entry) return;
    // GK 계열은 현재 ADD만 존재 — operation 파라미터는 미래 확장용
    if (operation === 'ADD') {
      classModifiers[entry.field] += value;
    }
  };


  // ------------------------------------------------------------
  // applyEffect: 공통 진입점 (로그 기록 포함)
  // ------------------------------------------------------------
  /**
   * @param label     - 디버그 패널에 표시될 출처 이름 (예: "원한", "목걸이 추가피해")
   * @param type      - EffectTypeId
   * @param value     - 수치 (소수)
   * @param operation - 연산 방식 (기본값 'ADD')
   */
  // 변경 후
  const applyEffect = (
    label    : string,
    type     : string,
    value    : number,
    operation: 'ADD' | 'MULTIPLY' = 'ADD',
    subGroup?: string,
  ) => {
    applyCommonEffect(type, value, operation, subGroup);  // ← subGroup 전달
    applyClassEffect(type, value, operation);
    effectLog.push({ label, type, value, operation, subGroup });
  };


  // ── 1. 전투 특성 ──────────────────────────────────────────
  // 특성은 applyEffect 를 거치지 않고 직접 할당 (EFFECT_MAP 대상 아님)
  combatStats.critical       = display.combatStats.critical;
  combatStats.specialization = display.combatStats.specialization;
  combatStats.swiftness      = display.combatStats.swiftness;
  combatStats.domination     = display.combatStats.domination;
  combatStats.endurance      = display.combatStats.endurance;
  combatStats.expertise      = display.combatStats.expertise;
  combatStats.hp             = display.combatStats.maxHp;
  combatStats.baseAtk        = display.combatStats.attackPower;

  // ── 2. 장비 효과 ──────────────────────────────────────────
  display.equipment.forEach(eq =>
    eq.effects.forEach(eff =>
      // label: "무기 무기공격력", "상의 힘" 등
      applyEffect(`${eq.type} ${eff.label.text}`, eff.effectType, eff.value.value)
    )
  );

  // ── 3. 악세서리 연마효과 ──────────────────────────────────
  display.accessories.forEach(acc =>
    acc.polishEffects.forEach(eff => {
      const subGroup = eff.effectType === 'DMG_INC' ? 'accessory' : undefined;
      applyEffect(`${acc.type} ${eff.label.text}`, eff.effectType, eff.value.value, 'ADD', subGroup);
    })
  );

  // ── 4. 팔찌 효과 (랜덤 옵션만) ───────────────────────────
  display.bracelet?.effects.forEach(eff => {
    if (!eff.isFixed) {
      const subGroup = eff.effectType === 'DMG_INC' ? 'bracelet' : undefined;
      applyEffect(`팔찌 ${eff.label.text}`, eff.effectType, eff.value.value, 'ADD', subGroup);
    }
  });

  // ── 5. 아바타 주스탯 보너스 ───────────────────────────────
  const totalAvatarBonus = display.avatars.reduce(
    (sum, av) => sum + av.mainStatBonus, 0
  );
  applyEffect('아바타 주스탯', 'MAIN_STAT_P', totalAvatarBonus);

  // ── 6. 각인 효과 ──────────────────────────────────────────
  display.engravings.forEach(eng => {
    const db = ENGRAVINGS_DB.find(e => e.name === eng.name.text);
    if (!db?.effects) return;
    db.effects.forEach(eff =>
      // label: "원한", "예리한 둔기" 등 — 각인명 그대로 사용
      applyEffect(eng.name.text, eff.type, eff.value, eff.operation ?? 'ADD')
    );
  });

  // ── 7. 보석 공증 ──────────────────────────────────────────
  applyEffect('보석 공증', 'BASE_ATK_P', display.gems.totalBaseAtk.value);

  // ── 8. 카드 효과 ──────────────────────────────────────────
  display.cards?.activeItems.forEach(item => {
    if (!item.value) return;
    for (const [keyword, effectType] of CARD_EFFECT_LIST) {
      if (item.description.includes(keyword)) {
        if (effectType !== null) {
          // 카드 DMG_INC 는 카드끼리 합산(ADD) 후 그룹 단위 1회 곱연산
          // subGroup: 'card' 로 묶어서 calcFinalMultiplier 에서 그룹 처리
          const subGroup = effectType === 'DMG_INC' ? 'card' : undefined;
          applyEffect(`카드 ${keyword}`, effectType, item.value.value, 'ADD', subGroup);
        }
        break;
      }
    }
  });

  // ── 9. 아크그리드 효과 ────────────────────────────────────
  display.arkGrid.effects.forEach(eff => {
    const effectType = ARK_GRID_EFFECT_MAP[eff.label.text];
    if (effectType) {
      const subGroup = effectType === 'DMG_INC' ? 'arkGrid' : undefined;
      applyEffect(`아크그리드 ${eff.label.text}`, effectType, eff.value.value, 'ADD', subGroup);
    }
  });

  // ── 10. subGroup ADD 후처리 ───────────────────────────────
  // subGroup 있는 ADD 효과들: 그룹 내 합산 후 해당 필드에 (1 + 합산) 곱연산
  // effectLog 에서 subGroup 있는 ADD 항목만 추출 → 필드별 그룹핑 → 곱연산
  const subGroupLogs = effectLog.filter(l => l.operation === 'ADD' && l.subGroup);

  // { fieldName: { groupKey: number[] } } 구조로 집계
  const subGroupMap: Record<string, Record<string, number[]>> = {};

  subGroupLogs.forEach(log => {
    const entry = EFFECT_MAP[log.type as CommonEffectTypeId];
    if (!entry) return;

    const field    = entry.field;
    const groupKey = log.subGroup!;

    if (!subGroupMap[field]) subGroupMap[field] = {};
    if (!subGroupMap[field][groupKey]) subGroupMap[field][groupKey] = [];
    subGroupMap[field][groupKey].push(log.value);
  });

  // 필드별로: 각 그룹의 합산값을 (1 + 합산) 으로 독립 곱연산
  const damageMod = damageModifiers as unknown as Record<string, number>;
  const statMod   = statModifiers   as unknown as Record<string, number>;

  Object.entries(subGroupMap).forEach(([field, groups]) => {
    const targetMod = Object.prototype.hasOwnProperty.call(statModifiers, field)
      ? statMod : damageMod;

    Object.values(groups).forEach(values => {
      const groupSum = values.reduce((s, v) => s + v, 0);
      targetMod[field] *= (1 + groupSum);
    });
  });

  // ── 10. 공격력 3종 계산 ───────────────────────────────────
  // weaponAtk: 무기 공격력 고정 × (1 + 무기 공격력 % 합산)
  combatStats.weaponAtk = calcWeaponAtk(
    statModifiers.weaponAtkC,
    statModifiers.weaponAtkP,
  );

  // mainStat: baseAtk / baseAtkP 보정 제거 후 역산
  combatStats.mainStat = calcMainStat(
    combatStats.baseAtk,
    statModifiers.baseAtkP,
    combatStats.weaponAtk,
  );

  // finalAtk: (baseAtk + atkC) × ATK_P subGroup 독립 곱연산
  // ATK_P 로그만 꺼내서 calcFinalAtk 에 전달
  const atkPLogs = effectLog.filter(l => l.type === 'ATK_P');
  combatStats.finalAtk = calcFinalAtk(
    combatStats.baseAtk,
    statModifiers.atkC,
    atkPLogs,
  );

  return { combatStats, statModifiers, damageModifiers, classModifiers, effectLog };
};


// ============================================================
// useCalculatorStore
// ============================================================

export const useCalculatorStore = () => {

  const [displayData, setDisplayDataState] =
    useState<CharacterDisplayData | null>(null);

  const [calcData, setCalcData] = useState<CalcData>(createEmptyCalcData());

  useEffect(() => {
    if (!displayData) {
      setCalcData(createEmptyCalcData());
      return;
    }
    setCalcData(extractCalcData(displayData));
  }, [displayData]);

  const setDisplayData = (data: CharacterDisplayData) => setDisplayDataState(data);

  const overrideCalcData = (partial: Partial<CalcData>) => {
    setCalcData(prev => ({ ...prev, ...partial }));
  };

  return {
    displayData,
    setDisplayData,
    calcData,
    overrideCalcData,
  };
};