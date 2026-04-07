/**
 * @/engine/damage-calculator.ts
 *
 * 스킬 피해량 계산
 *
 * [피해 공식]
 *   일반 스킬:
 *     피해량 = (상수 + 계수 × finalAtk)
 *            × damageInc
 *            × (1 + evoDamage)
 *            × (1 + addDamage)
 *            × critResult
 *            × (1 + defPenetration 보정)
 *            × (1 + enemyDamageTaken)
 *
 *   초각성기(HYPER_ULTIMATE):
 *     피해량 = (상수 + 계수 × baseAtk)
 *            × hyperUltimateInc
 *            × critResult
 *
 * [치명타 결과값]
 *   critResult = critChance × (critDamage × critDamageInc)
 *              + (1 - critChance) × 1.0
 *
 * [공격 타입 보너스 - 7.1 인게임 규칙]
 *   헤드어택: 피해 증가 +20%
 *   백어택  : 피해 증가 +5%, 치명타 확률 +10%
 */

import { DamageModifiers, AttackTypeId } from '@/types/sim-types';


// ============================================================
// 타입 정의
// ============================================================

/** 단일 피해원 계산 입력 */
export interface DamageSourceInput {
  hits       : number;    // 타수
  constant   : number;    // 해당 레벨 상수
  coefficient: number;    // 해당 레벨 계수
  attackId   : AttackTypeId;  // 공격 타입 (헤드/백/비방향)
}

/** 단일 피해원 계산 결과 */
export interface DamageSourceResult {
  name      : string;   // 피해원 이름 (예: "1타", "화상")
  damage    : number;   // 기댓값 피해량 (치명타 확률 반영)
  isCombined: boolean;  // 합산 여부
}

/** 스킬 전체 계산 결과 */
export interface SkillDamageResult {
  skillName    : string;
  totalDamage  : number;              // isCombined=true 합산
  sources      : DamageSourceResult[]; // 피해원별 상세
}


// ============================================================
// 공격 타입 보너스
// ============================================================

/**
 * 공격 타입에 따른 추가 보너스 반환
 *
 * 각성기(ULTIMATE)는 공격 타입 미적용 (인게임 규칙 7.1)
 * 초각성기(HYPER_ULTIMATE)는 별도 공식 사용
 */
const getAttackTypeBonus = (
  attackId  : AttackTypeId,
  isUltimate: boolean,
): { dmgInc: number; critChance: number } => {
  // 각성기/초각성기는 공격 타입 보너스 미적용
  if (isUltimate) return { dmgInc: 0, critChance: 0 };

  switch (attackId) {
    case 'HEAD_ATK': return { dmgInc: 0.20, critChance: 0 };
    case 'BACK_ATK': return { dmgInc: 0.05, critChance: 0.10 };
    default        : return { dmgInc: 0,    critChance: 0 };
  }
};


// ============================================================
// 치명타 기댓값
// ============================================================

/**
 * 치명타 기댓값 계산
 * = critChance × (critDamage × critDamageInc)
 * + (1 - critChance) × 1.0
 *
 * critChance는 1.0 상한 적용
 *
 * @param baseCritChance  - 기본 치명타 확률 (소수)
 * @param bonusCritChance - 공격 타입 추가 치명타 확률 (소수)
 * @param critDamage      - 치명타 피해 (기본 2.0)
 * @param critDamageInc   - 치명타 시 피해 증가 (기본 1.0)
 */
const calcCritResult = (
  baseCritChance : number,
  bonusCritChance: number,
  critDamage     : number,
  critDamageInc  : number,
): number => {
  const totalCrit = Math.min(baseCritChance + bonusCritChance, 1.0);
  return totalCrit * (critDamage * critDamageInc)
       + (1 - totalCrit) * 1.0;
};


// ============================================================
// 단일 피해원 계산
// ============================================================

/**
 * 피해원 1개의 피해량 계산 (일반 스킬)
 *
 * @param source     - 피해원 입력값
 * @param finalAtk   - 최종 공격력
 * @param dmgMods    - 데미지 보정치
 * @param isUltimate - 각성기 여부 (공격 타입 보너스 미적용)
 */
export const calcSourceDamage = (
  source    : DamageSourceInput,
  finalAtk  : number,
  dmgMods   : DamageModifiers,
  isUltimate: boolean = false,
): number => {
  // 기본 피해량 = (상수 + 계수 × 최종공격력) × 타수
  const baseDmg = (source.constant + source.coefficient * finalAtk)
                * source.hits;

  // // [디버그 로그 추가]
  // console.log(` - 소스:`, source);
  // console.log(` - 공격력: ${finalAtk}, 상수: ${source.constant}, 계수: ${source.coefficient}, 타수: ${source.hits}`);
  // console.log(` - 기초 데미지 (Base): ${baseDmg}`);
  // console.log(` - 보정치 객체 (Modifiers):`, dmgMods);

  // 공격 타입 보너스
  const atkBonus = getAttackTypeBonus(source.attackId, isUltimate);

  // 피해 증가 (damageInc는 이미 곱연산 누적값)
  // 공격 타입 추가 피해 증가를 독립 곱연산으로 적용
  const totalDmgInc = dmgMods.damageInc * (1 + atkBonus.dmgInc);

  // 치명타 기댓값
  const critResult = calcCritResult(
    dmgMods.critChance,
    atkBonus.critChance,
    dmgMods.critDamage,
    dmgMods.critDamageInc,
  );

  // 방어력 관통 보정 (추후 적 방어력 공식 연결 예정)
  // TODO: Phase 4 적 방어력 시뮬레이션 연결
  const defBonus = 1 + dmgMods.defPenetration;

  // 적이 받는 피해 증가
  const enemyBonus = 1 + dmgMods.enemyDamageTaken;

  return baseDmg
    * totalDmgInc
    * (1 + dmgMods.evoDamage)
    * (1 + dmgMods.addDamage)
    * critResult
    * defBonus
    * enemyBonus;
};


// ============================================================
// 초각성기 피해량 계산
// ============================================================

/**
 * 초각성기 전용 피해량 계산
 * = (상수 + 계수 × baseAtk) × hyperUltimateInc × critResult
 *
 * 초각성기 관련 피해 증가(HYPER_ULTIMATE 카테고리 DMG_INC)는
 * skill-resolver에서 별도로 계산하여 전달
 *
 * @param source          - 피해원 입력값
 * @param baseAtk         - 기본 공격력 (finalAtk 아님)
 * @param dmgMods         - 데미지 보정치
 * @param hyperUltimateInc - 초각성기 전용 피해 증가 배율
 */
export const calcHyperUltimateDamage = (
  source          : DamageSourceInput,
  baseAtk         : number,
  dmgMods         : DamageModifiers,
  hyperUltimateInc: number,
): number => {
  // 초각성기 기본 피해 = (상수 + 계수 × 기본공격력) × 타수
  const baseDmg = (source.constant + source.coefficient * baseAtk)
                * source.hits;

  // 치명타 기댓값 (공격 타입 보너스 없음)
  const critResult = calcCritResult(
    dmgMods.critChance,
    0,
    dmgMods.critDamage,
    dmgMods.critDamageInc,
  );

  return baseDmg * hyperUltimateInc * critResult;
};