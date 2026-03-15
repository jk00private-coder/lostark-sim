/**
 * @/types/character-types.ts
 *
 * UI 표시를 위한 가공된 캐릭터 데이터 타입을 정의합니다.
 * data-normalizer.ts 가 RawCharacterData → 이 타입들로 변환합니다.
 *
 * [설계 원칙]
 *   - UI 컴포넌트가 직접 소비하는 타입
 *   - 수치는 파싱된 number 타입 (문자열 없음)
 *   - color 필드는 API HTML에서 추출한 hex 문자열 (예: "#CE43FC")
 *     → 사용 여부는 UI 컴포넌트에서 판단
 *   - 영문 ID는 UI 표시 시 별도 맵핑 파일로 한글 변환
 *     → src/constants/label-maps.ts 에서 관리 예정
 */


// ============================================================
// 공통 유틸 타입
// ============================================================

/**
 * 수치 + 색깔을 함께 저장하는 기본 단위
 * API HTML에서 추출한 color를 그대로 보존합니다.
 * color 가 없으면 undefined (흰색/기본 처리)
 */
export interface ColoredValue {
  value: number;
  color?: string; // hex 문자열 예: "#CE43FC" | "#FE9600" | "#99ff99"
}

/**
 * 텍스트 + 색깔을 함께 저장하는 기본 단위
 * 아크그리드 효과명, 카드 효과 설명 등 텍스트에 색깔이 붙는 경우 사용
 */
export interface ColoredText {
  text : string;
  color?: string;
}

/**
 * 딜 관련 개별 효과 수치
 * effectType 은 sim-types.ts 의 EffectTypeId 와 대응
 */
export interface EffectEntry {
  effectType: string;       // "DMG_INC" | "ATK_PERCENT" | "CRIT_DMG" 등
  value     : number;       // 파싱된 수치 (0.21 = 21%)
  color?    : string;       // API에서 추출한 색깔
}

/** 상/중/하 옵션 등급 */
export type OptionGrade = 'HIGH' | 'MID' | 'LOW';

/**
 * 등급이 있는 딜 관련 효과 수치
 * 악세서리/팔찌 연마효과에 사용
 * 등급 기준은 src/data/accessory-option-grades.ts 에서 관리
 */
export interface GradedEffectEntry extends EffectEntry {
  grade: OptionGrade; // 수치 기준으로 판별한 상/중/하
}


// ============================================================
// 장비 세트 타입
// ============================================================

/**
 * 장비 세트 구분 ID
 * 장비 이름 키워드로 판별합니다 (data-normalizer 처리)
 * UI 표시용 한글 변환: src/constants/label-maps.ts 의 EQUIPMENT_SET_LABEL
 *
 * 예시 (가디언나이트):
 *   "운명의 결단 할버드" → NORMAL_RELIC
 *   "운명의 업화 할버드" → AEGIR_ANCIENT
 *   "운명의 전율 할버드" → SERCA_ANCIENT
 *
 * ⚠️ 직업별 키워드가 다르므로 src/data/equipment-sets.ts 에 직업별 매핑 DB 필요
 */
export type EquipmentSetType =
  | 'NORMAL_RELIC'   // 일반 유물
  | 'AEGIR_ANCIENT'  // 에기르 고대
  | 'SERCA_ANCIENT'  // 세르카 고대
  | 'UNKNOWN';       // 판별 불가


// ============================================================
// 캐릭터 기본 정보
// ============================================================

/** 캐릭터 프로필 표시용 */
export interface CharacterProfileDisplay {
  name           : string;  // "소르가나"
  className      : string;  // "가디언나이트"
  characterLevel : number;  // 70
  itemAvgLevel   : number;  // 1710.00
  combatPower    : number;  // 2397.67
  serverName     : string;  // "아브렐슈드"
  guildName      : string;  // "IOl"
  guildGrade     : string;  // "길드장"
  expeditionLevel: number;  // 272
  townLevel      : number;  // 70
  townName       : string;  // "이름있는영지"
  title          : string;  // "없음" (null 이면 "없음" 처리)
  honorLevel     : number;  // 14
  characterImage : string;  // 캐릭터 이미지 URL
}

