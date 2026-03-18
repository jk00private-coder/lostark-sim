/**
 * @/utils/atk-calculator.ts
 *
 * 공격력 관련 계산 함수 모음
 *
 * [계산 순서]
 *   1. calcWeaponAtk  — 무기 공격력
 *   2. calcMainStat   — 주스탯 역산
 *   3. calcFinalAtk   — 최종 공격력
 *
 * [설계 원칙]
 *   - 순수 함수 (입력 → 출력, 사이드 이펙트 없음)
 *   - 각 함수는 독립적으로 테스트 가능
 *   - ATK_P는 subGroup 기반 독립 곱연산이므로
 *     effectLog 에서 직접 그룹핑하여 처리
 */

import { EffectLog } from '@/hooks/useCalculatorStore';


// ============================================================
// 1. 무기 공격력
// ============================================================

/**
 * 무기 공격력을 계산합니다.
 *
 * 공식: weaponAtk = weaponAtkC × (1 + weaponAtkP)
 *
 * weaponAtkC: 장비에서 파싱한 무기 공격력 고정값 합산
 * weaponAtkP: 귀걸이 연마효과 등 무기 공격력 % 증가 합산
 *
 * @param weaponAtkC - 무기 공격력 고정 합산 (StatModifiers.weaponAtkC)
 * @param weaponAtkP - 무기 공격력 % 합산 (StatModifiers.weaponAtkP)
 */
export const calcWeaponAtk = (
  weaponAtkC: number,
  weaponAtkP: number,
): number => {
  return weaponAtkC * (1 + weaponAtkP);
};


// ============================================================
// 2. 주스탯 역산
// ============================================================

/**
 * 주스탯(힘/민첩/지능)을 역산합니다.
 *
 * 원래 공식: baseAtk = sqrt(mainStat × weaponAtk / 6) × (1 + baseAtkP_합)
 * 역산 공식: mainStat = ((baseAtk / (1 + baseAtkP_합))^2) × 6 / weaponAtk
 *
 * API에서 주스탯을 직접 제공하지 않기 때문에
 * API가 주는 baseAtk(공격력)와 계산된 weaponAtk으로 역산합니다.
 *
 * ⚠️ weaponAtk 이 0이면 계산 불가 → 0 반환
 *
 * @param baseAtk   - API 공격력 (CombatStats.baseAtk)
 * @param baseAtkP  - 기본 공격력 % 합산 (StatModifiers.baseAtkP)
 * @param weaponAtk - 계산된 무기 공격력 (calcWeaponAtk 결과)
 */
export const calcMainStat = (
  baseAtk  : number,
  baseAtkP : number,
  weaponAtk: number,
): number => {
  // weaponAtk 이 0이면 0 나누기 방지
  if (weaponAtk === 0) return 0;

  // baseAtk에서 baseAtkP 보정 제거 → 보정 전 공격력
  const baseAtkBeforeBonus = baseAtk / (1 + baseAtkP);

  // 역산
  return (baseAtkBeforeBonus ** 2) * 6 / weaponAtk;
};


// ============================================================
// 3. 최종 공격력
// ============================================================

/**
 * 최종 공격력을 계산합니다.
 *
 * 공식: finalAtk = (baseAtk + atkC) × (1 + atkP_a) × (1 + atkP_b) × ...
 *
 * ATK_P는 subGroup 기반 독립 곱연산입니다.
 *   - subGroup 없음 : 전체를 하나의 그룹으로 합산 후 (1 + 합산) 으로 1회 곱
 *   - subGroup 있음 : 같은 subGroup끼리 합산 후 그룹 단위로 각각 독립 곱연산
 *
 * effectLog에서 ATK_P 항목만 꺼내 그룹핑하므로
 * StatModifiers.atkP 필드는 사용하지 않습니다.
 * (atkP 필드는 단순 합산값 — 참고용으로만 유지)
 *
 * @param baseAtk  - API 공격력 (CombatStats.baseAtk)
 * @param atkC     - 공격력 고정 합산 (StatModifiers.atkC)
 * @param atkPLogs - effectLog 에서 type === 'ATK_P' 인 항목들
 */
export const calcFinalAtk = (
  baseAtk  : number,
  atkC     : number,
  atkPLogs : EffectLog[],
): number => {

  // ── 1. (baseAtk + atkC) — 고정값 합산 ───────────────────
  const base = baseAtk + atkC;

  // ── 2. ATK_P 로그를 subGroup 별로 그룹핑 ────────────────
  //   key: subGroup 문자열 (없으면 '__NO_GROUP__' 으로 통합)
  //   value: 해당 그룹의 value 배열
  const NO_GROUP = '__NO_GROUP__';

  const groupMap: Record<string, number[]> = {};

  atkPLogs.forEach(log => {
    // operation 무관하게 ATK_P 는 ADD 기준으로 그룹 내 합산
    // (MULTIPLY ATK_P 가 생기면 별도 처리 필요 — 현재는 ADD만 존재)
    const key = log.subGroup ?? NO_GROUP;
    if (!groupMap[key]) groupMap[key] = [];
    groupMap[key].push(log.value);
  });

  // ── 3. 그룹 단위 독립 곱연산 ─────────────────────────────
  //   각 그룹 내 value 합산 → (1 + 합산) 으로 독립 곱연산
  const atkPMultiplier = Object.values(groupMap).reduce(
    (acc, values) => {
      const groupSum = values.reduce((s, v) => s + v, 0);
      return acc * (1 + groupSum);
    },
    1.0,  // 곱연산 초기값
  );

  // ── 4. 최종 공격력 ───────────────────────────────────────
  return base * atkPMultiplier;
};