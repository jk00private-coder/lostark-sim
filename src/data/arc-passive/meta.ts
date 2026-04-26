// @/data/ark-passive/meta.ts

import { ArkPassiveSectionRule } from '@/types/ark-passive';

export const ARK_PASSIVE_RULES: Record<'evolution' | 'insight' | 'leap', ArkPassiveSectionRule> = {
  evolution: {
    tierMeta: { 1: 40, 2: 30, 3: 20, 4: 20, 5: 30 },
    karma: {
        rankBonus: { type: 'EVO_DMG', value: Array.from({ length: 6 }, (_, i) => (i + 1) * 0.01) },
        levelBonus: { type: 'STAT_HP_C', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 400) }
    }
  },
  insight: {
    tierMeta: { 1: 24, 2: 24, 3: 34, 4: 34 },
    karma: {
      levelBonus: { type: 'WEAPON_ATK_P', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 0.001) }
    }
  },
  leap: {
    tierMeta: { 1: 40, 2: 30 },
    karma: {
      levelBonus: {
          type: 'DMG_INC', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 0.005),
          target: {categories:['HYPER_ULTIMATE']}
      }
    }
  }
};