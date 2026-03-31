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

/**
 * todo: 아바타는 등급이 영웅, 전설임, 현재 multiValues는 유물, 고대, 세르카로 장비기준인데
 * 이 장비 등급기준을 커스텀할수 있게끔 바꿔야하나 고민!, 아바타는 상하의 세트가 있는데 세트는 상하의 증가폭 합이 증가함.
 */
export const AVATAR_DATA: BaseSimData[] = [
  {
    id: ID.AVATAR,
    name: NAMES[ID.AVATAR],
    effects: [
      { type: "MAIN_STAT_P", multiValues: {relic:[0.01], ancient:[0.02]} }
    ]
  }
]