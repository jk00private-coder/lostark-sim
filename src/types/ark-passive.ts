// @/types/ark-passive.ts

import { BaseSimData, LeveledEffect, EffectEntry } from './sim-types';

/**
 * 카르마 데이터
 *
 * rankBonus  : 랭크 올라갈 때마다 추가되는 수치 (인덱스 = 랭크-1)
 * levelBonus : 레벨 올라갈 때마다 추가되는 수치 (인덱스 = 레벨-1)
 */
export interface KarmaData {
  rankBonus : LeveledEffect;  // 랭크별 누적 수치
  levelBonus: LeveledEffect;  // 레벨별 누적 수치
}

/**
 * 아크패시브 노드 데이터
 * 티어 내 개별 효과 하나를 표현
 *
 * effects  : 활성화 시 항상 적용되는 고정 효과
 * karma    : 랭크/레벨에 따라 변동되는 수치 (없는 노드도 있음)
 * target   : 특정 스킬에만 적용되는 경우 (EffectEntry.target과 동일 개념)
 */
export interface ArkPassiveNodeData extends BaseSimData {
  tier    : number;        // 1 | 2 | 3 | 4
  effects?: EffectEntry[]; // 고정 효과
  karma?  : KarmaData;     // 랭크/레벨 변동 수치
}

/**
 * 아크패시브 섹션 전체 (진화/깨달음/도약 각각)
 */
export interface ArkPassiveSectionData {
  category: '진화' | '깨달음' | '도약';
  nodes   : ArkPassiveNodeData[];
}