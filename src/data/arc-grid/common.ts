// @/data/arc-grid/guardain-knight.ts

import { ArkGridCoreData, GET_GRID_ICON } from '@/types/ark-grid';
import { ID_AA, ID_BB } from '@/constants/id-config';

// 공통 Base ID (80 10 0 0 00)
const BASE = (ID_AA.ARK_GRID * 1000000) + (ID_BB.COMMON * 10000);

// BB: 직업(질서 코어), 공통(혼돈 코어)
// C: 1(해, SN), 2(달, MN), 3(별, ST)
// D: 없음
// EE: 인게임 순서
export const ID = {
  // [🌞 해 코어]
  SN_01: BASE + 1001, SN_02: BASE + 1002, SN_03: BASE + 1003,
  SN_04: BASE + 1004, SN_05: BASE + 1005, SN_06: BASE + 1006,

  // [🌙 달 코어]
  MN_01: BASE + 2001, MN_02: BASE + 2002, MN_03: BASE + 2003,
  MN_04: BASE + 2004, MN_05: BASE + 2005, MN_06: BASE + 2006,

  // [⭐ 별 코어]
  ST_01: BASE + 3001, ST_02: BASE + 3002, ST_03: BASE + 3003,
  ST_04: BASE + 3004, ST_05: BASE + 3005, ST_06: BASE + 3006,
};

export const NAMES = {
  // [🌞 해 코어]
  [ID.SN_01]: '혼돈 해 [1]현란한 공격', [ID.SN_02]: '혼돈 해 [2]안정적인 공격', [ID.SN_03]: '혼돈 해 [3]재빠른 공격',
  [ID.SN_04]: '혼돈 해 [4]신념의 강화', [ID.SN_05]: '혼돈 해 [5]흐르는 마나', [ID.SN_06]: '혼돈 해 [6]불굴의 강화',

  // [🌙 달 코어]
  [ID.MN_01]: '혼돈 달 [1]불타는 일격', [ID.MN_02]: '혼돈 달 [2]흡수의 일격', [ID.MN_03]: '혼돈 달 [3]부수는 일격',
  [ID.MN_04]: '혼돈 달 [4]낙인의 흔적', [ID.MN_05]: '혼돈 달 [5]강철의 흔적', [ID.MN_06]: '혼돈 달 [6]치명적인 흔적',

  // [⭐ 별 코어]
  [ID.ST_01]: '혼돈 별 [1]공격', [ID.ST_02]: '혼돈 별 [2]무기', [ID.ST_03]: '혼돈 별 [3]구원',
  [ID.ST_04]: '혼돈 별 [4]생명', [ID.ST_05]: '혼돈 별 [5]속도', [ID.ST_06]: '혼돈 별 [6]방어',
} as const;

export const LABELS = {
  // [🌞 해 코어]
  [ID.SN_01]: '혼돈의 해 코어 : 현란한 공격', [ID.SN_02]: '혼돈의 해 코어 : 안정적인 공격', [ID.SN_03]: '혼돈의 해 코어 : 재빠른 공격',
  [ID.SN_04]: '혼돈의 해 코어 : 신념의 강화', [ID.SN_05]: '혼돈의 해 코어 : 흐르는 마나', [ID.SN_06]: '혼돈의 해 코어 : 불굴의 강화',

  // [🌙 달 코어]
  [ID.MN_01]: '혼돈의 달 코어 : 불타는 일격', [ID.MN_02]: '혼돈의 달 코어 : 흡수의 일격', [ID.MN_03]: '혼돈의 달 코어 : 부수는 일격',
  [ID.MN_04]: '혼돈의 달 코어 : 낙인의 흔적', [ID.MN_05]: '혼돈의 달 코어 : 강철의 흔적', [ID.MN_06]: '혼돈의 달 코어 : 치명적인 흔적',

  // [⭐ 별 코어]
  [ID.ST_01]: '혼돈의 별 코어 : 공격', [ID.ST_02]: '혼돈의 별 코어 : 무기', [ID.ST_03]: '혼돈의 별 코어 : 구원',
  [ID.ST_04]: '혼돈의 별 코어 : 생명', [ID.ST_05]: '혼돈의 별 코어 : 속도', [ID.ST_06]: '혼돈의 별 코어 : 방어',
} as const;



