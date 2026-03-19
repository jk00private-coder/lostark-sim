// @/data/engravings

import { EngravingData } from '../types/engraving';

export const ENGRAVING_ID = {
  ADRENALINE: 'ENGRAVING00',
  KEEN_BLUNT_WEAPON: 'ENGRAVING01',
  GRUDGE: 'ENGRAVING02',
  CURSED_DOLL: 'ENGRAVING03',
  HIT_MASTER: 'ENGRAVING04'
} as const;

export const ENGRAVING_NAME = {
  [ENGRAVING_ID.ADRENALINE]: '아드레날린',
  [ENGRAVING_ID.KEEN_BLUNT_WEAPON]: '예리한 둔기',
  [ENGRAVING_ID.GRUDGE]: '원한',
  [ENGRAVING_ID.CURSED_DOLL]: '저주받은 인형',
  [ENGRAVING_ID.HIT_MASTER]: '타격의 대가'
} as const;

export const ENGRAVINGS_DB: EngravingData[] = [
  {
    source: 'ENGRAVING',
    id: ID.KEEN_BLUNT_WEAPON,
    name: NAME[ID.KEEN_BLUNT_WEAPON],
    effects: [{ type: 'CRIT_DMG', value: 0.44, operation: 'ADD' }],
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
      { type: 'ATK_P', value: 0.054, operation: 'ADD' },
      { type: 'CRIT_CHANCE', value: 0.14, operation: 'ADD' }
    ],
    iconPath: '',
    bonus: {
      relic: { type: 'CRIT_CHANCE', values: [0.015, 0.03, 0.045, 0.06] },
      ability: { type: 'ATK_P', values: [0.0288, 0.036, 0.0498, 0.057] }
    }
  },
  {
    source: 'ENGRAVING',
    id: ID.GRUDGE,
    name: NAME[ID.GRUDGE],
    effects: [{ type: 'DMG_INC', value: 0.18, operation: 'MULTIPLY' }],
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
    effects: [{ type: 'DMG_INC', value: 0.14, operation: 'MULTIPLY' }],
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
    effects: [{
      type: 'DMG_INC', value: 0.14, operation: 'MULTIPLY',
      target:{ hasAttackType:['NON_DIRECTIONAL'] }
    }],
    iconPath: '',
    bonus: {
      relic: { type: 'DMG_INC', values: [0.0075, 0.015, 0.0225, 0.03] },
      ability: { type: 'DMG_INC', values: [0.03, 0.0375, 0.0525, 0.06] }
    }
  },
];