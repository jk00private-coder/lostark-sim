/**
 * @/types/raw-types.ts
 * 로스트아크 API 응답 구조 타입 선언
 * 변환/계산 로직 없음 — API가 주는 형태 그대로 기록
 */

// ============================================================
// profile
// ============================================================

export interface RawStat {
  Type   : string;
  Value  : string;   // "569" — 쉼표 없는 숫자 문자열
  Tooltip: string[];
}

export interface RawProfile {
  CharacterImage    : string;
  CharacterName     : string;
  CharacterClassName: string;
  CharacterLevel    : number;
  ItemAvgLevel      : string;  // "1,710.00" — 쉼표 포함
  CombatPower       : string;  // "2,397.67" — 쉼표 포함
  ServerName        : string;
  GuildName         : string | null;
  GuildMemberGrade  : string | null;
  ExpeditionLevel   : number;
  TownLevel         : number;
  TownName          : string;
  Title             : string | null;
  HonorPoint        : number;
  UsingSkillPoint   : number;
  TotalSkillPoint   : number;
  Stats             : RawStat[];
}

// ============================================================
// equipment
// ============================================================

export interface RawEquipment {
  Type   : string;
  Name   : string;
  Icon   : string;
  Grade  : string;
  Tooltip: string;  // JSON 문자열
}

// ============================================================
// avatars
// ============================================================

export interface RawAvatar {
  Type   : string;
  Name   : string;
  Icon   : string;
  Grade  : string;
  IsSet  : boolean;
  IsInner: boolean;
  Tooltip: string;
}

// ============================================================
// engravings
// ============================================================

export interface RawArkPassiveEffect {
  Name             : string;
  Grade            : string;
  Level            : number;
  AbilityStoneLevel: number | null;
  Description      : string;
}

export interface RawEngravings {
  Engravings       : null;
  Effects          : null;
  ArkPassiveEffects: RawArkPassiveEffect[];
}

// ============================================================
// gems
// ============================================================

export interface RawGemSkillEffect {
  GemSlot    : number;
  Name       : string;
  Description: string[];
  Option     : string;
  Icon       : string;
}

export interface RawGemEffects {
  Description: string;
  Skills     : RawGemSkillEffect[];
}

export interface RawGem {
  Slot   : number;
  Level  : number;
  Grade  : string;
  Icon   : string;
  Name   : string;
  Tooltip: string;
}

export interface RawGems {
  Gems   : RawGem[];
  Effects: RawGemEffects;
}

// ============================================================
// cards
// ============================================================

export interface RawCardSetItem {
  Name       : string;
  Description: string;
}

export interface RawCardEffect {
  Index    : number;
  CardSlots: number[];
  Items    : RawCardSetItem[];
}

export interface RawCards {
  Cards  : any[];
  Effects: RawCardEffect[];
}

// ============================================================
// arkPassive
// ============================================================

export interface RawArkPassivePoint {
  Name       : string;
  Value      : number;
  Description: string;
}

export interface RawArkPassiveEffectEntry {
  Name       : string;
  Description: string;
  Icon       : string;
  ToolTip    : string;
}

export interface RawArkPassive {
  Title       : string;
  IsArkPassive: boolean;
  Points      : RawArkPassivePoint[];
  Effects     : RawArkPassiveEffectEntry[];
}

// ============================================================
// arkGrid
// ============================================================

export interface RawArkGridSlot {
  Index: number;
  Name : string;
  Point: number;
  Grade: string;
  Icon : string;
}

export interface RawArkGridEffect {
  Name   : string;
  Level  : number;
  Tooltip: string;
}

export interface RawArkGrid {
  Slots  : RawArkGridSlot[];
  Effects: RawArkGridEffect[];
}

// ============================================================
// skills
// ============================================================

export interface RawTripod {
  Tier      : number;
  Slot      : number;
  Name      : string;
  IsSelected: boolean;
  Icon      : string;
  Tooltip   : string;
}

export interface RawRune {
  Name   : string;
  Grade  : string;
  Icon   : string;
  Tooltip: string;
}

export interface RawSkill {
  Name     : string;
  Icon     : string;
  Level    : number;
  Type     : string;
  SkillType: number;
  Tripods  : RawTripod[];
  Rune     : RawRune | null;
  Tooltip  : string;
}

// ============================================================
// API 응답 최상위
// ============================================================

export interface RawCharacterData {
  profile     : RawProfile;
  equipment   : RawEquipment[];
  avatars     : RawAvatar[];
  engravings  : RawEngravings;
  gems        : RawGems;
  cards       : RawCards;
  arkPassive  : RawArkPassive;
  arkGrid     : RawArkGrid;
  skills      : RawSkill[];
  colosseums  : any;
  collectibles: any[];
  _metadata: {
    characterName     : string;
    fetchedAt         : string;
    requestedEndpoints: string[];
  };
}