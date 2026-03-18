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
  baseAtk: 0, mainStat: 0, weaponAtk: 0,
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

/** 카드 효과 키워드 → EffectTypeId 매핑 */
const CARD_EFFECT_MAP: Record<string, CommonEffectTypeId> = {
  '피해'      : 'DMG_INC',
  '공격력'    : 'ATK_P',
  '치명타 피해': 'CRIT_DMG',
  '치명타 확률': 'CRIT_CHANCE',
};

/** 아크그리드 효과명 → EffectTypeId 매핑 */
const ARK_GRID_EFFECT_MAP: Record<string, CommonEffectTypeId> = {
  '공격력': 'ATK_P',
  '낙인력': 'ATK_P',
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
  ) => {
    const entry = EFFECT_MAP[type as CommonEffectTypeId];
    if (!entry) return;

    const allMods = { ...statModifiers, ...damageModifiers } as Record<string, number>;

    if (operation === 'ADD') {
      allMods[entry.field] += value;
    } else {
      // MULTIPLY: 독립 곱연산
      allMods[entry.field] *= (1 + value);
    }

    Object.assign(statModifiers, allMods);
    Object.assign(damageModifiers, allMods);
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
  const applyEffect = (
    label    : string,
    type     : string,
    value    : number,
    operation: 'ADD' | 'MULTIPLY' = 'ADD',
  ) => {
    applyCommonEffect(type, value, operation);
    applyClassEffect(type, value, operation);

    // 효과 로그 기록
    effectLog.push({ label, type, value, operation });
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
    acc.polishEffects.forEach(eff =>
      // label: "목걸이 추가피해", "반지 치명타피해" 등
      applyEffect(`${acc.type} ${eff.label.text}`, eff.effectType, eff.value.value)
    )
  );

  // ── 4. 팔찌 효과 (랜덤 옵션만) ───────────────────────────
  display.bracelet?.effects.forEach(eff => {
    if (!eff.isFixed)
      // label: "팔찌 치명타피해", "팔찌 추가피해" 등
      applyEffect(`팔찌 ${eff.label.text}`, eff.effectType, eff.value.value);
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
    for (const [keyword, effectType] of Object.entries(CARD_EFFECT_MAP)) {
      if (item.description.includes(keyword)) {
        // label: "카드 피해", "카드 치명타피해" 등
        applyEffect(`카드 ${keyword}`, effectType, item.value.value);
        break;
      }
    }
  });

  // ── 9. 아크그리드 효과 ────────────────────────────────────
  display.arkGrid.effects.forEach(eff => {
    const effectType = ARK_GRID_EFFECT_MAP[eff.label.text];
    if (effectType)
      // label: "아크그리드 공격력", "아크그리드 추가피해" 등
      applyEffect(`아크그리드 ${eff.label.text}`, effectType, eff.value.value);
  });

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