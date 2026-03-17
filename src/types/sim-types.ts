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
 *   - EFFECT_MAP         : 공통 타입만 포함, 직업별은 각 파일에서 정의
 *   - ADD  계열 초기값   : 0
 *   - MULTIPLY 계열 초기값: 1.0
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
  mainStatStatic  : number;  // 주스탯 고정 증가 (ADD, 초기 0)
  mainStatPercent : number;  // 주스탯 % 증가 (ADD, 초기 0)
  weaponAtkStatic : number;  // 무기 공격력 고정 증가 (ADD, 초기 0)
  weaponAtkPercent: number;  // 무기 공격력 % 증가 (ADD, 초기 0)
  baseAtkPercent  : number;  // 기본 공격력 % 증가 (ADD, 초기 0)
  atkStatic       : number;  // 공격력 고정 증가 (ADD, 초기 0)
  atkPercent      : number;  // 공격력 % 증가 (ADD, 초기 0)
}

/**
 * 데미지 계산용 공통 보정치
 * 모든 직업에 공통으로 존재하는 수치만 포함합니다.
 * 직업별 특수 수치는 ClassModifiers 에서 관리합니다.
 *
 * MULTIPLY 계열은 초기값이 1.0 입니다.
 * ADD 계열은 초기값이 0 입니다.
 */
export interface DamageModifiers {
  // 피해 관련 (MULTIPLY — 독립 곱연산)
  damageInc    : number;  // 피해 증가 (초기 1.0)
  critDamageInc: number;  // 치명타시 피해 증가 (초기 1.0)
  cdr          : number;  // 쿨타임 감소 % (초기 1.0)

  // 피해 관련 (ADD — 합연산)
  evoDamage        : number;  // 진화형 피해 (초기 0)
  addDamage        : number;  // 추가 피해 (초기 0)
  critChance       : number;  // 치명타 확률 (초기 0)
  critDamage       : number;  // 치명타 피해 (초기 0)
  defPenetration   : number;  // 방어력 관통 (초기 0)
  targetDamageTaken: number;  // 적이 받는 피해 증가 (초기 0)

  // 유틸리티 (ADD)
  atkSpeed: number;  // 공격 속도 증가 (초기 0)
  movSpeed: number;  // 이동 속도 증가 (초기 0)
  cdrFlat : number;  // 고정 쿨타임 감소 (초기 0, 단위: 초)
}


// ============================================================
// 2. Effect 타입 시스템
// ============================================================

/**
 * 공통 Effect 타입 목록
 * 모든 직업에서 사용 가능한 효과 타입입니다.
 */
export const COMMON_EFFECT_TYPES = [
  // 피해 (MULTIPLY)
  'DMG_INC'    ,  // 피해 증가
  'CRIT_DMG_INC',  // 치명타시 피해 증가
  'CDR'        ,  // 쿨타임 감소 %

  // 피해 (ADD)
  'EVO_DMG'        ,  // 진화형 피해
  'ADD_DMG'        ,  // 추가 피해
  'CRIT_CHANCE'    ,  // 치명타 확률
  'CRIT_DMG'       ,  // 치명타 피해
  'DEF_PENETRATION',  // 방어력 관통
  'TARGET_DMG_TAKEN',  // 적이 받는 피해 증가

  // 유틸리티 (ADD)
  'ATK_SPEED',  // 공격 속도
  'MOV_SPEED',  // 이동 속도
  'CDR_FLAT' ,  // 고정 쿨타임 감소 (초)

  // 공격력 (ADD)
  'MAIN_STAT_STATIC'  ,  // 주스탯 고정 증가
  'MAIN_STAT_PERCENT' ,  // 주스탯 % 증가
  'WEAPON_ATK_STATIC' ,  // 무기 공격력 고정 증가
  'WEAPON_ATK_PERCENT',  // 무기 공격력 % 증가
  'BASE_ATK_PERCENT'  ,  // 기본 공격력 % 증가
  'ATK_STATIC'        ,  // 공격력 고정 증가
  'ATK_PERCENT'       ,  // 공격력 % 증가
] as const;

export type CommonEffectTypeId = (typeof COMMON_EFFECT_TYPES)[number];

