/**
 * @/types/raw-types.ts
 *
 * 로스트아크 API 응답 구조를 타입으로만 선언합니다.
 * 이 파일은 "API가 준 데이터의 형태"를 기록하는 역할입니다.
 * 변환, 계산, 파싱 로직은 절대 포함하지 않습니다.
 *
 * ⚠️ 주의: 딜 계산에 영향 없는 섹션(collectibles, colosseums)은 제외했습니다.
*/

// ============================================================
// 공통 유틸 타입
// ============================================================

/** API 응답의 Tooltip 내부 Element 공통 구조 */
interface RawTooltipElement {
  type : string;
  value: any;
}

/** 아이템 Tooltip JSON 문자열 내부의 ItemPartBox 값 구조 */
interface RawItemPartBoxValue {
  Element_000: string; // 항목명 (예: "추가 효과")
  Element_001: string; // 항목값 (예: "추가 피해 +28.06%") ← 파싱 대상
}


// ============================================================
// profile 섹션
// ============================================================

/** profile.Stats[] 개별 전투 특성 */
export interface RawStat {
  Type   : string;    // "치명" | "특화" | "신속" | "제압" | "인내" | "숙련" | "최대 생명력" | "공격력"
  Value  : string;    // "569" — 문자열로 옵니다. 사용 시 Number() 변환 필요
  Tooltip: string[];  // HTML 태그 포함 설명 문자열 배열 (계산에 불필요, 참고용)
}

/** profile 섹션 전체 */
export interface RawProfile {
  Icon              : string;
  CharacterName     : string;
  CharacterClassName: string;
  ItemAvgLevel      : string;
  CombatPower       : string;
  ServerName        : string;
  GuildName         : string;
  ExpeditionLevel   : number;
  TownLevel         : number;
  TownName          : string;
  Title             : string | null;
  HonorPoint        : number;
  Stats             : RawStat[];
}


// ============================================================
// equipment 섹션
// ============================================================

/**
 * equipment[] 개별 장비
 *
 * 딜 계산에 필요한 수치들은 모두 Tooltip(JSON 문자열) 내부에 있습니다.
 * data-normalizer에서 JSON.parse → 각 Element 접근 → 정규식으로 숫자 추출합니다.
 *
 * 주요 파싱 대상:
 *   무기  → Element_006 (기본효과: 무기 공격력), Element_008 (추가효과: 추가 피해 %)
 *   방어구 → Element_006 (기본효과: 힘/체력 등),  Element_008 (추가효과: 생명활성력 등)
 *   악세서리 → Element_006 (연마효과: 공격력%, 치명타피해%, 추가피해% 등)
 *   팔찌  → Element_005 (팔찌효과: 특화, 신속, 치명타피해%, 치명타시피해%, 추가피해% 등)
 *   어빌리티 스톤 → Element_007 (각인 이름 + 레벨)
*/
export interface RawEquipment {
  Type   : string;  // "무기" | "투구" | "상의" | "하의" | "장갑" | "어깨" | "목걸이" | "귀걸이" | "반지" | "팔찌" | "어빌리티 스톤"
  Name   : string;  // "+18 운명의 업화 할버드"
  Icon   : string;  // 아이콘 URL
  Grade  : string;  // "고대" | "유물" | "전설"
  Tooltip: string;  // JSON 문자열 — 반드시 JSON.parse 후 접근
}


// ============================================================
// engravings 섹션
// ============================================================

/**
 * 아크패시브 각인 효과 (현재 프로젝트의 각인 시스템)
 *
 * ⚠️ 주의: engravings.Engravings, engravings.Effects는 null입니다.
 *          실제 각인 데이터는 ArkPassiveEffects에 있습니다.
 */
export interface RawArkPassiveEffect {
  Name              : string;       // "원한" | "예리한 둔기" | "아드레날린" 등
  Grade             : string;       // "유물"
  Level             : number;       // 각인 레벨 (Lv.0 = 최대)
  AbilityStoneLevel : number | null; // 어빌리티 스톤에서 온 레벨 (없으면 null)
  Description       : string;       // HTML 태그 포함 효과 설명 — 파싱으로 수치 추출 가능
}

