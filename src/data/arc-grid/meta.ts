import { EffectEntry } from '@/types/sim-types';

/**
 * 아크그리드 효과 메타 데이터
 * * [데이터 규격 약속]
 * isLinear: true인 경우, value 배열은 [step(증가치), min(최소), max(최대)]로 해석합니다.
 * UI단에서는 isLinear를 보고 슬라이더(0~max)를 렌더링하고,
 * 엔진단에서는 level * step으로 최종 수치를 계산합니다.
 */
export const ARK_GRID_EFFECT_RULES: Record<string, EffectEntry> = {
  '공격력': {
    type: 'ATK_P',
    isLinear: true,
    value: [0.0003658, 0, 120],
  },
  '추가 피해': {
    type: 'ADD_DMG',
    isLinear: true,
    value: [0.000808, 0, 120],
  },
  '보스 피해': {
    type: 'DMG_INC',
    isLinear: true,
    value: [0.00083, 0, 120],
  }
};