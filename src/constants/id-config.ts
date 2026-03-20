/**
 * @/constants/id-config.ts
 *
 * ID 규격 정의
 *
 * [설계 원칙]
 *   - 규격: 8자리 숫자 (AA BB CCCC)
 *   - 왼쪽부터 채우기(0은 무시 가능성 있음)
 *   - AA (2자리): 대분류 (Source / Category)
 *   - BB (2자리): 중분류 (Sub-Category)
 *   - CC (2자리): 소분류 (없으면 BB와 같은값)
 *   - DD (2자리): 고유 인덱스 (Index)가 직접 소비하는 타입
 */

export const ID_AA = {
  EQUIPMENT  : 10,   // 장비 (방어구,무기,악세서리,어빌리티스톤,팔찌,보주)
  AVATAR     : 20,   // 아바타
  SKILL      : 30,   // 스킬,트라이포드
  ENGRAVING  : 40,   // 각인
  CARD       : 50,   // 카드
  GEM        : 60,   // 보석
  ARK_PASSIVE: 70,   // 아크패시브
  ARK_GRID   : 80,   // 아크그리드
} as const;

export const ID_BB = {
  // 10. EQUIPMENT 세부 분류
  EQ_ARMOR: 10,      // 방어구 (머리, 어깨, 상의, 하의, 장갑)
  EQ_WEAPON: 11,     // 무기
  EQ_ACCESSORY: 20,  // 악세서리 (목걸이, 귀걸이, 반지)
  EQ_STONE: 30,      // 어빌리티 스톤
  EQ_BRACELET: 40,   // 팔찌
  EQ_ORB: 50,        // 보주 (엘릭서/초월 등 특수 장비 포함 가능)

  // 30. SKILL 세부 분류
  SKILL_BASE: 10,    // 기본 스킬
  SKILL_TRIPOD: 20,  // 트라이포드 데이터
  SKILL_AWAKENING: 30, // 각성기/초각성기

  // 40. ENGRAVING 세부 분류
  ENGRAVE_COMBAT: 10, // 전투 각인

  // 70. ARK_PASSIVE 세부 분류
  ARK_EVOLUTION: 10,  // 진화
  ARK_ENLIGHTEN: 20,  // 깨달음
  ARK_LEAP: 30,       // 도약
} as const;

//
export const ID_CC = {
  // 10. EQUIPMENT 세부 분류
  EQ_ARMOR: 10,      // 방어구 (머리, 어깨, 상의, 하의, 장갑)
  EQ_WEAPON: 11,     // 무기
  EQ_ACCESSORY: 20,  // 악세서리 (목걸이, 귀걸이, 반지)
  EQ_STONE: 30,      // 어빌리티 스톤
  EQ_BRACELET: 40,   // 팔찌
  EQ_ORB: 50,        // 보주 (엘릭서/초월 등 특수 장비 포함 가능)

  // 30. SKILL 세부 분류
  SKILL_BASE: 10,    // 기본 스킬
  SKILL_TRIPOD: 20,  // 트라이포드 데이터
  SKILL_AWAKENING: 30, // 각성기/초각성기

  // 40. ENGRAVING 세부 분류
  ENGRAVE_COMBAT: 10, // 전투 각인

  // 70. ARK_PASSIVE 세부 분류
  ARK_EVOLUTION: 10,  // 진화
  ARK_ENLIGHTEN: 20,  // 깨달음
  ARK_LEAP: 30,       // 도약
} as const;