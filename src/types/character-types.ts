/**
 * @/types/character-types.ts
 *
 * UI 표시를 위한 가공된 캐릭터 데이터 타입을 정의합니다.
 * data-normalizer.ts 가 RawCharacterData → 이 타입들로 변환합니다.
 *
 * [설계 원칙]
 *   - UI 컴포넌트가 직접 소비하는 타입
 *   - 수치는 파싱된 number 타입 (문자열 없음)
 *   - 영문 ID는 UI 표시 시 src/constants/label-maps.ts 에서 한글 변환
 */

import {ColoredText, ColoredValue, EffectEntry } from '@/types/sim-types';

// ============================================================
// 공통 유틸 타입
// ============================================================

// ColoredText, ColoredValue 재export — 기존 코드 호환성 유지
export type { ColoredText, ColoredValue };

/** 상/중/하 옵션 등급 */
export type OptionGrade = 'HIGH' | 'MID' | 'LOW';

/**
 * 등급이 있는 딜 관련 효과 수치
 * 악세서리/팔찌 연마효과에 사용
 */
export interface GradedEffectEntry extends EffectEntry {
  grade: OptionGrade;
}

// ============================================================
// 장비 세트 타입
// ============================================================

/**
 * 장비 세트 구분 ID
 * 장비 이름 키워드로 판별 (data-normalizer 처리)
 * UI 표시용 한글: src/constants/label-maps.ts 의 EQUIPMENT_SET_LABEL
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
 * itemTier 파싱: Tooltip leftStr2 "아이템 레벨 1710 (티어 4)" → 4
 */
export interface EquipmentDisplay {
  type      : string;           // "무기" | "투구" | "상의" | "하의" | "장갑" | "어깨"
  name      : string;           // "+18 운명의 업화 할버드"
  icon      : string;           // 아이콘 URL
  grade     : ColoredText;      // { text: "고대", color: "#E3C7A1" }
  refineStep: number;           // 18
  quality   : number;           // 95
  itemTier  : number;           // 4
  setType   : EquipmentSetType; // "AEGIR_ANCIENT"

  // 딜 관련 파싱 수치 (무기: 무기공격력/추가피해, 방어구: 주스탯 등)
  effects: EffectEntry[];

  // 아크패시브 포인트 기여 (방어구: 진화 +24)
  arkPassivePoint: { category: ColoredText; point: ColoredValue } | null;
}


// ============================================================
// 악세서리
// ============================================================

/**
 * 악세서리 기본 효과 (주스탯, 체력)
 * 딜 계산에 간접적으로 영향 (주스탯 → 공격력 계산)
 */
export interface AccessoryBaseEffect {
  statType: ColoredText;  // { text: "힘", color: undefined } | { text: "민첩", color: "#686660" } — 회색 = 비주스탯
  value   : ColoredValue; // { value: 15446, color: undefined }
}

/**
 * 악세서리 연마 효과
 * 딜 계산에 직접 영향
 * grade: 수치 기준 상/중/하 판별 (src/data/accessory-option-grades.ts)
 *
 * 예시: "추가 피해 +1.60%"
 *   label: { text: "추가 피해", color: undefined }
 *   value: { value: 0.016, color: "#CE43FC" }  // 보라 = % 수치
 */
export interface AccessoryPolishEffect extends GradedEffectEntry {}

/**
 * 악세서리 표시용 (목걸이/귀걸이/반지)
 *
 * baseEffects / polishEffects 분리 저장
 * UI 컴포넌트에서 섹션별로 나눠서 표시 가능
 */
export interface AccessoryDisplay {
  type         : string;                  // "목걸이" | "귀걸이" | "반지"
  name         : string;                  // "도래한 결전의 목걸이"
  icon         : string;                  // 아이콘 URL
  grade        : ColoredText;             // { text: "고대", color: "#E3C7A1" }
  quality      : number;                  // 70
  itemTier     : number;                  // 4
  baseEffects  : AccessoryBaseEffect[];   // 기본 효과 (주스탯/체력)
  polishEffects: AccessoryPolishEffect[]; // 연마 효과 (공격력%, 치명타피해% 등)

