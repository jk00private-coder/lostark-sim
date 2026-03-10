import { BaseSimData, EffectTypeId } from './sim-types';

export interface EngravingBonus {
  type: EffectTypeId;
  values: number[]; // [Lv1, Lv2, Lv3, Lv4]
}

export interface EngravingData extends BaseSimData {
  iconPath: string;
  bonus?: {
    relic?: EngravingBonus;
    ability?: EngravingBonus;
  };
  
}