// @/data/engravings

import {
  ENGRAVING_ID as ID,
  ENGRAVING_NAME as NAME } from '../constants/engravings';
import { EngravingData } from '../types/engraving';

export const ENGRAVINGS_DB: EngravingData[] = [
  {
    source: 'ENGRAVING',
    id: ID.KEEN_BLUNT_WEAPON,
    name: NAME[ID.KEEN_BLUNT_WEAPON],
    effects: [{ type: 'CRIT_DMG', value: 0.44, target: 'ALL' }],
    iconPath: '',
    bonus: {
      relic: { type: 'CRIT_DMG', values: [0.02, 0.04, 0.06, 0.08] },
      ability: { type: 'CRIT_DMG', values: [0.075, 0.094, 0.132, 0.15] }
    }
  },
  {
    source: 'ENGRAVING',
    id: ID.ADRENALINE,
    name: NAME[ID.ADRENALINE],
    effects: [
      { type: 'ATK_PERCENT', value: 0.054, target: 'ALL' },
      { type: 'CRIT_CHANCE', value: 0.14, target: 'ALL' }
    ],
    iconPath: '',
    bonus: {
      relic: { type: 'CRIT_CHANCE', values: [0.015, 0.03, 0.045, 0.06] },
      ability: { type: 'ATK_PERCENT', values: [0.0288, 0.036, 0.0498, 0.057] }
    }
  },
  {
    source: 'ENGRAVING',
    id: ID.GRUDGE,
    name: NAME[ID.GRUDGE],
    effects: [{ type: 'DMG_INC', value: 0.18, target: 'ALL' }],
    iconPath: '',
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
    }
  },
  {
    source: 'ENGRAVING',
    id: ID.CURSED_DOLL,
    name: NAME[ID.CURSED_DOLL],
    effects: [{ type: 'DMG_INC', value: 0.14, target: 'ALL' }],
    iconPath: '',
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
    }
  },
  {
    source: 'ENGRAVING',
    id: ID.HIT_MASTER,
    name: NAME[ID.HIT_MASTER],
    effects: [{ type: 'DMG_INC', value: 0.14, target: 'NON_DIRECTIONAL' }],
    iconPath: '',
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
    }
  },
];