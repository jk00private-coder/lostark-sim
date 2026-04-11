/**
 * @/types/sim-types.ts
 *
 * [파일 구조]
 *   1. 공통 UI 타입 (ColoredText, ColoredValue)
 *   2. 전투 스탯 / 보정치 인터페이스
 *   3. Effect 타입 시스템 (EffectEntry, EffectTarget, EFFECT_MAP)
 *   4. 공통 데이터 구조 (BaseSimData)
 *   5. 스킬 관련 타입 ID
 *
 * [설계 원칙]
 *   - EffectEntry : 계산 + UI 공용 규격
 *   - subGroup 없음 → 독립 곱연산
 *   - subGroup 있음 → 같은 그룹 합산 후 1회 곱연산
 *   - 다른 type 끼리 → 곱연산 (디폴트)
 *
 * [네이밍 컨벤션]
 *   - C (Constant) : 고정 상수 증가
 *   - P (Percent)  : 퍼센트 증가
 */


// ============================================================
// 1. 공통 UI 타입
// ============================================================

/**
 * color 없으면 기본색(흰색) 처리
 */


// ============================================================
// 2. 전투 스탯 / 보정치
// ============================================================

/** 전투 스탯 기본 수치 */
export interface CombatStats {
  baseAtk: number;  // 기본 공격력
  mainStat: number;  // 주스탯 역산값
  weaponAtk: number;  // 계산된 무기 공격력
  finalAtk: number;  // 최종 공격력
  critical: number;  // 치명
  specialization: number;  // 특화
  swiftness: number;  // 신속
  hp: number;  // 최대 생명력
  domination: number;  // 제압
  endurance: number;  // 인내
  expertise: number;  // 숙련
}

/** 공격력 및 주스탯 보정치 */
export interface StatModifiers {
  mainStatC: number;  // 주스탯 고정 증가
  mainStatP: number;  // 주스탯 % 증가
  weaponAtkC: number;  // 무기 공격력 고정 증가
  weaponAtkP: number;  // 무기 공격력 % 증가
  baseAtkP: number;  // 기본 공격력 % 증가
  atkC: number;  // 공격력 고정 증가
  atkP: number;  // 공격력 % 증가
  critC: number;  // 치명스탯 증가
  specC: number;  // 특화스탯 증가
  swiftC: number;  // 신속스탯 증가
  domC: number;  // 제압스탯 증가
  endC: number;  // 인내스탯 증가
  expC: number;  // 숙련스탯 증가
  hpC: number;  // 생명력 고정 증가
  hpP: number;  // 생명력 % 증가
}

/**
 * 데미지 계산용 공통 보정치
 *
 * [초기값]
 *   일반 계열 : 1.0 (damageInc, critDamageInc)
 *   합산 계열 : 0
 *   critDamage: 2.0 (기본 치명타 피해 200%)
 */
export interface DamageModifiers {
  damageInc: number;  // 피해 증가 (초기 1.0)
  evoDamage: number;  // 진화형 피해
  addDamage: number;  // 추가 피해
  critChance: number;  // 치명타 확률
  critDamage: number;  // 치명타 피해 (초기 2.0)
  critDamageInc: number;  // 치명타시 피해 증가 (초기 1.0)
  defPenetration: number;  // 방어력 관통
  enemyDamageTaken: number;  // 적이 받는 피해 증가
  cdrC: number;  // 쿨타임 고정 감소
  cdrP: number;  // 쿨타임 % 감소
  spdAtk: number;  // 공격 속도 증가
  spdMov: number;  // 이동 속도 증가
}


// ============================================================
// 3. Effect 타입 시스템
// ============================================================

/**
 * 공통 Effect 타입 목록
 */
