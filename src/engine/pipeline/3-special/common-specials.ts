/**
 * @/engine/pipeline/3-special/common-specials.ts
 *
 * [3단계-A] 공통 Special 계산 함수
 *
 * [등록된 Special 목록]
 *   EVO_DMG_FROM_CRIT_EXCESS: 뭉툭한 가시
 *     - 치명타 확률 80% 초과분 × 전환계수 → EVO_DMG 추가
 *     - 이 노드에 의한 EVO_DMG 상한 있음
 *
 * [Special 추가 방법]
 *   1. 새 type 상수 추가 (COMMON_SPECIAL_TYPES)
 *   2. handler 함수 작성
 *   3. COMMON_SPECIAL_HANDLERS에 등록
 */

import { PipelineEffectLog, SkillBuffer, SpecialCombatStats } from '../types';


// ============================================================
// 공통 Special type 상수
// ============================================================

export const COMMON_SPECIAL_TYPES = {
  /** 뭉툭한 가시: 초과 치명타 → 진화형 피해 전환 */
  EVO_DMG_FROM_CRIT_EXCESS: 'EVO_DMG_FROM_CRIT_EXCESS',
} as const;

export type CommonSpecialTypeId = keyof typeof COMMON_SPECIAL_TYPES;


// ============================================================
// 헬퍼: BufferMap에서 현재 합산값 읽기
// ============================================================

/**
 * BufferMap에서 특정 type의 현재 합산 승수 계산
 * (subGroup 합산 후 독립 곱연산 적용한 결과)
 *
 * 예) DMG_INC가 0.08, 0.18이면 → (1+0.08) * (1+0.18) = 1.2744
 *
 * 이 함수는 "지금까지 누적된 값"을 읽는 용도 (Special 의존성 처리)
 */
export const readBufferMultiplier = (
  bufferMap: SkillBuffer['bufferMap'],
  type     : string,
): number => {
  const typeBuffer = bufferMap[type];
  if (!typeBuffer) return 1.0;

  let multiplier = 1.0;
  Object.values(typeBuffer).forEach(values => {
    const groupSum = values.reduce((s, v) => s + v, 0);
    multiplier *= (1 + groupSum);
  });
  return multiplier;
};

/**
 * BufferMap에서 특정 type의 합산값만 읽기 (ADD 계열용)
 */
export const readBufferSum = (
  bufferMap: SkillBuffer['bufferMap'],
  type     : string,
): number => {
  const typeBuffer = bufferMap[type];
  if (!typeBuffer) return 0;
  return Object.values(typeBuffer)
    .flat()
    .reduce((s, v) => s + v, 0);
};


// ============================================================
// 뭉툭한 가시 Special 핸들러
// ============================================================

/**
 * 뭉툭한 가시 (T5_1) Special 계산
 *
 * [효과]
 *   1. EVO_DMG +7.5% / +15% (레벨 1/2) → 일반 효과로 처리됨 (여기서 처리 안 함)
 *   2. 치명타 확률 상한 80% 적용
 *   3. 초과 치명타 확률 × 125% / 150% → EVO_DMG 추가
 *   4. 이 노드에 의한 EVO_DMG 상한: 52.5% / 75%
 *
 * @param log - EVO_DMG_FROM_CRIT_EXCESS 로그
 *              value: 전환계수 (1.25 또는 1.5)
 *              subGroup: 상한값 전달용 ('0.525' 또는 '0.75')
 */
const handleEvoDmgFromCritExcess = (
  skillBuffer : SkillBuffer,
  log         : PipelineEffectLog,
  combatStats : SpecialCombatStats,
): PipelineEffectLog[] => {
  const CRIT_CAP = 0.80;                   // 치명타 확률 상한
  const transferCoeff = log.value;          // 전환계수 (1.25 / 1.5)
  const evoDmgCap = parseFloat(log.subGroup ?? '0'); // 상한값 (subGroup으로 전달)

  // 2단계까지 확정된 치명타 확률 합산
  const currentCrit = combatStats.critChance;

  // 초과분 계산 (상한 80%를 초과한 경우에만 발동)
  const excess = Math.max(0, currentCrit - CRIT_CAP);
  if (excess === 0) return [];

  // 초과분 × 전환계수 → EVO_DMG 추가값
  const rawEvoDmgBonus = excess * transferCoeff;

  // 상한 적용
  const evoDmgBonus = evoDmgCap > 0
    ? Math.min(rawEvoDmgBonus, evoDmgCap)
    : rawEvoDmgBonus;

  if (evoDmgBonus <= 0) return [];

  return [{
    label   : '뭉툭한 가시 (초과치명→진화)',
    type    : 'EVO_DMG',
    value   : evoDmgBonus,
    special : false, // 이미 계산 완료된 최종값
  }];
};


// ============================================================
// 공통 Special 핸들러 라우터
// ============================================================

/**
 * Special type → 핸들러 함수 매핑
 */
const COMMON_SPECIAL_HANDLERS: Record<
  string,
  (
    skillBuffer: SkillBuffer,
    log        : PipelineEffectLog,
    combatStats: SpecialCombatStats,
  ) => PipelineEffectLog[]
> = {
  [COMMON_SPECIAL_TYPES.EVO_DMG_FROM_CRIT_EXCESS]: handleEvoDmgFromCritExcess,
};


// ============================================================
// 메인: processCommonSpecials
// ============================================================

/**
 * 공통 Special 로그 처리
 *
 * @param skillBuffer  - 2단계까지 완성된 스킬 버퍼
 * @param specialLogs  - 이 스킬에 적용 가능한 Special 로그
 * @param combatStats  - 전투 특성 (치명타 확률 등)
 * @returns 버퍼에 push할 완성된 로그 목록
 */
export const processCommonSpecials = (
  skillBuffer : SkillBuffer,
  specialLogs : PipelineEffectLog[],
  combatStats : SpecialCombatStats,
): PipelineEffectLog[] => {
  const results: PipelineEffectLog[] = [];

  specialLogs.forEach(log => {
    const handler = COMMON_SPECIAL_HANDLERS[log.type];
    if (!handler) return; // 공통 핸들러 없음 → 직업 Special에서 처리

    const produced = handler(skillBuffer, log, combatStats);
    results.push(...produced);
  });

  return results;
};
