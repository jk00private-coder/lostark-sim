/**
 * @/utils/skill-calculator.ts
 *
 * 스킬 데미지 계산 유틸리티
 *
 * [수정 이력]
 * v1.1
 *   - cases 배열 처리로 변경 (복수 조건 지원)
 *   - getResourceCost 유지
 */

import { SkillData, TripodData } from '@/types/skill';

/**
 * 선택된 트라이포드를 반영한 rawDamage 를 계산합니다.
 *
 * finalMultiplier 에는 계산 엔진에서 산출한 전체 배율을 전달합니다.
 * (피해증가, 추가피해, 치명타 기댓값, 방어력 계수 등 모두 포함)
 *
 * @param skill           - 스킬 DB 데이터
 * @param level           - 현재 스킬 레벨 (1~14)
 * @param attackPower     - 최종 공격력
 * @param selectedTripods - 선택된 트라이포드 목록
 * @param finalMultiplier - 최종 배율 (계산 엔진 산출값)
 */
export const calculateSkillDamage = (
  skill          : SkillData,
  level          : number,
  attackPower    : number,
  selectedTripods: TripodData[],
  finalMultiplier: number,
): number => {

  const lvIdx      = level - 10; // 레벨 10 = index 0
  let   allSources = [...skill.levels.damageSources];

  // 현재 선택된 티어별 인덱스
  const currentIndices = {
    s1: selectedTripods.find(t => t.slot === 1)?.index,
    s2: selectedTripods.find(t => t.slot === 2)?.index,
    s3: selectedTripods.find(t => t.slot === 3)?.index,
  };

  selectedTripods.forEach(tp => {

    // 1. 상시 추가 소스 합산
    if (tp.addDamageSources) {
      allSources.push(...tp.addDamageSources.damageSources);
    }

    // 2. 조건부(cases) 소스 처리 — 배열로 복수 조건 지원
    if (tp.cases) {
      tp.cases.forEach(({ if: condition, then }) => {
        // 조건 검사: if에 명시된 슬롯이 현재 선택 인덱스와 모두 일치하는지
        const isMatch = (
          Object.keys(condition) as Array<keyof typeof currentIndices>
        ).every(key => condition[key] === currentIndices[key]);

        if (!isMatch) return;

        if (then.addDamageSources) {
          allSources.push(...then.addDamageSources.damageSources);
        }
      });
    }
  });

  // rawDamage 계산
  const rawDamage = allSources.reduce((total, source) => {
    const lvIndex    = source.coefficients.length === 1 ? 0 : lvIdx;
    const constant   = source.constants[lvIndex]    ?? source.constants[0]    ?? 0;
    const coefficient = source.coefficients[lvIndex] ?? source.coefficients[0] ?? 0;

    // (상수 + 계수 × 공격력) × 타수
    return total + (constant + coefficient * attackPower) * source.hits;
  }, 0);

  return rawDamage * finalMultiplier;
};


/**
 * 스킬의 자원 소모량을 반환합니다.
 *
 * @param skill        - 스킬 DB 데이터
 * @param currentLevel - 현재 스킬 레벨
 */
export const getResourceCost = (skill: SkillData, currentLevel: number): number => {
  const { resource } = skill;
  if (!resource) return 0;
  if (resource.isStatic) return resource.value;  // 유니온: isStatic=true → value
  const lvIdx = currentLevel - 10;
  return resource.values[lvIdx] ?? resource.values[resource.values.length - 1] ?? 0;
};


/**
 * 스킬 DB에서 선택된 트라이포드 데이터를 조회합니다.
 *
 * API에서 받은 선택 트라이포드 이름 목록으로
 * DB의 TripodData 를 찾아 반환합니다.
 *
 * @param skill             - 스킬 DB 데이터
 * @param selectedNames     - API에서 받은 선택 트라이포드 이름 목록
 */
export const getSelectedTripods = (
  skill        : SkillData,
  selectedNames: string[],
): TripodData[] => {
  if (!skill.tripods) return [];

  return skill.tripods.filter(tp =>
    selectedNames.includes(tp.name)
  );
};