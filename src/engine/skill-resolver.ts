/**
 * @/engine/skill-resolver.ts
 *
 * 스킬 DB 조회 + 트라이포드 효과 적용
 *
 * [역할]
 *   1. 스킬 ID + 레벨 → 해당 레벨의 상수/계수 추출
 *   2. 선택된 트라이포드 → overrides / effects 적용
 *   3. 최종 DamageSourceInput 목록 반환
 *
 * [트라이포드 처리 규칙]
 *   overrides.typeId    → 스킬 타입 변경 (CHARGE 등)
 *   overrides.attackId  → 공격 타입 변경 (HEAD_ATK 등)
 *   overrides.hits      → 타수 변경
 *   effects DMG_INC     → skill-level DMG_INC로 effectLog에 추가
 *   addDamageSources    → 추가 피해원 (화상 등) 목록에 추가
 */

import { SkillData, TripodData, DamageSource } from '@/types/skill';
import {
  AttackTypeId,
  SkillTypeId,
  SkillCategory,
  EffectEntry,
} from '@/types/sim-types';
import { DamageSourceInput } from '@/engine/damage-calculator';
import { EffectLog } from '@/hooks/useCalculatorStore';


// ============================================================
// 타입 정의
// ============================================================

/** skill-resolver 반환 타입 */
export interface ResolvedSkill {
  skillId        : number;
  skillName      : string;
  categories     : SkillCategory[];
  typeId         : SkillTypeId;
  attackId       : AttackTypeId;
  sources        : ResolvedSource[];  // 피해원 목록
  skillEffectLogs: EffectLog[];       // 스킬/트포 전용 effectLog
}

/** 피해원 + 메타 정보 */
export interface ResolvedSource {
  name      : string;
  isCombined: boolean;
  input     : DamageSourceInput;
}


// ============================================================
// 스킬 레벨 → 상수/계수 추출
// ============================================================

/**
 * 스킬 레벨에 맞는 상수/계수 반환
 * levels 배열 인덱스 = 스킬 레벨 - 1
 * 레벨이 배열 범위를 초과하면 마지막 값 사용
 */
const getLevelValues = (
  source: DamageSource,
  level : number,
): { constant: number; coefficient: number } => {
  const idx      = Math.min(level - 1, source.constants.length - 1);
  return {
    constant   : source.constants[idx]    ?? 0,
    coefficient: source.coefficients[idx] ?? 0,
  };
};


// ============================================================
// 트라이포드 적용
// ============================================================

/**
 * 선택된 트라이포드의 overrides를 스킬 기본값에 덮어씁니다.
 * link가 있는 트라이포드는 연결된 슬롯이 선택되어야 활성화됩니다.
 */
const applyTripodOverrides = (
  skill           : SkillData,
  selectedTripods : TripodData[],
): { typeId: SkillTypeId; attackId: AttackTypeId; hits: Record<string, number> } => {
  let typeId  : SkillTypeId  = skill.typeId;
  let attackId: AttackTypeId = skill.attackId;

  // 피해원별 hits 오버라이드 맵 (피해원 name → 변경된 hits)
  const hitsMap: Record<string, number> = {};

  selectedTripods.forEach(tripod => {
    // link 조건 확인: 연결된 슬롯의 트포가 선택되어야 활성
    if (tripod.link) {
      const linked = selectedTripods.find(
        t => t.slot === tripod.link!.slot && t.index === tripod.link!.index
      );
      if (!linked) return;
    }

    if (!tripod.overrides) return;

    if (tripod.overrides.typeId)   typeId   = tripod.overrides.typeId;
    if (tripod.overrides.attackId) attackId = tripod.overrides.attackId;
    if (tripod.overrides.hits !== undefined) {
      // overrides.hits는 전체 피해원에 공통 적용
      skill.levels.forEach(src => { hitsMap[src.name] = tripod.overrides!.hits!; });
    }
  });

  return { typeId, attackId, hits: hitsMap };
};


// ============================================================
// 트라이포드 effectLog 수집
// ============================================================

/**
 * 선택된 트라이포드의 effects를 EffectLog로 변환
 *
 * target.skillIds가 있으면 해당 스킬에만 적용
 * excludeTripods가 있는 피해원은 해당 트포 효과를 스킵
 */