/** engravings 섹션 전체 */
export interface RawEngravings {
  Engravings       : null;                  // 항상 null (아크패시브 시스템에서 미사용)
  Effects          : null;                  // 항상 null
  ArkPassiveEffects: RawArkPassiveEffect[]; // 실제 각인 데이터
}


// ============================================================
// gems 섹션
// ============================================================

/**
 * gems.Effects.Skills[] 개별 보석 효과 (계산용)
 *
 * 보석의 실제 효과 수치는 여기서 가져옵니다.
 * Description 예시: ["피해 32.00% 증가"] | ["재사용 대기시간 18.00% 감소"]
 */
export interface RawGemSkillEffect {
  GemSlot    : number;    // 보석 슬롯 인덱스 (0~10)
  Name       : string;    // 적용 스킬명 "렌딩 피니셔" | "블레이즈 스윕 계열"
  Description: string[];  // ["피해 36.00% 증가"] — 배열이지만 보통 1개
  Option     : string;    // "기본 공격력 0.80% 증가" — 보석 추가효과 (공증 합산)
  Icon       : string;    // 스킬 아이콘 URL
}

/** gems.Effects 구조 */
export interface RawGemEffects {
  Description: string;              // "기본 공격력 총합 : 6.85%" — 전체 공증 합산
  Skills     : RawGemSkillEffect[]; // 개별 보석 효과 목록
}

/** gems.Gems[] 개별 보석 (UI 표시용) */
export interface RawGem {
  Slot   : number;  // 0~10
  Level  : number;  // 6 | 7 | 8
  Grade  : string;  // "전설" | "유물"
  Icon   : string;
  Name   : string;  // HTML 태그 포함 — UI용으로만 사용
  Tooltip: string;  // JSON 문자열
}

/** gems 섹션 전체 */
export interface RawGems {
  Gems   : RawGem[];
  Effects: RawGemEffects;
}


// ============================================================
// cards 섹션
// ============================================================

/** cards.Effects[].Items[] 개별 카드 세트 효과 */
export interface RawCardSetItem {
  Name       : string; // "세상을 구하는 빛 6세트 (30각성합계)"
  Description: string; // "성속성 피해 +4.00%" — 파싱 대상
}

/** cards.Effects[] 카드 세트 효과 그룹 */
export interface RawCardEffect {
  Index    : number;
  CardSlots: number[];         // 세트에 포함된 슬롯 인덱스
  Items    : RawCardSetItem[]; // 각성 단계별 효과 목록
}

/** cards 섹션 전체 */
export interface RawCards {
  Cards  : any[];            // 개별 카드 정보 (UI용, 계산 불필요)
  Effects: RawCardEffect[];  // 세트 효과 (계산 대상)
}


// ============================================================
// arkPassive 섹션
// ============================================================

/** arkPassive.Points[] 아크패시브 포인트 (진화/깨달음/도약) */
export interface RawArkPassivePoint {
  Name       : string; // "진화" | "깨달음" | "도약"
  Value      : number; // 140 | 101 | 70
  Description: string; // "6랭크 21레벨" — UI 표시용
}

/**
 * arkPassive.Effects[] 개별 아크패시브 효과
 *
 * Description 예시:
 *   "진화 1티어 치명 Lv.10" → 치명 특성 +500
 *   "진화 2티어 예리한 감각 Lv.2" → 치명타확률 +8%, 진화형피해 +10%
 *   "깨달음 4티어 완전 융화 Lv.3" → 피해증가 +8%
 *
 * ToolTip(JSON 문자열) 내부의 Element_002.value에서 실제 수치 파싱 가능
 */
