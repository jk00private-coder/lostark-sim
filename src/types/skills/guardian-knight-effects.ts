/**
 * @/types/skills/guardian-knight-effects.ts
 *
 * 가디언나이트 전용 Effect 타입 및 ClassModifiers 를 정의합니다.
 *
 * [새 직업 추가 시 참고]
 *   1. 이 파일을 복사해서 {직업명}-effects.ts 생성
 *   2. GkEffectTypeId → {직업}EffectTypeId 로 이름 변경
 *   3. GkClassModifiers → {직업}ClassModifiers 로 이름 변경
 *   4. CLASS_EFFECT_MAP 항목 채우기
 *   5. sim-types.ts 의 ClassEffectTypeId 유니온에 추가
 */

import { EffectMapEntry } from '@/types/sim-types';


// ============================================================
// 가디언나이트 Effect 타입
// ============================================================

export const GK_EFFECT_TYPES = [
  'GK_QI_DMG',  // 기운 소모당 피해 증가 (ADD)
  'GK_QI_COST',  // 기운 소모 개수 변경 (ADD)
] as const;

export type GkEffectTypeId = (typeof GK_EFFECT_TYPES)[number];


// ============================================================
// 가디언나이트 ClassModifiers
// ============================================================

/**
 * 가디언나이트 전용 보정치
 *
 * [기운 피해 계산]
 *   기운 소모당 피해율 = 0.10 (기본) + qiDmg (누적)
 *   화신 스킬 추가 피해율 = specialization × QI_SPECIALIZATION_COEFF
 *   최종 기운 피해 = finalQiCount × (기운소모당피해율 + 화신추가피해율)
 *
 * [기운 소모량 계산]
 *   finalQiCount = skill.resource.value + qiCost (누적)
 */
export interface GkClassModifiers {
  qiDmg: number;  // 기운 소모당 피해 증가 누적 (ADD, 초기 0)
  qiCost: number;  // 기운 소모 개수 변경 누적 (ADD, 초기 0)
}

export const createEmptyGkClassModifiers = (): GkClassModifiers => ({
  qiDmg: 0,
  qiCost: 0,
});

/**
 * 가디언나이트 특화 계수
 * 화신 스킬의 기운 소모당 피해에 특화×계수 만큼 추가됩니다.
 */
export const QI_SPECIALIZATION_COEFF = 0.00858;

/**
 * 기운 소모당 기본 피해율
 * 발현/화신 스킬 공통 적용
 */
export const QI_BASE_DAMAGE_RATE = 0.10;


// ============================================================
// 가디언나이트 EFFECT_MAP
// ============================================================

/**
 * 가디언나이트 특수 Effect → GkClassModifiers 필드 매핑
 * 계산 엔진에서 applyClassEffect() 가 이 맵을 사용합니다.
 */
// 이후 — 전용 타입으로 분리
export interface ClassEffectMapEntry {
  field: keyof GkClassModifiers;
}

export const GK_EFFECT_MAP: Record<GkEffectTypeId, ClassEffectMapEntry> = {
  GK_QI_DMG : { field: 'qiDmg'  },
  GK_QI_COST: { field: 'qiCost' }, 
};