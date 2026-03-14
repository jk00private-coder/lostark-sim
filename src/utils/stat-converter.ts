// @/utils/stat-converter.ts

import { EffectTypeId, StatModifiers, DamageModifiers, EFFECT_MAP } from '@/types/sim-types';

/**
 * 1. 숫자 변환 유틸리티 (C언어의 atof와 유사)
 * "140,586" -> 140586 / "18%" -> 0.18
 */
export const parseGameValue = (val: string | number): number => {
  if (typeof val === 'number') return val;
  const pureNum = val.replace(/,/g, '').replace(/%/g, '');
  const parsed = parseFloat(pureNum);
  return isNaN(parsed) ? 0 : val.includes('%') ? parsed / 100 : parsed;
};

/**
 * 2. 효과 적용기 (핵심 로직)
 * 특정 효과(예: 원한)를 우리 스탯 객체에 누적시킵니다.
 */
export const applyEffect = (
  type: EffectTypeId,
  value: number,
  statGroup: StatModifiers & DamageModifiers
) => {
  const targetKey = EFFECT_MAP[type];
  
  if (targetKey && targetKey in statGroup) {
    // TypeScript에게 targetKey가 statGroup의 유효한 키임을 알려줌
    (statGroup as any)[targetKey] += value;
  }
};

/**
 * 3. 초기화 함수
 * 모든 수치가 0인 깨끗한 도화지를 만듭니다.
 */
export const createEmptyStats = (): StatModifiers & DamageModifiers => ({
  mainStatStatic: 0, mainStatPercent: 0,
  weaponAtkStatic: 0, weaponAtkPercent: 0,
  baseAtkPercent: 0, atkStatic: 0, atkPercent: 0,
  damageInc: 0, evolutionDamage: 0, specialDamage: 0,
  additionalDamage: 0, critChance: 0, critDamage: 0,
  critDamageInc: 0, defensePenetration: 0, targetDamageTaken: 0,
  atkSpeed: 0, movSpeed: 0, cooldownReduction: 0
});