export const COMMON_EFFECT_TYPES = [
  'DMG_INC',  // 피해 증가
  'EVO_DMG',  // 진화형 피해
  'ADD_DMG',  // 추가 피해
  'CRIT_CHANCE',  // 치명타 확률
  'CRIT_DMG',  // 치명타 피해
  'CRIT_DMG_INC',  // 치명타시 피해 증가
  'DEF_PENETRATION',  // 방어력 관통
  'ENEMY_DMG_TAKEN',  // 적이 받는 피해 증가
  'CDR_C',  // 쿨타임 고정 감소
  'CDR_P',  // 쿨타임 % 감소
  'SPEED_ATK',  // 공격 속도
  'SPEED_MOV',  // 이동 속도
  'MAIN_STAT_C',  // 주스탯 고정 증가
  'MAIN_STAT_P',  // 주스탯 % 증가
  'WEAPON_ATK_C',  // 무기 공격력 고정 증가
  'WEAPON_ATK_P',  // 무기 공격력 % 증가
  'BASE_ATK_P',  // 기본 공격력 % 증가
  'ATK_C',  // 공격력 고정 증가
  'ATK_P',  // 공격력 % 증가

  'STAT_CRIT',      // 치명 (고정치)
  'STAT_SPEC',      // 특화 (고정치)
  'STAT_SWIFT',     // 신속 (고정치)
  'STAT_DOM',       // 제압 (고정치)
  'STAT_END',       // 인내 (고정치)
  'STAT_EXP',       // 숙련 (고정치)
  'STAT_HP_C',      // 생명력 고정 증가
  'STAT_HP_P',      // 생명력 % 증가
] as const;
export type CommonEffectTypeId = (typeof COMMON_EFFECT_TYPES)[number];

/**
 * 직업별 특수 Effect 타입 유니온
 * 새 직업 추가 시: | 'SORC_ARCANE_DMG' 등
 */
export type ClassEffectTypeId =
  | 'GK_QI_DMG'   // 가디언나이트: 기운 소모당 피해 증가
  | 'GK_QI_COST'; // 가디언나이트: 기운 소모 개수 변경

/** 최종 EffectTypeId */
export type EffectTypeId = CommonEffectTypeId | ClassEffectTypeId;

/**
 * subGroup 식별자 상수
 * 
 * todo: 섭그룹이 생길때마다 여기에 작성해야 하는지 검토
 */
export const SUB_GROUPS = {
  CARD  : 'card',   // 카드 피해 — 카드끼리 합산 후 1회 곱연산
  SHN_03: 'snh03',  // 업화 해3 14p, 17p
  SND_03: 'snd03',  // 드레드 해3 14p, 17p
  MAIN_STAT_C_GROUP: 'mainStatC',
} as const;

// export type SUB_GROUPS =
//   | 'CARD'// 카드 피해 — 카드끼리 합산 후 1회 곱연산
//   | 'SHN_03'// 업화 해3 14p, 17p
//   | 'SND_03'// 드레드 해3 14p, 17p
//   | 'MAIN_STAT_C_GROUP';

/**
 * 적용 대상 분류
 */
export interface EffectTarget {
  skillIds?: number[];
  categories?: SkillCategory[];
  skillTypes?: SkillTypeId[];
  resourceTypes?: ResourceTypeId[];
  attackType?: AttackTypeId[];
}

/**
 * 모든 효과의 기본 단위 — 계산 + UI 공용
 *
 * [연산 규칙]
 *  subGroup 있음 → 합연산
 *  subGroup 없음 → 곱연산
 *
 * [value]
 *   DB 작성 시 color 없으면 생략 가능
 */

// ── OptionGrades (공통) ─────────────────────────────────
// 상중하 범위가 필요한 효과에 사용 (팔찌, 악세서리 등)
// grade: 장비 등급에 따른 수치 작성
// 인덱스 0: 최솟값, 인덱스 1: 최댓값
// 특수효과형은 min === max 로 작성
// ex) 추가피해 하: [0.025, 0.025]
export interface OptionGrades {
  low : [number, number];
  mid : [number, number];
  high: [number, number];
}
// 상중하 등급 색깔 — 게임 내 고정값
export const OPTION_GRADE_COLORS = {
  low : '#00B5FF',  // 파랑
  mid : '#CE43FC',  // 보라
  high: '#FE9600',  // 주황
} as const;

export type MultiKey = 'RELIC' | 'ANCIENT' | 'ANCIENT_2';

export type EffectEntry = {
  type       : EffectTypeId;
  valueColor?: string;
  subGroup?  : string;
  target?    : EffectTarget;
} & (
  | { value: number[]; grades?: never; multiValues?: never; multiGrades?: never }
  | { grades: OptionGrades; value?: never; multiValues?: never; multiGrades?: never }
  | { 
      multiValues: Partial<Record<MultiKey, number[]>>; 
      value?: never; grades?: never; multiGrades?: never
    } 
  | { 
      multiGrades: Partial<Record<MultiKey, OptionGrades>>;
      value?: never; grades?: never; multiValues?: never;
    }
);


