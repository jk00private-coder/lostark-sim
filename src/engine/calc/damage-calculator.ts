/**
 * @/engine/calc/damage-calculator.ts
 *
 * 스킬 피해량 최종 계산
 *
 * [피해 공식 - 일반 스킬]
 *   피해량 = (상수 + 계수 × finalAtk) × hits
 *          × damageInc
 *          × (1 + evoDamage - 1)     ← evoDamage는 1.0 기반이므로 변환
 *          × (1 + addDamage - 1)
 *          × critResult
 *          × (1 + defPenetration)
 *          × (1 + enemyDamageTaken)
 *
 * [피해 공식 - 초각성기 HYPER_ULTIMATE]
 *   피해량 = (상수 + 계수 × baseAtk) × hyperUltimateInc × critResult
 *
 * [치명타 기댓값]
 *   critResult = critChance × critDamage × critDamageInc
 *              + (1 - critChance) × 1.0
 *
 * [공격 타입 보너스]
 *   헤드어택: 피해 증가 +20%
 *   백어택  : 피해 증가 +5%, 치명타 확률 +10%
 *   각성기  : 공격 타입 보너스 미적용
 */

import { DamageModifiers, AttackTypeId, SkillCategory } from '@/types/sim-types';
import { ResolvedSource } from '@/engine/pipeline/types';


// ============================================================
// 공격 타입 보너스
// ============================================================

const getAttackTypeBonus = (
  attackId  : AttackTypeId,
  isUltimate: boolean,
): { dmgInc: number; critChance: number } => {
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
 * critChance 상한: 1.0
 * critDamage 기본: 2.0 (DamageModifiers 초기값)
 */
const calcCritResult = (
  critChance    : number,
  bonusCritChance: number,
  critDamage    : number,
  critDamageInc : number,
): number => {
  const totalCrit = Math.min(critChance + bonusCritChance, 1.0);
  return totalCrit * (critDamage * critDamageInc)
       + (1 - totalCrit) * 1.0;
};


// ============================================================
// 카테고리 판별
// ============================================================

const isHyperUltimate = (categories: SkillCategory[]): boolean =>
  categories.includes('HYPER_ULTIMATE');

const isUltimate = (categories: SkillCategory[]): boolean =>
  categories.includes('ULTIMATE') || categories.includes('HYPER_ULTIMATE');


// ============================================================
// 단일 피해원 계산 결과
// ============================================================

export interface DamageSourceResult {
  name      : string;
  damage    : number;
  isCombined: boolean;
}

export interface SkillDamageResult {
  skillName  : string;
  totalDamage: number;
  sources    : DamageSourceResult[];
}


// ============================================================
// 단일 피해원 계산
// ============================================================

/**
 * 일반 스킬 피해원 1개 계산
 *
 * @param source     - 피해원 (hits, constant, coefficient, attackId)
 * @param finalAtk   - 최종 공격력
 * @param mods       - 확정된 DamageModifiers
 * @param isUlt      - 각성기 여부
 */
export const calcSourceDamage = (
  source  : ResolvedSource,
  finalAtk: number,
  mods    : DamageModifiers,
  isUlt   : boolean = false,
): number => {
  const baseDmg = (source.constant + source.coefficient * finalAtk) * source.hits;

  const atkBonus = getAttackTypeBonus(source.attackId, isUlt);

  // damageInc는 1.0 기반 곱연산값 → 공격 타입 추가분을 독립 곱연산
  const totalDmgInc = mods.damageInc * (1 + atkBonus.dmgInc);

  const critResult = calcCritResult(
    mods.critChance,
    atkBonus.critChance,
    mods.critDamage,
    mods.critDamageInc,
  );

  return baseDmg
    * totalDmgInc
    * mods.evoDamage           // 1.0 기반
    * mods.addDamage           // 1.0 기반
    * critResult
    * (1 + mods.defPenetration)
    * (1 + mods.enemyDamageTaken);
};


// ============================================================
// 초각성기 피해량 계산
// ============================================================

/**
 * 초각성기 전용
 * = (상수 + 계수 × baseAtk) × hyperUltimateInc × critResult
 */
export const calcHyperUltimateDamage = (
  source          : ResolvedSource,
  baseAtk         : number,
  mods            : DamageModifiers,
  hyperUltimateInc: number,
): number => {
  const baseDmg = (source.constant + source.coefficient * baseAtk) * source.hits;

  const critResult = calcCritResult(
    mods.critChance, 0,
    mods.critDamage, mods.critDamageInc,
  );

  return baseDmg * hyperUltimateInc * critResult;
};


// ============================================================
// 스킬 전체 피해량 계산
// ============================================================

/**
 * 스킬 메타 + 확정 Mods → SkillDamageResult
 *
 * @param skillName  - 스킬 이름
 * @param categories - 스킬 카테고리
 * @param sources    - 피해원 목록 (0단계 확정)
 * @param mods       - 확정된 DamageModifiers (3단계 이후)
 * @param finalAtk   - 최종 공격력
 * @param baseAtk    - 기본 공격력 (초각성기용)
 */
export const calcSkillDamage = (
  skillName : string,
  categories: SkillCategory[],
  sources   : ResolvedSource[],
  mods      : DamageModifiers,
  finalAtk  : number,
  baseAtk   : number,
): SkillDamageResult => {
  const hyperUlt = isHyperUltimate(categories);
  const ult      = isUltimate(categories);

  const damageResults: DamageSourceResult[] = sources.map(src => {
    const damage = hyperUlt
      ? calcHyperUltimateDamage(src, baseAtk, mods, 1.0)
      : calcSourceDamage(src, finalAtk, mods, ult);

    return { name: src.name, damage, isCombined: src.isCombined };
  });

  const totalDamage = damageResults
    .filter(s => s.isCombined)
    .reduce((sum, s) => sum + s.damage, 0);

  return { skillName, totalDamage, sources: damageResults };
};
