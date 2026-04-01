/**
 * @/types/character-types.ts
 * UI 표시용 가공 타입
 * data-normalizer.ts 가 RawCharacterData → 이 타입으로 변환
 * 계산용 수치는 포함하지 않음 — useCalculatorStore 참조
 */

import { ColoredText, ColoredValue } from '@/types/sim-types';

export type { ColoredText, ColoredValue };

// ============================================================
// 공통
// ============================================================

/** 상/중/하 옵션 등급 */
export type OptionGrade = 'HIGH' | 'MID' | 'LOW';

/** 장비 세트 타입 */
export type EquipmentSetType =
  | 'NORMAL_RELIC'
  | 'AEGIR_ANCIENT'
  | 'SERCA_ANCIENT'
  | 'UNKNOWN';

// ============================================================
// 프로필
// ============================================================

export interface CharacterProfileDisplay {
  name           : string;
  className      : string;
  characterLevel : number;
  itemAvgLevel   : number;
  combatPower    : number;
  serverName     : string;
  guildName      : string;
  guildGrade     : string;
  expeditionLevel: number;
  townLevel      : number;
  townName       : string;
  title          : string;
  honorLevel     : number;
  characterImage : string;
}

/** 전투 특성 표시용 */
export interface CombatStatsDisplay {
  critical      : number;
  specialization: number;
  swiftness     : number;
  domination    : number;
  endurance     : number;
  expertise     : number;
  maxHp         : number;
  attackPower   : number;
}

// ============================================================
// 장비
// ============================================================

export interface EquipmentDisplay {
  type      : string;
  name      : string;
  icon      : string;
  grade     : ColoredText;
  refineStep: number;
  quality   : number;
  itemTier  : number;
  setType   : EquipmentSetType;
  arkPassivePoint: { category: ColoredText; point: ColoredValue } | null;
}

// ============================================================
// 악세서리
// ============================================================

/** 악세서리 기본 효과 (주스탯, 체력) — UI 표시용 */
export interface AccessoryBaseEffect {
  statType: ColoredText;
  value   : ColoredValue;
}

/** 악세서리 연마 효과 — UI 표시용 */
export interface AccessoryPolishEffect {
  label: ColoredText;   // "추가 피해"
  value: ColoredValue;  // 0.016, color
  grade: OptionGrade;
}

export interface AccessoryDisplay {
  type         : string;
  name         : string;
  icon         : string;
  grade        : ColoredText;
  quality      : number;
  itemTier     : number;
  baseEffects  : AccessoryBaseEffect[];
  polishEffects: AccessoryPolishEffect[];
  arkPassivePoint: { category: ColoredText; point: ColoredValue } | null;
}

// ============================================================
// 팔찌
// ============================================================

export interface BraceletEffect {
  label  : ColoredText;
  value  : ColoredValue;
  isFixed: boolean;
  grade? : OptionGrade;
}

export interface BraceletDisplay {
  name   : string;
  icon   : string;
  grade  : ColoredText;
  effects: BraceletEffect[];
  arkPassivePoint: { category: ColoredText; point: ColoredValue } | null;
}

// ============================================================
// 어빌리티 스톤
// ============================================================

export interface AbilityStoneDisplay {
  name        : string;
  icon        : string;
  grade       : ColoredText;
  baseAtkBonus: number;
  engravings: {
    name : ColoredText;
    level: ColoredValue;
  }[];
  penalty: {
    name : ColoredText;
    level: ColoredValue;
  } | null;
}

// ============================================================
// 보주
// ============================================================

export interface BoJuDisplay {
  name        : string;
  icon        : string;
  grade       : ColoredText;
  seasonLabel : string;
  paradoxPower: number;
}

// ============================================================
// 아바타
// ============================================================

export interface AvatarDisplay {
  type         : string;
  name         : string;
  icon         : string;
  grade        : ColoredText;
  mainStatBonus: number;
}

// ============================================================
// 각인
// ============================================================

export interface EngravingDisplay {
  name             : ColoredText;
  grade            : ColoredText;
  level            : number;
  abilityStoneLevel: number | null;
  description      : string;
  icon             : string;
}

// ============================================================
// 보석
// ============================================================

export interface GemDisplay {
  slot        : number;
  level       : number;
  grade       : ColoredText;
  icon        : string;
  skillName   : ColoredText;
  effectLabel : ColoredText;
  effectValue : ColoredValue;
  baseAtkBonus: number;
}

export interface GemSummaryDisplay {
  gems        : GemDisplay[];
  totalBaseAtk: ColoredValue;
}

// ============================================================
// 카드
// ============================================================

export interface CardSetDisplay {
  setName    : string;
  totalAwake : number;
  activeItems: {
    name       : string;
    description: string;
    value?     : ColoredValue;
  }[];
}

// ============================================================
// 아크패시브
// ============================================================

export interface ArkPassivePointDisplay {
  evolution: { value: number; description: string };
  insight  : { value: number; description: string };
  leap     : { value: number; description: string };
  title    : string;
}

export interface ArkPassiveEffectDisplay {
  category   : ColoredText;
  name       : ColoredText;
  tier       : number;
  level      : number;
  description: string;
  icon       : string;
}

// ============================================================
// 아크그리드
// ============================================================

export interface ArkGridCoreDisplay {
  index: number;
  name : ColoredText;
  point: ColoredValue;
  grade: ColoredText;
  icon : string;
}

export interface ArkGridEffectDisplay {
  label: ColoredText;
  level: number;
  value: ColoredValue;
}

export interface ArkGridDisplay {
  cores  : ArkGridCoreDisplay[];
  effects: ArkGridEffectDisplay[];
}

// ============================================================
// 스킬
// ============================================================

export interface SelectedTripodDisplay {
  tier : number;
  slot : number;
  name : ColoredText;
  icon : string;
}

export interface EquippedRuneDisplay {
  name : ColoredText;
  grade: ColoredText;
  icon : string;
}

export interface SkillDisplay {
  name           : string;
  icon           : string;
  level          : number;
  type           : string;
  skillType      : number;
  category       : ColoredText;
  isUsed         : boolean;
  selectedTripods: SelectedTripodDisplay[];
  rune           : EquippedRuneDisplay | null;
}

// ============================================================
// 전체 캐릭터 DisplayData
// ============================================================

export interface CharacterDisplayData {
  profile     : CharacterProfileDisplay;
  combatStats : CombatStatsDisplay;
  equipment   : EquipmentDisplay[];
  accessories : AccessoryDisplay[];
  bracelet    : BraceletDisplay | null;
  abilityStone: AbilityStoneDisplay | null;
  boJu        : BoJuDisplay | null;
  avatars     : AvatarDisplay[];
  engravings  : EngravingDisplay[];
  gems        : GemSummaryDisplay;
  cards       : CardSetDisplay | null;
  arkPassive  : {
    points : ArkPassivePointDisplay;
    effects: ArkPassiveEffectDisplay[];
  };
  arkGrid     : ArkGridDisplay;
  skills      : SkillDisplay[];
}