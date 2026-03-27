/**
 * @/constants/id-config.ts
 *
 * ID 규격 정의
 *
 * [설계 원칙]
 *   - 규격: 8자리 숫자 (AA BB C D EE)
 *   - 왼쪽부터 채우기(0은 무시 가능성 있음)
 *   - AA (2자리): 대분류 (Source / Category)
 *   - BB (2자리): 중분류 (Root Class)
 *   - C  (1자리) : 소분류1 (...)
 *   - D  (1자리) : 소분류2 (...)
 *   - EE (2자리): 고유 인덱스 (Index)가 직접 소비하는 타입
 */

export const ID_AA = {
  EQUIPMENT  : 10,   // 장비
  AVATAR     : 20,   // 아바타
  SKILL      : 30,   // 스킬,트라이포드
  ENGRAVING  : 40,   // 각인
  CARD       : 50,   // 카드
  GEM        : 60,   // 보석
  ARK_PASSIVE: 70,   // 아크패시브
  ARK_GRID   : 80,   // 아크그리드
} as const;

export const ID_BB = {
  // 직업 공통
  COMMON: 10,

  // 전사 (Warrior)
  ROOT_WARRIOR: 20,
  GUNLANCER   : 21, // 워로드
  BERSERKER   : 22, // 버서커
  DESTROYER   : 23, // 디스트로이어
  PALADIN     : 24, // 홀리나이트
  SLAYER      : 25, // 슬레이어
  VALKYRIE    : 26, // 발키리

  // 무도가 (Fighter)
  ROOT_FIGHTER : 30,
  SCRAPPER     : 31, // 인파이터
  WARDANCER    : 32, // 배틀마스터
  SOULFIST     : 33, // 기공사
  GLAIVIER     : 34, // 창술사
  STRIKER      : 35, // 스트라이커
  BREAKER      : 36, // 브레이커

  // 헌터 (Hunter)
  ROOT_HUNTER  : 40,
  DEADEYE      : 41, // 데빌헌터
  SHARPSHOOTER : 42, // 호크아이
  ARTILLERIST  : 43, // 블래스터
  MACHINIST    : 44, // 스카우터
  GUNSLINGER   : 45, // 건슬링어

  // 마법사 (Magician)
  ROOT_MAGICIAN: 50,
  ARCANIST     : 51, // 아르카나
  SUMMONER     : 52, // 서머너
  BARD         : 53, // 바드
  SORCERESS    : 54, // 소서리스

  // 암살자 (Assassin)
  ROOT_ASSASSIN: 60,
  DEATHBLADE   : 61, // 블레이드
  SHADOWHUNTER : 62, // 데모닉
  REAPER       : 63, // 리퍼
  SOULEATER    : 64, // 소울이터

  // 스페셜리스트 (Specialist)
  ROOT_SPECIALIST: 70,
  ARTIST         : 71, // 도화가
  AEROMANCER     : 73, // 기상술사
  WILDSOUL       : 72, // 환수사

  // 가디언나이트 (Guardian Knight)
  ROOT_GUARDIAN : 80, // 분류 미정
  GUARDIANKNIGHT: 81, // 가디언나이트
} as const;

export const ID_C = {
  // 10. EQUIPMENT 소분류
  EQ_COMBAT: 1,     // 전투 장비 (머리, 어깨, 상의, 하의, 장갑, 무기)
  EQ_ACCESSORY: 2,  // 악세서리 (목걸이, 귀걸이, 반지)
  EQ_STONE: 3,      // 어빌리티 스톤
  EQ_BRACELET: 4,   // 팔찌
  EQ_ORB: 5,        // 보주 (엘릭서/초월 등 특수 장비 포함 가능)

  // 70. ARK_PASSIVE 소분류
  ARK_EVOLUTION: 1,  // 진화
  ARK_ENLIGHTEN: 2,  // 깨달음
  ARK_LEAP: 3,       // 도약
} as const;