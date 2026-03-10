// @/type/sim-types

/* [시스템 출처 ID] 데이터의 근원을 식별합니다. */
export type SystemSourceId = 
  | 'ENGRAVING'   // 각인
  | 'GEAR'        // 장비 (세트 효과 등)
  | 'GEM'         // 보석
  | 'CARD'        // 카드
  | 'ARK_PASSIVE' // 아크 패시브
  | 'ARK_GRID'    // 아크 그리드
  | 'SKILL'       // 스킬
  | 'TRIPOD'      // 트라이포드
  | 'NONE';

/* [피해 증가 타입 상수 배열]
  calculator에 자동 초기화하기 위해 이와 같이 구성 */
export const EFFECT_TYPES = [
  'DMG_INC',          // 피해 증가
  'ATK_INC_PERCENT',  // 공격력 % 증가
  'ATK_INC_FIXED',    // 공격력 상수 증가
  'CRIT_CHANCE',      // 치명타 확률
  'CRIT_DMG',         // 치명타 피해
  'COOLDOWN_DELTA',   // 쿨타임 증감
  'MOV_SPEED',        // 공격 속도 증가
  'ATK_SPEED',        // 이동 속도 증가
  'NONE'
] as const;
export type EffectTypeId = (typeof EFFECT_TYPES)[number];

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

/* [피해 증가 관련 특수 타입 ID] */
export type specialTypeId = 
  | 'QI_DMG'    // 가디언 나이트 특수:기운 피해 증가
  | 'QI_COST';  // 가디언 나이트 특수:기운 소모 개수 증가

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