export interface RawArkPassiveEffectEntry {
  Name       : string; // "진화" | "깨달음" | "도약"
  Description: string; // HTML 포함 설명 — 어떤 효과인지 식별용
  Icon       : string; // 아이콘 URL
  ToolTip    : string; // JSON 문자열 — 실제 수치 파싱 대상
}

/** arkPassive 섹션 전체 */
export interface RawArkPassive {
  Title      : string;                    // "업화의 계승자"
  IsArkPassive: boolean;                  // true
  Points     : RawArkPassivePoint[];      // 진화/깨달음/도약 포인트
  Effects    : RawArkPassiveEffectEntry[]; // 활성화된 패시브 효과 목록
}


// ============================================================
// arkGrid 섹션
// ============================================================

/**
 * arkGrid.Effects[] 아크그리드 합산 효과 (계산용 핵심)
 *
 * API가 이미 젬 포인트를 합산해서 최종 수치를 제공합니다.
 * Tooltip 예시: "공격력 <font color='#ffd200'>+1.21%</font>"
 * → 정규식으로 1.21 추출
 *
 * Name 종류: "낙인력" | "공격력" | "보스 피해" | "추가 피해" | "아군 피해 강화" | "아군 공격 강화"
 */
export interface RawArkGridEffect {
  Name   : string; // 효과 이름
  Level  : number; // 합산 레벨
  Tooltip: string; // HTML 포함 수치 문자열 — 파싱 대상
}

/** arkGrid 섹션 전체 */
export interface RawArkGrid {
  Slots  : any[];              // 코어/젬 UI 표시용 (계산은 Effects로 충분)
  Effects: RawArkGridEffect[]; // 최종 합산 효과 (계산 대상)
}


// ============================================================
// skills 섹션
// ============================================================

/** skills[].Tripods[] 개별 트라이포드 */
export interface RawTripod {
  Tier      : number;  // 0 | 1 | 2  (티어 인덱스)
  Slot      : number;  // 1 | 2 | 3  (슬롯 번호)
  Name      : string;  // "약점 포착" | "원거리 사격" 등
  IsSelected: boolean; // 실제 선택 여부 — 핵심 필드
  Icon      : string;
  Tooltip   : string;  // HTML 포함 효과 설명
}

/** skills[].Rune 장착 룬 */
export interface RawRune {
  Name   : string; // "속행" | "질풍" | "광분" 등
  Grade  : string; // "전설" | "영웅" | "희귀"
  Icon   : string;
  Tooltip: string;
}

/**
 * skills[] 개별 스킬
 *
 * SkillType 값:
 *   0   = 일반 스킬 (트라이포드 있음)
 *   1   = 초각성 스킬
 *   100 = 각성기
 *   101 = 초각성기
 */
export interface RawSkill {
  Name     : string;       // "렌딩 피니셔"
  Icon     : string;
  Level    : number;       // 스킬 레벨 (1~14)
  Type     : string;       // "일반" | "홀딩" | "콤보" | "지점"
  SkillType: number;       // 0 | 1 | 100 | 101
  Tripods  : RawTripod[];  // 전체 트라이포드 목록 (선택/미선택 모두 포함)
  Rune     : RawRune | null;
  Tooltip  : string;       // JSON 문자열
}


// ============================================================
// API 응답 최상위 타입
// ============================================================

/**
 * /api/lostark/[name] 엔드포인트 응답 전체 구조
 * src/app/api/lostark/[name]/route.ts 의 combinedData와 대응
 */
export interface RawCharacterData {
  profile   : RawProfile;
  equipment : RawEquipment[];
  engravings: RawEngravings;
  gems      : RawGems;
  cards     : RawCards;
  arkPassive: RawArkPassive;
  arkGrid   : RawArkGrid;
  skills    : RawSkill[];

  // 계산 불필요 섹션 (any로 처리)
  avatars     : any[];
  colosseums  : any;
  collectibles: any[];

  _metadata: {
    characterName     : string;
    fetchedAt         : string;
    requestedEndpoints: string[];
  };
}