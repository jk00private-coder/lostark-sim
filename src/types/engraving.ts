// @/types/engraving.ts

import { BaseSimData, EffectEntry } from './sim-types';

export interface EngravingData extends BaseSimData {
  bonus?: {
    relic?  : EffectEntry;
    ability?: EffectEntry;
  };
}