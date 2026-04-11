// @/data/cards.ts

import { BaseSimData } from '@/types/sim-types';
import { ID_AA, ID_BB } from '@/constants/id-config';

// 공통 Base ID (50 10 0 0 00)
const BASE = (ID_AA.AVATAR * 1000000) + (ID_BB.COMMON * 10000);

export const ID = {
    AVATAR: BASE,
}

export const NAMES = {
    [ID.AVATAR]: '아바타',
}


export const AVATAR_DATA: BaseSimData[] = [
  {
    id: ID.AVATAR,
    name: NAMES[ID.AVATAR],
    effects: [
      { type: "MAIN_STAT_P", multiValues: {HERO:[0.01], LEGEND:[0.02]} }
    ]
  }
]