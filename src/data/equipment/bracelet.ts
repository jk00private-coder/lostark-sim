// @/data/equipment/bracelet.ts

import { BraceletRawData, BraceletData } from '@/types/equipment-types';
import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';

// 공통 Base ID (10 10 4 0 00)
const BASE = (ID_AA.EQUIPMENT * 1000000) + (ID_BB.COMMON * 10000) + (ID_C.EQ_BRACELET * 1000);

// D: 1(4티어, F)
// EE: 01~09(기본 효과, F1), 11~19(전투 특성, F2), 21~(특수 효과, F3)
export const ID = {
  // ── 등급: 유물 ──────────────────────────────────
  F1_1: BASE + 101, F1_2: BASE + 102,
    
  F2_1: BASE + 111, F2_2: BASE + 112, F2_3: BASE + 113,
  F2_4: BASE + 114, F2_5: BASE + 115, F2_6: BASE + 116,

  F3_1 : BASE + 121, F3_11: BASE + 131, F3_12: BASE + 132,
  F3_13: BASE + 133, F3_14: BASE + 134, F3_15: BASE + 135,
  F3_16: BASE + 136, F3_17: BASE + 137, F3_19: BASE + 139,
  F3_20: BASE + 140, F3_21: BASE + 141, F3_22: BASE + 142,
  F3_23: BASE + 143, F3_24: BASE + 144, F3_25: BASE + 145,
  F3_26: BASE + 146, F3_27: BASE + 147, F3_31: BASE + 151,
  F3_32: BASE + 152, F3_33: BASE + 153,
};

export const NAMES = {
  // ── 기본 효과 & 전투 특성 ──────────────────
  [ID.F1_1]: '주스탯 +{v1}', [ID.F1_2]: '체력 +{v1}',
  [ID.F2_1]: '치명 +{v1}', [ID.F2_2]: '특화 +{v1}', [ID.F2_3]: '제압 +{v1}',
  [ID.F2_4]: '신속 +{v1}', [ID.F2_5]: '인내 +{v1}', [ID.F2_6]: '숙련 +{v1}',
  // ── 특수 효과 (복합 및 서술형 요약) ──────────────────
  [ID.F3_1]:  '공이속 +{v1}%',
  [ID.F3_11]: '치적 +{v1}% & 치명타시 피증 +{v2}%', [ID.F3_12]: '치피 +{v1}% & 치명타시 피증 +{v2}%',
  [ID.F3_13]: '피증 +{v1}% & 무력화시 피증 +{v2}%', [ID.F3_14]: '추피 +{v1}% & (대)악추피 +{v2}%',
  [ID.F3_15]: '피증 +{v1}% & 쿨증 +{v2}%', [ID.F3_16]: '방감 -{v1}% & 아공강 +{v2}%',
  [ID.F3_17]: '치명타 저항 -{v1}% & 아공강 +{v2}%', [ID.F3_19]: '치피 저항 -{v1}% & 아공강 +{v2}%',
  [ID.F3_20]: '무공 +{v1} & 공이속 +{v2}% (풀 스택 기준)', [ID.F3_21]: '무공 +{v1} & (생50%↑)무공 +{v2}',
  [ID.F3_22]: '무공 +{v1} & (적중시)무공 +{v2} (풀 스택 기준)',
  // 단일 계열
  [ID.F3_23]: '피해 증가 +{v1}%', [ID.F3_24]: '추가 피해 +{v1}%', [ID.F3_25]: '백 피증 +{v1}%',
  [ID.F3_26]: '헤드 피증 +{v1}%', [ID.F3_27]: '타대 피증 +{v1}%', [ID.F3_31]: '치적 +{v1}%',
  [ID.F3_32]: '치피 +{v1}%', [ID.F3_33]: '무공 +{v1}',
} as const;

