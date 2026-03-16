// @/hooks/useCalculatorStore.ts
"use client";

import { useState, useEffect } from 'react';

import { CharacterDisplayData } from '@/types/character-types';
import {
  CombatStats, StatModifiers, DamageModifiers,
} from '@/types/sim-types';

// ============================================================
// 계산용 데이터 타입
// ============================================================

/**
 * 계산 엔진이 소비하는 수치 묶음
 * displayData 변경 시 useEffect 로 자동 동기화됩니다.
 * Phase 4 시뮬레이터에서 setCalcData() 로 수동 수정 가능합니다.
 */
export interface CalcData {
  combatStats    : CombatStats;      // 전투 특성 수치 (치명, 특화, 신속 등)
  statModifiers  : StatModifiers;    // 공격력 계열 보정치
  damageModifiers: DamageModifiers;  // 피해 계열 보정치
}

// ============================================================
// 초기값 생성 함수
// ============================================================

/** 모든 수치가 0인 CombatStats 초기값 */
const createEmptyCombatStats = (): CombatStats => ({
  baseAtk       : 0,
  mainStat      : 0,
  weaponAtk     : 0,
  critical      : 0,
  specialization: 0,
  swiftness     : 0,
  hp            : 0,
  domination    : 0,
  endurance     : 0,
  expertise     : 0,
});

/** 모든 수치가 0인 StatModifiers 초기값 */
const createEmptyStatModifiers = (): StatModifiers => ({
  mainStatStatic  : 0,
  mainStatPercent : 0,
  weaponAtkStatic : 0,
  weaponAtkPercent: 0,
  baseAtkPercent  : 0,
  atkStatic       : 0,
  atkPercent      : 0,
});

/** 모든 수치가 0인 DamageModifiers 초기값 */
const createEmptyDamageModifiers = (): DamageModifiers => ({
  damageInc         : 0,
  evolutionDamage   : 0,
  specialDamage     : 0,
  additionalDamage  : 0,
  critChance        : 0,
  critDamage        : 0,
  critDamageInc     : 0,
  defensePenetration: 0,
  targetDamageTaken : 0,
  atkSpeed          : 0,
  movSpeed          : 0,
  cooldownReduction : 0,
});

/** 모든 수치가 0인 CalcData 초기값 */
const createEmptyCalcData = (): CalcData => ({
  combatStats    : createEmptyCombatStats(),
  statModifiers  : createEmptyStatModifiers(),
  damageModifiers: createEmptyDamageModifiers(),
});

// ============================================================
// displayData → calcData 추출 함수
// ============================================================

/**
 * CharacterDisplayData 에서 계산 엔진용 수치를 추출합니다.
 *
 * 누적 순서:
 *   1. 전투 특성 (profile.Stats)
 *   2. 장비 효과 (무기 공격력, 주스탯 등)
 *   3. 악세서리 연마효과 (공격력%, 추가피해% 등)
 *   4. 팔찌 효과
 *   5. 아바타 주스탯 보너스
 *   6. 각인 효과
 *   7. 보석 공증
 *   8. 카드 효과
 *   9. 아크그리드 효과
 *
 * ⚠️ 아크패시브 효과는 Tooltip 파싱이 필요하므로 추후 구현 예정
 */
