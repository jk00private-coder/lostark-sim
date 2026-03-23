// @/types/engraving.ts

import { BaseSimData, LeveledEffect } from './sim-types';

export interface EngravingData extends BaseSimData {
  bonus?: {
    relic?  : LeveledEffect;
    ability?: LeveledEffect;
  };
  
}