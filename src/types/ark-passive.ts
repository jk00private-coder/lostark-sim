// @/types/ark-passive.ts

import { BaseSimData, EffectEntry } from './sim-types';
import { SkillOverride } from './skill-types';

/**
 * 카르마 데이터
 */
export interface KarmaData {
  rankBonus?: EffectEntry;  // 랭크별 누적 수치 (인덱스 = 랭크-1)
  levelBonus: EffectEntry;  // 레벨별 누적 수치 (인덱스 = 레벨-1)
}

/**
 * 아크패시브 노드 데이터
 *
 * pointCost: 이 노드의 레벨당 포인트 차감량
 *   → 같은 티어라도 노드마다 다르므로 노드 단위로 보관
 */
export interface ArkPassiveSectionData extends BaseSimData {
  pointCost: number;
  overrides?: SkillOverride;
}

/**
 * tierMeta: 티어별 최대 포인트 - key: 티어 번호, value: 최대 포인트
 * karma: 섹션 전체에 적용되는 랭크/레벨 보너스
 */
export interface ArkPassiveSectionRule {
  tierMeta: Record<number, number>;
  karma   : KarmaData;
}