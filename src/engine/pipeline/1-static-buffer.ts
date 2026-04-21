/**
 * @/engine/pipeline/1-static-buffer.ts
 *
 * [1단계] Static Buffer 구성
 *
 * [역할]
 *   effectLog 전체를 순회하여
 *   - target 없음 + special 아님 → StaticBuffer에 push
 *   - target 있음 → 2단계(Dynamic)로 패스
 *   - special=true → 3단계(Special)로 패스
 *
 * [BufferMap 구조]
 *   { DMG_INC: { card: [0.08, 0.12], __solo_0: [0.18] }, ... }
 *
 *   subGroup 없음 → '__solo_{전역인덱스}' 키 (독립 곱연산 보장)
 *   subGroup 있음 → 해당 키로 합산 (같은 그룹끼리 합연산 후 1회 곱연산)
 */

import { PipelineEffectLog, BufferMap } from './types';


// ============================================================
// 헬퍼: BufferMap에 값 push
// ============================================================

/**
 * BufferMap의 특정 type + subGroup에 값을 추가
 *
 * @param bufferMap - 대상 버퍼
 * @param type      - 효과 타입 (예: 'DMG_INC')
 * @param subGroup  - 그룹 키 (없으면 '__solo_{idx}' 생성)
 * @param value     - 추가할 수치
 * @param soloIdx   - subGroup 없을 때 고유 인덱스 (중복 방지)
 */
export const pushToBuffer = (
  bufferMap: BufferMap,
  type     : string,
  subGroup : string | undefined,
  value    : number,
  soloIdx  : number,
): void => {
  if (!bufferMap[type]) bufferMap[type] = {};

  const key = subGroup ?? `__solo_${soloIdx}`;
  if (!bufferMap[type][key]) bufferMap[type][key] = [];
  bufferMap[type][key].push(value);
};


// ============================================================
// 메인: buildStaticBuffer
// ============================================================

export interface StaticBufferResult {
  /** 1단계에서 처리된 Static 버퍼 */
  staticBuffer   : BufferMap;
  /** 2단계로 넘길 Dynamic 로그 (target 있음 + special 아님) */
  dynamicLogs    : PipelineEffectLog[];
  /** 3단계로 넘길 Special 로그 (special=true) */
  specialLogs    : PipelineEffectLog[];
}

/**
 * effectLog 전체를 분류하여 StaticBuffer + 잔여 로그 반환
 *
 * @param effectLogs - 전체 효과 로그 (각인/카드/장비/아크그리드/스킬/트포 포함)
 */
export const buildStaticBuffer = (
  effectLogs: PipelineEffectLog[],
): StaticBufferResult => {
  const staticBuffer: BufferMap = {};
  const dynamicLogs : PipelineEffectLog[] = [];
  const specialLogs : PipelineEffectLog[] = [];

  effectLogs.forEach((log, idx) => {
    // [분기 1] Special → 3단계로 패스
    if (log.special) {
      specialLogs.push(log);
      return;
    }

    // [분기 2] target 있음 → 2단계로 패스
    if (log.target) {
      dynamicLogs.push(log);
      return;
    }

    // [분기 3] target 없음 + special 아님 → StaticBuffer에 push
    pushToBuffer(staticBuffer, log.type, log.subGroup, log.value, idx);
  });

  return { staticBuffer, dynamicLogs, specialLogs };
};


// ============================================================
// 헬퍼: BufferMap 깊은 복사
// ============================================================

/**
 * BufferMap을 깊은 복사하여 반환
 * 2단계에서 스킬별 버퍼 초기화 시 사용
 */
export const cloneBufferMap = (source: BufferMap): BufferMap => {
  const clone: BufferMap = {};
  for (const type in source) {
    clone[type] = {};
    for (const group in source[type]) {
      clone[type][group] = [...source[type][group]];
    }
  }
  return clone;
};