/** 전투 특성 표시용 */
export interface CombatStatsDisplay {
  critical      : number;  // 569
  specialization: number;  // 1823
  swiftness     : number;  // 163
  domination    : number;  // 79
  endurance     : number;  // 69
  expertise     : number;  // 75
  maxHp         : number;  // 311496
  attackPower   : number;  // 127141
}


// ============================================================
// 장비
// ============================================================

/**
 * 전투 장비 표시용 (무기/투구/상의/하의/장갑/어깨)
 *
 * setType 판별: 장비 이름 키워드 → equipment-sets.ts DB 조회
 * itemTier 파싱: Tooltip ItemTitle.leftStr2 "아이템 레벨 1710 (티어 4)" → 4
 */
export interface EquipmentDisplay {
  type      : string;           // "무기" | "투구" | "상의" | "하의" | "장갑" | "어깨"
  name      : string;           // "+18 운명의 업화 할버드"
  icon      : string;           // 아이콘 URL
  grade     : string;           // "고대" | "유물"
  refineStep: number;           // 18 — 이름에서 파싱
  quality   : number;           // 95 — Tooltip ItemTitle.qualityValue
  itemTier  : number;           // 4 — Tooltip leftStr2 파싱
  setType   : EquipmentSetType; // "AEGIR_ANCIENT" 등

  // 딜 관련 파싱 수치 (무기: 무기공격력/추가피해, 방어구: 주스탯 등)
  effects: EffectEntry[];

  // 아크패시브 포인트 기여 (방어구: 진화 +24)
  arkPassivePoint: { category: string; point: number } | null;
}


// ============================================================
// 악세서리
// ============================================================

/**
 * 악세서리 기본 효과 (주스탯, 체력)
 * 딜 계산에 간접적으로 영향 (주스탯 → 공격력 계산)
 */
export interface AccessoryBaseEffect {
  statType: string;      // "힘" | "민첩" | "지능" | "체력"
  value   : number;      // 15446
  color?  : string;      // 회색(#686660) = 비주스탯, 없음 = 주스탯
}

/**
 * 악세서리 연마 효과
 * 딜 계산에 직접 영향
 * grade: 수치 기준 상/중/하 판별 (src/data/accessory-option-grades.ts)
 */
export interface AccessoryPolishEffect extends GradedEffectEntry {
  label: string; // "공격력" | "추가 피해" | "치명타 피해" | "치명타 적중률" | "무기 공격력"
}

/**
 * 악세서리 표시용 (목걸이/귀걸이/반지)
 *
 * baseEffects 와 polishEffects 를 분리해서 저장합니다.
 * UI 컴포넌트에서 섹션별로 나눠서 표시할 수 있습니다.
 */
export interface AccessoryDisplay {
  type         : string;                    // "목걸이" | "귀걸이" | "반지"
  name         : string;                    // "도래한 결전의 목걸이"
  icon         : string;                    // 아이콘 URL
  grade        : string;                    // "고대" | "유물"
  quality      : number;                    // 70
  itemTier     : number;                    // 4
  baseEffects  : AccessoryBaseEffect[];     // 기본 효과 (힘/체력 등)
  polishEffects: AccessoryPolishEffect[];   // 연마 효과 (공격력%, 치명타피해% 등)

  // 아크패시브 포인트 기여 (깨달음 +13)
  arkPassivePoint: { category: string; point: number } | null;
}


// ============================================================
// 팔찌
// ============================================================

/**
 * 팔찌 효과
 * 고정 특성(신속/특화)과 피해 관련 옵션이 섞여 있습니다.
 * 피해 관련 옵션은 grade(상/중/하) 판별 적용
 */
export interface BraceletEffect {
  label     : string;      // "신속" | "특화" | "치명타 피해" | "추가 피해" | "치명타 시 피해 증가" | "헤드어택 피해"
  effectType: string;      // sim-types EffectTypeId 대응
  value     : number;      // 파싱 수치
  color?    : string;      // 파랑(#00B5FF)=고정특성, 주황(#FE9600)=%, 초록(#99ff99)=조건부
  isFixed   : boolean;     // true = 고정 특성(신속/특화), false = 랜덤 옵션
  grade?    : OptionGrade; // 랜덤 옵션일 때만 상/중/하 판별
}

