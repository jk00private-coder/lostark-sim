// @/types/bracelet-types.ts

import { BaseSimData } from '@/types/sim-types';
import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';

// 공통 Base ID (10 10 4 0 00)
const BASE = (ID_AA.EQUIPMENT * 1000000) + (ID_BB.COMMON * 10000) + (ID_C.EQ_BRACELET * 1000);

// 스킬별 ID
// D: 1(4티어 유물), 2(4티어 고대)
// EE: 11~19(기본 효과), 21~29(전투 특성), 31~(특수 효과)
export const ID = {
  // ── 등급: 유물 ──────────────────────────────────
  R1_1: BASE + 111, R1_2: BASE + 112,
    
  R2_1: BASE + 121, R2_2: BASE + 122, R2_3: BASE + 123,
  R2_4: BASE + 124, R2_5: BASE + 125, R2_6: BASE + 126,

  R3_1 : BASE + 131, R3_11: BASE + 141, R3_12: BASE + 142,
  R3_13: BASE + 143, R3_14: BASE + 144, R3_15: BASE + 145,
  R3_16: BASE + 146, R3_17: BASE + 147, R3_19: BASE + 149,
  R3_20: BASE + 150, R3_21: BASE + 151, R3_22: BASE + 152,
  R3_23: BASE + 153, R3_24: BASE + 154, R3_25: BASE + 155,
  R3_26: BASE + 156, R3_27: BASE + 157, R3_31: BASE + 161,
  R3_32: BASE + 162, R3_33: BASE + 163,

  // ── 등급: 고대 ──────────────────────────────────
  A1_1: BASE + 211, A1_2: BASE + 212,
    
  A2_1: BASE + 221, A2_2: BASE + 222, A2_3: BASE + 223,
  A2_4: BASE + 224, A2_5: BASE + 225, A2_6: BASE + 226,

  A3_1 : BASE + 231, A3_11: BASE + 241, A3_12: BASE + 242,
  A3_13: BASE + 243, A3_14: BASE + 244, A3_15: BASE + 245,
  A3_16: BASE + 246, A3_17: BASE + 247, A3_19: BASE + 249,
  A3_20: BASE + 250, A3_21: BASE + 251, A3_22: BASE + 252,
  A3_23: BASE + 253, A3_24: BASE + 254, A3_25: BASE + 255,
  A3_26: BASE + 256, A3_27: BASE + 257, A3_31: BASE + 261,
  A3_32: BASE + 262, A3_33: BASE + 263,
};

export const NAMES = {
  // ── 등급: 유물 ──────────────────────────────────
  [ID.R1_1]: '주스탯', [ID.R1_2]: '체력',

  [ID.R2_1]: '치명', [ID.R2_2]: '특화', [ID.R2_3]: '제압',
  [ID.R2_4]: '신속', [ID.R2_5]: '인내', [ID.R2_6]: '숙련',

  [ID.R3_1]: '공이속', [ID.R3_11]: '치적 + 치피시 피증', [ID.R3_12]: '치피 + 치피시 피증',
  [ID.R3_13]: '피증 + 무력시 피증', [ID.R3_14]: '추피 + 악마대악마 피증', [ID.R3_15]: '피증 + 쿨증',
  [ID.R3_16]: '방감 + 아공강', [ID.R3_17]: '치적 + 아공강', [ID.R3_19]: '치피 + 아공강',
  [ID.R3_20]: '무공 + 공이속', [ID.R3_21]: '무공 + 생50무공', [ID.R3_22]: '무공 + 적중시 무공',
  [ID.R3_23]: '피해 증가', [ID.R3_24]: '추가 피해', [ID.R3_25]: '백 피증',
  [ID.R3_26]: '헤드 피증', [ID.R3_27]: '타대 피증', [ID.R3_31]: '치적',
  [ID.R3_32]: '치피', [ID.R3_33]: '무공',
  
  // ── 등급: 고대 ──────────────────────────────────
  [ID.A1_1]: '주스탯', [ID.A1_2]: '체력',
  [ID.A2_1]: '치명', [ID.A2_2]: '특화', [ID.A2_3]: '제압',
  [ID.A2_4]: '신속', [ID.A2_5]: '인내', [ID.A2_6]: '숙련',

  [ID.A3_1]: '공이속', [ID.A3_11]: '치적 + 치피시 피증', [ID.A3_12]: '치피 + 치피시 피증',
  [ID.A3_13]: '피증 + 무력시 피증', [ID.A3_14]: '추피 + 악마대악마 피증', [ID.A3_15]: '피증 + 쿨증',
  [ID.A3_16]: '방감 + 아공강', [ID.A3_17]: '치적 + 아공강', [ID.A3_19]: '치피 + 아공강',
  [ID.A3_20]: '무공 + 공이속', [ID.A3_21]: '무공 + 생50무공', [ID.A3_22]: '무공 + 적중시 무공',
  [ID.A3_23]: '피해 증가', [ID.A3_24]: '추가 피해', [ID.A3_25]: '백 피증',
  [ID.A3_26]: '헤드 피증', [ID.A3_27]: '타대 피증', [ID.A3_31]: '치적',
  [ID.A3_32]: '치피', [ID.A3_33]: '무공',

} as const;

