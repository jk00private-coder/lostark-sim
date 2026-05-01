/**
 * @/engine/pipeline/0-resolve-skill.ts
 *
 * [0단계] 스킬 특성 확정
 *
 * [역할]
 *   1. 선택된 트라이포드의 overrides 적용
 *      → typeId, attackId, hits 변경
 *   2. 스킬 레벨에 맞는 상수/계수 확정
 *   3. GK_QI_COST 합산 (기운 소모 개수 확정)
 *   4. ResolvedSkillMeta 반환
 *
 * [설계 원칙]
 *   - 이 단계는 순수 함수. 부수 효과 없음.
 *   - 효과(effects) 수집은 하지 않음 → 1단계에서 담당
 */

import { SkillData, TripodData, DamageSource, SkillOverride } from '@/types/skill-types';
import { AttackTypeId, SkillTypeId, ResourceTypeId } from '@/types/sim-types';
import { PipelineEffectLog, ResolvedSkillMeta, ResolvedSource } from './types';
import { isTargetMatch } from './2-dynamic-buffer';


// ============================================================
// 헬퍼: 스킬 레벨 → 상수/계수
// ============================================================

/**
 * 스킬 레벨에 맞는 상수/계수 반환
 * 레벨이 배열 범위 초과 시 마지막 값 사용
 */
const getLevelValues = (
  source: DamageSource,
  level : number,
): { constant: number; coefficient: number } => {
  const idx = Math.min(level - 1, source.constants.length - 1);
  return {
    constant   : source.constants[idx]    ?? 0,
    coefficient: source.coefficients[idx] ?? 0,
  };
};


// ============================================================
// 헬퍼: 트라이포드 overrides 적용
// ============================================================

/**
 * 선택된 트라이포드의 overrides를 스킬 기본값에 덮어씀
 *
 * link 조건: 연결된 슬롯의 트라이포드가 선택되어야 활성화
 *
 * @returns 확정된 typeId, attackId, hits 오버라이드 맵
 */
const applyAllOverrides = (
  skill: SkillData,
  selectedTripods: TripodData[],
  externalLogs: PipelineEffectLog[],
): {
  typeId: SkillTypeId;
  attackId: AttackTypeId;
  hitsMap: Record<string, number>;
} => {
  let typeId: SkillTypeId = skill.typeId;
  let attackId: AttackTypeId = skill.attackId;
  const hitsMap: Record<string, number> = {};

  // [1차 적용] 외부 로그 (아크패시브: 드레드 로어 등)
  externalLogs.forEach(log => {
    if (log.type !== 'OVERRIDE' || !log.overrides) return;
  
    // 로그 레벨의 target만 확인하면 됨
    const isMatch = isTargetMatch(
      log.target || {}, // target이 없으면 빈 객체 전달
      skill.id,
      skill.category,
      skill.typeId,
      skill.attackId,
      skill.resource?.typeId
    );
    if (!isMatch) return;

    const ov = log.overrides;
    if (ov.typeId) typeId = ov.typeId;
    if (ov.attackId) attackId = ov.attackId;
    if (ov.hits !== undefined) {
      skill.levels.forEach(src => { hitsMap[src.name] = ov.hits!; });
    }
  });

  selectedTripods.forEach(tripod => {
    // link 조건 확인
    if (tripod.link) {
      const linked = selectedTripods.find(
        t => t.slot === tripod.link!.slot
      );
      if (!linked) return;
    }

    if (!tripod.overrides) return;

    if (tripod.overrides.typeId)   typeId   = tripod.overrides.typeId;
    if (tripod.overrides.attackId) attackId = tripod.overrides.attackId;
    if (tripod.overrides.hits !== undefined) {
      skill.levels.forEach(src => {
        hitsMap[src.name] = tripod.overrides!.hits!;
      });
    }
  });

  return { typeId, attackId, hitsMap };
};