/** 팔찌 표시용 */
export interface BraceletDisplay {
  name   : string;           // "찬란한 구원자의 팔찌"
  icon   : string;           // 아이콘 URL
  grade  : string;           // "고대"
  effects: BraceletEffect[]; // 팔찌 효과 목록

  // 아크패시브 포인트 기여 (도약 +18)
  arkPassivePoint: { category: string; point: number } | null;
}


// ============================================================
// 어빌리티 스톤
// ============================================================

/** 어빌리티 스톤 표시용 */
export interface AbilityStoneDisplay {
  name       : string;   // "위대한 비상의 돌"
  icon       : string;   // 아이콘 URL
  grade      : string;   // "고대"
  baseAtkBonus: number;  // 기본 공격력 보너스 (없으면 0)

  // 세공된 각인 목록
  engravings: {
    name : string;  // "원한" | "아드레날린"
    level: number;  // 1 | 3
    color?: string; // 황금(#FFFFAC) = 각인명 색깔
  }[];

  // 패널티 각인
  penalty: {
    name : string;  // "공격력 감소"
    level: number;  // 0
    color?: string; // 빨강(#FE2E2E) = 패널티 색깔
  } | null;
}


// ============================================================
// 아바타
// ============================================================

/**
 * 아바타 표시용
 *
 * mainStatBonus: 같은 부위의 일반/이너 아바타 중 최댓값 적용
 *   영웅 아바타 = +1%, 전설 아바타 = +2%
 *   이너 아바타가 전설이면 해당 부위 보너스는 2% 적용
 *   UI에 이너 여부는 표시하지 않고 최종 수치만 표시
 */
export interface AvatarDisplay {
  type         : string;  // "무기 아바타" | "상의 아바타" | "하의 아바타"
  name         : string;  // 표시용 이름 (이너 아바타면 이너 이름)
  icon         : string;  // 아이콘 URL (이너 아바타면 이너 아이콘)
  grade        : string;  // 최종 적용 아바타 등급
  mainStatBonus: number;  // 0.01 | 0.02 — 최종 적용값
}


// ============================================================
// 각인
// ============================================================

/** 개별 각인 표시용 */
export interface EngravingDisplay {
  name             : string;        // "원한"
  grade            : string;        // "유물"
  level            : number;        // 0 (최대)
  abilityStoneLevel: number | null; // 어빌리티 스톤 레벨 (없으면 null)
  description      : string;        // HTML 제거된 효과 설명
  icon             : string;        // ENGRAVINGS_DB 에서 매핑
}


// ============================================================
// 보석
// ============================================================

/** 개별 보석 표시용 */
export interface GemDisplay {
  slot        : number;  // 0~10
  level       : number;  // 6 | 7 | 8
  grade       : string;  // "전설" | "유물"
  icon        : string;  // 아이콘 URL
  skillName   : string;  // "렌딩 피니셔" | "블레이즈 스윕 계열"
  effectType  : string;  // "피해" | "재사용 대기시간"
  effectValue : number;  // 0.36 — "36.00%" 파싱
  baseAtkBonus: number;  // 0.008 — "기본 공격력 0.80%" 파싱
  color?      : string;  // 보석 등급 색깔 (유물: #FA5D00, 전설: #F99200)
}

/** 보석 전체 요약 */
export interface GemSummaryDisplay {
  gems        : GemDisplay[];
  totalBaseAtk: number;  // 0.0685 — "기본 공격력 총합 6.85%" 파싱
}


// ============================================================
// 카드
// ============================================================

/** 카드 세트 효과 표시용 */
export interface CardSetDisplay {
  setName    : string;  // "세상을 구하는 빛"
  totalAwake : number;  // 30 — 전체 각성 합계
  activeItems: {        // 현재 각성 합계 기준 발동된 효과만
    name       : string;
    description: string;  // HTML 제거된 효과 설명
    color?     : string;  // 효과 수치 색깔 (#99ff99 = 증가)
  }[];
}


// ============================================================
// 아크패시브
// ============================================================

/** 아크패시브 포인트 표시용 */
export interface ArkPassivePointDisplay {
  evolution: { value: number; description: string }; // { 140, "6랭크 21레벨" }
  insight  : { value: number; description: string }; // { 101, "6랭크 25레벨" }
  leap     : { value: number; description: string }; // { 70,  "6랭크 25레벨" }
  title    : string;                                 // "업화의 계승자"
}