export const BRACELET_DATA: BaseSimData[] = [
  // ── 주스탯 ──────────────────────────────────
  {
    id: ID.R1_1,
    name: NAMES[ID.R1_1],
    effects: [{
        type: "MAIN_STAT_C",
        grades: { low: [6400, 8320], mid: [8321, 10240], high: [10241, 12800] }
      }]
  },
  {
    id: ID.A1_1,
    name: NAMES[ID.A1_1],
    effects: [{
        type: "MAIN_STAT_C",
        grades: { low: [9600, 11520], mid: [11521, 13440], high: [13441, 16000] }
      }]
  },
  // ── 체력 ──────────────────────────────────
  {
    id: ID.R1_2,
    name: NAMES[ID.R1_2],
    effects: [{
        type: "STAT_HP_C",
        grades: { low: [3000, 3800], mid: [3801, 4400], high: [4401, 5000] }
      }]
  },
  {
    id: ID.A1_2,
    name: NAMES[ID.A1_2],
    effects: [{
        type: "STAT_HP_C",
        grades: { low: [4000, 4800], mid: [4801, 5400], high: [5401, 6000] }
      }]
  },

  // ── 치명 ──────────────────────────────────
  {
    id: ID.R2_1,
    name: NAMES[ID.R2_1],
    effects: [{
        type: "STAT_CRIT",
        grades: { low: [41, 64], mid: [65, 82], high: [83, 100] }
      }]
  },
  {
    id: ID.A2_1,
    name: NAMES[ID.A2_1],
    effects: [{
        type: "STAT_CRIT",
        grades: { low: [61, 84], mid: [85, 102], high: [103, 120] }
      }]
  },
  // ── 특화 ──────────────────────────────────
  {
    id: ID.R2_2,
    name: NAMES[ID.R2_2],
    effects: [{
        type: "STAT_SPEC",
        grades: { low: [41, 64], mid: [65, 82], high: [83, 100] }
      }]
  },
  {
    id: ID.R2_2,
    name: NAMES[ID.R2_2],
    effects: [{
        type: "STAT_SPEC",
        grades: { low: [61, 84], mid: [85, 102], high: [103, 120] }
      }]
  },
  // ── 제압 ──────────────────────────────────
  {
    id: ID.R2_3,
    name: NAMES[ID.R2_3],
    effects: [{
        type: "STAT_DOM",
        grades: { low: [41, 64], mid: [65, 82], high: [83, 100] }
      }]
  },
  {
    id: ID.A2_3,
    name: NAMES[ID.A2_3],
    effects: [{
        type: "STAT_DOM",
        grades: { low: [61, 84], mid: [85, 102], high: [103, 120] }
      }]
  },
  // ── 신속 ──────────────────────────────────
  {
    id: ID.R2_4,
    name: NAMES[ID.R2_4],
    effects: [{
        type: "STAT_SWIFT",
        grades: { low: [41, 64], mid: [65, 82], high: [83, 100] }
      }]
  },
  {
    id: ID.A2_4,
    name: NAMES[ID.A2_4],
    effects: [{
        type: "STAT_SWIFT",
        grades: { low: [61, 84], mid: [85, 102], high: [103, 120] }
      }]
  },
  // ── 인내 ──────────────────────────────────
  {
    id: ID.R2_5,
    name: NAMES[ID.R2_5],
    effects: [{
        type: "STAT_END",
        grades: { low: [41, 64], mid: [65, 82], high: [83, 100] }
      }]
  },
  {
    id: ID.A2_5,
    name: NAMES[ID.A2_5],
    effects: [{
        type: "STAT_END",
        grades: { low: [61, 84], mid: [85, 102], high: [103, 120] }
      }]
  },
  // ── 숙련 ──────────────────────────────────
  {
    id: ID.R2_6,
    name: NAMES[ID.R2_6],
    effects: [{
        type: "STAT_EXP",
        grades: { low: [41, 64], mid: [65, 82], high: [83, 100] }
      }]
  },
  {
    id: ID.A2_6,
    name: NAMES[ID.A2_6],
    effects: [{
        type: "STAT_EXP",
        grades: { low: [61, 84], mid: [85, 102], high: [103, 120] }
      }]
  },

  // ── 공이속 ──────────────────────────────────
  {
    id: ID.R3_1,
    name: NAMES[ID.R3_1],
    effects: [
      {
        type: "SPEED_ATK",
        grades: { low: [0.03, 0.03], mid: [0.04, 0.04], high: [0.05, 0.05] }
      },
      {
        type: "SPEED_MOV",
        grades: { low: [0.03, 0.03], mid: [0.04, 0.04], high: [0.05, 0.05] }
      }
    ]
  },
  {
    id: ID.A3_1,
    name: NAMES[ID.A3_1],
    effects: [
      {
        type: "SPEED_ATK",
        grades: { low: [0.04, 0.04], mid: [0.05, 0.05], high: [0.06, 0.06] }
      },
      {
        type: "SPEED_MOV",
        grades: { low: [0.04, 0.04], mid: [0.05, 0.05], high: [0.06, 0.06] }
      }
    ]
  },
  // ── 치명타 적중률 + 치명타 시 피해 증가 ──────────────────────────────────
  {
    id: ID.R3_11,
    name: NAMES[ID.R3_11],
    effects: [
      {
        type : 'CRIT_CHANCE',
        grades: { low: [0.026, 0.026], mid: [0.034, 0.034], high: [0.042, 0.042] }
      },
      {
        type: 'CRIT_DMG_INC', value: [0.015]
      }
    ]
  },
  {
    id: ID.A3_11,
    name: NAMES[ID.A3_11],
    effects: [
      {
        type : 'CRIT_CHANCE',
        grades: { low: [0.034, 0.034], mid: [0.042, 0.042], high: [0.05, 0.05] }
      },
      {
        type: 'CRIT_DMG_INC', value: [0.015]
      }
    ]
  },
  // ── 치명타 피해 + 치명타 시 피해 증가 ──────────────────────────────────
  {
    id: ID.R3_12,
    name: NAMES[ID.R3_12],
    effects: [
      {
        type : 'CRIT_DMG',
        grades: { low: [0.052, 0.052], mid: [0.068, 0.068], high: [0.084, 0.084] }
      },
      {
        type: 'CRIT_DMG_INC', value: [0.015]
      }
    ]
  },
  {
    id: ID.A3_12,
    name: NAMES[ID.A3_12],
    effects: [
      {
        type : 'CRIT_DMG',
        grades: { low: [0.068, 0.068], mid: [0.084, 0.084], high: [0.1, 0.1] }
      },
      {
        type: 'CRIT_DMG_INC', value: [0.015]
      }
    ]
  },
  // ── 피해 증가 + 무력화시 피해 증가 ──────────────────────────────────
  {
    id: ID.R3_13,
    name: NAMES[ID.R3_13],
    effects: [
      {
        type : 'DMG_INC',
        grades: { low: [0.015, 0.015], mid: [0.020, 0.020], high: [0.025, 0.025] }
      }
    ]
  },
  {
    id: ID.A3_13,
    name: NAMES[ID.A3_13],
    effects: [
      {
        type : 'DMG_INC',
        grades: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] }
      }
    ]
  },
  // ── 추가 피해 + 악마대악마 피해 증가 ──────────────────────────────────
  {
    id: ID.R3_14,
    name: NAMES[ID.R3_14],
    effects: [
      {
        type : 'ADD_DMG',
        grades: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] }
      }
    ]
  },
  {
    id: ID.A3_14,
    name: NAMES[ID.A3_14],
    effects: [
      {
        type : 'ADD_DMG',
        grades: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] }
      }
    ]
  },
  // ── 피해 증가 + 쿨타임 증가 ──────────────────────────────────
  {
    id: ID.R3_15,
    name: NAMES[ID.R3_15],
    effects: [
      {
        type : 'DMG_INC',
        grades: { low: [0.04, 0.04], mid: [0.045, 0.045], high: [0.05, 0.05] }
      },
      {
        type : 'CDR_C', value: [-0.2]
      }
    ]
  },
  {
    id: ID.A3_15,
    name: NAMES[ID.A3_15],
    effects: [
      {
        type : 'DMG_INC',
        grades: { low: [0.045, 0.045], mid: [0.05, 0.05], high: [0.055, 0.055] }
      },
      {
        type : 'CDR_C', value: [-0.2]
      }
    ]
  },
  // ── 방어력 감소 + 아군 공격력 강화 ──────────────────────────────────
  {
    id: ID.R3_16,
    name: NAMES[ID.R3_16],
    effects: [
      {
        type : 'DEF_PENETRATION',
        grades: { low: [0.015, 0.015], mid: [0.018, 0.018], high: [0.021, 0.021] }
      }
    ]
  },
  {
    id: ID.A3_16,
    name: NAMES[ID.A3_16],
    effects: [
      {
        type : 'DEF_PENETRATION',
        grades: { low: [0.018, 0.018], mid: [0.021, 0.021], high: [0.025, 0.025] }
      }
    ]
  },
  // ── 치명타 저항 + 아군 공격력 강화 ──────────────────────────────────
  {
    id: ID.R3_17,
    name: NAMES[ID.R3_17],
    effects: [
      {
        type : 'DEF_PENETRATION',
        grades: { low: [0.015, 0.015], mid: [0.018, 0.018], high: [0.021, 0.021] }
      }
    ]
  },
  {
    id: ID.A3_17,
    name: NAMES[ID.A3_17],
    effects: [
      {
        type : 'DEF_PENETRATION',
        grades: { low: [0.018, 0.018], mid: [0.021, 0.021], high: [0.025, 0.025] }
      }
    ]
  },
  // ── 치명타 피해 저항 + 아군 공격력 강화 ──────────────────────────────────
  {
    id: ID.R3_19,
    name: NAMES[ID.R3_19],
    effects: [
      {
        type : 'CRIT_DMG',
        grades: { low: [0.03, 0.03], mid: [0.036, 0.036], high: [0.042, 0.042] }
      }
    ]
  },
  {
    id: ID.A3_19,
    name: NAMES[ID.A3_19],
    effects: [
      {
        type : 'CRIT_DMG',
        grades: { low: [0.036, 0.036], mid: [0.042, 0.042], high: [0.048, 0.048] }
      }
    ]
  },
  // ── 무기 공격력 증가 + 공이속 증가 ──────────────────────────────────
  {
    id: ID.R3_20,
    name: NAMES[ID.R3_20],
    effects: [
      {
        type : 'WEAPON_ATK_C',
        grades: { low: [6000, 6000], mid: [6960, 6960], high: [7920, 7920] }
      },
      {
        type : 'SPEED_ATK', value: [0.06]
      },
      {
        type : 'SPEED_MOV', value: [0.06]
      }
    ]
  },
  {
    id: ID.A3_20,
    name: NAMES[ID.A3_20],
    effects: [
      {
        type : 'WEAPON_ATK_C',
        grades: { low: [6960, 6960], mid: [7920, 7920], high: [8880, 8880] }
      },
      {
        type : 'SPEED_ATK', value: [0.06]
      },
      {
        type : 'SPEED_MOV', value: [0.06]
      }
    ]
  },
  // ── 무기 공격력 증가 + 생명력 50퍼 이상 무기 공격력 증가 ──────────────────────────────────
  {
    id: ID.R3_21,
    name: NAMES[ID.R3_21],
    effects: [
      {
        type : 'WEAPON_ATK_C',
        grades: { low: [8100, 8100], mid: [9200, 9200], high: [10300, 10300] }
      }
    ]
  },
  {
    id: ID.A3_21,
    name: NAMES[ID.A3_21],
    effects: [
      {
        type : 'WEAPON_ATK_C',
        grades: { low: [9200, 9200], mid: [10300, 10300], high: [11400, 11400] }
      }
    ]
  },
  // ── 무기 공격력 증가 + 적중시 무기 공격력 증가 ──────────────────────────────────
  {
    id: ID.R3_22,
    name: NAMES[ID.R3_22],
    effects: [
      {
        type : 'WEAPON_ATK_C',
        grades: { low: [9600, 9600], mid: [10800, 10800], high: [12000, 12000] }
      }
    ]
  },
  {
    id: ID.A3_22,
    name: NAMES[ID.A3_22],
    effects: [
      {
        type : 'WEAPON_ATK_C',
        grades: { low: [10800, 10800], mid: [12000, 12000], high: [13200, 13200] }
      }
    ]
  },
  // ── 피해 증가 ──────────────────────────────────
  {
    id: ID.R3_23,
    name: NAMES[ID.R3_23],
    effects: [
      {
        type : 'DMG_INC',
        grades: { low: [0.015, 0.015], mid: [0.02, 0.02], high: [0.025, 0.025] }
      }
    ]
  },
  {
    id: ID.A3_23,
    name: NAMES[ID.A3_23],
    effects: [
      {
        type : 'DMG_INC',
        grades: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] }
      }
    ]
  },
  // ── 추가 피해 ──────────────────────────────────
  {
    id: ID.R3_24,
    name: NAMES[ID.R3_24],
    effects: [
      {
        type : 'ADD_DMG',
        grades: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] }
      }
    ]
  },
  {
    id: ID.A3_24,
    name: NAMES[ID.A3_24],
    effects: [
      {
        type : 'ADD_DMG',
        grades: { low: [0.03, 0.03], mid: [0.035, 0.035], high: [0.04, 0.04] }
      }
    ]
  },
  // ── 백어택 시 피해 증가 ──────────────────────────────────
  {
    id: ID.R3_25,
    name: NAMES[ID.R3_25],
    effects: [
      {
        type : 'DMG_INC',
        grades: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] },
        target: { attackType: ['BACK_ATK'] }
      }
    ]
  },
  {
    id: ID.A3_25,
    name: NAMES[ID.A3_25],
    effects: [
      {
        type : 'DMG_INC',
        grades: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] },
        target: { attackType: ['BACK_ATK'] }
      }
    ]
  },
  // ── 헤드어택 시 피해 증가 ──────────────────────────────────
  {
    id: ID.R3_26,
    name: NAMES[ID.R3_26],
    effects: [
      {
        type : 'DMG_INC',
        grades: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] },
        target: { attackType: ['HEAD_ATK'] }
      }
    ]
  },
  {
    id: ID.A3_26,
    name: NAMES[ID.A3_26],
    effects: [
      {
        type : 'DMG_INC',
        grades: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] },
        target: { attackType: ['HEAD_ATK'] }
      }
    ]
  },
  // ── 비방향성 시  피해 증가 ──────────────────────────────────
  {
    id: ID.R3_27,
    name: NAMES[ID.R3_27],
    effects: [
      {
        type : 'DMG_INC',
        grades: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] },
        target: { attackType: ['NON_DIRECTIONAL'] }
      }
    ]
  },
  {
    id: ID.A3_27,
    name: NAMES[ID.A3_27],
    effects: [
      {
        type : 'DMG_INC',
        grades: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] },
        target: { attackType: ['NON_DIRECTIONAL'] }
      }
    ]
  },
  // ── 치명타 적중률 ──────────────────────────────────
  {
    id: ID.R3_31,
    name: NAMES[ID.R3_31],
    effects: [
      {
        type : 'CRIT_CHANCE',
        grades: { low: [0.026, 0.026], mid: [0.034, 0.034], high: [0.042, 0.042] },
      }
    ]
  },
  {
    id: ID.A3_31,
    name: NAMES[ID.A3_31],
    effects: [
      {
        type : 'CRIT_CHANCE',
        grades: { low: [0.034, 0.034], mid: [0.042, 0.42], high: [0.05, 0.05] },
      }
    ]
  },
  // ── 치명타 피해 ──────────────────────────────────
  {
    id: ID.R3_32,
    name: NAMES[ID.R3_32],
    effects: [
      {
        type : 'CRIT_DMG',
        grades: { low: [0.052, 0.052], mid: [0.068, 0.068], high: [0.084, 0.084] },
      }
    ]
  },
  {
    id: ID.A3_32,
    name: NAMES[ID.A3_32],
    effects: [
      {
        type : 'CRIT_DMG',
        grades: { low: [0.068, 0.068], mid: [0.084, 0.084], high: [0.1, 0.1] },
      }
    ]
  },
  // ── 무기 공격력 ──────────────────────────────────
  {
    id: ID.R3_33,
    name: NAMES[ID.R3_33],
    effects: [
      {
        type : 'WEAPON_ATK_C',
        grades: { low: [6300, 6300], mid: [7200, 7200], high: [8100, 8100] },
      }
    ]
  },
  {
    id: ID.A3_33,
    name: NAMES[ID.A3_33],
    effects: [
      {
        type : 'WEAPON_ATK_C',
        grades: { low: [7200, 7200], mid: [8100, 8100], high: [9000, 9000] },
      }
    ]
  },
];
