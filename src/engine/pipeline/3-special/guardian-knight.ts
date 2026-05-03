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
 * [desc 필드]
 *   완성된 로그에 계산 근거를 명시 (UI 투명성)
 *   예) "기운4개×10% + 특화1800×0.00858% + 트포10%"
 */

import { PipelineEffectLog, SkillBuffer, SpecialCombatStats, ResolvedSkillMeta } from '../types';
import { readBufferSum } from './common-specials';


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
  if (!meta.cost || meta.cost <= 0) return [];

  // GK_QI_DMG 추가치 합산 (버퍼에 쌓인 값)
  const qiDmgBonus = readBufferSum(skillBuffer.bufferMap, 'GK_QI_DMG');

  // 기본값: 소모 기운 × 10%
  const baseQiDmg = meta.cost * QI_BASE_COEFF;
  let totalQiDmg = baseQiDmg;

  // 화신 스킬: 특화 수치 × 특화계수 추가
  const isGodForm = meta.categories.includes('GOD_FORM');
  const specBonus = isGodForm ? combatStats.specialization * SPEC_COEFF : 0;
  totalQiDmg += specBonus;

  // 아크패시브/트라이포드 추가치 합산
  totalQiDmg += qiDmgBonus;

  if (totalQiDmg <= 0) return [];

  // ── desc: 계산 근거 명시 ──────────────────────────────────
  const descParts: string[] = [
    `기운${meta.cost}개×${(QI_BASE_COEFF * 100).toFixed(0)}%(=${(baseQiDmg * 100).toFixed(1)}%)`,
  ];
  if (isGodForm && specBonus > 0) {
    descParts.push(
      `특화${combatStats.specialization}×${(SPEC_COEFF * 100).toFixed(5)}%(=${(specBonus * 100).toFixed(2)}%)`
    );
  }
  if (qiDmgBonus > 0) {
    descParts.push(`추가치${(qiDmgBonus * 100).toFixed(1)}%`);
  }
  const desc = descParts.join(' + ');

  // 최종 DMG_INC로 변환하여 반환
  return [{
    label   : `GK 기운 피해 (소모${meta.cost}개)`,
    type    : 'DMG_INC',
    value   : totalQiDmg,
    special : false, // 이미 계산 완료
    desc,
  }];
};