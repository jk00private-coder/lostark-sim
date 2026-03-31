/**
 * @/types/raw-types.ts
 *
 * 로스트아크 API 응답 구조를 타입으로만 선언합니다.
 * 이 파일은 "API가 준 데이터의 형태"를 기록하는 역할입니다.
 * 변환, 계산, 파싱 로직은 절대 포함하지 않습니다.
 *
 * [설계 원칙]
 *   - API가 준 값만 선언 (판단값, 파생값 금지)
 *   - 중복 데이터는 주석으로 명시하고 제외
 *   - 딜 계산 무관 섹션(collectibles, colosseums)은 any 처리
 */


// ============================================================
// profile 섹션
// ============================================================

/** profile.Stats[] 개별 전투 특성 */
export interface RawStat {
  Type   : string;   // "치명" | "특화" | "신속" | "제압" | "인내" | "숙련" | "최대 생명력" | "공격력"
  Value  : string;   // "569" — 문자열. 사용 시 Number() 변환 필요
  Tooltip: string[]; // HTML 태그 포함 설명 배열 (참고용)
}

/** profile 섹션 전체 */
export interface RawProfile {
  CharacterImage    : string;    // 캐릭터 이미지 URL
  CharacterName     : string;    // "소르가나"
  CharacterClassName: string;    // "가디언나이트"
  CharacterLevel    : number;    // 70
  ItemAvgLevel      : string;    // "1,710.00" — 쉼표 포함 문자열
  CombatPower       : string;    // "2,397.67" — 쉼표 포함 문자열
  ServerName        : string;    // "아브렐슈드"
  GuildName         : string;    // "IOl"
  GuildMemberGrade  : string;    // "길드장"
  ExpeditionLevel   : number;    // 272
  TownLevel         : number;    // 70
  TownName          : string;    // "이름있는영지"
  Title             : string | null;
  HonorPoint        : number;    // 14
  UsingSkillPoint   : number;    // 482
  TotalSkillPoint   : number;    // 483
  Stats             : RawStat[]; // 전투 특성 배열
}


// ============================================================
// equipment 섹션
// ============================================================

/**
 * equipment[] 개별 장비
 *
 * 딜 계산 수치는 모두 Tooltip(JSON 문자열) 내부에 있습니다.
 * data-normalizer에서 JSON.parse → Element 접근 → 정규식으로 숫자 추출
 *
 * 주요 파싱 대상:
 *   무기       → Element_006 (무기 공격력), Element_008 (추가 피해 %)
 *   방어구     → Element_006 (힘/체력), Element_008 (생명활성력)
 *                Element_010 (아크패시브 포인트: 진화 +24)
 *   악세서리   → Element_006 (연마효과: 공격력%, 치명타피해%, 추가피해% 등)
 *                Element_007 (아크패시브 포인트: 깨달음 +13)
 *   팔찌       → Element_005 (특화, 신속, 치명타피해%, 치명타시피해증가%, 추가피해%)
 *                Element_007 (아크패시브 포인트: 도약 +18)
 *   어빌리티 스톤 → Element_007 (각인 이름 + 레벨)
 */
export interface RawEquipment {
  Type   : string; // "무기" | "투구" | "상의" | "하의" | "장갑" | "어깨" | "목걸이" | "귀걸이" | "반지" | "팔찌" | "어빌리티 스톤" | "나침반" | "부적" | "보주"
  Name   : string; // "+18 운명의 업화 할버드"
  Icon   : string; // 아이콘 URL
  Grade  : string; // "고대" | "유물" | "전설"
  Tooltip: string; // JSON 문자열 — 반드시 JSON.parse 후 접근
}


// ============================================================
// avatars 섹션
// ============================================================

/**
 * avatars[] 개별 아바타
 *
 * 딜 계산 관련:
 *   무기/상의/하의 아바타에 주스탯 옵션 "힘 +1.00%"이 있습니다.
 *   Tooltip 내부 Element_005.value.Element_001 에서 파싱합니다.
 *   3개 합산 시 주스탯 +3%
 */
export interface RawAvatar {
  Type   : string;  // "무기 아바타" | "머리 아바타" | "상의 아바타" | "하의 아바타" | "이동 효과"
  Name   : string;  // "7주년 기억 할버드 (이벤트)"
  Icon   : string;  // 아이콘 URL
  Grade  : string;  // "영웅" | "전설" 등
  IsSet  : boolean; // 세트 아바타 여부
  IsInner: boolean; // 이너 아바타 여부
  Tooltip: string;  // JSON 문자열 — Element_005에서 주스탯 파싱
}


