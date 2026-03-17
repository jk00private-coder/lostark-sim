// @/hooks/useCalculatorStore.ts
"use client";

import { useState, useEffect } from 'react';
import { CharacterDisplayData } from '@/types/character-types';
import {
  CombatStats, StatModifiers, DamageModifiers,
  EffectEntry, CommonEffectTypeId, EFFECT_MAP,
} from '@/types/sim-types';
import {
  GkClassModifiers, GkEffectTypeId, GK_EFFECT_MAP,
  ClassEffectMapEntry, createEmptyGkClassModifiers,
} from '@/types/skills/guardian-knight-effects';
import { ENGRAVINGS_DB } from '@/data/engravings';



// ============================================================
// CalcData 타입
// ============================================================

/**
 * 계산 엔진이 소비하는 수치 묶음
 *
 * classModifiers: 직업별 특수 보정치
 *   현재는 가디언나이트만 구현
 *   추후 직업별 유니온으로 확장 가능
 *   null 이면 직업 특수 계산 없음
 */
export interface CalcData {
  combatStats: CombatStats;
  statModifiers: StatModifiers;
  damageModifiers: DamageModifiers;
  classModifiers: GkClassModifiers | null;
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
 * MULTIPLY 계열(damageInc, critDamageInc, cdr)은 1.0
 * ADD 계열은 0
 */
const createEmptyDamageModifiers = (): DamageModifiers => ({
  damageInc: 0.0,
  critDamageInc: 0.0,
  cdrC: 0.0,
  cdrP: 0.0,
  evoDamage: 0,
  addDamage: 0,
  critChance: 0,
  critDamage: 0,
  defPenetration: 0,
  enemyDamageTaken: 0,
  atkSpeed: 0,
  movSpeed: 0,
});

const createEmptyCalcData = (): CalcData => ({
  combatStats: createEmptyCombatStats(),
  statModifiers: createEmptyStatModifiers(),
  damageModifiers: createEmptyDamageModifiers(),
  classModifiers: createEmptyGkClassModifiers(),  // 현재 가디언나이트 고정
});


// ============================================================
// extractCalcData
// ============================================================

/** 카드 효과 → EffectTypeId 매핑 */
const CARD_EFFECT_MAP: Record<string, CommonEffectTypeId> = {
  '피해': 'DMG_INC',
  '공격력': 'ATK_P',
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
 * [applyEffect 처리]
 *   1. EFFECT_MAP 에 있는 공통 타입 → 해당 필드에 ADD/MULTIPLY 처리
 *   2. GK_EFFECT_MAP 에 있는 가디언나이트 타입 → classModifiers 에 누적
 *   3. 둘 다 없는 타입 → 무시 (특수 계산은 계산 엔진에서 처리)
 */
const extractCalcData = (display: CharacterDisplayData): CalcData => {
  const combatStats = createEmptyCombatStats();
  const statModifiers = createEmptyStatModifiers();
  const damageModifiers = createEmptyDamageModifiers();
  const classModifiers = createEmptyGkClassModifiers();

  /**
   * EFFECT_MAP 기반 자동 누적
   * ADD      → += value
   * MULTIPLY → *= (1 + value)  (초기값 1.0 기준)
   */
  const applyCommonEffect = (type: string, value: number) => {
    const entry = EFFECT_MAP[type as CommonEffectTypeId];
    if (!entry) return;

    const allMods = { ...statModifiers, ...damageModifiers } as Record<string, number>;

    // 변경 후 — operation 없이 타입 이름만으로 판단 불가
    // → Todo: 대신 EFFECT_MAP에 연산 방식을 어떻게 알 수 있는가?
    allMods[entry.field] += value;
    // allMods[entry.field] *= (1 + value);

    // 변경사항 반영
    Object.assign(statModifiers, allMods);
    Object.assign(damageModifiers, allMods);
  };

  /**
   * 직업 특수 Effect 누적 (가디언나이트)
   * GK_EFFECT_MAP 에 있는 타입만 처리합니다.
   */
  const applyClassEffect = (type: string, value: number) => {
    const entry = GK_EFFECT_MAP[type as GkEffectTypeId] as ClassEffectMapEntry | undefined;
    if (!entry) return;

    // → Todo: 대신 EFFECT_MAP에 연산 방식을 어떻게 알 수 있는가?
      classModifiers[entry.field] += value;
  };

  const applyEffect = (type: string, value: number) => {
    applyCommonEffect(type, value);
    applyClassEffect(type, value);
  };

  // ── 1. 전투 특성 ──────────────────────────────────────────
  combatStats.critical = display.combatStats.critical;
  combatStats.specialization = display.combatStats.specialization;
  combatStats.swiftness = display.combatStats.swiftness;
  combatStats.domination = display.combatStats.domination;
  combatStats.endurance = display.combatStats.endurance;
  combatStats.expertise = display.combatStats.expertise;
  combatStats.hp = display.combatStats.maxHp;
  combatStats.baseAtk = display.combatStats.attackPower;

  // ── 2. 장비 효과 ──────────────────────────────────────────
  display.equipment.forEach(eq =>
    eq.effects.forEach(eff => applyEffect(eff.effectType, eff.value.value))
  );

  // ── 3. 악세서리 연마효과 ──────────────────────────────────
  display.accessories.forEach(acc =>
    acc.polishEffects.forEach(eff => applyEffect(eff.effectType, eff.value.value))
  );

  // ── 4. 팔찌 효과 (랜덤 옵션만) ───────────────────────────
  display.bracelet?.effects.forEach(eff => {
    if (!eff.isFixed) applyEffect(eff.effectType, eff.value.value);
  });

  // ── 5. 아바타 주스탯 보너스 ───────────────────────────────
  const totalAvatarBonus = display.avatars.reduce(
    (sum, av) => sum + av.mainStatBonus, 0
  );
  applyEffect('MAIN_STAT_P', totalAvatarBonus);

  // ── 6. 각인 효과 ──────────────────────────────────────────
  display.engravings.forEach(eng => {
    const db = ENGRAVINGS_DB.find(e => e.name === eng.name.text);
    if (!db?.effects) return;
    db.effects.forEach(eff => applyEffect(eff.type, eff.value));
  });

  // ── 7. 보석 공증 ──────────────────────────────────────────
  applyEffect('BASE_ATK_P', display.gems.totalBaseAtk.value);

  // ── 8. 카드 효과 ──────────────────────────────────────────
  display.cards?.activeItems.forEach(item => {
    if (!item.value) return;
    for (const [keyword, effectType] of Object.entries(CARD_EFFECT_MAP)) {
      if (item.description.includes(keyword)) {
        applyEffect(effectType, item.value.value);
        break;
      }
    }
  });

  // ── 9. 아크그리드 효과 ────────────────────────────────────
  display.arkGrid.effects.forEach(eff => {
    const effectType = ARK_GRID_EFFECT_MAP[eff.label.text];
    if (effectType) applyEffect(effectType, eff.value.value);
  });

  return { combatStats, statModifiers, damageModifiers, classModifiers };
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