// @/data/ark-passive/meta.ts

import { ArkPassiveSectionRule } from '@/types/ark-passive';

export const ARK_PASSIVE_RULES: Record<'evolution' | 'insight' | 'leap', ArkPassiveSectionRule> = {
  evolution: {
    tierMeta: { 1: 40, 2: 30, 3: 20, 4: 20, 5: 30 },
    karma: {
        rankBonus: { type: 'EVO_DMG', isLinear:true, value: [0.01, 0, 6] },
        levelBonus: { type: 'STAT_HP_C', isLinear:true, value: [400, 0, 30] }
    }
  },
  insight: {
    tierMeta: { 1: 24, 2: 24, 3: 34, 4: 34 },
    karma: {
      levelBonus: { type: 'WEAPON_ATK_P', isLinear:true, value: [0.001, 0, 30] }
    }
  },
  leap: {
    tierMeta: { 1: 40, 2: 30 },
    karma: {
      levelBonus: { type: 'DMG_INC',  isLinear:true, value: [0.005, 0, 30], target: {categories:['HYPER_ULTIMATE']} }
    }
  }
};