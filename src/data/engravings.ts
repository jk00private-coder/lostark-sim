// @/data/engravings

import { EngravingData } from '../types/engraving';
import { ID_AA, ID_BB, ID_CC } from '@/constants/id-config';

const BASE = (ID_AA.ENGRAVING * 1000000) + (ID_BB.COMMON * 10000) + (ID_CC.NONE * 100);

export const NAMES = {
  [BASE + 1] : "각성",      [BASE + 4] : "결투의 대가",   [BASE + 5] : "구슬동자",
  [BASE + 7] : "급소 타격",   [BASE + 8] : "기습의 대가",   [BASE + 10]: "달인의 저력",
  [BASE + 11]: "돌격대장",    [BASE + 12]: "마나 효율 증가", [BASE + 13]: "마나의 흐름",
  [BASE + 14]: "바리케이드",   [BASE + 20]: "속전속결",     [BASE + 21]: "슈퍼 차지",
  [BASE + 23]: "시선 집중",   [BASE + 25]: "아드레날린",    [BASE + 26]: "안정된 상태",
  [BASE + 28]: "에테르 포식자", [BASE + 30]: "예리한 둔기",   [BASE + 31]: "원한",
  [BASE + 32]: "위기 모면",   [BASE + 33]: "저주받은 인형",  [BASE + 34]: "전문의",
  [BASE + 35]: "정기 흡수",   [BASE + 36]: "정밀 단도",    [BASE + 37]: "중갑 착용",
  [BASE + 38]: "질량 증가",   [BASE + 39]: "최대 마나 증가", [BASE + 41]: "타격의 대가",
  [BASE + 43]: "폭발물 전문가"
} as const;

/**todo: 구슬동자/급소타격/BASE + 32위기모면/[BASE + 34]: "전문의"/중갑착용/[BASE + 39]: "최대 마나 증가"/BASE + 43 폭발물 전문가
 *  돌격대장 데미지처리 / 유물,어빌 타겟(마나효율증가,속전속결,시선집중,정기흡수) /
 * 예리한 둔기 피해감소 / BASE + 36정밀단도 effect추가 /  
 * 어떻게 할지 생각*/  