  // 아크패시브 포인트 기여 (깨달음 +13)
  arkPassivePoint: { category: ColoredText; point: ColoredValue } | null;
}


// ============================================================
// 팔찌
// ============================================================

/**
 * 팔찌 효과
 * 고정 특성(신속/특화)과 피해 관련 랜덤 옵션이 섞여 있습니다.
 *
 * 색깔 의미:
 *   파랑(#00B5FF) = 고정 특성 (신속/특화 수치)
 *   주황(#FE9600) = % 랜덤 옵션
 *   초록(#99ff99) = 조건부 효과 (치명타 시 피해 증가 등)
 *   보라(#CE43FC) = % 랜덤 옵션 (연마효과와 동일 계열)
 */
// 변경 후 — EffectEntry 상속으로 통일
export interface BraceletEffect extends EffectEntry {
  isFixed: boolean;
  grade? : OptionGrade;
}

/** 팔찌 표시용 */
export interface BraceletDisplay {
  name   : string;           // "찬란한 구원자의 팔찌"
  icon   : string;           // 아이콘 URL
  grade  : ColoredText;      // { text: "고대", color: "#E3C7A1" }
  effects: BraceletEffect[];

  // 아크패시브 포인트 기여 (도약 +18)
  arkPassivePoint: { category: ColoredText; point: ColoredValue } | null;
}


// ============================================================
// 어빌리티 스톤
// ============================================================

/** 어빌리티 스톤 표시용 */
export interface AbilityStoneDisplay {
  name        : string;      // "위대한 비상의 돌"
  icon        : string;      // 아이콘 URL
  grade       : ColoredText; // { text: "고대", color: "#E3C7A1" }
  baseAtkBonus: number;      // 기본 공격력 보너스 (없으면 0)

  // 세공된 각인 목록
  engravings: {
    name : ColoredText;  // { text: "아드레날린", color: "#FFFFAC" }
    level: ColoredValue; // { value: 3, color: undefined }
  }[];

  // 패널티 각인
  penalty: {
    name : ColoredText;  // { text: "공격력 감소", color: "#FE2E2E" }
    level: ColoredValue; // { value: 0, color: undefined }
  } | null;
}

// ============================================================
// 보주
// ============================================================

/** 보주 표시용 */
export interface BoJuDisplay {
  name        : string;      // "눈부신 비전의 보주"
  icon        : string;      // 아이콘 URL
  grade       : ColoredText; // { text: "유물", color: "#FA5D00" }
  seasonLabel : string;      // "시즌2"
  paradoxPower: number;      // 30431195 — 달성 최대 낙원력
}


// ============================================================
// 아바타
// ============================================================

/**
 * 아바타 표시용
 *
 * mainStatBonus: 같은 부위의 일반/이너 중 최댓값 적용
 *   영웅 = +1%, 전설 = +2%
 *   이너 여부는 UI에 표시하지 않고 최종 수치만 저장
 */
export interface AvatarDisplay {
  type         : string;      // "무기 아바타" | "상의 아바타" | "하의 아바타"
  name         : string;      // 최종 적용 아바타 이름
  icon         : string;      // 최종 적용 아바타 아이콘 URL
  grade        : ColoredText; // { text: "전설", color: "#F99200" }
  mainStatBonus: number;      // 0.01 | 0.02 — 최종 적용값
}


// ============================================================
// 각인
// ============================================================

/** 개별 각인 표시용 */
export interface EngravingDisplay {
  name             : ColoredText;   // { text: "원한", color: "#FFFFAC" }
  grade            : ColoredText;   // { text: "유물", color: "#FA5D00" }
  level            : number;        // 0 ~ 4(Max)
  abilityStoneLevel: number | null; // 어빌리티 스톤 레벨 (없으면 null)
  description      : string;        // HTML 제거된 효과 설명
  icon             : string;        // ENGRAVINGS_DB 에서 매핑
}


// ============================================================
// 보석
// ============================================================

