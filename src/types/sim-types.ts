/**
 * @/types/sim-types.ts
 *
 * 시뮬레이션 공통 타입을 정의합니다.
 *
 * [파일 구조]
 *   1. 전투 스탯 / 보정치 인터페이스
 *   2. Effect 타입 시스템 (EffectEntry, EffectTarget, EFFECT_MAP)
 *   3. 공통 데이터 구조 (BaseSimData)
 *   4. 스킬 관련 타입 ID
 *
 * [설계 원칙]
 *   - CommonEffectTypeId : 모든 직업 공통 효과 타입
 *   - ClassEffectTypeId  : 직업별 특수 효과 타입 유니온 (이 파일에서 관리)
 *   - EffectTypeId       : 위 둘의 유니온 (최종 사용 타입)
 *   - EFFECT_MAP         : 공통 타입 → Modifiers 필드 매핑 (연산 방식은 EffectEntry.operation 이 결정)
 *
 * [네이밍 컨벤션]
 *   - C (Constant) : 고정 상수 증가
 *   - P (Percent)  : 퍼센트 증가
 */


// ============================================================
// 1. 전투 스탯 / 보정치
// ============================================================

/** 전투 스탯 기본 수치 */
export interface CombatStats {
  baseAtk       : number;  // 기본 공격력
  mainStat      : number;  // 주스탯 (힘/민첩/지능)
  weaponAtk     : number;  // 무기 공격력
  critical      : number;  // 치명
  specialization: number;  // 특화
  swiftness     : number;  // 신속
  hp            : number;  // 최대 생명력
  domination    : number;  // 제압
  endurance     : number;  // 인내
  expertise     : number;  // 숙련
}

/** 공격력 및 주스탯 보정치 */
export interface StatModifiers {
  mainStatC : number;  // 주스탯 고정 증가 (C: Constant)
  mainStatP : number;  // 주스탯 % 증가 (P: Percent)
  weaponAtkC: number;  // 무기 공격력 고정 증가
  weaponAtkP: number;  // 무기 공격력 % 증가
  baseAtkP  : number;  // 기본 공격력 % 증가
  atkC      : number;  // 공격력 고정 증가
  atkP      : number;  // 공격력 % 증가
}

/**
 * 데미지 계산용 공통 보정치
 *
 * 모든 직업에 공통으로 존재하는 수치만 포함합니다.
 * 직업별 특수 수치는 ClassModifiers 에서 관리합니다.
 *
 * [초기값]
 *   ADD      계열 : 0
 *   MULTIPLY 계열 : 1.0
 */
export interface DamageModifiers {
  damageInc    : number;  // 피해 증가
  evoDamage    : number;  // 진화형 피해
  addDamage    : number;  // 추가 피해

  critChance   : number;  // 치명타 확률
  critDamage   : number;  // 치명타 피해
  critDamageInc: number;  // 치명타시 피해 증가

  defPenetration  : number;  // 방어력 관통
  enemyDamageTaken: number;  // 적이 받는 피해 증가

  cdrC    : number;  // 쿨타임 고정 감소 (단위: 초)
  cdrP    : number;  // 쿨타임 % 감소
  atkSpeed: number;  // 공격 속도 증가
  movSpeed: number;  // 이동 속도 증가
}


// ============================================================
// 2. Effect 타입 시스템
// ============================================================

/**
 * 공통 Effect 타입 목록
 *
 * 타입(type)      : 무엇에 관한 수치인가 (의미)
 * 연산(operation) : 어떻게 계산하는가 (방식) → EffectEntry 에서 결정
 * 그룹(subGroup)  : 같은 연산 방식 내에서 어떤 단위로 묶는가
 */
