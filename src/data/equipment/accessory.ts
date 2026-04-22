// @/data/equipment/accessory.ts

import { AccessoryRawData, AccessoryData } from '@/types/equipment-types';
import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';

// 공통 Base ID (10 10 2 0 00)
const BASE = (ID_AA.EQUIPMENT * 1000000) + (ID_BB.COMMON * 10000) + (ID_C.EQ_ACCESSORY * 1000);

// D: 1(4티어, T4)
// EE: 01~19(목걸이,N), 21~39(귀걸이,E), 41~59(반지,R)
// EE: 각 항에서 1,2번은 기본효과, 나머지는 연마 효과
export const ID = {
  // ── 등급: 유물 ──────────────────────────────────

  // ── 등급: 고대 ──────────────────────────────────
  T4N_1: BASE + 101, T4N_2: BASE + 102,
  T4N_3: BASE + 103, T4N_4: BASE + 104, T4N_8: BASE + 108,
  T4N_9: BASE + 109,

  T4E_1: BASE + 121, T4E_2: BASE + 122,
  T4E_3: BASE + 123, T4E_4: BASE + 124, T4E_8: BASE + 128,
  T4E_9: BASE + 129,

  T4R_1: BASE + 141, T4R_2: BASE + 142,
  T4R_3: BASE + 143, T4R_4: BASE + 144, T4R_8: BASE + 148,
  T4R_9: BASE + 149,
};

export const NAMES = {
  [ID.T4N_1]: '주스탯 +{v1}', [ID.T4N_2]: '체력 +{v1}',
  [ID.T4N_3]: '추가 피해 +{v1}%', [ID.T4N_4]: '피해 증가 +{v1}%', [ID.T4N_8]: '공격력 +{v1}',
  [ID.T4N_9]: '무기 공격력 +{v1}',

  [ID.T4E_1]: '주스탯 +{v1}', [ID.T4E_2]: '체력 +{v1}',
  [ID.T4E_3]: '공격력 +{v1}%', [ID.T4E_4]: '무기 공격력 +{v1}%', [ID.T4E_8]: '공격력 +{v1}',
  [ID.T4E_9]: '무기 공격력 +{v1}',

  [ID.T4R_1]: '주스탯 +{v1}', [ID.T4R_2]: '체력 +{v1}',
  [ID.T4R_3]: '치명타 적중률 +{v1}%', [ID.T4R_4]: '치명타 피해 +{v1}%', [ID.T4R_8]: '공격력 +{v1}',
  [ID.T4R_9]: '무기 공격력 +{v1}',

} as const;

export const LABELS = {
  // ── 등급: 고대 ──────────────────────────────────
  [ID.T4N_1]: '힘', [ID.T4N_2]: '체력',
  [ID.T4N_3]: '추가 피해', [ID.T4N_4]: '적에게 주는 피해', [ID.T4N_8]: '공격력',
  [ID.T4N_9]: '무기 공격력',
  
  [ID.T4E_1]: '힘', [ID.T4E_2]: '체력',
  [ID.T4E_3]: '공격력', [ID.T4E_4]: '무기 공격력', [ID.T4E_8]: '공격력',
  [ID.T4E_9]: '무기 공격력',
  
  
  [ID.T4R_1]: '힘', [ID.T4R_2]: '체력',
  [ID.T4R_3]: '치명타 적중률', [ID.T4R_4]: '치명타 피해', [ID.T4R_8]: '공격력',
  [ID.T4R_9]: '무기 공격력',
};

const ID_TIER_MAP: Record<number, AccessoryData['tier']> = {
  1: 4, 2: 5,
};

/** ID 규칙에 따라 부위, 티어, 카테고리를 추출 */
export const decodeAccessoryId = (id: number): Pick<AccessoryData, 'type' | 'category' | 'tier'> => {
  const last3 = id % 1000;
  const tierCode = Math.floor(last3 / 100); 
  const offset = last3 % 100;
  const itemIndex = offset % 20;

  // 1. 티어 결정 (기본값 4티어)
  const tier = ID_TIER_MAP[tierCode];

  // 2. 부위(Type) 결정
  let type: AccessoryData['type'];
  if (offset >= 41) type = '반지';
  else if (offset >= 21) type = '귀걸이';
  else type = '목걸이';

  // 3. 카테고리(Category) 결정
  const category: AccessoryData['category'] = (itemIndex === 1 || itemIndex === 2) 
    ? 'BASE' 
    : 'POLISH';

  return {
    type,
    category,
    tier,
  };
};