/** 개별 보석 표시용 */
export interface GemDisplay {
  slot        : number;      // 0~10
  level       : number;      // 6 | 7 | 8
  grade       : ColoredText; // { text: "유물", color: "#FA5D00" }
  icon        : string;      // 아이콘 URL
  skillName   : ColoredText; // { text: "렌딩 피니셔", color: "#FFD200" }
  effectLabel : ColoredText; // { text: "피해", color: undefined }
  effectValue : ColoredValue; // { value: 0.36, color: "#99ff99" }
  baseAtkBonus: number;      // 0.008
}

/** 보석 전체 요약 */
export interface GemSummaryDisplay {
  gems        : GemDisplay[];
  totalBaseAtk: ColoredValue; // { value: 0.0685, color: "#B7FB00" }
}


// ============================================================
// 카드
// ============================================================

/** 카드 세트 효과 표시용 */
export interface CardSetDisplay {
  setName    : string;  // "세상을 구하는 빛"
  totalAwake : number;  // 30
  activeItems: {
    name       : string;
    description: string;      // HTML 제거된 효과 설명
    value?     : ColoredValue; // 수치가 있는 경우 (없는 효과도 있음)
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

/**
 * 개별 아크패시브 효과 표시용
 *
 * category 색깔:
 *   진화(#F1D594) | 깨달음(#83E9FF) | 도약(#C2EA55)
 */
export interface ArkPassiveEffectDisplay {
  category   : ColoredText; // { text: "진화", color: "#F1D594" }
  name       : ColoredText; // { text: "예리한 감각", color: undefined }
  tier       : number;      // 2
  level      : number;      // 2
  description: string;      // HTML 제거된 효과 설명
  icon       : string;      // 아이콘 URL
}


// ============================================================
// 아크그리드
// ============================================================

/** 개별 아크그리드 코어 표시용 */
export interface ArkGridCoreDisplay {
  index: number;      // 슬롯 인덱스 (0~5)
  name : ColoredText; // { text: "질서의 해 코어 : 피니셔", color: "#FA5D00" }
  point: ColoredValue; // { value: 17, color: "#B7FB00" }
  grade: ColoredText; // { text: "유물", color: "#FA5D00" }
  icon : string;      // 아이콘 URL
}

/**
 * 아크그리드 젬 합산 효과 표시용
 *
 * 예시: "공격력 +1.21%"
 *   label: { text: "공격력", color: undefined }
 *   value: { value: 0.0121, color: "#FFD200" }
 */
export interface ArkGridEffectDisplay {
  label: ColoredText;  // 효과 이름 + 색깔
  level: number;       // 합산 레벨 (33)
  value: ColoredValue; // 수치 + 색깔
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
  tier : number;      // 0 | 1 | 2
  slot : number;      // 1 | 2 | 3
  name : ColoredText; // { text: "약점 포착", color: "#FFBB63" }
  icon : string;      // 아이콘 URL
}

/** 장착 룬 표시용 */
export interface EquippedRuneDisplay {
  name : ColoredText; // { text: "속행", color: "#F99200" }
  grade: ColoredText; // { text: "전설", color: "#F99200" }
  icon : string;      // 아이콘 URL
}

/**
 * 개별 스킬 표시용
 *
 * isUsed 판별 기준 (data-normalizer 처리):
 *   Level >= 4  OR  Rune 장착  OR  보석 적용 스킬
 *   각성기(skillType 100, 101) 는 항상 포함
 *
 * category 색깔:
 *   일반(#83DCB7) | 발현(#FE9A2E) | 화신(#FF0000) | 각성기(#E73517)
 */
export interface SkillDisplay {
  name           : string;                  // "렌딩 피니셔"
  icon           : string;                  // 스킬 아이콘 URL
  level          : number;                  // 14
  type           : string;                  // "일반" | "홀딩" | "콤보" | "지점"
  skillType      : number;                  // 0 | 1 | 100 | 101
  category       : ColoredText;             // { text: "발현 스킬", color: "#FE9A2E" }
  isUsed         : boolean;                 // 사용 스킬 여부
  selectedTripods: SelectedTripodDisplay[];
  rune           : EquippedRuneDisplay | null;
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
  boJu: BoJuDisplay | null;
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