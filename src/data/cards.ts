// @/data/cards.ts

import { BaseSimData } from '@/types/sim-types';
import { ID_AA, ID_BB } from '@/constants/id-config';

// 공통 Base ID (50 10 0 0 00)
const BASE = (ID_AA.CARD * 1000000) + (ID_BB.COMMON * 10000);

export const ID = {
    CARDS: BASE,
}

export const NAMES = {
    [ID.CARDS]: '카드',
}

// todo: 카드도 어떻게할지 고민, 그냥 18각은 8퍼, 24각 12퍼 30각 15퍼 이렇게만 표현해도 됨.
export const CARD_DATA: BaseSimData[] = [
  {
    id: ID.CARDS,
    name: NAMES[ID.CARDS],
    effects: [
      { type: "DMG_INC", value: [0.08, 0.12, 0.15] }
    ]
  }
]