export const ENGRAVINGS_DB: EngravingData[] = [
  {
  id: BASE + 1,
  name: { text: NAMES[BASE + 1] },
  effects: [{ type: 'CDR_P', value: { value: 0.44 }, target: {categories:['ULTIMATE']} }],
  iconPath: `/images/engravings/${BASE + 1}.webp`,
  bonus: {
    relic: { type: 'CDR_P', values: [0.015, 0.03, 0.045, 0.06] },
    ability: { type: 'CDR_P', values: [0.06, 0.075, 0.105, 0.12] }
    }
  },
  {
    id: BASE + 4,
    name: { text: NAMES[BASE + 4] },
    effects: [
      { type: 'DMG_INC', value: { value: 0.048 } },
      { type: 'DMG_INC', value: { value: 0.15 }, target: {attackType:['HEAD_ATK']} }
    ],
    iconPath: `/images/engravings/${BASE + 4}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.007, 0.014, 0.021, 0.028] },
      ability: { type: 'DMG_INC', values: [0.027, 0.034, 0.047, 0.054] }
      }
  },
  {
    id: BASE + 5,
    name: { text: NAMES[BASE + 5] },
    iconPath: `/images/engravings/${BASE + 5}.webp`,
  },
  {
    id: BASE + 7,
    name: { text: NAMES[BASE + 7] },
    iconPath: `/images/engravings/${BASE + 7}.webp`,
  },
  {
    id: BASE + 8,
    name: { text: NAMES[BASE + 8] },
    effects: [
      { type: 'DMG_INC', value: { value: 0.048 } },
      { type: 'DMG_INC', value: { value: 0.15 }, target: {attackType:['BACK_ATK']} }
    ],
    iconPath: `/images/engravings/${BASE + 8}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.007, 0.014, 0.021, 0.028] },
      ability: { type: 'DMG_INC', values: [0.027, 0.034, 0.047, 0.054] }
      }
  },
  {
    id: BASE + 10,
    name: { text: NAMES[BASE + 10] },
    effects: [{ type: 'DMG_INC', value: { value: 0.14 } }],
    iconPath: `/images/engravings/${BASE + 10}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
      }
  },
  {
    id: BASE + 11,
    name: { text: NAMES[BASE + 11] },
    effects: [{ type: 'DMG_INC', value: { value: 0.40 } }],
    iconPath: `/images/engravings/${BASE + 11}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.02, 0.04, 0.06, 0.08] },
      ability: { type: 'DMG_INC', values: [0.075, 0.094, 0.132, 0.15] }
      }
  },
  {
    id: BASE + 12,
    name: { text: NAMES[BASE + 12] },
    effects: [{ type: 'DMG_INC', value: { value: 0.13 }, target: { resourceTypes: ['MANA'] } }],
    iconPath: `/images/engravings/${BASE + 12}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
      }
  },
  {
    id: BASE + 13,
    name: { text: NAMES[BASE + 13] },
    effects: [{ type: 'CDR_P', value: { value: 0.07 } }],
    iconPath: `/images/engravings/${BASE + 13}.webp`,
    bonus: {
      relic: { type: 'CDR_P', values: [0.0075, 0.015, 0.0225, 0.03] },
      }
  },
  {
    id: BASE + 14,
    name: { text: NAMES[BASE + 14] },
    effects: [{ type: 'DMG_INC', value: { value: 0.14 } }],
    iconPath: `/images/engravings/${BASE + 14}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
      }
  },
  {
    id: BASE + 20,
    name: { text: NAMES[BASE + 20] },
    effects: [{ type: 'DMG_INC', value: { value: 0.18 }, target: { skillTypes: ['HOLDING', 'CASTING'] } }],
    iconPath: `/images/engravings/${BASE + 20}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
      }
  },
  {
    id: BASE + 21,
    name: { text: NAMES[BASE + 21] },
    effects: [{ type: 'DMG_INC', value: { value: 0.18 }, target: { skillTypes: ['CHARGE'] } }],
    iconPath: `/images/engravings/${BASE + 21}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
      }
  },
  {
    id: BASE + 23,
    name: { text: NAMES[BASE + 23] },
    effects: [{ type: 'DMG_INC', value: { value: 0.25 } }],
    iconPath: `/images/engravings/${BASE + 22}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0125, 0.025, 0.0375, 0.05] },
      ability: { type: 'DMG_INC', values: [0.04, 0.05, 0.07, 0.08] }
      }
  },
  {
    id: BASE + 25,
    name: { text: NAMES[BASE + 25] },
    effects: [
      { type: 'ATK_P', value: { value: 0.054 } },
      { type: 'CRIT_CHANCE', value: { value: 0.14 } }
    ],
    iconPath: `/images/engravings/${BASE + 25}.webp`,
    bonus: {
      relic: { type: 'CRIT_CHANCE', values: [0.015, 0.03, 0.045, 0.06] },
      ability: { type: 'ATK_P', values: [0.0288, 0.036, 0.0498, 0.057] }
    }
  },
  {
    id: BASE + 26,
    name: { text: NAMES[BASE + 26] },
    effects: [{ type: 'DMG_INC', value: { value: 0.14 } }],
    iconPath: `/images/engravings/${BASE + 26}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
      }
  },
  {
    id: BASE + 28,
    name: { text: NAMES[BASE + 28] },
    effects: [{ type: 'ATK_P', value: { value: 0.0126 } }],
    iconPath: `/images/engravings/${BASE + 28}.webp`,
    bonus: {
      relic: { type: 'ATK_P', values: [0.009, 0.0018, 0.027, 0.036] },
      ability: { type: 'ATK_P', values: [0.03, 0.039, 0.054, 0.06] }
      }
  },
  {
    id: BASE + 30,
    name: { text: NAMES[BASE + 30] },
    effects: [
      { type: 'CRIT_DMG_INC', value: { value: 0.44 } }
    ],
    iconPath: `/images/engravings/${BASE + 30}.webp`,
    bonus: {
      relic: { type: 'CRIT_DMG_INC', values: [0.02, 0.04, 0.06, 0.08] },
      ability: { type: 'CRIT_DMG_INC', values: [0.075, 0.094, 0.132, 0.15] }
      }
  },
  {
    id: BASE + 31,
    name: { text: NAMES[BASE + 31] },
    effects: [{ type: 'DMG_INC', value: { value: 0.18 } }],
    iconPath: `/images/engravings/${BASE + 31}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
      }
  },
  {
    id: BASE + 32,
    name: { text: NAMES[BASE + 32] },
    iconPath: `/images/engravings/${BASE + 32}.webp`,
  },
  {
    id: BASE + 33,
    name: { text: NAMES[BASE + 33] },
    effects: [{ type: 'DMG_INC', value: { value: 0.14 } }],
    iconPath: `/images/engravings/${BASE + 33}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
    }
  },
  {
    id: BASE + 34,
    name: { text: NAMES[BASE + 34] },
    iconPath: `/images/engravings/${BASE + 34}.webp`,
  },
  {
    id: BASE + 35,
    name: { text: NAMES[BASE + 35] },
    effects: [
      { type: 'SPEED_ATK', value: { value: 0.13 } },
      { type: 'SPEED_MOV', value: { value: 0.13 } }
    ],
    iconPath: `/images/engravings/${BASE + 35}.webp`,
    bonus: {
      relic: { type: 'SPEED_ATK', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'SPEED_MOV', values: [0.03, 0.0375, 0.0525, 0.06] }
    }
  },
  {
    id: BASE + 36,
    name: { text: NAMES[BASE + 36] },
    effects: [
      { type: 'CRIT_CHANCE', value: { value: 0.18 } },
    ],
    iconPath: `/images/engravings/${BASE + 36}.webp`,
    bonus: {
      relic: { type: 'CRIT_CHANCE', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'CRIT_CHANCE', values: [0.03, 0.0375, 0.0525, 0.06] }
    }
  },
  {
    id: BASE + 37,
    name: { text: NAMES[BASE + 37] },
    iconPath: `/images/engravings/${BASE + 37}.webp`,
  },
  {
    id: BASE + 38,
    name: { text: NAMES[BASE + 38] },
    effects: [
      { type: 'DMG_INC', value: { value: 0.16 } },
      { type: 'SPEED_ATK', value: { value: -0.10 } }
    ],
    iconPath: `/images/engravings/${BASE + 38}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
    }
  },
  {
    id: BASE + 39,
    name: { text: NAMES[BASE + 39] },
    iconPath: `/images/engravings/${BASE + 39}.webp`,
  },
  {
    id: BASE + 41,
    name: { text: NAMES[BASE + 41] },
    effects: [{ type: 'DMG_INC', value: { value: 0.14 }, target: { attackType: ['NON_DIRECTIONAL'] } }],
    iconPath: `/images/engravings/${BASE + 41}.webp`,
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
    }
  },
  {
    id: BASE + 43,
    name: { text: NAMES[BASE + 43] },
    iconPath: `/images/engravings/${BASE + 43}.webp`,
  },
];