const collectTripodEffectLogs = (
  skill          : SkillData,
  selectedTripods: TripodData[],
  skillLabel     : string,
): EffectLog[] => {
  const logs: EffectLog[] = [];

  selectedTripods.forEach(tripod => {
    // link 조건 확인
    if (tripod.link) {
      const linked = selectedTripods.find(
        t => t.slot === tripod.link!.slot && t.index === tripod.link!.index
      );
      if (!linked) return;
    }

    if (!tripod.effects) return;

    tripod.effects.forEach(eff => {
      if (!eff.value) return;

      // target.skillIds 필터: 이 스킬 ID가 포함된 경우만 적용
      if (eff.target?.skillIds && !eff.target.skillIds.includes(skill.id)) return;

      logs.push({
        label   : `${skillLabel} ${tripod.name}`,
        type    : eff.type,
        value   : eff.value[0] ?? 0,
        subGroup: eff.subGroup,
      });
    });

    // cases 처리: 조건부 트라이포드 효과
    tripod.cases?.forEach(c => {
      // if 조건 확인 (명시된 슬롯만 체크)
      const conditionMet = Object.entries(c.if).every(([slotKey, idx]) => {
        const slot = parseInt(slotKey.replace('s', ''));
        return selectedTripods.some(t => t.slot === slot && t.index === idx);
      });
      if (!conditionMet) return;

      c.then.effects?.forEach(eff => {
        if (!eff.value) return;
        logs.push({
          label   : `${skillLabel} ${tripod.name} (조건)`,
          type    : eff.type,
          value   : eff.value[0] ?? 0,
          subGroup: eff.subGroup,
        });
      });
    });
  });

  return logs;
};


// ============================================================
// 추가 피해원 수집 (화상, 폭발 등)
// ============================================================

/**
 * 선택된 트라이포드의 addDamageSources를 ResolvedSource로 변환
 */
const collectAddedSources = (
  selectedTripods: TripodData[],
  attackId       : AttackTypeId,
  level          : number,
): ResolvedSource[] => {
  const sources: ResolvedSource[] = [];

  selectedTripods.forEach(tripod => {
    if (!tripod.addDamageSources) return;

    tripod.addDamageSources.forEach(src => {
      const { constant, coefficient } = getLevelValues(src, level);
      sources.push({
        name      : src.name,
        isCombined: src.isCombined,
        input     : {
          hits       : src.hits,
          constant,
          coefficient,
          attackId,  // 추가 피해원은 스킬 공격 타입 그대로 상속
        },
      });
    });
  });

  return sources;
};


// ============================================================
// 메인: 스킬 해석
// ============================================================

/**
 * 스킬 DB + 선택된 트라이포드 → ResolvedSkill 반환
 *
 * @param skill          - 스킬 DB 데이터
 * @param level          - 현재 스킬 레벨
 * @param selectedTripods - 선택된 트라이포드 목록
 */
export const resolveSkill = (
  skill          : SkillData,
  level          : number,
  selectedTripods: TripodData[],
): ResolvedSkill => {
  // 트라이포드 overrides 적용
  const { typeId, attackId, hits: hitsOverride } =
    applyTripodOverrides(skill, selectedTripods);

  // 기본 피해원 목록 구성
  const baseSources: ResolvedSource[] = skill.levels.map(src => {
    const { constant, coefficient } = getLevelValues(src, level);
    return {
      name      : src.name,
      isCombined: src.isCombined,
      input     : {
        hits       : hitsOverride[src.name] ?? src.hits,
        constant,
        coefficient,
        attackId,
      },
    };
  });

  // 추가 피해원 수집 (화상 등)
  const addedSources = collectAddedSources(selectedTripods, attackId, level);

  // 트라이포드 effectLog 수집
  const skillEffectLogs = collectTripodEffectLogs(
    skill,
    selectedTripods,
    skill.name ?? String(skill.id),
  );

  return {
    skillId        : skill.id,
    skillName      : skill.name ?? String(skill.id),
    categories     : skill.category,
    typeId,
    attackId,
    sources        : [...baseSources, ...addedSources],
    skillEffectLogs,
  };
};