export const COMMON_EFFECT_TYPES = [
  'DMG_INC'    ,  // 피해 증가
  'EVO_DMG'    ,  // 진화형 피해
  'ADD_DMG'    ,  // 추가 피해

  'CRIT_CHANCE' ,  // 치명타 확률
  'CRIT_DMG'    ,  // 치명타 피해
  'CRIT_DMG_INC',  // 치명타시 피해 증가

  'DEF_PENETRATION',  // 방어력 관통
  'ENEMY_DMG_TAKEN',  // 적이 받는 피해 증가

  'CDR_C'    ,  // 쿨타임 고정 감소
  'CDR_P'    ,  // 쿨타임 % 감소
  'ATK_SPEED',  // 공격 속도
  'MOV_SPEED',  // 이동 속도

  'MAIN_STAT_C' ,  // 주스탯 고정 증가
  'MAIN_STAT_P' ,  // 주스탯 % 증가
  'WEAPON_ATK_C',  // 무기 공격력 고정 증가
  'WEAPON_ATK_P',  // 무기 공격력 % 증가
  'BASE_ATK_P'  ,  // 기본 공격력 % 증가
  'ATK_C'       ,  // 공격력 고정 증가
  'ATK_P'       ,  // 공격력 % 증가
] as const;
export type CommonEffectTypeId = (typeof COMMON_EFFECT_TYPES)[number];

/**
 * 직업별 특수 Effect 타입 유니온
 * 새 직업 추가 시: | 'SORC_ARCANE_DMG' 등
 */
export type ClassEffectTypeId =
  | 'GK_QI_DMG'   // 가디언나이트: 기운 소모당 피해 증가
  | 'GK_QI_COST'; // 가디언나이트: 기운 소모 개수 변경

/** 최종 EffectTypeId — 공통 + 직업별 유니온 */
export type EffectTypeId = CommonEffectTypeId | ClassEffectTypeId;

/**
 * subGroup 식별자 상수
 *
 * EffectEntry.subGroup 에 직접 문자열을 쓰는 대신 이 상수를 참조합니다.
 * 오탈자를 컴파일 에러로 차단할 수 있습니다.
 *
 * 새로운 그룹이 필요하면 이 상수에만 추가합니다.
 *
 * 사용 예시:
 *   { type: 'DEF_PENETRATION', value: 0.10, operation: 'ADD', subGroup: SUB_GROUPS.DEF_PEN_A }
 */
export const SUB_GROUPS = {
  // 방어력 관통 그룹
  DEF_PEN_A: 'defPenA',
  DEF_PEN_B: 'defPenB',
  // 적이 받는 피해 증가 그룹
  ENEMY_DMG_A: 'enemyDmgA',
  ENEMY_DMG_B: 'enemyDmgB',
} as const;

/**
 * 적용 대상 분류
 *
 * 모든 필드가 optional
 * 아무것도 지정하지 않으면 전체 적용
 */
export interface EffectTarget {
  skillIds?     : string[];             // 특정 스킬 ID 배열
  categories?   : SkillCategory[];      // ENLIGHTEN, GOD_FORM, BASIC 등
  skillTypes?   : SkillTypeId[];        // NORMAL, CHARGE, HOLDING 등
  resourceTypes?: ResourceTypeId[];     // 기운, 마나 등
  hasAttackType?: AttackTypeId[];       // 스킬에 해당 어택타입 태그가 존재하는가
}

/**
 * 모든 효과의 기본 단위
 *
 * [operation 규칙]
 *   ADD      → subGroup 없음: 전체 합산 후 (1 + 합산값) 으로 적용
 *              subGroup 있음: 같은 subGroup끼리 합산 후 그룹 단위로 독립 곱연산
 *   MULTIPLY → 항상 독립 곱연산 (1 + value), subGroup 무시
 *
 * [target 규칙]
 *   없음 → 전체 적용
 *   있음 → target 조건을 모두 만족하는 스킬에만 적용
 */
export interface EffectEntry {
  type      : EffectTypeId;
  value     : number;
  operation : 'ADD' | 'MULTIPLY';
  subGroup? : string;   // SUB_GROUPS 상수 사용 권장, operation: 'ADD' 일 때만 유효
  target?   : EffectTarget;
}

/**
 * EFFECT_MAP 개별 항목
 *
 * 연산 방식은 EffectEntry.operation 이 결정하므로 여기서는 필드 매핑만 담당합니다.
 */
export interface EffectMapEntry {
  field: keyof (StatModifiers & DamageModifiers);
}

