/**
 * @/types/character-types.ts
 * UI 표시용 가공 데이터 타입 정의
 * data-normalizer.ts가 API 원본 데이터를 이 타입으로 변환함
 */

// ============================================================
// 유틸리티 및 공통 타입
// ============================================================

import { MultiKey } from '@/types/sim-types';

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

/**
 * 모든 표시용 데이터의 최상위 규격 (Base)
 * API에서 가져온 원본(label)과 시스템 ID(id)를 연결하는 핵심 구조
 */
export interface BaseDisplay {
  id: number;           // DB 매칭 ID (실패 시 0)
  name: string;         // UI용 요약 명칭
  label: ColoredText | string;   // API 원본 텍스트, 규칙이있는 색상은 이름만
  isDb: boolean;        // DB 매칭 성공 여부
  idDiff?: boolean;      // DB 범위수치 벗어날 경우 true
  icon?: string;
  values?: ColoredValue[];
  valueRange?: {min: number; max: number};
  opGrade?: OptionGrade; // 상/중/하 옵션
  eqGrade?: MultiKey; // 장비 등급(유물, 고대 등)
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
  refineLv: number;
  advRefineLv: number;
  quality: number;
  itemTier: number;

  // --- 에스더 전용 필드 추가 ---
  estherName?: string;    // 에스더 효과 이름
  ellaLv?: number;        // 엘라 부여 단계 (0~3)
}

// ============================================================
// 악세서리 및 팔찌
// ============================================================

/** 악세서리 및 팔찌의 개별 효과 (Base 상속) */
export interface AccessoryDisplay extends BaseDisplay {
  type: string;
  quality: number;
  tier: number;
  effects: BaseDisplay[];
}

export interface BraceletDisplay extends BaseDisplay {
  itemTier: number;
  effects: BaseDisplay[];
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

export interface AvatarDisplay extends BaseDisplay { }

// ============================================================
// 각인 및 보석
// ============================================================

export interface EngravingDisplay extends BaseDisplay {
  level: number;
  abilityStoneLevel: number;
}

export interface GemDisplay extends BaseDisplay {
  level: number;
  skillName: string;
  effectType: '피해 증가' | '쿨타임 감소';
  baseAtkBonus: number;
}

// ============================================================
// 카드 및 아크 패시브
// ============================================================

export interface CardSetDisplay extends BaseDisplay {
  level: number;
 }

export interface ArkPassivePointDisplay {
  evolution: { level: number; description: string };
  insight: { level: number; description: string };
  leap: { level: number; description: string };
  title: string;
}

export interface ArkPassiveEffectDisplay extends BaseDisplay {
  category: ColoredText;
  tier: number;
  level: number;
  description: string;  
}

export interface ArkGridCoreDisplay extends BaseDisplay {
  point: number;
} 

export interface ArkGridEffectDisplay {
  label: string;
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
  category: ColoredText;
  selectedTripods: SelectedTripodDisplay[];
  rune: EquippedRuneDisplay;
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
  gems: GemDisplay[];
  cards: CardSetDisplay | null;
  arkPassive: {
    points: ArkPassivePointDisplay;
    effects: ArkPassiveEffectDisplay[];
  } | null;
  arkGrid: ArkGridDisplay;
  skills: SkillDisplay[];
}