/**
 * 직업별 특수 Effect 타입 유니온
 * 새 직업 추가 시 여기에 | NewClassEffectTypeId 를 추가합니다.
 * 각 직업별 타입은 src/types/skills/{직업}-effects.ts 에서 정의합니다.
 */
// import { GkEffectTypeId } from './skills/guardian-knight-effects'
export type ClassEffectTypeId =
  | 'GK_QI_DMG'   // 가디언나이트: 기운 소모당 피해 증가
  | 'GK_QI_COST'; // 가디언나이트: 기운 소모 개수 변경
  // 새 직업 추가 시: | 'SORC_ARCANE_DMG' 등

/** 최종 EffectTypeId — 공통 + 직업별 유니온 */
export type EffectTypeId = CommonEffectTypeId | ClassEffectTypeId;

/**
 * 적용 대상 분류
 *
 * 모든 필드가 optional 이며 복수 지정 가능합니다.
 * 지정된 조건을 모두 만족하는 스킬에만 적용됩니다.
 * 아무것도 지정하지 않으면 전체 적용입니다.
 */
export interface EffectTarget {
  attackType?   : AttackTypeId[];   // HEAD_ATK, BACK_ATK, NON_DIRECTIONAL
  skillCategory?: SkillCategory[];  // ENLIGHTEN, GOD_FORM, BASIC 등
  skillType?    : SkillTypeId[];    // NORMAL, CHARGE, HOLDING 등
  skillId?      : string;           // 특정 스킬 ID
  resource?     : ResourceTypeId;   // QI_EMBERES, MANA 등 (리소스 타입 스킬만)
}

/**
 * 모든 효과의 기본 단위
 *
 * [operation 규칙]
 *   ADD      → 같은 타입끼리 합산 후 최종 계산식에 (1 + 합산값) 으로 적용
 *   MULTIPLY → 각각 독립 곱연산 (1 + value) × (1 + value) × ...
 *
 * [target 규칙]
 *   없음 → 전체 적용
 *   있음 → target 조건을 모두 만족하는 스킬에만 적용
 */
export interface EffectEntry {
  type     : EffectTypeId;
  value    : number;
  operation: 'ADD' | 'MULTIPLY';
  target?  : EffectTarget;
}

/**
 * EFFECT_MAP 개별 항목
 * field: AllModifiers 에서 누적할 필드명
 * operation: 해당 타입의 연산 방식
 */
export interface EffectMapEntry {
  field    : keyof (StatModifiers & DamageModifiers);
  operation: 'ADD' | 'MULTIPLY';
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
  // 피해 (MULTIPLY)
  DMG_INC      : { field: 'damageInc',     operation: 'MULTIPLY' },
  CRIT_DMG_INC : { field: 'critDamageInc', operation: 'MULTIPLY' },
  CDR          : { field: 'cdr',           operation: 'MULTIPLY' },

  // 피해 (ADD)
  EVO_DMG         : { field: 'evoDamage',         operation: 'ADD' },
  ADD_DMG         : { field: 'addDamage',          operation: 'ADD' },
  CRIT_CHANCE     : { field: 'critChance',         operation: 'ADD' },
  CRIT_DMG        : { field: 'critDamage',         operation: 'ADD' },
  DEF_PENETRATION : { field: 'defPenetration',     operation: 'ADD' },
  TARGET_DMG_TAKEN: { field: 'targetDamageTaken',  operation: 'ADD' },

  // 유틸리티 (ADD)
  ATK_SPEED: { field: 'atkSpeed', operation: 'ADD' },
  MOV_SPEED: { field: 'movSpeed', operation: 'ADD' },
  CDR_FLAT : { field: 'cdrFlat',  operation: 'ADD' },

  // 공격력 (ADD)
  MAIN_STAT_STATIC  : { field: 'mainStatStatic',   operation: 'ADD' },
  MAIN_STAT_PERCENT : { field: 'mainStatPercent',  operation: 'ADD' },
  WEAPON_ATK_STATIC : { field: 'weaponAtkStatic',  operation: 'ADD' },
  WEAPON_ATK_PERCENT: { field: 'weaponAtkPercent', operation: 'ADD' },
  BASE_ATK_PERCENT  : { field: 'baseAtkPercent',   operation: 'ADD' },
  ATK_STATIC        : { field: 'atkStatic',        operation: 'ADD' },
  ATK_PERCENT       : { field: 'atkPercent',       operation: 'ADD' },
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