/**
 * @/data/arc-passive/leap/common.ts
 *
 * 아크패시브 도약 1티어 DB
 *
 * [설계 원칙]
 *   - 
 *
 * ⚠️ 
 */

import { ArkPassiveSectionData } from '@/types/ark-passive';
import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';

// ============================================================
// 아크패시브-도약 ID 상수
// ============================================================

// 공통 Base ID (7010 3 0 00)
const BASE = (ID_AA.ARK_PASSIVE * 1000000) + (ID_BB.COMMON * 10000) + (ID_C.ARK_LEAP * 1000);

// 스킬별 ID
// D: 티어(1,2), 2티어는 직업별로 작성
// EE: 해당 티어의 노드
export const ID = {
    T1_1: BASE + 101, T1_2: BASE + 102, T1_3: BASE + 103, T1_4: BASE + 104, T1_5: BASE + 105, T1_6: BASE + 106,
};

export const NAMES = {
    [ID.T1_1]: '초월적인 힘', [ID.T1_2]: '충전된 분노', [ID.T1_3]: '각성 증폭기',
    [ID.T1_4]: '풀려난 힘', [ID.T1_5]: '잠재력 해방', [ID.T1_6]: '즉각적인 주문',
} as const;

export const LEAP_COMMON_DATA: ArkPassiveSectionData[] = [
  // ── 티어 1 ──────────────────────────────────────────
  { // 초월적인 힘
      id: ID.T1_1,
      name: NAMES[ID.T1_1],
      iconPath: `/images/arc-passive/leap/${ID.T1_1}.webp`,
      pointCost: 4,
      effects: [
          { type: 'DMG_INC', value: [0.1, 0.2, 0.3, 0.4, 0.5], target: {categories:['HYPER_ULTIMATE']} }
      ]
  },
  { // 충전된 분노
      id: ID.T1_2,
      name: NAMES[ID.T1_2],
      iconPath: `/images/arc-passive/leap/${ID.T1_2}.webp`,
      pointCost: 4
  },
  {
      id: ID.T1_3,
      name: NAMES[ID.T1_3], // 각성 증폭기
      iconPath: `/images/arc-passive/leap/${ID.T1_3}.webp`,
      pointCost: 2
  },
  { // 풀려난 힘
      id: ID.T1_4,
      name: NAMES[ID.T1_4],
      iconPath: `/images/arc-passive/leap/${ID.T1_4}.webp`,
      pointCost: 4,
      effects: [
          { type: 'DMG_INC', value: [0.03, 0.06, 0.09, 0.12, 0.15], target: {categories:['HYPER_SKILL']} }
      ]
  },
  { // 잠재력 해방
      id: ID.T1_5,
      name: NAMES[ID.T1_5],
      iconPath: `/images/arc-passive/leap/${ID.T1_5}.webp`,
      pointCost: 4,
      effects: [
          { type: 'CDR_P', value: [0.02, 0.04, 0.06, 0.08, 0.1], target: {categories:['HYPER_SKILL']} }
      ]
  },
  { // 즉각적인 주문
      id: ID.T1_6,
      name: NAMES[ID.T1_6],
      iconPath: `/images/arc-passive/leap/${ID.T1_6}.webp`,
      pointCost: 2
  },
];