const extractCalcData = (display: CharacterDisplayData): CalcData => {
  const combatStats     = createEmptyCombatStats();
  const statModifiers   = createEmptyStatModifiers();
  const damageModifiers = createEmptyDamageModifiers();

  // sim-types.ts 의 EffectTypeId → calcData 필드 매핑
  // data-normalizer 의 EFFECT_MAP 과 동일한 역할
  const applyEffect = (effectType: string, value: number) => {
    switch (effectType) {
      // StatModifiers
      case 'MAIN_STAT_STATIC'  : statModifiers.mainStatStatic   += value; break;
      case 'MAIN_STAT_PERCENT' : statModifiers.mainStatPercent  += value; break;
      case 'WEAPON_ATK_STATIC' : statModifiers.weaponAtkStatic  += value; break;
      case 'WEAPON_ATK_PERCENT': statModifiers.weaponAtkPercent += value; break;
      case 'BASE_ATK_PERCENT'  : statModifiers.baseAtkPercent   += value; break;
      case 'ATK_STATIC'        : statModifiers.atkStatic        += value; break;
      case 'ATK_PERCENT'       : statModifiers.atkPercent       += value; break;
      // DamageModifiers
      case 'DMG_INC'          : damageModifiers.damageInc          += value; break;
      case 'EVO_DMG'          : damageModifiers.evolutionDamage    += value; break;
      case 'ADD_DMG'          : damageModifiers.additionalDamage   += value; break;
      case 'CRIT_CHANCE'      : damageModifiers.critChance         += value; break;
      case 'CRIT_DMG'         : damageModifiers.critDamage         += value; break;
      case 'CRIT_DMG_INC'     : damageModifiers.critDamageInc      += value; break;
      case 'DEF_PENETRATION'  : damageModifiers.defensePenetration += value; break;
      case 'TARGET_DMG_TAKEN' : damageModifiers.targetDamageTaken  += value; break;
      // 유틸
      case 'ATK_SPEED'         : damageModifiers.atkSpeed          += value; break;
      case 'MOV_SPEED'         : damageModifiers.movSpeed          += value; break;
      case 'COOLDOWN_REDUCTION': damageModifiers.cooldownReduction += value; break;
    }
  };

  // ── 1. 전투 특성 ──────────────────────────────────────────
  combatStats.critical       = display.combatStats.critical;
  combatStats.specialization = display.combatStats.specialization;
  combatStats.swiftness      = display.combatStats.swiftness;
  combatStats.domination     = display.combatStats.domination;
  combatStats.endurance      = display.combatStats.endurance;
  combatStats.expertise      = display.combatStats.expertise;
  combatStats.hp             = display.combatStats.maxHp;
  combatStats.baseAtk        = display.combatStats.attackPower;

  // ── 2. 장비 효과 ──────────────────────────────────────────
  display.equipment.forEach(eq => {
    eq.effects.forEach(eff => applyEffect(eff.effectType, eff.value.value));
  });

  // ── 3. 악세서리 연마효과 ──────────────────────────────────
  display.accessories.forEach(acc => {
    acc.polishEffects.forEach(eff => applyEffect(eff.effectType, eff.value.value));
  });

  // ── 4. 팔찌 효과 ──────────────────────────────────────────
  display.bracelet?.effects.forEach(eff => {
    if (!eff.isFixed) {
      // 고정 특성(신속/특화)은 combatStats 에 이미 포함됨
      applyEffect(eff.effectType, eff.value.value);
    }
  });

  // ── 5. 아바타 주스탯 보너스 ───────────────────────────────
  // 무기/상의/하의 아바타 각 mainStatBonus 합산
  const totalAvatarBonus = display.avatars.reduce(
    (sum, av) => sum + av.mainStatBonus, 0
  );
  statModifiers.mainStatPercent += totalAvatarBonus;

  // ── 6. 각인 효과 ──────────────────────────────────────────
  // ⚠️ ENGRAVINGS_DB 와 연결 필요
  // 현재 engravings 는 description(텍스트)만 있고 effectType/value 없음
  // TODO: ENGRAVINGS_DB 에서 각인 ID → 효과 수치 매핑 후 여기서 누적

  // ── 7. 보석 공증 ──────────────────────────────────────────
  // gems.totalBaseAtk = 전체 공증 합산 수치
  statModifiers.baseAtkPercent += display.gems.totalBaseAtk.value;

  // ── 8. 카드 효과 ──────────────────────────────────────────
  // ⚠️ 카드 효과는 description 텍스트 파싱 필요
  // TODO: activeItems[].value 가 있는 경우 effectType 판별 후 누적

  // ── 9. 아크그리드 효과 ────────────────────────────────────
  // arkGrid.effects 는 이미 name 과 value 가 파싱되어 있음
  // name → effectType 매핑
  const ARK_GRID_EFFECT_MAP: Record<string, string> = {
    '낙인력'    : 'ATK_PERCENT',   // 낙인력은 지원용 — 딜러에게 무관하나 일단 포함
    '공격력'    : 'ATK_PERCENT',
    '보스 피해' : 'DMG_INC',
    '추가 피해' : 'ADD_DMG',
  };

  display.arkGrid.effects.forEach(eff => {
    const effectType = ARK_GRID_EFFECT_MAP[eff.label.text];
    if (effectType) applyEffect(effectType, eff.value.value);
  });

  return { combatStats, statModifiers, damageModifiers };
};

// ============================================================
// useCalculatorStore
// ============================================================

export const useCalculatorStore = () => {

  // ── UI용 데이터 ─────────────────────────────────────────
  const [displayData, setDisplayDataState] =
    useState<CharacterDisplayData | null>(null);

  // ── 계산용 데이터 ────────────────────────────────────────
  const [calcData, setCalcData] = useState<CalcData>(createEmptyCalcData());

  // ── displayData 변경 시 calcData 자동 동기화 ─────────────
  useEffect(() => {
    if (!displayData) {
      // displayData 가 없으면 calcData 초기화
      setCalcData(createEmptyCalcData());
      return;
    }
    // displayData 에서 계산용 수치 추출하여 자동 동기화
    setCalcData(extractCalcData(displayData));
  }, [displayData]);

  /**
   * API 응답을 normalizeCharacter() 로 변환한 결과를 저장합니다.
   * CharacterSearch 컴포넌트에서 호출합니다.
   */
  const setDisplayData = (data: CharacterDisplayData) => {
    setDisplayDataState(data);
  };

  /**
   * Phase 4 시뮬레이터에서 수동으로 calcData 를 수정할 때 사용합니다.
   * displayData 와의 자동 동기화를 덮어씁니다.
   */
  const overrideCalcData = (partial: Partial<CalcData>) => {
    setCalcData(prev => ({ ...prev, ...partial }));
  };

  return {
    // UI용
    displayData,
    setDisplayData,

    // 계산용
    calcData,
    overrideCalcData,
  };
};