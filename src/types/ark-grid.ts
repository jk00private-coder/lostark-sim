// @/types/arc-grid.ts

import { BaseSimData, EffectEntry } from '@/types/sim-types';
import { SkillOverride } from './skill-types';

// 이미지 경로 생성 헬퍼
export const GET_GRID_ICON = (type: 'O_SN' | 'O_MN' | 'O_ST' | 'C_SN' | 'C_MN' | 'C_ST') => `/images/arc-grid/icon_${type.toLowerCase()}.webp`;

/**
 * 아크크리드 코어 이펙트
 * 
 * point: 이 코어의 포인트별 옵션 효과
 */
export interface ArkGridCoreEffect {
  point: 10 | 14 | 17 | 18 | 19 | 20;
  effects?: EffectEntry[];
}

/**
 * 아크그리드 코어 데이터
 */
export interface ArkGridCoreData extends BaseSimData {
  thresholds: ArkGridCoreEffect[];
  overrides?: SkillOverride;
}