export const ARKGRID_COMMON_DATA: ArkGridCoreData[] = [
  // ── [🌞 혼돈의 해 코어] ──────────────────────────────────
  { // <해1> 현란한 공격
    id: ID.SN_01, label: LABELS[ID.SN_01], name: NAMES[ID.SN_01], iconPath: GET_GRID_ICON('C_SN'),
    thresholds: [
      { point: 10, effects: [{ type: 'CRIT_DMG_INC', value: [0.0055] }] },
      { point: 14, effects: [{ type: 'DMG_INC', value: [0.005] }] },
      { point: 17, effects: [
          { type: 'DMG_INC', multiValues: { RELIC:[0.01], ANCIENT:[0.015] } },
          { type: 'CRIT_DMG_INC', multiValues: { RELIC:[0.0055], ANCIENT:[0.011] } }
      ]},
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
    ]
  },
  { // <해2> 안정적인 공격
    id: ID.SN_02, label: LABELS[ID.SN_02], name: NAMES[ID.SN_02], iconPath: GET_GRID_ICON('C_SN'),
    thresholds: [
      { point: 10 }, // 받는 피해가 0.5% 감소한다.
      { point: 14, effects: [{ type: 'ADD_DMG', value: [0.007] }] },
      { point: 17, effects: [{ type: 'ADD_DMG', multiValues: { RELIC: [0.014], ANCIENT: [0.028] } }] },
      { point: 18, effects: [{ type: 'ADD_DMG', value: [0.0023] }] },
      { point: 19, effects: [{ type: 'ADD_DMG', value: [0.0023] }] },
      { point: 20, effects: [{ type: 'ADD_DMG', value: [0.0023] }] }
    ]
  },
  { // <해3> 재빠른 공격
    id: ID.SN_03, label: LABELS[ID.SN_03], name: NAMES[ID.SN_03], iconPath: GET_GRID_ICON('C_SN'),
    thresholds: [
      { point: 10, effects: [{ type: 'SPEED_ATK', value: [0.01] }] },
      { point: 14, effects: [{ type: 'CRIT_DMG', value: [0.014] }] },
      { point: 17, effects: [
          { type: 'SPEED_ATK', multiValues: { RELIC: [0.02], ANCIENT: [0.03] } },
          { type: 'CRIT_DMG', multiValues: { RELIC: [0.028], ANCIENT: [0.056] } }
      ]},
      { point: 18, effects: [{ type: 'CRIT_DMG', value: [0.0045] }] },
      { point: 19, effects: [{ type: 'CRIT_DMG', value: [0.0045] }] },
      { point: 20, effects: [{ type: 'CRIT_DMG', value: [0.0045] }] }
    ]
  },
  { // <해4> 신념의 강화
    id: ID.SN_04, label: LABELS[ID.SN_04], name: NAMES[ID.SN_04], iconPath: GET_GRID_ICON('C_SN'),
    thresholds: [
      { point: 10 },
      { point: 14 },
      { point: 17 },
      { point: 18 },
      { point: 19 },
      { point: 20 }
    ]
  },
  { // <해5> 흐르는 마나
    id: ID.SN_05, label: LABELS[ID.SN_05], name: NAMES[ID.SN_05], iconPath: GET_GRID_ICON('C_SN'),
    thresholds: [
      { point: 10 },
      { point: 14, effects: [{ type: 'CDR_P', value: [0.004] }] },
      { point: 17, effects: [{ type: 'CDR_P', multiValues: { RELIC: [0.008], ANCIENT: [0.016] } }] },
      { point: 18, effects: [{ type: 'CDR_P', value: [0.0013] }] },
      { point: 19, effects: [{ type: 'CDR_P', value: [0.0013] }] },
      { point: 20, effects: [{ type: 'CDR_P', value: [0.0013] }] }
    ]
  },
  { // <해6> 불굴의 강화
    id: ID.SN_06, label: LABELS[ID.SN_06], name: NAMES[ID.SN_06], iconPath: GET_GRID_ICON('C_SN'),
    thresholds: [
      { point: 10 },
      { point: 14 },
      { point: 17 },
      { point: 18 },
      { point: 19 },
      { point: 20 }
    ]
  },

  // ── [🌙 혼돈의 달 코어] ──────────────────────────────────
  { // <달1> 불타는 일격
    id: ID.MN_01, label: LABELS[ID.MN_01], name: NAMES[ID.MN_01], iconPath: GET_GRID_ICON('C_MN'),
    thresholds: [
      { point: 10}, //todo: 화상 도트 대미지 유틸
      { point: 14, effects: [{ type: 'DMG_INC', value: [0.005] }] },
      { point: 17, effects: [{ type: 'DMG_INC', multiValues: { RELIC: [0.01], ANCIENT: [0.02] } }] },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
    ]
  },
  { // <달2> 흡수의 일격
    id: ID.MN_02, label: LABELS[ID.MN_02], name: NAMES[ID.MN_02], iconPath: GET_GRID_ICON('C_MN'),
    thresholds: [
      { point: 10 }, // 생명력 회복 유틸
      { point: 14, effects: [{ type: 'DMG_INC', value: [0.005] }] },
      { point: 17, effects: [{ type: 'DMG_INC', multiValues: { RELIC: [0.01], ANCIENT: [0.02] } }] },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
    ]
  },
  { // <달3> 부수는 일격
    id: ID.MN_03, label: LABELS[ID.MN_03], name: NAMES[ID.MN_03], iconPath: GET_GRID_ICON('C_MN'),
    thresholds: [
      { point: 10 }, // 부위 파괴 유틸
      { point: 14, effects: [{ type: 'CRIT_CHANCE', value: [0.0065] }] },
      { point: 17, effects: [{ type: 'CRIT_CHANCE', multiValues: { RELIC: [0.013], ANCIENT: [0.026] } }] },
      { point: 18, effects: [{ type: 'CRIT_CHANCE', value: [0.0021] }] },
      { point: 19, effects: [{ type: 'CRIT_CHANCE', value: [0.0021] }] },
      { point: 20, effects: [{ type: 'CRIT_CHANCE', value: [0.0021] }] }
    ]
  },
  { // <달4> 낙인의 흔적
    id: ID.MN_04, label: LABELS[ID.MN_04], name: NAMES[ID.MN_04], iconPath: GET_GRID_ICON('C_MN'),
    thresholds: [
      { point: 10 },
      { point: 14 },
      { point: 17 },
      { point: 18 },
      { point: 19 },
      { point: 20 }
    ]
  },
  { // <달5> 강철의 흔적, todo: 방어력 감소 10p 17p 합인지 곱인지 검토
    id: ID.MN_05, label: LABELS[ID.MN_05], name: NAMES[ID.MN_05], iconPath: GET_GRID_ICON('C_MN'),
    thresholds: [
      { point: 10, effects:[{ type: 'DEF_PENETRATION', value: [0.002] }] },
      { point: 14 },
      { point: 17, effects: [{ type: 'DEF_PENETRATION', multiValues: { RELIC: [0.004], ANCIENT: [0.008] } }] },
      { point: 18 },
      { point: 19 },
      { point: 20 }
    ]
  },
  { // <달6> 치명적인 흔적
    id: ID.MN_06, label: LABELS[ID.MN_06], name: NAMES[ID.MN_06], iconPath: GET_GRID_ICON('C_MN'),
    thresholds: [
      { point: 10, effects: [{ type: 'CRIT_DMG', value: [0.003] }] },
      { point: 14, },
      { point: 17, effects: [{ type: 'CRIT_DMG', multiValues: { RELIC: [0.006], ANCIENT: [0.012] } }] },
      { point: 18 },
      { point: 19 },
      { point: 20 }
    ]
  },

  // ── [⭐ 혼돈의 별 코어] ──────────────────────────────────
  { // <별1> 공격
    id: ID.ST_01, label: LABELS[ID.ST_01], name: NAMES[ID.ST_01], iconPath: GET_GRID_ICON('C_ST'),
    thresholds: [
      { point: 10, effects: [{ type: 'ATK_C', value: [900] }] },
      { point: 14, effects: [{ type: 'ATK_P', value: [0.0055] }] },
      { point: 17, effects: [
          { type: 'ATK_P', multiValues: { RELIC: [0.011], ANCIENT: [0.0165] } },
          { type: 'ATK_C', multiValues: { RELIC: [1800], ANCIENT: [2700] } }
      ]},
      { point: 18, effects: [{ type: 'ATK_P', value: [0.0016] }] },
      { point: 19, effects: [{ type: 'ATK_P', value: [0.0016] }] },
      { point: 20, effects: [{ type: 'ATK_P', value: [0.0016] }] }
    ]
  },
  { // <별2> 무기
    id: ID.ST_02, label: LABELS[ID.ST_02], name: NAMES[ID.ST_02], iconPath: GET_GRID_ICON('C_ST'),
    thresholds: [
      { point: 10, effects: [{ type: 'WEAPON_ATK_C', value: [1300] }] },
      { point: 14, effects: [{ type: 'WEAPON_ATK_P', value: [0.0075] }] },
      { point: 17, effects: [
          { type: 'WEAPON_ATK_P', multiValues: { RELIC: [0.015], ANCIENT: [0.0225] } },
          { type: 'WEAPON_ATK_C', multiValues: { RELIC: [2600], ANCIENT: [3900] } }
      ]},
      { point: 18, effects: [{ type: 'WEAPON_ATK_P', value: [0.0023] }] },
      { point: 19, effects: [{ type: 'WEAPON_ATK_P', value: [0.0023] }] },
      { point: 20, effects: [{ type: 'WEAPON_ATK_P', value: [0.0023] }] }
    ]
  },
  { // <별3> 구원
    id: ID.ST_03, label: LABELS[ID.ST_03], name: NAMES[ID.ST_03], iconPath: GET_GRID_ICON('C_ST'),
    thresholds: [
      { point: 10 },
      { point: 14 },
      { point: 17 },
      { point: 18 },
      { point: 19 },
      { point: 20 }
    ]
  },
  { // <별4> 생명
    id: ID.ST_04, label: LABELS[ID.ST_04], name: NAMES[ID.ST_04], iconPath: GET_GRID_ICON('C_ST'),
    thresholds: [
      { point: 10 },
      { point: 14 },
      { point: 17 },
      { point: 18 },
      { point: 19 },
      { point: 20 }
    ]
  },
  { // <별5> 속도
    id: ID.ST_05, label: LABELS[ID.ST_05], name: NAMES[ID.ST_05], iconPath: GET_GRID_ICON('C_ST'),
    thresholds: [
      { point: 10, effects: [{ type: 'SPEED_ATK', value: [0.009] }] },
      { point: 14, effects: [{ type: 'SPEED_MOV', value: [0.009] }] },
      { point: 17, effects: [
          { type: 'SPEED_ATK', multiValues: { RELIC: [0.018], ANCIENT: [0.027] } },
          { type: 'SPEED_MOV', multiValues: { RELIC: [0.018], ANCIENT: [0.027] } }
      ]},
      { point: 18, effects: [{ type: 'SPEED_ATK', value: [0.003] }, { type: 'SPEED_MOV', value: [0.003] }] },
      { point: 19, effects: [{ type: 'SPEED_ATK', value: [0.003] }, { type: 'SPEED_MOV', value: [0.003] }] },
      { point: 20, effects: [{ type: 'SPEED_ATK', value: [0.003] }, { type: 'SPEED_MOV', value: [0.003] }] }
    ]
  },
  { // <별6> 방어
    id: ID.ST_06, label: LABELS[ID.ST_06], name: NAMES[ID.ST_06], iconPath: GET_GRID_ICON('C_ST'),
    thresholds: [
      { point: 10 },
      { point: 14 },
      { point: 17 },
      { point: 18 },
      { point: 19 },
      { point: 20 }
    ]
  }
];