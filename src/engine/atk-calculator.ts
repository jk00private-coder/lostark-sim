/**
 * @/engine/atk-calculator.ts
 *
 * 공격력 4종 계산 함수
 *
 * [계산 순서]
 *   1. 무기공격력  = weaponAtkC * (1 + weaponAtkP)
 *   2. 주스탯      = mainStatC  * (1 + mainStatP)
 *                 = API에서 불러온 기본공격력에서 역산을 기본값으로
 *   3. 기본공격력  = sqrt(주스탯 * 무기공격력 / 6) * (1 + baseAtkP)
 *   4. 최종공격력  = (기본공격력 + atkC) * (1 + atkP)
 */

import { StatModifiers } from '@/types/sim-types';


// ============================================================
// 무기 공격력
// ============================================================

/**
 * 최종 무기 공격력 계산
 * = 무기공격력 고정증가 합산 * (1 + 무기공격력 % 증가)
 *
 * @param weaponAtkC - 무기 공격력 고정 증가 합산
 * @param weaponAtkP - 무기 공격력 % 증가 합산 (소수, 예: 0.1 = 10%)
 */
export const calcWeaponAtk = (
  weaponAtkC: number,
  weaponAtkP: number,
): number => weaponAtkC * (1 + weaponAtkP);


// ============================================================
// 주스탯
// ============================================================

/**
 * 최종 주스탯 계산
 * = 주스탯 고정증가 합산 * (1 + 주스탯 % 증가)
 *
 * @param mainStatC - 주스탯 고정 증가 합산
 * @param mainStatP - 주스탯 % 증가 합산 (소수)
 */
export const calcMainStat = (
  mainStatC: number,
  mainStatP: number,
): number => mainStatC * (1 + mainStatP);


// ============================================================
// 기본 공격력
// ============================================================

/**
 * 기본 공격력 계산
 * = sqrt(주스탯 * 무기공격력 / 6) * (1 + baseAtkP)
 *
 * 시뮬레이터에서 장비/스탯 변경 시 이 함수로 재계산합니다.
 * API의 baseAtk는 초기값 확인용으로만 사용합니다.
 *
 * @param mainStat  - 최종 주스탯 (calcMainStat 결과)
 * @param weaponAtk - 최종 무기공격력 (calcWeaponAtk 결과)
 * @param baseAtkP  - 기본 공격력 % 증가 합산 (소수)
 */
export const calcBaseAtk = (
  mainStat : number,
  weaponAtk: number,
  baseAtkP : number,
): number => {
  if (mainStat === 0 || weaponAtk === 0) return 0;
  return Math.sqrt(mainStat * weaponAtk / 6) * (1 + baseAtkP);
};


// ============================================================
// 최종 공격력
// ============================================================

/**
 * 최종 공격력 계산 (인게임 표시 공격력)
 * = (기본공격력 + atkC) * (1 + atkP합산)
 *
 * ATK_P는 subGroup 없이 각각 독립 곱연산
 *
 * @param baseAtk  - 기본 공격력 (calcBaseAtk 결과)
 * @param atkC     - 공격력 고정 증가 합산
 * @param atkPLogs - ATK_P effectLog 목록 (subGroup 포함)
 */
export const calcFinalAtk = (
  baseAtk : number,
  atkC    : number,
  atkPLogs: { value: number; subGroup?: string }[],
): number => {
  // subGroup별 합산 후 독립 곱연산
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
// 공격력 4종 일괄 계산
// ============================================================

/**
 * StatModifiers로부터 공격력 4종을 한 번에 계산
 * useCalculatorStore / 시뮬레이터 양쪽에서 공통으로 사용
 *
 * @param mods     - StatModifiers
 * @param atkPLogs - ATK_P effectLog 목록
 * @returns { weaponAtk, mainStat, baseAtk, finalAtk }
 */
export const calcAllAtk = (
  mods    : StatModifiers,
  atkPLogs: { value: number; subGroup?: string }[],
): {
  weaponAtk: number;
  mainStat : number;
  baseAtk  : number;
  finalAtk : number;
} => {
  const weaponAtk = calcWeaponAtk(mods.weaponAtkC, mods.weaponAtkP);
  const mainStat  = calcMainStat(mods.mainStatC, mods.mainStatP);
  const baseAtk   = calcBaseAtk(mainStat, weaponAtk, mods.baseAtkP);
  const finalAtk  = calcFinalAtk(baseAtk, mods.atkC, atkPLogs);

  return { weaponAtk, mainStat, baseAtk, finalAtk };
};