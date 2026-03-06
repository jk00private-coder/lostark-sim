import { Engraving } from '@/types/sim-types';

export const ENGRAVINGS_DB: Engraving[] = [
  {
    source: "ENGRAVING",
    id: "grudge",
    name: "원한",
    effects: [], // 초기화용
    baseEffects: [{ type: "DMG_INC", value: 0.18, target: "ALL" }],
    bonus: {
      relic: { type: "DMG_INC", values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: "DMG_INC", values: [0.03, 0.0375, 0.0525, 0.06] }
    }
  },
  {
    id: "keen_blunt",
    name: "예리한 둔기",
    source: "ENGRAVING",
    effects: [],
    baseEffects: [{ type: "CRIT_DMG", value: 0.44, target: "ALL" }],
    bonus: {
      relic: { type: "CRIT_DMG", values: [0.02, 0.04, 0.06, 0.08] },
      ability: { type: "CRIT_DMG", values: [0.075, 0.094, 0.132, 0.15] }
    }
  },
  {
    id: "hit_master",
    name: "타격의 대가",
    source: "ENGRAVING",
    effects: [],
    baseEffects: [{ type: "DMG_INC", value: 0.14, target: "NON_DIRECTIONAL" }],
    bonus: {
      relic: { type: "DMG_INC", values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: "DMG_INC", values: [0.03, 0.0375, 0.0525, 0.06] }
    }
  },
  {
    id: "adrenaline",
    name: "아드레날린",
    source: "ENGRAVING",
    effects: [],
    // 기본효과: 6스택 공증(0.9% * 6) + 6스택 치확(14%)
    baseEffects: [
      { type: "ATK_INC_PERCENT", value: 0.054, target: "ALL" },
      { type: "CRIT_CHANCE", value: 0.14, target: "ALL" }
    ],
    bonus: {
      relic: { type: "CRIT_CHANCE", values: [0.015, 0.03, 0.045, 0.06] },
      ability: { type: "ATK_INC_PERCENT", values: [0.0288, 0.036, 0.0498, 0.057] }
    }
  }
];