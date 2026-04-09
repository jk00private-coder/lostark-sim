/**
 * @/types/character-types.ts
 * UI 표시용 가공 데이터 타입 정의
 * data-normalizer.ts가 API 원본 데이터를 이 타입으로 변환함
 */

// ============================================================
// 유틸리티 및 공통 타입
// ============================================================

export interface ColoredValue {
  value: number;
  color?: string;
}

export interface ColoredText {
  text: string;
  color?: string;
}

/** 상/중/하 옵션 등급 */
export type OptionGrade = 'HIGH' | 'MID' | 'LOW';

/** 장비 세트 타입 */
export type EquipmentSetType =
  | 'NORMAL_RELIC'
  | 'AEGIR_ANCIENT'
  | 'SERCA_ANCIENT'
  | 'UNKNOWN';

/**
 * 모든 표시용 데이터의 최상위 규격 (Base)
 * API에서 가져온 원본(label)과 시스템 ID(id)를 연결하는 핵심 구조
 */
export interface BaseDisplay {
  id: number;           // DB 매칭 ID (실패 시 0)
  name: string;         // UI용 요약 명칭
  label: ColoredText;   // API 원본 텍스트
  isDb: boolean;        // DB 매칭 성공 여부
  icon?: string;
  value?: ColoredValue;
  opGrade?: OptionGrade; // 상/중/하 (악세, 팔찌 등)
  eqGrade?: ColoredText; // 유물, 고대 등 (장비 등급 명칭)
}

// ============================================================
// 프로필 및 전투 특성
// ============================================================

export interface CharacterProfileDisplay {
  name: string;
  className: string;
  characterLevel: number;
  itemAvgLevel: number;
  combatPower: number;
  serverName: string;
  guildName: string;
  guildGrade: string;
  expeditionLevel: number;
  townLevel: number;
  townName: string;
  title: string;
  honorLevel: number;
  characterImage: string;
}

export interface CombatStatsDisplay {
  critical: number;
  specialization: number;
  swiftness: number;
  domination: number;
  endurance: number;
  expertise: number;
  maxHp: number;
  attackPower: number;
}

// ============================================================
// 장비 (무기/방어구)
// ============================================================

export interface EquipmentDisplay extends BaseDisplay {
  itemLv: number;
  refineStep: number;
  adv_refine?: number;
  quality: number;
  itemTier: number;
  setType: EquipmentSetType;
}

// ============================================================
// 악세서리 및 팔찌
// ============================================================

/** 악세서리 및 팔찌의 개별 효과 (Base 상속) */
export interface AccessoryEffect extends BaseDisplay {}

export interface AccessoryDisplay extends BaseDisplay {
  quality: number;
  itemTier: number;
  effects: AccessoryEffect[]; // 기본 효과 및 연마 효과 통합
}

export interface BraceletDisplay extends BaseDisplay {
  effects: AccessoryEffect[]; // isFixed 제거 후 통합 규격 사용
}

// ============================================================
// 어빌리티 스톤, 보주, 아바타
// ============================================================

export interface AbilityStoneDisplay extends BaseDisplay {
  baseAtkBonus: number;
  engravings: {
    name: ColoredText;
    level: ColoredValue;
  }[];
  penalty: {
    name: ColoredText;
    level: ColoredValue;
  } | null;
}

export interface BoJuDisplay extends BaseDisplay {
  seasonLabel: string;
  paradoxPower: number;
}
/**
 * todo: 자동화할려면 API에서 넘어오는 IsSet, IsInner 필요 여부?
 *       아니면 모든 아바타를 스캔후 같은 부위에 여러 아바타 일경우 Grade가 높은 아바타만 표시?
 */
export interface AvatarDisplay extends BaseDisplay {
  mainStatBonus: number;
}

// ============================================================
// 각인 및 보석
// ============================================================

export interface EngravingDisplay extends BaseDisplay {
  level: number;
  abilityStoneLevel: number | null;
}

export interface GemDisplay extends BaseDisplay {
  slot: number;
  level: number;
  skillName: ColoredText;
  baseAtkBonus: number;
}

// ============================================================
// 카드 및 아크 패시브
// ============================================================

export interface CardSetDisplay extends BaseDisplay {
  totalAwake: number;
  activeItems: {
    name: string;
    description: string;
    value?: ColoredValue;
  }[];
}

export interface ArkPassivePointDisplay {
  evolution: { value: number; description: string };
  insight: { value: number; description: string };
  leap: { value: number; description: string };
  title: string;
}

export interface ArkPassiveEffectDisplay extends BaseDisplay {
  category: ColoredText;
  tier: number;
  level: number;
  description: string;
}

export interface ArkGridCoreDisplay extends BaseDisplay {
  point: ColoredValue;
}

export interface ArkGridEffectDisplay {
  label: ColoredText;
  level: number;
  value: ColoredValue;
}

export interface ArkGridDisplay {
  cores: ArkGridCoreDisplay[];
  effects: ArkGridEffectDisplay[];
}

// ============================================================
// 스킬
// ============================================================

export interface SelectedTripodDisplay extends BaseDisplay {
  tier: number;
  slot: number;
}

export interface EquippedRuneDisplay extends BaseDisplay { }

export interface SkillDisplay extends BaseDisplay {
  level: number;
  skillType: number;
  category: ColoredText;
  isUsed: boolean;
  selectedTripods: SelectedTripodDisplay[];
  rune: EquippedRuneDisplay | null;
}

// ============================================================
// 최상위 캐릭터 표시 데이터 구조 (CharacterDisplayData)
// ============================================================

export interface CharacterDisplayData {
  profile: CharacterProfileDisplay;
  combatStats: CombatStatsDisplay;
  equipment: EquipmentDisplay[];
  accessories: AccessoryDisplay[];
  bracelet: BraceletDisplay | null;
  abilityStone: AbilityStoneDisplay | null;
  boJu: BoJuDisplay | null;
  avatars: AvatarDisplay[];
  engravings: EngravingDisplay[];
  gems: GemDisplay[]; // GemSummaryDisplay 제거 후 배열로 관리
  cards: CardSetDisplay | null;
  arkPassive: {
    points: ArkPassivePointDisplay;
    effects: ArkPassiveEffectDisplay[];
  };
  arkGrid: ArkGridDisplay;
  skills: SkillDisplay[];
}