//todo: 모든 품질은 colorValue가 상중하로 안나뉘고 5개의 범위로 나뉜다.
const ACCESSORY_DATA: AccessoryRawData[] = [
  // ── 목걸이 ──────────────────────────────────
  { // 주스탯
    id: ID.T4N_1,
    name: NAMES[ID.T4N_1],
    label: LABELS[ID.T4N_1],
    effects: [{
        type: "MAIN_STAT_C",
        multiGrades: { ANCIENT: { low: [15178, 17068], mid: [17069, 17589], high: [17590, 17857] } }
      }]
  },
  { // 체력
    id: ID.T4N_2,
    name: NAMES[ID.T4N_2],
    label: LABELS[ID.T4N_2],
    effects: [{
        type: "STAT_HP_C",
        multiGrades: { ANCIENT: { low: [3754, 3860], mid: [3861, 3999], high: [4000, 4103] } }
      }]
  },
  { // 추가 피해
    id: ID.T4N_3,
    name: NAMES[ID.T4N_3],
    label: LABELS[ID.T4N_3],
    effects: [{
        type: "ADD_DMG",
        multiGrades: { ANCIENT: { low: [0.007, 0.007], mid: [0.016, 0.016], high: [0.026, 0.026] } }
      }]
  },
  { // 적에게 주는 피해
    id: ID.T4N_4,
    name: NAMES[ID.T4N_4],
    label: LABELS[ID.T4N_4],
    effects: [{
        type: "DMG_INC",
        multiGrades: { ANCIENT: { low: [0.0055, 0.0055], mid: [0.012, 0.012], high: [0.02, 0.02] } }
      }]
  },
  { // 공격력C
    id: ID.T4N_8,
    name: NAMES[ID.T4N_8],
    label: LABELS[ID.T4N_8],
    effects: [{
        type: "ATK_C",
        multiGrades: { ANCIENT: { low: [80, 80], mid: [195, 195], high: [390, 390] } }
      }]
  },
  { // 무기 공격력C
    id: ID.T4N_9,
    name: NAMES[ID.T4N_9],
    label: LABELS[ID.T4N_9],
    effects: [{
        type: "WEAPON_ATK_C",
        multiGrades: { ANCIENT: { low: [195, 195], mid: [480, 480], high: [960, 960] } }
      }]
  },

  // ── 귀걸이 ──────────────────────────────────
  { // 주스탯
    id: ID.T4E_1,
    name: NAMES[ID.T4E_1],
    label: LABELS[ID.T4E_1],
    effects: [{
        type: "MAIN_STAT_C",
        multiGrades: { ANCIENT: { low: [11806, 12446], mid: [12447, 13275], high: [13276, 13889] } }
      }]
  },
  { // 체력
    id: ID.T4E_2,
    name: NAMES[ID.T4E_2],
    label: LABELS[ID.T4E_2],
    effects: [{
        type: "STAT_HP_C",
        multiGrades: { ANCIENT: { low: [2682, 2758], mid: [2759, 2857], high: [2858, 2931] } }
      }]
  },
  { // 공격력P
    id: ID.T4E_3,
    name: NAMES[ID.T4E_3],
    label: LABELS[ID.T4E_3],
    effects: [{
        type: "ATK_P",
        multiGrades: { ANCIENT: { low: [0.004, 0.004], mid: [0.0095, 0.0095], high: [0.0155, 0.0155] } }
      }]
  },
  { // 무기 공격력P
    id: ID.T4E_4,
    name: NAMES[ID.T4E_4],
    label: LABELS[ID.T4E_4],
    effects: [{
        type: "WEAPON_ATK_P",
        multiGrades: { ANCIENT: { low: [0.008, 0.008], mid: [0.018, 0.018], high: [0.03, 0.03] } }
      }]
  },
  { // 공격력C
    id: ID.T4E_8,
    name: NAMES[ID.T4E_8],
    label: LABELS[ID.T4E_8],
    effects: [{
        type: "ATK_C",
        multiGrades: { ANCIENT: { low: [80, 80], mid: [195, 195], high: [390, 390] } }
      }]
  },
  { // 무기 공격력C
    id: ID.T4E_9,
    name: NAMES[ID.T4E_9],
    label: LABELS[ID.T4E_9],
    effects: [{
        type: "WEAPON_ATK_C",
        multiGrades: { ANCIENT: { low: [195, 195], mid: [480, 480], high: [960, 960] } }
      }]
  },

  // ── 반지 ──────────────────────────────────
  { // 주스탯
    id: ID.T4R_1,
    name: NAMES[ID.T4R_1],
    label: LABELS[ID.T4R_1],
    effects: [{
        type: "MAIN_STAT_C",
        multiGrades: { ANCIENT: { low: [10962, 11556], mid: [11557, 12327], high: [12328, 12897] } }
      }]
  },
  { // 체력
    id: ID.T4R_2,
    name: NAMES[ID.T4R_2],
    label: LABELS[ID.T4R_2],
    effects: [{
        type: "STAT_HP_C",
        multiGrades: { ANCIENT: { low: [2146, 2206], mid: [2207, 2285], high: [2286, 2345] } }
      }]
  },
  { // 치명타 적중률
    id: ID.T4R_3,
    name: NAMES[ID.T4R_3],
    label: LABELS[ID.T4R_3],
    effects: [{
        type: "CRIT_CHANCE",
        multiGrades: { ANCIENT: { low: [0.004, 0.004], mid: [0.0095, 0.0095], high: [0.0155, 0.0155] } }
      }]
  },
  { // 치명타 피해
    id: ID.T4R_4,
    name: NAMES[ID.T4R_4],
    label: LABELS[ID.T4R_4],
    effects: [{
        type: "CRIT_DMG",
        multiGrades: { ANCIENT: { low: [0.011, 0.011], mid: [0.024, 0.024], high: [0.04, 0.04] } }
      }]
  },
  { // 공격력C
    id: ID.T4R_8,
    name: NAMES[ID.T4R_8],
    label: LABELS[ID.T4R_8],
    effects: [{
        type: "ATK_C",
        multiGrades: { ANCIENT: { low: [80, 80], mid: [195, 195], high: [390, 390] } }
      }]
  },
  { // 무기공격력C
    id: ID.T4R_9,
    name: NAMES[ID.T4R_9],
    label: LABELS[ID.T4R_9],
    effects: [{
        type: "WEAPON_ATK_C",
        multiGrades: { ANCIENT: { low: [195, 195], mid: [480, 480], high: [960, 960] } }
      }]
  },
]

export const ACCESSORY_DB = ACCESSORY_DATA.map(item => ({
  ...item,
  ...decodeAccessoryId(item.id) // 여기서 알아서 부위, 티어 다 붙여줌
})) as AccessoryData[];