export const LABELS = {
  [ID.F1_1]: '주스탯', [ID.F1_2]: '체력',
  [ID.F2_1]: '치명', [ID.F2_2]: '특화', [ID.F2_3]: '제압',
  [ID.F2_4]: '신속', [ID.F2_5]: '인내', [ID.F2_6]: '숙련',

  // 서술형 매칭 (문장 앞부분 혹은 핵심 키워드)
  [ID.F3_1]:  '공격 및 이동 속도',
  [ID.F3_11]: '치명타 적중률이', [ID.F3_12]: '치명타 피해가',
  [ID.F3_13]: '무력화 상태의 적에게 주는 피해가', [ID.F3_14]: '악마 및 대악마 계열 피해량이', 
  [ID.F3_15]: '스킬의 재사용 대기 시간이', [ID.F3_16]: '대상의 방어력을',
  [ID.F3_17]: '대상의 치명타 저항을', [ID.F3_19]: '대상의 치명타 피해 저항을',
  [ID.F3_20]: '공격 적중 시 매 초마다', [ID.F3_21]: '자신의 생명력이 50% 이상일 경우',
  [ID.F3_22]: '공격 적중 시 30초 마다',
  // 단일 계열
  [ID.F3_23]: '적에게 주는', [ID.F3_24]: '추가 피해', [ID.F3_25]: '백어택 스킬이 적에게 주는 피해가',
  [ID.F3_26]: '헤드어택 스킬이 적에게 주는 피해가', [ID.F3_27]: '방향성 공격이 아닌 스킬이 적에게 주는 피해가', [ID.F3_31]: '치명타 적중률',
  [ID.F3_32]: '치명타 피해', [ID.F3_33]: '무기 공격력',
} as const;

const ID_TIER_MAP: Record<number, BraceletData['tier']> = {
  1: 4, 2: 5,
};

export const decodeBraceletId = (id: number): Pick<BraceletData, 'category' | 'tier'> => {
  const last3 = id % 1000;
  const tierCode = Math.floor(last3 / 100); 
  const offset = last3 % 100;

  const tier = ID_TIER_MAP[tierCode];

  let category: BraceletData['category'];
  if (offset >= 21) category = 'POLISH';
  else if (offset >= 11) category = 'COMBAT';
  else category = 'BASE';

  return {
    category,
    tier,
  };
};

