/**
 * LostArk Simulator Core Types
 * 시뮬레이션에 필요한 정규화된 데이터 타입을 정의
 * @/type/sim-types
 */

/** 단순 표시용 프로필 정보 */
export interface CharacterProfile {
  name           : string;  // 캐릭터명
  itemLevel      : number;  // 아이템 레벨
  combatPower    : number;  // 전투력
  server         : string;  // 서버
  guild          : string;  // 길드
  className      : string;  // 직업
  enlightenment  : string;  // 깨달음
  title          : string;  // 칭호
  honorLevel     : number;  // 명예
  expeditionLevel: number;  // 원정대 레벨
  territoryName  : string;  // 영지
}

/** 전투 스탯 (기본 수치) */
export interface CombatStats {
  baseAtk       : number;  // 기본 공격력
  mainStat      : number;  // 주스탯 (힘민지)
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
  mainStatStatic   : number;  // 주스탯 고정 증가
  mainStatPercent  : number;  // 주스탯 % 증가
  weaponAtkStatic  : number;  // 무기 공격력 고정 증가
  weaponAtkPercent : number;  // 무기 공격력 % 증가
  baseAtkPercent   : number;  // 기본 공격력 % 증가
  atkStatic        : number;  // 공격력 고정 증가
  atkPercent       : number;  // 최종 공격력 % 증가
}

/** 데미지 계산용 보정치 */
export interface DamageModifiers {
  damageInc         : number;  // 피해 증가
  evolutionDamage   : number;  // 진화형 피해
  specialDamage     : number;  // 특수 피해
  additionalDamage  : number;  // 추가 피해
  critChance        : number;  // 치명타 확률
  critDamage        : number;  // 치명타 피해
  critDamageInc     : number;  // 치명타 시 피해 증가
  defensePenetration: number;  // 방어력 관통
  targetDamageTaken : number;  // 적이 받는 피해 증가

  //유틸리티
  atkSpeed          : number;  // 공격 속도
  movSpeed          : number;  // 이동 속도
  cooldownReduction : number;  // 쿨타임 감소
}

/* [시스템 출처 ID] 데이터의 근원을 식별합니다. */
export type SystemSourceId = 
  | 'ENGRAVING'   // 각인
  | 'GEAR'        // 장비 (세트 효과 등)
  | 'GEM'         // 보석
  | 'CARD'        // 카드
  | 'ARK_PASSIVE' // 아크 패시브
  | 'ARK_GRID'    // 아크 그리드
  | 'SKILL'       // 스킬
  | 'TRIPOD';      // 트라이포드

export const EFFECT_TYPES = [
  'MAIN_STAT_STATIC'  ,  // 주스탯 고정 증가
  'MAIN_STAT_PERCENT' ,  // 주스탯 % 증가
  'WEAPON_ATK_STATIC' ,  // 무기 공격력 고정 증가
  'WEAPON_ATK_PERCENT',  // 무기 공격력 % 증가
  'BASE_ATK_PERCENT'  ,  // 기본 공격력 % 증가 (공증)
  'ATK_STATIC'        ,  // 공격력 고정 증가
  'ATK_PERCENT'       ,  // 최종 공격력 % 증가

  'DMG_INC'         ,  // 피해 증가
  'EVO_DMG'         ,  // 진화형 피해
  'ADD_DMG'         ,  // 추가 피해
  'CRIT_CHANCE'     ,  // 치명타 확률
  'CRIT_DMG'        ,  // 치명타 피해
  'CRIT_DMG_INC'    ,  // 치명타 시 피해 증가
  'DEF_PENETRATION' ,  // 방어력 관통
  'TARGET_DMG_TAKEN',  // 적이 받는 피해 증가

  'ATK_SPEED'         ,  // 공격 속도
  'MOV_SPEED'         ,  // 이동 속도
  'COOLDOWN_REDUCTION',  // 쿨타임 감소
] as const;
export type EffectTypeId = (typeof EFFECT_TYPES)[number];

/** 맵핑 테이블 */
export const EFFECT_MAP: Record<EffectTypeId, keyof (StatModifiers & DamageModifiers)> = {
  // 1. StatModifiers (공격력/주스탯 세부)
  MAIN_STAT_STATIC  : 'mainStatStatic',
  MAIN_STAT_PERCENT : 'mainStatPercent',
  WEAPON_ATK_STATIC : 'weaponAtkStatic',
  WEAPON_ATK_PERCENT: 'weaponAtkPercent',
  BASE_ATK_PERCENT  : 'baseAtkPercent',
  ATK_STATIC        : 'atkStatic',
  ATK_PERCENT       : 'atkPercent',

  // 2. DamageModifiers (데미지 직접 보정)
  DMG_INC         : 'damageInc',
  EVO_DMG         : 'evolutionDamage',
  ADD_DMG         : 'additionalDamage',
  CRIT_CHANCE     : 'critChance',
  CRIT_DMG        : 'critDamage',
  CRIT_DMG_INC    : 'critDamageInc',
  DEF_PENETRATION : 'defensePenetration',
  TARGET_DMG_TAKEN: 'targetDamageTaken',

  // 3. 유틸리티
  ATK_SPEED         : 'atkSpeed',
  MOV_SPEED         : 'movSpeed',
  COOLDOWN_REDUCTION: 'cooldownReduction'
};

/* [피해 증가 관련 특수 타입 ID] */
export type specialTypeId = 
  | 'QI_DMG'    // 가디언 나이트 특수:기운 피해 증가
  | 'QI_COST';  // 가디언 나이트 특수:기운 소모 개수 증가

/* [공격 타입 ID] */
export type AttackTypeId = 
  | 'BACK_ATK'          // 백어택 스킬군
  | 'HEAD_ATK'          // 헤드어택 스킬군
  | 'NON_DIRECTIONAL';  // 비방향성 스킬군

/* [스킬 타입 ID] */
export type SkillTypeId = 
  | 'NORMAL'    // 일반
  | 'CHAIN'     // 체인
  | 'HOLDING'   // 홀딩
  | 'COMBO'     // 콤보
  | 'CHARGE'    // 차지
  | 'POINT'     // 지점
  | 'TOGGLE';   // 토글

/* [슈퍼 아머 ID] */
export type SuperArmorId =
  | 'NONE'
  | 'STIFF_IMMUNE'  //경직 면역 
  | 'PUSH_IMMUNE'   //피격이상 면역
  | 'DEBUFF_IMMUNE' //상태이상 면역
  | 'ALL_IMMUNE';   //기본 무적

/* [소모 자원 ID] */
export type ResourceTypeId = 
  | 'MANA'            // 공통 마나
  | 'QI_EMBERES'       // 가디언나이트 전용: 엠버레스의 기운
  | 'NONE';           // 자원 소모 없음



// 직업별/스킬별 특수 변수 (확장성 고려)
export interface SpecialParam {
  type?: specialTypeId | (string&{});
  value?: number;
  target?: AttackTypeId | SkillTypeId | (string&{});
}

/* [세부 효과 규격] */
export interface SimEffect {
  type: EffectTypeId;
  value: number;
  target: AttackTypeId | SkillTypeId | (string&{});
}

/* [공통 데이터 규격] */
export interface BaseSimData {
  source: SystemSourceId;
  id: string;            // 고유 ID
  name: string;          // 화면 표시 이름
  iconPath: string;
  effects?: SimEffect[];
  special?: SpecialParam[];
}