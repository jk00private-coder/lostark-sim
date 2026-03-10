// @/types/skill-types

import {
  BaseSimData, SkillTypeId, AttackTypeId, SuperArmorId, ResourceTypeId,
  SimEffect, SpecialParam  
} from './sim-types';

export type SkillCategory = 
  | "BASIC"           // 일반
  | "ENLIGHTEN"       // 발현
  | "GOD_FORM"        // 화신
  | "HYPER_SKILL"     // 초각성스킬
  | "ULTIMATE"        // 각성기
  | "HYPER_ULTIMATE"  // 초각성기

export interface SkillResource {
  isStatic: boolean;  // 레벨 변수 여부
  typeId: ResourceTypeId;
  values: number[];   // 레벨별 값(고정이면 index 0만 사용)
}

export interface SkillLevelData {
  isStatic?: boolean;            // 레벨 고정 여부
  damageSources: {
    name: string;
    isCombined: boolean;         // 메인 딜 합산 여부
    hits: number;
    constants: number[];
    coefficients: number[];
  }[];
}

// 룬 정보 (간소화)
export interface EquippedRune {
  runeId: string;   // ex: "GALWIND" (질풍), "BLEED" (출혈)
  rarity: string;   // ex: "LEGEND", "EPIC"
}

// 보석 정보 (11개 슬롯 관리용)
export interface EquippedGem {
  slotIndex: number; // 0 ~ 10
  gemType: "DMG" | "CDR"; // 멸화(피증) 또는 작열(쿨감)
  level: number;     // 1 ~ 10레벨
  targetSkillId: string; // 적용할 스킬 ID (ex: "gk_02")
}

/* [트라이포드 규격] */
export interface TripodData extends BaseSimData {
  slot: 1 | 2 | 3;
  index: 1 | 2 | 3;
  link?: { slot: number; index: number };
  
  cases?: {
    if: { s1?: number; s2?: number; s3?: number };
    then: {
      effects?: SimEffect[];
      special?: SpecialParam[];
      overrides?: TripodData['overrides'];
      addDamageSources?: SkillLevelData;
    };
  };

  addDamageSources?: SkillLevelData;

  overrides?: {
    typeId?: SkillTypeId;
    attackId?: AttackTypeId;
    destruction?: number;
    stagger?: string;
    superArmorId?: SuperArmorId;
    hits?: number;
  };
}

/* [최종 스킬 데이터 규격] */
export interface SkillData extends BaseSimData {
  category: SkillCategory[];    // 스킬 종류
  typeId: SkillTypeId;          // 스킬 타입
  attackId: AttackTypeId;       // 공격 타입
  resource?: SkillResource;     // 소모 타입
  destruction: number;          // 부위 파괴
  stagger: string;              // 무력화
  superArmorId: SuperArmorId;   // 공격 면역
  cooldown: number;             // 기본 쿨타임
  levels: SkillLevelData;     // 레벨별 상수/계수
  tripods?: TripodData[]; // 트라이포드 규격 포함
}








