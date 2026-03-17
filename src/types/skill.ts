/**
 * @/types/skill.ts
 * 스킬/트라이포드 데이터 타입을 정의합니다.
 */

import {
  BaseSimData, EffectEntry, MemoParam,
  SkillTypeId, AttackTypeId, SuperArmorId,
  ResourceTypeId, SkillCategory,
} from '@/types/sim-types';


// ============================================================
// 스킬 레벨 데이터
// ============================================================

/**
 * 개별 타격 소스
 *
 * [excludeTripods]
 *   이 피해원에 적용되지 않는 트라이포드 ID 목록입니다.
 *   블래스터 개틀링건 케이스처럼 피해원마다
 *   적용 트라이포드가 다른 경우 사용합니다.
 *
 *   예: c3 피해원은 b1 트라이포드 효과 제외
 *   excludeTripods: ['BLASTER_GATLING_B1']
 */
export interface DamageSource {
  name           : string;    // "1타" | "화상" | "폭발" 등
  isCombined     : boolean;   // true = 메인 딜 합산, false = 별도 표시
  hits           : number;    // 타수
  constants      : number[];  // 레벨별 상수
  coefficients   : number[];  // 레벨별 계수
  excludeTripods?: string[];  // 이 피해원에 적용 안 되는 트라이포드 ID 목록
}

/**
 * 스킬 레벨별 데미지 소스
 *
 * isStatic: true  → 레벨 고정, index 0만 사용
 * isStatic: false → 레벨별, 레벨10=index0 ~ 레벨14=index4
 */
export type SkillLevelData =
  | { isStatic: true;  damageSources: DamageSource[] }
  | { isStatic: false; damageSources: DamageSource[] };

/**
 * 스킬 소모 자원
 *
 * isStatic: true  → 레벨 무관 고정값 (value 단일 숫자)
 * isStatic: false → 레벨별 소모량 (values 배열)
 */
export type SkillResource =
  | { typeId: ResourceTypeId; isStatic: true;  value : number   }
  | { typeId: ResourceTypeId; isStatic: false; values: number[] };


// ============================================================
// 트라이포드 데이터
// ============================================================

/** 트라이포드로 변경 가능한 스킬 속성 */
export interface TripodOverride {
  typeId?      : SkillTypeId;
  attackId?    : AttackTypeId;
  destruction? : number;
  stagger?     : string;
  superArmorId?: SuperArmorId;
  hits?        : number;
}

/**
 * 조건부 트라이포드 효과
 *
 * 특정 슬롯 조합에서만 발동하는 효과를 정의합니다.
 * if 조건: s1/s2/s3 에 해당 티어의 선택 index 를 명시
 * 명시하지 않은 티어는 조건 무관
 */
export interface TripodCase {
  if: {
    s1?: number;
    s2?: number;
    s3?: number;
  };
  then: {
    effects?         : EffectEntry[];
    addDamageSources?: SkillLevelData;
    overrides?       : TripodOverride;
    memo?            : MemoParam[];
  };
}

/**
 * 트라이포드 데이터
 *
 * [effects vs memo]
 *   effects → 계산 엔진이 처리 (DMG_INC, ADD_DMG, GK_QI_DMG 등)
 *   memo    → 계산 무관 메모 (시전 속도, 범위 등)
 */
export interface TripodData extends BaseSimData {
  slot : 1 | 2 | 3;
  index: 1 | 2 | 3;

  effects?         : EffectEntry[];
  addDamageSources?: SkillLevelData;
  overrides?       : TripodOverride;
  cases?           : TripodCase[];
  link?            : { slot: number; index: number };
  memo?            : MemoParam[];
}


// ============================================================
// 스킬 데이터
// ============================================================

export interface SkillData extends BaseSimData {
  category    : SkillCategory[];
  typeId      : SkillTypeId;
  attackId    : AttackTypeId;
  resource?   : SkillResource;
  destruction : number;
  stagger     : string;
  superArmorId: SuperArmorId;
  cooldown    : number;
  levels      : SkillLevelData;
  tripods?    : TripodData[];
}