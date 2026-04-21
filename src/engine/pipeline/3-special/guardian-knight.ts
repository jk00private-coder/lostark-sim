/**
 * @/engine/pipeline/3-special/classes/guardian-knight.ts
 *
 * [3단계-B] 가디언나이트 직업 Special
 *
 * [GK_QI_DMG 확정 공식]
 *   최종 기운 피해 보너스
 *   = (소모 기운 개수 × 0.10)               ← 기본값: 기운 1개당 10%
 *   + [화신 스킬만] 특화 × 0.00858%         ← 특화계수
 *   + 아크패시브 깨달음 추가치 (GK_QI_DMG 로그 합산)
 *   + 트라이포드 추가치 (GK_QI_DMG 로그 합산)
 *
 * [처리 대상]
 *   GK_QI_DMG: 기운 소모당 피해 증가 (확정 전 재료)
 *   → 이 값들을 모두 합산하여 DMG_INC로 변환 후 버퍼에 push
 *
 * [설계 노트]
 *   GK_QI_DMG는 Special이 아님.
 *   Dynamic 단계에서 스킬별 버퍼에 쌓임.
 *   이 함수는 쌓인 GK_QI_DMG 값을 읽어 최종 DMG_INC를 확정.
 */

import { PipelineEffectLog, SkillBuffer, SpecialCombatStats, ResolvedSkillMeta } from '../types';
import { readBufferSum } from '../common-specials';


// ============================================================
// 상수
// ============================================================

/** 기운 소모 1개당 기본 피해 증가 */
const QI_BASE_COEFF = 0.10;

/** 화신 스킬 특화 계수 */
const SPEC_COEFF = 0.0000858; // 0.00858% = 0.0000858 (소수 표기)


// ============================================================
// 메인: processGuardianKnightSpecials
// ============================================================

/**
 * 가디언나이트 직업 Special 처리
 *
 * GK_QI_DMG를 최종 DMG_INC로 변환하여 반환
 *
 * @param skillBuffer  - 2단계까지 완성된 스킬 버퍼 (GK_QI_DMG 누적됨)
 * @param meta         - 스킬 메타 (qiCost, categories 등)
 * @param combatStats  - 전투 특성 (특화 수치)
 */
export const processGuardianKnightSpecials = (
  skillBuffer: SkillBuffer,
  meta       : ResolvedSkillMeta,
  combatStats: SpecialCombatStats,
): PipelineEffectLog[] => {
  // QI 소모가 없는 스킬은 스킵
  if (!meta.qiCost || meta.qiCost <= 0) return [];

  // GK_QI_DMG 추가치 합산 (버퍼에 쌓인 값)
  const qiDmgBonus = readBufferSum(skillBuffer.bufferMap, 'GK_QI_DMG');

  // 기본값: 소모 기운 × 10%
  let totalQiDmg = meta.qiCost * QI_BASE_COEFF;

  // 화신 스킬: 특화 수치 × 특화계수 추가
  const isGodForm = meta.categories.includes('GOD_FORM');
  if (isGodForm) {
    totalQiDmg += combatStats.specialization * SPEC_COEFF;
  }

  // 아크패시브/트라이포드 추가치 합산
  totalQiDmg += qiDmgBonus;

  if (totalQiDmg <= 0) return [];

  // 최종 DMG_INC로 변환하여 반환
  return [{
    label   : `GK 기운 피해 (소모${meta.qiCost}개)`,
    type    : 'DMG_INC',
    value   : totalQiDmg,
    special : false, // 이미 계산 완료
  }];
};