// ============================================================
// engravings 섹션
// ============================================================

/**
 * engravings.ArkPassiveEffects[] 개별 각인
 *
 * ⚠️ engravings.Engravings, engravings.Effects 는 항상 null
 *    실제 각인 데이터는 ArkPassiveEffects 에 있습니다.
 */
export interface RawArkPassiveEffect {
  Name             : string;        // "원한" | "예리한 둔기" | "아드레날린" 등
  Grade            : string;        // "유물"
  Level            : number;        // 각인 레벨 (4 = 최대)
  AbilityStoneLevel: number | null; // 어빌리티 스톤에서 온 레벨 (없으면 null)
  Description      : string;        // HTML 포함 효과 설명 — 파싱으로 수치 추출
}

/** engravings 섹션 전체 */
export interface RawEngravings {
  Engravings       : null;                  // 항상 null
  Effects          : null;                  // 항상 null
  ArkPassiveEffects: RawArkPassiveEffect[]; // 실제 각인 데이터
}


// ============================================================
// gems 섹션
// ============================================================

/**
 * gems.Effects.Skills[] 개별 보석 효과 (계산용 핵심)
 *
 * Description 예시: ["피해 32.00% 증가"] | ["재사용 대기시간 18.00% 감소"]
 * Option 예시: "기본 공격력 0.80% 증가" — 보석 공증 합산에 사용
 *
 * ⚠️ RawGemSkillEffect{Tooltip} 제외:
 *   RawSkill.Tooltip + RawGem.Tooltip 에 동일 정보 포함
 */
export interface RawGemSkillEffect {
  GemSlot    : number;   // 보석 슬롯 인덱스 (0~10)
  Name       : string;   // "렌딩 피니셔" | "블레이즈 스윕 계열"
  Description: string[]; // ["피해 36.00% 증가"] — 배열이지만 보통 1개
  Option     : string;   // "기본 공격력 0.80% 증가" — 보석 추가 공증
  Icon       : string;   // 스킬 아이콘 URL
}

/** gems.Effects 구조 */
export interface RawGemEffects {
  Description: string;              // "기본 공격력 총합 : 6.85%"
  Skills     : RawGemSkillEffect[]; // 개별 보석 효과 목록
}

