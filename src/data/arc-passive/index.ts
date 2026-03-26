/**
 * @/data/arc-passive/index.ts
 *
 * 아크패시브 전체 re-export 파일
 *
 * [설계 원칙]
 *   - 
 *
 * ⚠️ 
 */

import { ArkPassiveSectionData, ArkPassiveNodeData } from '@/types/ark-passive';
import { LEAP_COMMON_DATA } from './leap/common';
import { LEAP_GUARDIAN_KNIGHT_DATA } from './leap/guardian-knight';

// 직업명(String)을 키로 사용하는 매핑 테이블
const JOB_LEAP_MAP: Record<string, ArkPassiveNodeData[]> = {
  '가디언나이트': LEAP_GUARDIAN_KNIGHT_DATA,
};

export const getLeapDataByName = (jobName: string): ArkPassiveSectionData => {
  // 1. 매핑 테이블에서 해당 직업의 2티어 노드 배열을 가져옴
  const specificNodes = JOB_LEAP_MAP[jobName] || [];

  return {
    // 2. common.ts의 tierMeta, karma 등 공통 규격을 그대로 사용
    ...LEAP_COMMON_DATA,
    // 3. 노드 배열 병합: [공통 1티어 6개] + [직업 전용 2티어 4개]
    nodes: [
      ...LEAP_COMMON_DATA.nodes,
      ...specificNodes
    ]
  };
};