/**
 * EFFECT_MAP 개별 항목
 * 연산 방식은 subGroup으로 결정되므로 필드 매핑만 담당
 */
export interface EffectMapEntry {
  field: keyof (StatModifiers & DamageModifiers & CombatStats);
}

/** 공통 Effect → Modifiers 필드 매핑 */
export const EFFECT_MAP: Record<CommonEffectTypeId, EffectMapEntry> = {
  // --- 기존 피해/유틸 관련 ---
  DMG_INC        : { field: 'damageInc' },
  EVO_DMG        : { field: 'evoDamage' },
  ADD_DMG        : { field: 'addDamage' },
  CRIT_CHANCE    : { field: 'critChance' },
  CRIT_DMG       : { field: 'critDamage' },
  CRIT_DMG_INC   : { field: 'critDamageInc' },
  DEF_PENETRATION: { field: 'defPenetration' },
  ENEMY_DMG_TAKEN: { field: 'enemyDamageTaken' },
  CDR_C          : { field: 'cdrC' },
  CDR_P          : { field: 'cdrP' },
  SPEED_ATK      : { field: 'spdAtk' },
  SPEED_MOV      : { field: 'spdMov' },
  MAIN_STAT_C    : { field: 'mainStatC' },
  MAIN_STAT_P    : { field: 'mainStatP' },
  WEAPON_ATK_C   : { field: 'weaponAtkC' },
  WEAPON_ATK_P   : { field: 'weaponAtkP' },
  BASE_ATK_P     : { field: 'baseAtkP' },
  ATK_C          : { field: 'atkC' },
  ATK_P          : { field: 'atkP' },

  // --- 추가: 전투 특성(CombatStats) 직접 매핑 ---
  STAT_CRIT : { field: 'critC' },
  STAT_SPEC : { field: 'specC' },
  STAT_SWIFT: { field: 'swiftC' },
  STAT_DOM  : { field: 'domC' },
  STAT_END  : { field: 'endC' },
  STAT_EXP  : { field: 'expC' },
  STAT_HP_C : { field: 'hpC' },
  STAT_HP_P : { field: 'hpP' }
};

// ============================================================
// 4. 시뮬레이션 시나리오 구조
// ============================================================


// ============================================================
// 5. 공통 데이터 구조
// ============================================================



/**
 * 계산 무관 메모용 파라미터
 * ⚠️ 계산에 반영되어야 하는 수치는 반드시 EffectEntry 사용
 */
export interface MemoParam {
  type: string;
  value: number;
  target?: string;
}

/**
 * 공통 데이터 규격
 * API 데이터 + DB 데이터 모두 이 규격으로 통일
 * 
 * label: API 툴팁 매칭용
 * name : UI 표시용
 */
export interface BaseSimData {
  id        : number;
  name     ?: string;
  label    ?: string;
  nameColor?: string;
  iconPath ?: string;
  effects  ?: EffectEntry[];
  memo     ?: MemoParam[];
}

// ============================================================
// 5. 스킬 관련 타입 ID
// ============================================================

/** 공격 타입 ID */
export type AttackTypeId =
  | 'BACK_ATK'
  | 'HEAD_ATK'
  | 'NON_DIRECTIONAL';

/** 스킬 타입 ID */
export type SkillTypeId =
  | 'NORMAL'
  | 'CHAIN'
  | 'HOLDING'
  | 'COMBO'
  | 'CHARGE'
  | 'POINT'
  | 'TOGGLE'
  | 'CASTING';

/** 스킬 카테고리 */
export type SkillCategory =
  | 'BASIC'
  | 'ENLIGHTEN'
  | 'GOD_FORM'
  | 'HYPER_SKILL'
  | 'ULTIMATE'
  | 'HYPER_ULTIMATE';

/** 슈퍼 아머 ID */
export type SuperArmorId =
  | 'NONE'
  | 'STIFF_IMMUNE'   // 경직 면역
  | 'PUSH_IMMUNE'    // 피격 면역
  | 'DEBUFF_IMMUNE'; // 상태 이상 면역

/** 소모 자원 ID */
export type ResourceTypeId =
  | 'MANA'
  | 'QI_EMBERES'
  | 'NONE';