/** gems.Gems[] 개별 보석 */
export interface RawGem {
  Slot   : number; // 0~10
  Level  : number; // 6 | 7 | 8
  Grade  : string; // "전설" | "유물"
  Icon   : string; // 아이콘 URL
  Name   : string; // HTML 태그 포함 보석명 — UI 표시 시 태그 제거 필요
  Tooltip: string; // JSON 문자열 — 계열 스킬 목록 포함
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

/** arkPassive.Points[] 아크패시브 포인트 */
export interface RawArkPassivePoint {
  Name       : string; // "진화" | "깨달음" | "도약"
  Value      : number; // 140 | 101 | 70
  Description: string; // "6랭크 21레벨" — UI 표시용
}

/**
 * arkPassive.Effects[] 개별 아크패시브 효과
 *
 * Description 예시:
 *   "진화 1티어 치명 Lv.10"        → 치명 특성 +500
 *   "진화 2티어 예리한 감각 Lv.2"  → 치명타확률 +8%, 진화형피해 +10%
 *   "깨달음 4티어 완전 융화 Lv.3"  → 피해증가 +8%
 *   "도약 2티어 대강하 Lv.3"       → 딥임팩트 피해 +32%
 *
 * ToolTip JSON 내부 Element_002.value 에서 실제 수치 파싱
 */
export interface RawArkPassiveEffectEntry {
  Name       : string; // "진화" | "깨달음" | "도약"
  Description: string; // "진화 2티어 예리한 감각 Lv.2" — 효과 식별용
  Icon       : string; // 아이콘 URL
  ToolTip    : string; // JSON 문자열 — Element_002.value 파싱 대상
}

/** arkPassive 섹션 전체 */
export interface RawArkPassive {
  Title       : string;                     // "업화의 계승자"
  IsArkPassive: boolean;                    // true
  Points      : RawArkPassivePoint[];       // 진화/깨달음/도약 포인트
  Effects     : RawArkPassiveEffectEntry[]; // 활성화된 패시브 효과 목록
}


// ============================================================
// arkGrid 섹션
// ============================================================

/**
 * arkGrid.Slots[] 개별 코어 슬롯
 *
 * [설계 결정 — 방식 B 채택]
 * 코어 Tooltip을 파싱하지 않습니다.
 * Name + Point 로 아크그리드 DB를 조회해서 실제 딜 수치를 가져옵니다.
 *
 * 이유:
 *   - 코어 옵션이 단계별 조건부 효과(10P, 14P, 17P...)라 Tooltip 파싱 불안정
 *   - API 문자열 포맷 변경 시 파서 오류 위험
 *   - 로스트가나_v01_03 엑셀에 이미 수동 정리된 수치 존재
 */
export interface RawArkGridSlot {
  Index: number; // 슬롯 인덱스 (0~5)
  Name : string; // "질서의 해 코어 : 피니셔" — DB 조회 키
  Point: number; // 17 — 현재 포인트 (DB에서 해당 포인트까지 효과 적용)
  Grade: string; // "유물" | "전설"
  Icon : string; // 아이콘 URL
}

/**
 * arkGrid.Effects[] 아크그리드 젬 합산 효과 (계산용 핵심)
 *
 * API가 젬 포인트를 이미 합산한 최종 수치를 제공합니다.
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
  Slots  : RawArkGridSlot[];   // 코어 슬롯 (이름+포인트, DB 조회용)
  Effects: RawArkGridEffect[]; // 젬 합산 최종 효과 (계산 대상)
}


// ============================================================
// skills 섹션
// ============================================================

/** skills[].Tripods[] 개별 트라이포드 */
export interface RawTripod {
  Tier      : number;  // 0 | 1 | 2
  Slot      : number;  // 1 | 2 | 3
  Name      : string;  // "약점 포착" | "원거리 사격" 등
  IsSelected: boolean; // 선택 여부 — 핵심 필드
  Icon      : string;  // 아이콘 URL
  Tooltip   : string;  // HTML 포함 효과 설명
}

/** skills[].Rune 장착 룬 */
export interface RawRune {
  Name   : string; // "속행" | "질풍" | "광분" 등
  Grade  : string; // "전설" | "영웅" | "희귀"
  Icon   : string; // 아이콘 URL
  Tooltip: string; // JSON 문자열
}

/**
 * skills[] 개별 스킬
 *
 * [SkillType 값]
 *   0   = 일반 스킬 (트라이포드 있음)
 *   1   = 초각성 스킬
 *   100 = 각성기
 *   101 = 초각성기
 *
 * [사용 스킬 판별 — data-normalizer 에서 처리]
 * API가 사용 여부 필드를 제공하지 않으므로 normalizer에서 아래 기준으로 판별합니다:
 *   조건 1: Level >= 2
 *   조건 2: Rune !== null
 *   조건 3: gems.Effects.Skills[].Name 에 해당 스킬명 포함
 *   초각성스킬(SkillType 1) : arkpassive: Title 값으로 판단
 *   각성기(SkillType 100, 101): 조건 무관 항상 포함
 *   → 3조건 중 하나라도 충족하면 사용 스킬
 */
export interface RawSkill {
  Name     : string;         // "렌딩 피니셔"
  Icon     : string;         // 스킬 아이콘 URL
  Level    : number;         // 1~14 — 사용 판별 조건 1
  Type     : string;         // "일반" | "홀딩" | "콤보" | "지점" | "차지"
  SkillType: number;         // 0 | 1 | 100 | 101
  Tripods  : RawTripod[];    // 전체 트라이포드 (IsSelected=true 인 것만 계산 사용)
  Rune     : RawRune | null; // null = 미장착 — 사용 판별 조건 2
  Tooltip  : string;         // JSON 문자열
}


// ============================================================
// API 응답 최상위 타입
// ============================================================

/**
 * /api/lostark/[name] 엔드포인트 응답 전체 구조
 * src/app/api/lostark/[name]/route.ts 의 combinedData 와 대응
 */
export interface RawCharacterData {
  profile   : RawProfile;
  equipment : RawEquipment[];
  avatars   : RawAvatar[];
  engravings: RawEngravings;
  gems      : RawGems;
  cards     : RawCards;
  arkPassive: RawArkPassive;
  arkGrid   : RawArkGrid;
  skills    : RawSkill[];

  // 전투 계산 무관 섹션
  colosseums  : any;
  collectibles: any[];

  _metadata: {
    characterName     : string;
    fetchedAt         : string;
    requestedEndpoints: string[];
  };
}