/** 개별 아크패시브 효과 표시용 */
export interface ArkPassiveEffectDisplay {
  category   : string;  // "진화" | "깨달음" | "도약"
  name       : string;  // "예리한 감각" — Description 에서 추출
  tier       : number;  // 2
  level      : number;  // 2
  description: string;  // HTML 제거된 효과 설명
  icon       : string;  // 아이콘 URL
  color?     : string;  // 카테고리 색깔 (진화: #F1D594, 깨달음: #83E9FF, 도약: #C2EA55)
}


// ============================================================
// 아크그리드
// ============================================================

/** 개별 아크그리드 코어 표시용 */
export interface ArkGridCoreDisplay {
  index: number;  // 슬롯 인덱스 (0~5)
  name : string;  // "질서의 해 코어 : 피니셔"
  point: number;  // 17
  grade: string;  // "유물" | "전설"
  icon : string;  // 아이콘 URL
  color?: string; // 등급 색깔 (유물: #FA5D00, 전설: #F99200)
}

/** 아크그리드 젬 합산 효과 표시용 */
export interface ArkGridEffectDisplay {
  name        : string;   // "공격력"
  level       : number;   // 33
  valuePercent: number;   // 0.0121 — "+1.21%" 파싱
  color?      : string;   // 수치 색깔 (#FFD200 = 노랑)
}

/** 아크그리드 전체 표시용 */
export interface ArkGridDisplay {
  cores  : ArkGridCoreDisplay[];
  effects: ArkGridEffectDisplay[];
}


// ============================================================
// 스킬
// ============================================================

/** 선택된 트라이포드 표시용 */
export interface SelectedTripodDisplay {
  tier : number;  // 0 | 1 | 2
  slot : number;  // 1 | 2 | 3
  name : string;  // "약점 포착"
  icon : string;  // 아이콘 URL
  color?: string; // 트라이포드 색깔 (#FFBB63 = 선택됨)
}

/** 장착 룬 표시용 */
export interface EquippedRuneDisplay {
  name  : string;  // "속행"
  grade : string;  // "전설" | "영웅" | "희귀"
  icon  : string;  // 아이콘 URL
  color?: string;  // 등급 색깔 (전설: #F99200, 영웅: #CE43FC, 희귀: #00B0FA)
}

/**
 * 개별 스킬 표시용
 *
 * isUsed 판별 기준 (data-normalizer 처리):
 *   Level >= 4  OR  Rune 장착  OR  보석 적용 스킬
 *   각성기(skillType 100, 101) 는 항상 포함
 */
export interface SkillDisplay {
  name           : string;                  // "렌딩 피니셔"
  icon           : string;                  // 스킬 아이콘 URL
  level          : number;                  // 14
  type           : string;                  // "일반" | "홀딩" | "콤보" | "지점"
  skillType      : number;                  // 0 | 1 | 100 | 101
  isUsed         : boolean;                 // 사용 스킬 여부 (normalizer 판별)
  selectedTripods: SelectedTripodDisplay[]; // IsSelected=true 인 것만
  rune           : EquippedRuneDisplay | null;
  color?         : string;                  // 스킬 분류 색깔 (발현: #FE9A2E, 화신: #FF0000, 일반: #83DCB7)
}


// ============================================================
// 전체 캐릭터 데이터 (UI 최상위 타입)
// ============================================================

/**
 * UI 컴포넌트가 소비하는 전체 캐릭터 데이터
 * data-normalizer.ts 의 최종 반환 타입
 */
export interface CharacterDisplayData {
  profile     : CharacterProfileDisplay;
  combatStats : CombatStatsDisplay;
  equipment   : EquipmentDisplay[];
  accessories : AccessoryDisplay[];
  bracelet    : BraceletDisplay | null;
  abilityStone: AbilityStoneDisplay | null;
  avatars     : AvatarDisplay[];
  engravings  : EngravingDisplay[];
  gems        : GemSummaryDisplay;
  cards       : CardSetDisplay | null;
  arkPassive  : {
    points : ArkPassivePointDisplay;
    effects: ArkPassiveEffectDisplay[];
  };
  arkGrid     : ArkGridDisplay;
  skills      : SkillDisplay[];
}