// ============================================================
// 헬퍼: GK_QI_COST 합산
// ============================================================

/**
 * 기운 소모 개수 확정
 * = resource.value(기본값) + 트라이포드 GK_QI_COST 합산
 *
 * GK_QI_COST는 양수(추가 소모), 음수(감소) 모두 가능
 */
const resolveQiCost = (
  skill          : SkillData,
  selectedTripods: TripodData[],
  externalLogs: PipelineEffectLog[],
): number | undefined => {
  if (skill.resource?.typeId !== 'QI_EMBERES') return undefined;

  const baseCost = skill.resource.isStatic
    ? skill.resource.value
    : (skill.resource.values?.[0] ?? 0);

  const tripodCost = selectedTripods.reduce((sum, tripod) => {
    if (!tripod.effects) return sum;
    return sum + tripod.effects
      .filter(eff => eff.type === 'GK_QI_COST')
      .reduce((s, eff) => s + (eff.value?.[0] ?? 0), 0);
  }, 0);

  const externalCost = externalLogs
    .filter(log => {
      if (log.type !== 'GK_QI_COST') return false;

      return isTargetMatch(
        log.target || {}, 
        skill.id,
        skill.category,
        skill.typeId,
        skill.attackId,
        skill.resource?.typeId
      );
    })
    .reduce((sum, log) => sum + (log.value ?? 0), 0);

  return baseCost + tripodCost + externalCost;
};


// ============================================================
// 헬퍼: 추가 피해원 수집 (트라이포드 addDamageSources)
// ============================================================

const collectAddedSources = (
  selectedTripods: TripodData[],
  attackId       : AttackTypeId,
  level          : number,
): ResolvedSource[] => {
  const sources: ResolvedSource[] = [];

  selectedTripods.forEach(tripod => {
    if (!tripod.addDamageSources) return;

    // link 조건 확인
    if (tripod.link) {
      const linked = selectedTripods.find(t => t.slot === tripod.link!.slot);
      if (!linked) return;
    }

    tripod.addDamageSources.forEach(src => {
      const { constant, coefficient } = getLevelValues(src, level);
      sources.push({
        name      : src.name,
        isCombined: src.isCombined,
        hits      : src.hits,
        constant,
        coefficient,
        attackId,
      });
    });
  });

  return sources;
};


// ============================================================
// 메인: resolveSkillMeta
// ============================================================

/**
 * 스킬 DB + 선택 트라이포드 + 스킬 레벨 → ResolvedSkillMeta
 *
 * @param skill          - 스킬 DB 데이터
 * @param level          - 현재 스킬 레벨
 * @param selectedTripods - 선택된 트라이포드 목록
 */
export const resolveSkillMeta = (
  skill          : SkillData,
  level          : number,
  selectedTripods: TripodData[],
  externalLogs: PipelineEffectLog[],
): ResolvedSkillMeta => {
  // overrides 적용
  const { typeId, attackId, hitsMap } = applyAllOverrides(skill, selectedTripods, externalLogs);

  // 기본 피해원 목록 구성
  const baseSources: ResolvedSource[] = skill.levels.map(src => {
    const { constant, coefficient } = getLevelValues(src, level);
    return {
      name      : src.name,
      isCombined: src.isCombined,
      hits      : hitsMap[src.name] ?? src.hits,
      constant,
      coefficient,
      attackId,
    };
  });

  // 추가 피해원 (트라이포드 addDamageSources)
  const addedSources = collectAddedSources(selectedTripods, attackId, level);

  // 기운 소모 개수 확정
  const cost = resolveQiCost(skill, selectedTripods, externalLogs);

  return {
    skillId     : skill.id,
    skillName   : skill.name,
    categories  : skill.category,
    typeId,
    attackId,
    resourceType: skill.resource?.typeId as ResourceTypeId | undefined,
    cost,
    sources     : [...baseSources, ...addedSources],
  };
};
