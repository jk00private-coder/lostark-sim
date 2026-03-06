/**
 * [시스템 출처 ID]
 * 데이터의 근원을 식별합니다.
 */
export type SystemSourceId = 
  | "ENGRAVING"    // 각인
  | "GEAR"         // 장비 (세트 효과 등)
  | "GEM"          // 보석
  | "CARD"         // 카드
  | "ARK_PASSIVE"  // 아크 패시브
  | "ARK_GRID"     // 아크 그리드
  | "SKILL"        // 스킬 및 트라이포드
  | "NONE";

/**
 * [효과 타입 상수 배열]
 * 새로운 효과가 필요하면 여기에 문자열만 추가하세요. 
 * 자동으로 타입과 초기화 로직에 반영됩니다.
 */
export const EFFECT_TYPES = [
  "DMG_INC", 
  "ATK_INC_PERCENT", 
  "ATK_INC_FIXED", 
  "CRIT_CHANCE", 
  "CRIT_DMG", 
  "COOLDOWN_RED", 
  "MOV_SPEED", 
  "ATK_SPEED", 
  "NONE"
] as const;
// 배열로부터 타입을 자동으로 추출 (Union Type 생성)
export type EffectTypeId = (typeof EFFECT_TYPES)[number];

/**
 * [직업별 스킬 ID 정의]
 */
// 1. 가디언나이트
export type GuardianKnightSkillId = 
  | "SPINNING_FLAME" 
  | "ABADDON_FLAME" 
  | "DEEP_IMPACT" 
  | "IMPERNO_BURST" 
  | "GUILLOTINE_SPIN" 
  | "GUARDIAN_BACKLASH" 
  | "BREATH_OF_EMBERS";

// 2. 데빌헌터
export type DevilHunterSkillId = 
  | "JUDGEMENT_DAY"     // 심판의 날
  | "SHOTGUN_RAPID";    // 샷건 연사

// 전체 스킬 ID 통합
export type SkillId = 
  | GuardianKnightSkillId 
  | DevilHunterSkillId 
  | "AWAKENING";

/**
 * [적용 대상/조건 ID]
 */
export type TargetId = 
  | "ALL"               // 전체 공통
  | "BACK_ATK"          // 백어택 스킬군
  | "HEAD_ATK"          // 헤드어택 스킬군
  | "NON_DIRECTIONAL"   // 비방향성 스킬군 (타대 등)
  | SkillId;            // 특정 스킬

/**
 * [세부 효과 규격]
 */
export interface SimEffect {
  type: EffectTypeId;
  value: number;
  target: TargetId;
  isStackable?: boolean;
  maxStack?: number;
  reqStack?: number;
}

/**
 * [트라이포드 규격]
 */
export interface Tripod {
  slot: 1 | 2 | 3;       // 트포 단계
  index: 1 | 2 | 3;      // 단계 내 번호
  name: string;
  effects: SimEffect[];
}

/**
 * [공통 데이터 규격]
 */
export interface BaseSimData {
  source: SystemSourceId;
  id: string;            // 고유 ID (예: "grudge", "JUDGEMENT_DAY")
  name: string;          // 화면 표시 이름
  effects: SimEffect[];
}

// 유물/어빌리티 레벨별 수치를 담는 타입
export interface LevelBonus {
  relic: number[];   // [Lv1, Lv2, Lv3, Lv4] 수치
  ability: number[]; // [Lv1, Lv2, Lv3, Lv4] 수치
}

export interface Engraving extends BaseSimData {
  // 각인의 기본 효과 (아드레날린 6스택 기준 등)
  baseEffects: SimEffect[]; 
  // 레벨업 시 추가되는 보너스 정보
  bonus?: {
    relic?: { type: EffectTypeId; values: number[] };
    ability?: { type: EffectTypeId; values: number[] };
  };
}

/**
 * [스킬 데이터 전용 규격]
 */
export interface SkillData extends BaseSimData {
  source: "SKILL";
  tripods: Tripod[];     // 스킬은 트라이포드를 가짐
}