// @/data/gems.ts

import { BaseSimData } from '@/types/sim-types';
import { ID_AA, ID_BB } from '@/constants/id-config';

// 공통 Base ID (60 10 0 0 00)
const BASE = (ID_AA.GEM * 1000000) + (ID_BB.COMMON * 10000);

/**
 * C: 1(3티어), 2(4티어)
 * DD: 01(피해 증가), 02(쿨타임 감소)
 */
export const ID = {
    GEMS_T3_DMG: BASE+1001, GEMS_T3_CDR: BASE+1002,
    GEMS_T4_DMG: BASE+2001, GEMS_T4_CDR: BASE+2002,
}

export const NAMES = {
    [ID.GEMS_T3_DMG]: '멸화', [ID.GEMS_T3_CDR]: '홍염',
    [ID.GEMS_T4_DMG]: '겁화', [ID.GEMS_T4_CDR]: '작열'
}
export const LABELS = {
    [ID.GEMS_T3_DMG]: '멸화의 보석', [ID.GEMS_T3_CDR]: '홍염의 보석',
    [ID.GEMS_T4_DMG]: '겁화의 보석', [ID.GEMS_T4_CDR]: '작열의 보석'
}

export const GEM_DATA: BaseSimData[] = [
  {
    id: ID.GEMS_T3_DMG,
    name: NAMES[ID.GEMS_T3_DMG],
    label: LABELS[ID.GEMS_T3_DMG],
    effects: [{ type: "DMG_INC", value: [0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.21, 0.24, 0.3, 0.4] }]
  },
  {
    id: ID.GEMS_T3_CDR,
    name: NAMES[ID.GEMS_T3_CDR],
    label: LABELS[ID.GEMS_T3_CDR],
    effects: [{ type: "CDR_P", value: [0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2] }]
  },
  {
    id: ID.GEMS_T4_DMG,
    name: NAMES[ID.GEMS_T4_DMG],
    label: LABELS[ID.GEMS_T4_DMG],
    effects: [
      { type: "DMG_INC", value: Array.from({ length: 10 }, (_, i) => 0.08 + (i * 0.04)) },
      { type: "BASE_ATK_P", value: [0, 0, 0.001, 0.002, 0.003, 0.004, 0.006, 0.008, 0.01, 0.012] }
    ]
  },
  {
    id: ID.GEMS_T4_CDR,
    name: NAMES[ID.GEMS_T4_CDR],
    label: LABELS[ID.GEMS_T4_CDR],
    effects: [
      { type: "CDR_P", value: Array.from({ length: 10 }, (_, i) => 0.06 + (i * 0.02)) },
      { type: "BASE_ATK_P", value: [0, 0, 0.001, 0.002, 0.003, 0.004, 0.006, 0.008, 0.01, 0.012] }
    ]
  }
];