// @/utils/skill-calculator

import { SkillData, TripodData } from "../types/skill";

/**
 * [데미지 계산기]
 * 선택된 트라이포드들의 영향을 모두 합산하여 최종 데미지를 산출합니다.
 */
export const calculateSkillDamage = (
  skill: SkillData,
  level: number,
  attackPower: number,
  selectedTripods: TripodData[],
  finalMultiplier: number
) => {
  const lvIdx = level - 1;
  let allSources = [...skill.levels.damageSources];

  const currentIndices = {
    s1: selectedTripods.find(t => t.slot === 1)?.index,
    s2: selectedTripods.find(t => t.slot === 2)?.index,
    s3: selectedTripods.find(t => t.slot === 3)?.index,
  };

  selectedTripods.forEach((tp) => {
    // 1. 상시 추가 소스 합산
    if (tp.addDamageSources) {
      allSources.push(...tp.addDamageSources.damageSources);
    }

    // 2. 조건부(cases) 소스 처리 - 배열이 아니므로 바로 접근
    if (tp.cases) {
      const condition = tp.cases.if;
      
      // 조건 검사: if에 적힌 모든 키가 현재 선택된 인덱스와 일치하는지 확인
      const isMatch = (Object.keys(condition) as Array<keyof typeof currentIndices>).every(
        (key) => condition[key] === currentIndices[key]
      );

      if (isMatch && tp.cases.then.addDamageSources) {
        allSources.push(...tp.cases.then.addDamageSources.damageSources);
      }
    }
  });

  const rawDamage = allSources.reduce((total, source) => {
    const constant = source.constants[lvIdx] ?? source.constants[0] ?? 0;
    const coefficient = source.coefficients[lvIdx] ?? source.coefficients[0] ?? 0;
    
    // 개별 소스 데미지 계산 (상수 + 계수 * 공력) * 타수
    const sourceDamage = (constant + (coefficient * attackPower)) * source.hits;
    return total + sourceDamage;
  }, 0);

  return rawDamage * finalMultiplier;
};

/**
 * [자원 소모량 계산기]
 * 기존 로직 유지하되 안전장치 강화
 */
export const getResourceCost = (skill: SkillData, currentLevel: number): number => {
  const { resource } = skill;
  if (!resource) return 0;

  const lvIdx = currentLevel - 1;

  if (resource.isStatic) {
    return resource.values[0] || 0;
  }

  const cost = resource.values[lvIdx];
  return cost !== undefined ? cost : (resource.values[resource.values.length - 1] || 0);
};