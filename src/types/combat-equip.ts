// @/types/combat-equip.ts

import { BaseSimData, EffectEntry, MultiKey } from '@/types/sim-types';

// 이미지 경로 생성 헬퍼
export const GET_ICON = (type: 'HEAD' | 'SHOULDER' | 'CHEST' | 'PANTS' | 'GLOVE' | 'WEAPON') => `/images/equipment/icon_${type.toLowerCase()}.webp`;

/**
 * 전투 장비 데이터
 */

// 강화 단계별 상급 재련 수치 데이터
export interface AdvRefineEffect {
  refineLv: number;
  effects: EffectEntry[];
}

export interface CombatEquipData extends BaseSimData {
  initItemLv: Partial<Record<MultiKey, number>>; 
  adv_refine: AdvRefineEffect[];
}