/**
 * 공통 Effect → Modifiers 필드 매핑
 *
 * 계산 엔진에서 applyEffect() 가 이 맵을 통해
 * switch 없이 자동으로 해당 필드에 누적합니다.
 *
 * 직업별 타입(GK_QI_DMG 등)은 각 직업 파일의 CLASS_EFFECT_MAP 에서 관리합니다.
 */
export const EFFECT_MAP: Record<CommonEffectTypeId, EffectMapEntry> = {
  DMG_INC: { field: 'damageInc'     },
  EVO_DMG: { field: 'evoDamage'     },
  ADD_DMG: { field: 'addDamage'     },

  CRIT_CHANCE : { field: 'critChance'    },
  CRIT_DMG    : { field: 'critDamage'    },
  CRIT_DMG_INC: { field: 'critDamageInc' },

  DEF_PENETRATION: { field: 'defPenetration'   },
  ENEMY_DMG_TAKEN: { field: 'enemyDamageTaken' },

  CDR_C    : { field: 'cdrC'     },
  CDR_P    : { field: 'cdrP'     },
  ATK_SPEED: { field: 'atkSpeed' },
  MOV_SPEED: { field: 'movSpeed' },

  MAIN_STAT_C : { field: 'mainStatC'  },
  MAIN_STAT_P : { field: 'mainStatP'  },
  WEAPON_ATK_C: { field: 'weaponAtkC' },
  WEAPON_ATK_P: { field: 'weaponAtkP' },
  BASE_ATK_P  : { field: 'baseAtkP'   },
  ATK_C       : { field: 'atkC'       },
  ATK_P       : { field: 'atkP'       },
};


// ============================================================
// 3. 공통 데이터 구조
// ============================================================

/** 시스템 출처 ID */
export type SystemSourceId =
  | 'ENGRAVING'
  | 'GEAR'
  | 'GEM'
  | 'CARD'
  | 'ARK_PASSIVE'
  | 'ARK_GRID'
  | 'SKILL'
  | 'TRIPOD';

/**
 * 계산 무관 메모용 파라미터
 * 시전 속도, 범위 증가 등 딜 계산에 무관한 정보를 기록합니다.
 * ⚠️ 계산에 반영되어야 하는 수치는 반드시 EffectEntry 를 사용하세요.
 */
export interface MemoParam {
  type   : string;
  value  : number;
  target?: string;
}

/** 공통 데이터 규격 */
export interface BaseSimData {
  source  : SystemSourceId;
  id      : string;
  name    : string;
  iconPath: string;
  effects?: EffectEntry[];
  memo?   : MemoParam[];
}


// ============================================================
// 4. 스킬 관련 타입 ID
// ============================================================

/** 공격 타입 ID */
export type AttackTypeId =
  | 'BACK_ATK'         // 백어택
  | 'HEAD_ATK'         // 헤드어택
  | 'NON_DIRECTIONAL'; // 비방향성

/** 스킬 타입 ID */
export type SkillTypeId =
  | 'NORMAL'   // 일반
  | 'CHAIN'    // 체인
  | 'HOLDING'  // 홀딩
  | 'COMBO'    // 콤보
  | 'CHARGE'   // 차지
  | 'POINT'    // 지점
  | 'TOGGLE';  // 토글

/** 스킬 카테고리 */
export type SkillCategory =
  | 'BASIC'           // 일반
  | 'ENLIGHTEN'       // 발현
  | 'GOD_FORM'        // 화신
  | 'HYPER_SKILL'     // 초각성 스킬
  | 'ULTIMATE'        // 각성기
  | 'HYPER_ULTIMATE'; // 초각성기

/** 슈퍼 아머 ID */
export type SuperArmorId =
  | 'NONE'
  | 'STIFF_IMMUNE'   // 경직 면역
  | 'PUSH_IMMUNE'    // 피격이상 면역
  | 'DEBUFF_IMMUNE'  // 상태이상 면역
  | 'ALL_IMMUNE';    // 기본 무적

/** 소모 자원 ID */
export type ResourceTypeId =
  | 'MANA'        // 공통 마나
  | 'QI_EMBERES'  // 가디언나이트: 엠버레스의 기운
  | 'NONE';       // 자원 소모 없음