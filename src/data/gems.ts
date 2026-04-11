// @/data/gems.ts

import { BaseSimData } from '@/types/sim-types';
import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';

// 공통 Base ID (60 10 0 0 00)
const BASE = (ID_AA.GEM * 1000000) + (ID_BB.COMMON * 10000);

export const ID = {
    GEMS_T3: BASE+1000, GEMS_T4: BASE+2000
}

export const NAMES = {
    [ID.GEMS_T3]: '3티어 보석', [ID.GEMS_T4]: '4티어 보석'
}

// todo: target은 사용자가 선택한 스킬 ID를 계산 시점에 동적으로 넣어준다.
// 좀더 만저야함. 겁화, 멸화, 작열, 홍염, 광희 종류가 있음.
export const GEM_DATA: BaseSimData[] = [
  {
    id: ID.GEMS_T3,
    name: NAMES[ID.GEMS_T3],
    effects: [
      { type: "DMG_INC", value: [0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.21, 0.24, 0.3, 0.4] },
      { type: "CDR_P", value: [0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2] }
    ]
  },
  {
    id: ID.GEMS_T4,
    name: NAMES[ID.GEMS_T4],
    effects: [
      { type: "DMG_INC", value: Array.from({ length: 10 }, (_, i) => 0.08 + (i*0.04)) },
      { type: "CDR_P", value: Array.from({ length: 10 }, (_, i) => 0.06 + (i*0.02)) },
      { type: "BASE_ATK_P", value: [0, 0, 0.001, 0.002, 0.003, 0.004, 0.006, 0.008, 0.01, 0.012] }
    ]
  }
]