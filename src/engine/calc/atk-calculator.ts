/**
 * @/engine/calc/atk-calculator.ts
 *
 * 공격력 4종 계산 함수
 *
 * [계산 순서]
 *   1. 무기공격력  = weaponAtkC * (1 + weaponAtkP)
 *   2. 주스탯      = mainStatC  * (1 + mainStatP)
 *   3. 기본공격력  = sqrt(주스탯 * 무기공격력 / 6) * (1 + baseAtkP)
 *   4. 최종공격력  = (기본공격력 + atkC) * (1 + atkP 곱연산)
 */

import { StatModifiers } from '@/types/sim-types';
import { BufferMap } from '@/engine/pipeline/types';


// ── 무기 공격력 ─────────────────────────────────────────────

/** 최종 무기 공격력 = weaponAtkC × (1 + weaponAtkP) */
export const calcWeaponAtk = (
  weaponAtkC: number,
  weaponAtkP: number,
): number => weaponAtkC * (1 + weaponAtkP);


// ── 주스탯 ──────────────────────────────────────────────────

/** 최종 주스탯 = mainStatC × (1 + mainStatP) */
export const calcMainStat = (
  mainStatC: number,
  mainStatP: number,
): number => mainStatC * (1 + mainStatP);


// ── 기본 공격력 ─────────────────────────────────────────────

/** 기본 공격력 = sqrt(주스탯 × 무기공격력 / 6) × (1 + baseAtkP) */
export const calcBaseAtk = (
  mainStat : number,
  weaponAtk: number,
  baseAtkP : number,
): number => {
  if (mainStat === 0 || weaponAtk === 0) return 0;
  return Math.sqrt(mainStat * weaponAtk / 6) * (1 + baseAtkP);
};


// ── 최종 공격력 ─────────────────────────────────────────────

/**
 * 최종 공격력 = (기본공격력 + atkC) × ATK_P 곱연산
 *
 * ATK_P는 BufferMap에서 subGroup별 독립 곱연산
 */
export const calcFinalAtk = (
  baseAtk  : number,
  atkC     : number,
  atkBuffer: BufferMap,
): number => {
  const atkPGroups = atkBuffer['ATK_P'] ?? {};

  let multiplier = 1;
  Object.values(atkPGroups).forEach(values => {
    multiplier *= (1 + values.reduce((s, v) => s + v, 0));
  });

  return (baseAtk + atkC) * multiplier;
};


// ── 일괄 계산 ───────────────────────────────────────────────

/**
 * StatModifiers + ATK_P BufferMap → 공격력 4종 일괄 계산
 */
export const calcAllAtk = (
  mods     : StatModifiers,
  atkBuffer: BufferMap,
): {
  weaponAtk: number;
  mainStat : number;
  baseAtk  : number;
  finalAtk : number;
} => {
  const weaponAtk = calcWeaponAtk(mods.weaponAtkC, mods.weaponAtkP);
  const mainStat  = calcMainStat(mods.mainStatC, mods.mainStatP);
  const baseAtk   = calcBaseAtk(mainStat, weaponAtk, mods.baseAtkP);
  const finalAtk  = calcFinalAtk(baseAtk, mods.atkC, atkBuffer);

  return { weaponAtk, mainStat, baseAtk, finalAtk };
};