export const BRACELET_DATA: BraceletRawData[] = [
  // ── 주스탯 (Main Stat) ──────────────────────────────────
  {
    id: ID.F1_1,
    label: LABELS[ID.F1_1],
    name: NAMES[ID.F1_1],
    effects: [
      {
        type: "MAIN_STAT_C",
        multiGrades: {
          RELIC: { low: [6400, 8320], mid: [8321, 10240], high: [10241, 12800] },
          ANCIENT: { low: [9600, 11520], mid: [11521, 13440], high: [13441, 16000] }
        }
      }
    ]
  },
  // ── 체력 (HP) ──────────────────────────────────
  {
    id: ID.F1_2,
    label: LABELS[ID.F1_2],
    name: NAMES[ID.F1_2],
    effects: [
      {
        type: "STAT_HP_C",
        multiGrades: {
          RELIC: { low: [3000, 3800], mid: [3801, 4400], high: [4401, 5000] },
          ANCIENT: { low: [4000, 4800], mid: [4801, 5400], high: [5401, 6000] }
        }
      }
    ]
  },

  // ── 치명 (Critical) ──────────────────────────────────
  {
    id: ID.F2_1,
    label: LABELS[ID.F2_1],
    name: NAMES[ID.F2_1],
    effects: [
      {
        type: "STAT_CRIT",
        multiGrades: {
          RELIC: { low: [41, 64], mid: [65, 82], high: [83, 100] },
          ANCIENT: { low: [61, 84], mid: [85, 102], high: [103, 120] }
        }
      }
    ]
  },
  // ── 특화 (Specialization) ──────────────────────────────────
  {
    id: ID.F2_2,
    label: LABELS[ID.F2_2],
    name: NAMES[ID.F2_2],
    effects: [
      {
        type: "STAT_SPEC",
        multiGrades: {
          RELIC: { low: [41, 64], mid: [65, 82], high: [83, 100] },
          ANCIENT: { low: [61, 84], mid: [85, 102], high: [103, 120] }
        }
      }
    ]
  },
  // ── 제압 (Domination) ──────────────────────────────────
  {
    id: ID.F2_3,
    label: LABELS[ID.F2_3],
    name: NAMES[ID.F2_3],
    effects: [
      {
        type: "STAT_DOM",
        multiGrades: {
          RELIC: { low: [41, 64], mid: [65, 82], high: [83, 100] },
          ANCIENT: { low: [61, 84], mid: [85, 102], high: [103, 120] }
        }
      }
    ]
  },
  // ── 신속 (Swiftness) ──────────────────────────────────
  {
    id: ID.F2_4,
    label: LABELS[ID.F2_4],
    name: NAMES[ID.F2_4],
    effects: [
      {
        type: "STAT_SWIFT",
        multiGrades: {
          RELIC: { low: [41, 64], mid: [65, 82], high: [83, 100] },
          ANCIENT: { low: [61, 84], mid: [85, 102], high: [103, 120] }
        }
      }
    ]
  },
  // ── 인내 (Endurance) ──────────────────────────────────
  {
    id: ID.F2_5,
    label: LABELS[ID.F2_5],
    name: NAMES[ID.F2_5],
    effects: [
      {
        type: "STAT_END",
        multiGrades: {
          RELIC: { low: [41, 64], mid: [65, 82], high: [83, 100] },
          ANCIENT: { low: [61, 84], mid: [85, 102], high: [103, 120] }
        }
      }
    ]
  },
  // ── 숙련 (Expertise) ──────────────────────────────────
  {
    id: ID.F2_6,
    label: LABELS[ID.F2_6],
    name: NAMES[ID.F2_6],
    effects: [
      {
        type: "STAT_EXP",
        multiGrades: {
          RELIC: { low: [41, 64], mid: [65, 82], high: [83, 100] },
          ANCIENT: { low: [61, 84], mid: [85, 102], high: [103, 120] }
        }
      }
    ]
  },

  // ── 공이속 ──────────────────────────────────
  {
    id: ID.F3_1,
    label: LABELS[ID.F3_1],
    name: NAMES[ID.F3_1],
    effects: [
      {
        type: "SPEED_ATK",
        multiGrades: {
          RELIC: { low: [0.03, 0.03], mid: [0.04, 0.04], high: [0.05, 0.05] },
          ANCIENT: { low: [0.04, 0.04], mid: [0.05, 0.05], high: [0.06, 0.06] }
        }
      },
      {
        type: "SPEED_MOV",
        multiGrades: {
          RELIC: { low: [0.03, 0.03], mid: [0.04, 0.04], high: [0.05, 0.05] },
          ANCIENT: { low: [0.04, 0.04], mid: [0.05, 0.05], high: [0.06, 0.06] }
        }
      }
    ]
  },
  // ── 치명타 적중률 + 치명타 시 피해 증가 ────────────────────────
  {
    id: ID.F3_11,
    label: LABELS[ID.F3_11],
    name: NAMES[ID.F3_11],
    effects: [
      {
        type: 'CRIT_CHANCE',
        multiGrades: {
          RELIC: { low: [0.026, 0.026], mid: [0.034, 0.034], high: [0.042, 0.042] },
          ANCIENT: { low: [0.034, 0.034], mid: [0.042, 0.042], high: [0.05, 0.05] }
        }
      },
      {
        type: 'CRIT_DMG_INC',
        value: [0.015]
      }
    ]
  },
  // ── 치명타 피해 + 치명타 시 피해 증가 ──────────────────────────
  {
    id: ID.F3_12,
    label: LABELS[ID.F3_12],
    name: NAMES[ID.F3_12],
    effects: [
      {
        type: 'CRIT_DMG',
        multiGrades: {
          RELIC: { low: [0.052, 0.052], mid: [0.068, 0.068], high: [0.084, 0.084] },
          ANCIENT: { low: [0.068, 0.068], mid: [0.084, 0.084], high: [0.1, 0.1] }
        }
      },
      {
        type: 'CRIT_DMG_INC',
        value: [0.015]
      }
    ]
  },
  // ── 피해 증가 + 무력화시 피해 증가 ────────────────────────────
  {
    id: ID.F3_13,
    label: LABELS[ID.F3_13],
    name: NAMES[ID.F3_13],
    effects: [
      {
        type: 'DMG_INC',
        multiGrades: {
          RELIC: { low: [0.015, 0.015], mid: [0.02, 0.02], high: [0.025, 0.025] },
          ANCIENT: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] }
        }
      }
    ]
  },
  // ── 추가 피해 + 악마대악마 피해 증가 ──────────────────────────────────
  {
    id: ID.F3_14,
    label: LABELS[ID.F3_14],
    name: NAMES[ID.F3_14],
    effects: [
      {
        type: 'ADD_DMG',
        multiGrades: {
          RELIC: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] },
          ANCIENT: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] }
        }
      },
      {
        type: 'DMG_INC',
        value: [0.025]
      }
    ]
  },
  // ── 피해 증가 + 쿨타임 증가 ──────────────────────────────────
  {
    id: ID.F3_15,
    label: LABELS[ID.F3_15],
    name: NAMES[ID.F3_15],
    effects: [
      {
        type: 'DMG_INC',
        multiGrades: {
          RELIC: { low: [0.04, 0.04], mid: [0.045, 0.045], high: [0.05, 0.05] },
          ANCIENT: { low: [0.045, 0.045], mid: [0.05, 0.05], high: [0.055, 0.055] }
        }
      },
      {
        type: 'CDR_C',
        value: [-0.2]
      }
    ]
  },
  // ── 방어력 감소 + 아군 공격력 강화 ──────────────────────────────────
  {
    id: ID.F3_16,
    label: LABELS[ID.F3_16],
    name: NAMES[ID.F3_16],
    effects: [
      {
        type: 'DEF_PENETRATION',
        multiGrades: {
          RELIC: { low: [0.015, 0.015], mid: [0.018, 0.018], high: [0.021, 0.021] },
          ANCIENT: { low: [0.018, 0.018], mid: [0.021, 0.021], high: [0.025, 0.025] }
        }
      }
    ]
  },
  // ── 치명타 저항 + 아군 공격력 강화 ──────────────────────────────────
  {
    id: ID.F3_17,
    label: LABELS[ID.F3_17],
    name: NAMES[ID.F3_17],
    effects: [
      {
        type: 'DEF_PENETRATION',
        multiGrades: {
          RELIC: { low: [0.015, 0.015], mid: [0.018, 0.018], high: [0.021, 0.021] },
          ANCIENT: { low: [0.018, 0.018], mid: [0.021, 0.021], high: [0.025, 0.025] }
        }
      }
    ]
  },
  // ── 치명타 피해 저항 + 아군 공격력 강화 ──────────────────────────────────
  {
    id: ID.F3_19,
    label: LABELS[ID.F3_19],
    name: NAMES[ID.F3_19],
    effects: [
      {
        type: 'CRIT_DMG',
        multiGrades: {
          RELIC: { low: [0.03, 0.03], mid: [0.036, 0.036], high: [0.042, 0.042] },
          ANCIENT: { low: [0.036, 0.036], mid: [0.042, 0.042], high: [0.048, 0.048] }
        }
      }
    ]
  },
  // ── 무기 공격력 증가 + 공이속 증가 ──────────────────────────────────
  {
    id: ID.F3_20,
    label: LABELS[ID.F3_20],
    name: NAMES[ID.F3_20],
    effects: [
      {
        type: 'WEAPON_ATK_C',
        multiGrades: {
          RELIC: { low: [6000, 6000], mid: [6960, 6960], high: [7920, 7920] },
          ANCIENT: { low: [6960, 6960], mid: [7920, 7920], high: [8880, 8880] }
        }
      },
      {
        type: 'SPEED_ATK',
        value: [0.06]
      },
      {
        type: 'SPEED_MOV',
        value: [0.06]
      }
    ]
  },
  // ── 무기 공격력 증가 + 생명력 50퍼 이상 무기 공격력 증가 ──────────────────────────────────
  {
    id: ID.F3_21,
    label: LABELS[ID.F3_21],
    name: NAMES[ID.F3_21],
    effects: [
      {
        type: 'WEAPON_ATK_C',
        multiGrades: {
          RELIC: { low: [8100, 8100], mid: [9200, 9200], high: [10300, 10300] },
          ANCIENT: { low: [9200, 9200], mid: [10300, 10300], high: [11400, 11400] }
        }
      }
    ]
  },
  // ── 무기 공격력 증가 + 적중시 무기 공격력 증가 ──────────────────────────────────
  {
    id: ID.F3_22,
    label: LABELS[ID.F3_22],
    name: NAMES[ID.F3_22],
    effects: [
      {
        type: 'WEAPON_ATK_C',
        multiGrades: {
          RELIC: { low: [9600, 9600], mid: [10800, 10800], high: [12000, 12000] },
          ANCIENT: { low: [10800, 10800], mid: [12000, 12000], high: [13200, 13200] }
        }
      }
    ]
  },
  // ── 피해 증가 ──────────────────────────────────
  {
    id: ID.F3_23,
    label: LABELS[ID.F3_23],
    name: NAMES[ID.F3_23],
    effects: [
      {
        type: 'DMG_INC',
        multiGrades: {
          RELIC: { low: [0.015, 0.015], mid: [0.02, 0.02], high: [0.025, 0.025] },
          ANCIENT: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] }
        }
      }
    ]
  },
  // ── 추가 피해 ──────────────────────────────────
  {
    id: ID.F3_24,
    label: LABELS[ID.F3_24],
    name: NAMES[ID.F3_24],
    effects: [
      {
        type: 'ADD_DMG',
        multiGrades: {
          RELIC: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] },
          ANCIENT: { low: [0.03, 0.03], mid: [0.035, 0.035], high: [0.04, 0.04] }
        }
      }
    ]
  },
  // ── 백어택 시 피해 증가 ──────────────────────────────────
  {
    id: ID.F3_25,
    label: LABELS[ID.F3_25],
    name: NAMES[ID.F3_25],
    effects: [
      {
        type: 'DMG_INC', target: { attackType: ['BACK_ATK'] },
        multiGrades: {
          RELIC: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] },
          ANCIENT: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] }
        }
      }
    ]
  },
  // ── 헤드어택 시 피해 증가 ──────────────────────────────────
  {
    id: ID.F3_26,
    label: LABELS[ID.F3_26],
    name: NAMES[ID.F3_26],
    effects: [
      {
        type: 'DMG_INC', target: { attackType: ['HEAD_ATK'] },
        multiGrades: {
          RELIC: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] },
          ANCIENT: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] }
        }
      }
    ]
  },
  // ── 비방향성 시  피해 증가 ──────────────────────────────────
  {
    id: ID.F3_27,
    label: LABELS[ID.F3_27],
    name: NAMES[ID.F3_27],
    effects: [
      {
        type: 'DMG_INC', target: { attackType: ['NON_DIRECTIONAL'] },
        multiGrades: {
          RELIC: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] },
          ANCIENT: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] }
        }
      }
    ]
  },
  // ── 치명타 적중률 ──────────────────────────────────
  {
    id: ID.F3_31,
    label: LABELS[ID.F3_31],
    name: NAMES[ID.F3_31],
    effects: [
      {
        type: 'CRIT_CHANCE',
        multiGrades: {
          RELIC: { low: [0.026, 0.026], mid: [0.034, 0.034], high: [0.042, 0.042] },
          ANCIENT: { low: [0.034, 0.034], mid: [0.042, 0.042], high: [0.05, 0.05] }
        }
      }
    ]
  },
  // ── 치명타 피해 ──────────────────────────────────
  {
    id: ID.F3_32,
    label: LABELS[ID.F3_32],
    name: NAMES[ID.F3_32],
    effects: [
      {
        type: 'CRIT_DMG',
        multiGrades: {
          RELIC: { low: [0.052, 0.052], mid: [0.068, 0.068], high: [0.084, 0.084] },
          ANCIENT: { low: [0.068, 0.068], mid: [0.084, 0.084], high: [0.1, 0.1] }
        }
      }
    ]
  },
  // ── 무기 공격력 ──────────────────────────────────
  {
    id: ID.F3_33,
    label: LABELS[ID.F3_33],
    name: NAMES[ID.F3_33],
    effects: [
      {
        type: 'WEAPON_ATK_C',
        multiGrades: {
          RELIC: { low: [6300, 6300], mid: [7200, 7200], high: [8100, 8100] },
          ANCIENT: { low: [7200, 7200], mid: [8100, 8100], high: [9000, 9000] }
        }
      }
    ]
  },
];

export const BRACELET_DB = BRACELET_DATA.map(item => ({
  ...item,
  ...decodeBraceletId(item.id)
})) as BraceletData[];
