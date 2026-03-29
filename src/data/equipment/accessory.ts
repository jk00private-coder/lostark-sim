// @/data/equipment/accessory.ts

import { BaseSimData } from '@/types/sim-types';
import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';

// 공통 Base ID (10 10 2 0 00)
const BASE = (ID_AA.EQUIPMENT * 1000000) + (ID_BB.COMMON * 10000) + (ID_C.EQ_ACCESSORY * 1000);

// D: 1(4티어 유물,R), 2(4티어 고대,A)
// EE: 01~19(목걸이,N), 21~39(귀걸이,E), 41~59(반지,R)
// EE: 각 항에서 1,2번은 기본효과, 나머지는 연마 효과
export const ID = {
  // ── 등급: 유물 ──────────────────────────────────

  // ── 등급: 고대 ──────────────────────────────────
  AN_1: BASE + 201, AN_2: BASE + 202,
  AN_3: BASE + 203, AN_4: BASE + 204, AN_8: BASE + 208,
  AN_9: BASE + 209,

  AE_1: BASE + 221, AE_2: BASE + 222,
  AE_3: BASE + 223, AE_4: BASE + 224, AE_8: BASE + 228,
  AE_9: BASE + 229,

  AR_1: BASE + 241, AR_2: BASE + 242,
  AR_3: BASE + 243, AR_4: BASE + 244, AR_8: BASE + 248,
  AR_9: BASE + 249,
};

//todo: 목걸이는 colorValue가 상중하로 안나뉘고 5개의 범위로 나뉜다.
export const ACCESSORY_DATA: BaseSimData[] = [
  // ── 목걸이 ──────────────────────────────────
  { // 주스탯
    id: ID.AN_1,
    effects: [{
        type: "MAIN_STAT_C",
        grades: { low: [15178, 17068], mid: [17069, 17589], high: [17590, 17857] }
      }]
  },
  { // 생명력
    id: ID.AN_2,
    effects: [{
        type: "STAT_HP_C",
        grades: { low: [3754, 3860], mid: [3861, 3999], high: [4000, 4103] }
      }]
  },
  { // 추가 피해
    id: ID.AN_3,
    effects: [{
        type: "ADD_DMG",
        grades: { low: [0.007, 0.007], mid: [0.016, 0.016], high: [0.026, 0.026] }
      }]
  },
  { // 피해 증가
    id: ID.AN_4,
    effects: [{
        type: "DMG_INC",
        grades: { low: [0.0055, 0.0055], mid: [0.012, 0.012], high: [0.02, 0.02] }
      }]
  },
  { // 공격력C
    id: ID.AN_8,
    effects: [{
        type: "ATK_C",
        grades: { low: [80, 80], mid: [195, 195], high: [390, 390] }
      }]
  },
  { // 무기공격력C
    id: ID.AN_9,
    effects: [{
        type: "WEAPON_ATK_C",
        grades: { low: [195, 195], mid: [480, 480], high: [960, 960] }
      }]
  },

  // ── 귀걸이 ──────────────────────────────────
  { // 주스탯
    id: ID.AE_1,
    effects: [{
        type: "MAIN_STAT_C",
        grades: { low: [11806, 12446], mid: [12447, 13275], high: [13276, 13889] }
      }]
  },
  { // 생명력
    id: ID.AE_2,
    effects: [{
        type: "STAT_HP_C",
        grades: { low: [2682, 2758], mid: [2759, 2857], high: [2858, 2931] }
      }]
  },
  { // 공격력P
    id: ID.AE_3,
    effects: [{
        type: "ATK_P",
        grades: { low: [0.004, 0.004], mid: [0.0095, 0.0095], high: [0.0155, 0.0155] }
      }]
  },
  { // 무기공격력P
    id: ID.AE_4,
    effects: [{
        type: "WEAPON_ATK_P",
        grades: { low: [0.008, 0.008], mid: [0.018, 0.018], high: [0.03, 0.03] }
      }]
  },
  { // 공격력C
    id: ID.AE_8,
    effects: [{
        type: "ATK_C",
        grades: { low: [80, 80], mid: [195, 195], high: [390, 390] }
      }]
  },
  { // 무기공격력C
    id: ID.AE_9,
    effects: [{
        type: "WEAPON_ATK_C",
        grades: { low: [195, 195], mid: [480, 480], high: [960, 960] }
      }]
  },

  // ── 반지 ──────────────────────────────────
  { // 주스탯
    id: ID.AR_1,
    effects: [{
        type: "MAIN_STAT_C",
        grades: { low: [10962, 11556], mid: [11557, 12327], high: [12328, 12897] }
      }]
  },
  { // 생명력
    id: ID.AR_2,
    effects: [{
        type: "STAT_HP_C",
        grades: { low: [2146, 2206], mid: [2207, 2285], high: [2286, 2345] }
      }]
  },
  { // 치명타 적중률
    id: ID.AR_3,
    effects: [{
        type: "CRIT_CHANCE",
        grades: { low: [0.004, 0.004], mid: [0.0095, 0.0095], high: [0.0155, 0.0155] }
      }]
  },
  { // 치명타 피해
    id: ID.AR_4,
    effects: [{
        type: "CRIT_DMG",
        grades: { low: [0.011, 0.011], mid: [0.024, 0.024], high: [0.04, 0.04] }
      }]
  },
  { // 공격력C
    id: ID.AR_8,
    effects: [{
        type: "ATK_C",
        grades: { low: [80, 80], mid: [195, 195], high: [390, 390] }
      }]
  },
  { // 무기공격력C
    id: ID.AR_9,
    effects: [{
        type: "WEAPON_ATK_C",
        grades: { low: [195, 195], mid: [480, 480], high: [960, 960] }
      }]
  },
]