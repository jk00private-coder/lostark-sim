/**
 * @/data/combat-rules.ts
 *
 * 전투 규칙 데이터를 정의합니다.
 * 공격 타입별 고정 보너스, 스킬 카테고리별 계산 규칙 등을 관리합니다.
 *
 * 새로운 전투 규칙이 생기면 이 파일에만 추가합니다.
 */

import {
  AttackTypeId, SkillCategory, EffectEntry,
} from '@/types/sim-types';


// ============================================================
// 공격 타입별 기본 보너스
// ============================================================

/**
 * 공격 타입별 자동 적용 고정 보너스
 *
 * 해당 공격 타입의 스킬은 계산 시 이 보너스가 자동으로 추가됩니다.
 * 각성기(ULTIMATE)는 공격 타입이 없으므로 이 보너스가 적용되지 않습니다.
 *
 * 헤드어택: 피해 증가 +20%
 * 백어택  : 피해 증가 +5%, 치명타 확률 +10%
 */
export const ATTACK_TYPE_BONUS: Partial<Record<AttackTypeId, EffectEntry[]>> = {
  HEAD_ATK: [
    { type: 'DMG_INC', value: 0.20, operation: 'MULTIPLY' },
  ],
  BACK_ATK: [
    { type: 'DMG_INC',    value: 0.05, operation: 'MULTIPLY' },
    { type: 'CRIT_CHANCE', value: 0.10, operation: 'ADD'      },
  ],
};


// ============================================================
// 스킬 카테고리별 규칙
// ============================================================

/**
 * 스킬 카테고리별 계산 규칙
 *
 * ignoreAttackType  : 공격 타입 보너스 미적용 (각성기)
 * useHyperFormula   : 초각성기 전용 계산식 사용
 * ignoreCategoryDmg : 카테고리 관련 피해 증가 미적용
 */
export interface SkillCategoryRule {
  ignoreAttackType? : boolean;  // 공격 타입 보너스 무시
  useHyperFormula?  : boolean;  // 초각성기 전용 계산식
  ignoreCategoryDmg?: boolean;  // 공통 피해 증가 미적용
}

export const SKILL_CATEGORY_RULES: Partial<Record<SkillCategory, SkillCategoryRule>> = {
  // 각성기: 공격 타입 보너스 미적용
  ULTIMATE: {
    ignoreAttackType: true,
  },

  // 초각성기: 별도 계산식 사용, 공통 피해 증가 미적용
  // 계산식: (기본공격력 × 계수 + 상수) × 초각성기 관련 피해 증가만 적용
  HYPER_ULTIMATE: {
    ignoreAttackType : true,
    useHyperFormula  : true,
    ignoreCategoryDmg: true,
  },
};


// ============================================================
// 특수 계산 노드 설정
// ============================================================

/**
 * 뭉툭한 가시 설정
 *
 * critCap        : 치명타 확률 상한 (80%)
 * conversionRate : 초과 치명타 확률의 진화형 피해 전환율 (n%)
 * maxEvoDamage   : 이 노드로 발생하는 진화형 피해 최대값 (n%)
 * baseEvoDamage  : 이 노드 기본 진화형 피해 (n%)
 *
 * ⚠️ 실제 수치는 캐릭터의 아크패시브 레벨에 따라 달라집니다.
 *    여기서는 계산 구조만 정의하며 실제 수치는 아크패시브 DB에서 가져옵니다.
 */
export interface BluntThornConfig {
  critCap       : number;  // 0.80
  conversionRate: number;  // n% (아크패시브 레벨별)
  maxEvoDamage  : number;  // n% (아크패시브 레벨별)
  baseEvoDamage : number;  // n% (아크패시브 레벨별)
}

/**
 * 음속 돌파 설정
 *
 * speedCap         : 공/이속 상한 (140% = 0.40 증가분)
 * evoDmgPerSpeedPct: 속도 증가량 1%당 진화형 피해 증가율
 * bonusEvoDamage   : 공이속 모두 상한 초과 시 추가 진화형 피해
 * maxEvoDamage     : 이 노드로 발생하는 진화형 피해 최대값
 */
export interface SonicBreakConfig {
  speedCap          : number;  // 0.40 (기본 100% + 40% = 140%)
  evoDmgPerSpeedPct : number;  // n% (아크패시브 레벨별)
  bonusEvoDamage    : number;  // n% (공이속 모두 상한 초과 시)
  maxEvoDamage      : number;  // n%
}

/**
 * 마나 용광로 설정
 *
 * evoDmgPer10Mana: 마나 소모량 10당 진화형 피해 증가율
 * maxEvoDamage   : 이 노드로 발생하는 진화형 피해 최대값
 */
export interface ManaFurnaceConfig {
  evoDmgPer10Mana: number;  // n%
  maxEvoDamage   : number;  // n%
}