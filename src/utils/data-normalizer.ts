/**
 * @/utils/data-normalizer.ts
 *
 * API raw 데이터(RawCharacterData)를 UI 표시용(CharacterDisplayData)으로 변환합니다.
 *
 * [파일 구조]
 *   1. 내부 파싱 유틸  — 이 파일에서만 사용하는 파싱 헬퍼 함수
 *   2. 섹션별 정규화  — normalizeXxx() 함수들
 *   3. 최상위 통합    — normalizeCharacter() 최종 반환
 *
 * [설계 원칙]
 *   - API가 주는 color 값을 그대로 보존 (UI 컴포넌트가 사용 여부 결정)
 *   - 상중하 등급은 API color 기반으로 판별
 *     TODO: src/data/accessory-option-grades.ts 생성 후 수치 기반으로 교체 예정
 *   - 장비 세트 판별은 직업 공통 키워드 기반
 *     TODO: src/data/equipment-sets.ts 생성 후 교체 예정
 */

import {
  RawCharacterData,
} from '@/types/raw-types';

import {
  CharacterDisplayData,
  CharacterProfileDisplay, CombatStatsDisplay,
  EquipmentDisplay, AccessoryDisplay, AccessoryBaseEffect, AccessoryPolishEffect,
  BraceletDisplay, BraceletEffect,
  AbilityStoneDisplay,
  AvatarDisplay,
  EngravingDisplay,
  GemDisplay, GemSummaryDisplay,
  CardSetDisplay,
  ArkPassivePointDisplay, ArkPassiveEffectDisplay,
  ArkGridDisplay, ArkGridCoreDisplay, ArkGridEffectDisplay,
  SkillDisplay, SelectedTripodDisplay, EquippedRuneDisplay,
  ColoredText, ColoredValue, EffectEntry,
  EquipmentSetType, OptionGrade,
} from '@/types/character-types';


// ============================================================
// 1. 내부 파싱 유틸 (export 하지 않음)
// ============================================================

/**
 * HTML 태그를 모두 제거하고 순수 텍스트만 반환합니다.
 * 예: "<FONT COLOR='#99ff99'>21.00%</FONT>" → "21.00%"
 */
const stripHtml = (html: string): string =>
  html.replace(/<[^>]+>/g, '').trim();

/**
 * HTML 문자열에서 첫 번째 font color 값을 추출합니다.
 * 대소문자 무관하게 매칭합니다.
 * 예: "<font color='#ffd200'>+1.21%</font>" → "#ffd200"
 */
const extractColor = (html: string): string | undefined => {
  const m = html.match(/color='([^']+)'/i);
  return m ? m[1] : undefined;
};

/**
 * 문자열에서 첫 번째 숫자(소수점 포함)를 추출합니다.
 * 예: "+1.21%" → 1.21 / "390" → 390
 * 없으면 0 반환
 */
const extractRawNumber = (str: string): number => {
  const m = stripHtml(str).match(/([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
};

/**
 * 퍼센트 문자열을 소수로 변환합니다.
 * 예: "21.00%" → 0.21 / "+1.60%" → 0.016
 */
const extractPercent = (str: string): number =>
  extractRawNumber(str) / 100;

/**
 * HTML 수치 문자열에서 ColoredValue 를 생성합니다.
 * 퍼센트(%) 포함 여부에 따라 소수 변환 여부를 결정합니다.
 * 예: "<FONT COLOR='#CE43FC'>+1.60%</FONT>" → { value: 0.016, color: "#CE43FC" }
 * 예: "<FONT COLOR='#FE9600'>+390</FONT>"   → { value: 390,   color: "#FE9600" }
 */
const toColoredValue = (html: string): ColoredValue => {
  const isPercent = html.includes('%');
  const value     = isPercent ? extractPercent(html) : extractRawNumber(html);
  return { value, color: extractColor(html) };
};

/**
 * 텍스트와 색깔을 함께 저장하는 ColoredText 를 생성합니다.
 * 예: "<FONT COLOR='#FFFFAC'>원한</FONT>" → { text: "원한", color: "#FFFFAC" }
 */
const toColoredText = (html: string): ColoredText => ({
  text : stripHtml(html),
  color: extractColor(html),
});

/**
 * Tooltip JSON 문자열을 파싱합니다.
 * 실패 시 빈 객체 반환 (오류로 앱이 멈추지 않도록)
 */
const parseTooltip = (tooltipStr: string): Record<string, any> => {
  try {
    return JSON.parse(tooltipStr);
  } catch {
    return {};
  }
};

/**
 * 장비 이름에서 재련 단계를 추출합니다.
 * 예: "+18 운명의 업화 할버드" → 18
 * 악세서리처럼 재련이 없으면 0 반환
 */
const extractRefineStep = (name: string): number => {
  const m = name.match(/^\+(\d+)/);
  return m ? parseInt(m[1]) : 0;
};

/**
 * Tooltip leftStr2 에서 아이템 티어를 추출합니다.
 * 예: "아이템 레벨 1710 (티어 4)" → 4
 */
const extractItemTier = (leftStr2: string): number => {
  const m = leftStr2.match(/티어\s*(\d+)/);
  return m ? parseInt(m[1]) : 0;
};

/**
 * 등급 텍스트를 ColoredText 로 변환합니다.
 */
const GRADE_COLORS: Record<string, string> = {
  '고대': '#E3C7A1',
  '유물': '#FA5D00',
  '전설': '#F99200',
  '영웅': '#CE43FC',
  '희귀': '#00B0FA',
  '일반': '#FFFFFF',
};

const toGradeColoredText = (grade: string): ColoredText => ({
  text : grade,
  color: GRADE_COLORS[grade],
});

/**
 * 아크패시브 카테고리별 색깔 매핑
 */
const ARK_PASSIVE_COLORS: Record<string, string> = {
  '진화'  : '#F1D594',
  '깨달음': '#83E9FF',
  '도약'  : '#C2EA55',
};

/**
 * 스킬 분류 색깔 매핑
 */
const SKILL_CATEGORY_COLORS: Record<string, string> = {
  '일반 스킬': '#83DCB7',
  '발현 스킬': '#FE9A2E',
  '화신 스킬': '#FF0000',
  '각성기'   : '#E73517',
  '초각성기' : '#E73517',
};

/**
 * 장비 세트 타입 판별 (직업 공통 키워드 기반)
 *
 * ⚠️ TODO: src/data/equipment-sets.ts 생성 후 교체 예정
 * 현재는 티어4 공통 세트명 키워드로 임시 구현
 */
const detectSetType = (name: string): EquipmentSetType => {
  if (name.includes('결단')) return 'NORMAL_RELIC';
  if (name.includes('업화')) return 'AEGIR_ANCIENT';
  if (name.includes('전율')) return 'SERCA_ANCIENT';
  return 'UNKNOWN';
};

/**
 * 악세서리 연마효과 텍스트에서 EffectTypeId 를 추출합니다.
 */
const POLISH_EFFECT_TYPE_MAP: Record<string, string> = {
  '적에게 주는 피해': 'DMG_INC',
  '추가 피해'       : 'ADD_DMG',
  '공격력'          : 'ATK_PERCENT',
  '무기 공격력'     : 'WEAPON_ATK_PERCENT',
  '치명타 피해'     : 'CRIT_DMG',
  '치명타 적중률'   : 'CRIT_CHANCE',
};

const detectPolishEffectType = (label: string): string => {
  for (const [key, typeId] of Object.entries(POLISH_EFFECT_TYPE_MAP)) {
    if (label.includes(key)) return typeId;
  }
  return 'UNKNOWN';
};

/**
 * 악세서리/팔찌 옵션 상/중/하 판별 — API color 기반
 *
 * 로아 API는 연마효과 수치에 직접 색깔을 부여합니다:
 *   상 → #FE9600 (주황)
 *   중 → #CE43FC (보라)
 *   하 → #00B5FF (파랑)
 *   고정값 → #99ff99 (초록) — 상중하 판별 불필요
 *
 * ⚠️ TODO: src/data/accessory-option-grades.ts 생성 후
 *          색깔 기반 → 수치 기반으로 교체 예정
 */
const detectOptionGrade = (color: string | undefined): OptionGrade => {
  if (color === '#FE9600') return 'HIGH';
  if (color === '#CE43FC') return 'MID';
  if (color === '#00B5FF') return 'LOW';
  return 'LOW'; // fallback
};


// ============================================================
// 2. 섹션별 정규화 함수
// ============================================================

// ------------------------------------------------------------
// 2-1. 프로필
// ------------------------------------------------------------

export const normalizeProfile = (raw: RawCharacterData): CharacterProfileDisplay => {
  const p = raw.profile;
  return {
    name           : p.CharacterName,
    className      : p.CharacterClassName,
    characterLevel : p.CharacterLevel,
    itemAvgLevel   : parseFloat(p.ItemAvgLevel.replace(/,/g, '')),
    combatPower    : parseFloat(p.CombatPower.replace(/,/g, '')),
    serverName     : p.ServerName,
    guildName      : p.GuildName        ?? '',
    guildGrade     : p.GuildMemberGrade ?? '',
    expeditionLevel: p.ExpeditionLevel,
    townLevel      : p.TownLevel,
    townName       : p.TownName,
    title          : p.Title ?? '없음',
    honorLevel     : p.HonorPoint,
    characterImage : p.CharacterImage,
  };
};


// ------------------------------------------------------------
// 2-2. 전투 특성
// ------------------------------------------------------------

export const normalizeCombatStats = (raw: RawCharacterData): CombatStatsDisplay => {
  // profile.Stats 배열을 Type 기준으로 맵핑
  const statsMap = Object.fromEntries(
    raw.profile.Stats.map(s => [s.Type, parseInt(s.Value.replace(/,/g, ''))])
  );
  return {
    critical      : statsMap['치명']        ?? 0,
    specialization: statsMap['특화']        ?? 0,
    swiftness     : statsMap['신속']        ?? 0,
    domination    : statsMap['제압']        ?? 0,
    endurance     : statsMap['인내']        ?? 0,
    expertise     : statsMap['숙련']        ?? 0,
    maxHp         : statsMap['최대 생명력'] ?? 0,
    attackPower   : statsMap['공격력']      ?? 0,
  };
};


// ------------------------------------------------------------
// 2-3. 전투 장비 (무기/방어구)
// ------------------------------------------------------------

/**
 * Tooltip 에서 아크패시브 포인트 기여 추출
 * 방어구: Element_010, 악세서리/팔찌: Element_007
 */
const extractArkPassivePoint = (
  tooltip: Record<string, any>
): { category: ColoredText; point: ColoredValue } | null => {
  const candidates = ['Element_010', 'Element_007'];
  for (const key of candidates) {
    const el      = tooltip[key];
    const content: string = el?.value?.Element_001 ?? '';
    if (content.includes('아크 패시브 포인트')) {
      // "진화 +24" | "깨달음 +13" | "도약 +18"
      const m = stripHtml(content).match(/(진화|깨달음|도약)\s*\+(\d+)/);
      if (m) {
        return {
          category: { text: m[1], color: ARK_PASSIVE_COLORS[m[1]] },
          point   : { value: parseInt(m[2]), color: undefined },
        };
      }
    }
  }
  return null;
};

export const normalizeEquipment = (raw: RawCharacterData): EquipmentDisplay[] => {
  const weaponTypes = ['무기', '투구', '상의', '하의', '장갑', '어깨'];

  return raw.equipment
    .filter(eq => weaponTypes.includes(eq.Type))
    .map(eq => {
      const tooltip = parseTooltip(eq.Tooltip);
      const titleEl = tooltip['Element_001']?.value ?? {};
      const tier    = extractItemTier(titleEl.leftStr2 ?? '');
      const effects: EffectEntry[] = [];

      // 무기: Element_006 = 무기 공격력, Element_008 = 추가 피해
      if (eq.Type === '무기') {
        const base: string = tooltip['Element_006']?.value?.Element_001 ?? '';
        const add : string = tooltip['Element_008']?.value?.Element_001 ?? '';
        if (base.includes('무기 공격력')) {
          effects.push({
            effectType: 'WEAPON_ATK_STATIC',
            label     : { text: '무기 공격력', color: undefined },
            value     : { value: extractRawNumber(base), color: undefined },
          });
        }
        if (add.includes('추가 피해')) {
          effects.push({
            effectType: 'ADD_DMG',
            label     : { text: '추가 피해', color: undefined },
            value     : toColoredValue(add),
          });
        }
      }

      // 방어구: Element_006 = 주스탯 (힘/민첩/지능)
      if (['투구', '상의', '하의', '장갑', '어깨'].includes(eq.Type)) {
        const base: string = tooltip['Element_006']?.value?.Element_001 ?? '';
        const mainStatM = base.match(/힘\s*\+(\d+)/);
        if (mainStatM) {
          effects.push({
            effectType: 'MAIN_STAT_STATIC',
            label     : { text: '힘', color: undefined },
            value     : { value: parseInt(mainStatM[1]), color: undefined },
          });
        }
      }

      return {
        type      : eq.Type,
        name      : eq.Name,
        icon      : eq.Icon,
        grade     : toGradeColoredText(eq.Grade),
        refineStep: extractRefineStep(eq.Name),
        quality   : titleEl.qualityValue ?? 0,
        itemTier  : tier,
        setType   : detectSetType(eq.Name),
        effects,
        arkPassivePoint: extractArkPassivePoint(tooltip),
      };
    });
};


// ------------------------------------------------------------
// 2-4. 악세서리 (목걸이/귀걸이/반지)
// ------------------------------------------------------------

export const normalizeAccessories = (raw: RawCharacterData): AccessoryDisplay[] => {
  const accTypes = ['목걸이', '귀걸이', '반지'];

  return raw.equipment
    .filter(eq => accTypes.includes(eq.Type))
    .map(eq => {
      const tooltip = parseTooltip(eq.Tooltip);
      const titleEl = tooltip['Element_001']?.value ?? {};
      const tier    = extractItemTier(titleEl.leftStr2 ?? '');

      // 기본 효과: Element_004.value.Element_001
      // "힘 +15446\n민첩 +15446(회색)\n지능 +15446(회색)\n체력 +3789"
      const baseEffects: AccessoryBaseEffect[] = [];
      const baseStr: string = tooltip['Element_004']?.value?.Element_001 ?? '';
      baseStr.split(/<br\s*\/?>/i).filter(Boolean).forEach(line => {
        const clean = stripHtml(line);
        const m     = clean.match(/(힘|민첩|지능|체력)\s*\+(\d+)/);
        if (m) {
          // 회색(#686660) = 비주스탯
          const isNonMain = line.toLowerCase().includes('#686660');
          baseEffects.push({
            statType: { text: m[1], color: isNonMain ? '#686660' : undefined },
            value   : { value: parseInt(m[2]), color: undefined },
          });
        }
      });

      // 연마 효과: Element_006.value.Element_001
      // "<img ...>추가 피해 <FONT COLOR='#CE43FC'>+1.60%</FONT>"
      // color 가 상중하를 직접 알려줍니다
      const polishEffects: AccessoryPolishEffect[] = [];
      const polishStr: string = tooltip['Element_006']?.value?.Element_001 ?? '';
      polishStr.split(/<br\s*\/?>/i).filter(Boolean).forEach(line => {
        const clean      = stripHtml(line);
        const labelM     = clean.match(/^([가-힣\s]+)/);
        const labelText  = labelM ? labelM[1].trim() : clean;
        const effectType = detectPolishEffectType(labelText);
        const cv         = toColoredValue(line);

        // color 기반으로 상중하 판별
        polishEffects.push({
          effectType,
          label: { text: labelText, color: undefined },
          value: cv,
          grade: detectOptionGrade(cv.color),
        });
      });

      return {
        type         : eq.Type,
        name         : eq.Name,
        icon         : eq.Icon,
        grade        : toGradeColoredText(eq.Grade),
        quality      : titleEl.qualityValue ?? 0,
        itemTier     : tier,
        baseEffects,
        polishEffects,
        arkPassivePoint: extractArkPassivePoint(tooltip),
      };
    });
};


// ------------------------------------------------------------
// 2-5. 팔찌
// ------------------------------------------------------------

export const normalizeBracelet = (raw: RawCharacterData): BraceletDisplay | null => {
  const bracelet = raw.equipment.find(eq => eq.Type === '팔찌');
  if (!bracelet) return null;

  const tooltip    = parseTooltip(bracelet.Tooltip);
  const effectStr: string = tooltip['Element_005']?.value?.Element_001 ?? '';

  // 팔찌 효과 라벨 → effectType + isFixed 매핑
  const BRACELET_EFFECT_MAP: Record<string, { effectType: string; isFixed: boolean }> = {
    '신속'            : { effectType: 'SWIFTNESS',      isFixed: true  },
    '특화'            : { effectType: 'SPECIALIZATION', isFixed: true  },
    '헤드어택'        : { effectType: 'DMG_INC',        isFixed: false },
    '치명타 피해'     : { effectType: 'CRIT_DMG',       isFixed: false },
    '치명타로 적중 시': { effectType: 'CRIT_DMG_INC',   isFixed: false },
    '추가 피해'       : { effectType: 'ADD_DMG',        isFixed: false },
  };

  const effects: BraceletEffect[] = effectStr
    .split(/<br\s*\/?>/i)
    .filter(Boolean)
    .map(line => {
      const clean      = stripHtml(line);
      let effectType   = 'UNKNOWN';
      let isFixed      = false;

      for (const [key, val] of Object.entries(BRACELET_EFFECT_MAP)) {
        if (clean.includes(key)) {
          effectType = val.effectType;
          isFixed    = val.isFixed;
          break;
        }
      }

      const labelM    = clean.match(/^([^+\d]+)/);
      const labelText = labelM ? labelM[1].trim() : clean;
      const cv        = toColoredValue(line);

      return {
        effectType,
        label  : { text: labelText, color: undefined },
        value  : cv,
        isFixed,
        // 고정 특성은 등급 없음, 랜덤 옵션은 color 기반 판별
        grade  : isFixed ? undefined : detectOptionGrade(cv.color),
      };
    });

  return {
    name   : bracelet.Name,
    icon   : bracelet.Icon,
    grade  : toGradeColoredText(bracelet.Grade),
    effects,
    arkPassivePoint: extractArkPassivePoint(tooltip),
  };
};


// ------------------------------------------------------------
// 2-6. 어빌리티 스톤
// ------------------------------------------------------------

export const normalizeAbilityStone = (raw: RawCharacterData): AbilityStoneDisplay | null => {
  const stone = raw.equipment.find(eq => eq.Type === '어빌리티 스톤');
  if (!stone) return null;

  const tooltip        = parseTooltip(stone.Tooltip);
  const engravingGroup = tooltip['Element_007']?.value?.Element_000?.contentStr ?? {};

  const engravings: AbilityStoneDisplay['engravings'] = [];
  let   penalty:    AbilityStoneDisplay['penalty']    = null;
  let   baseAtkBonus = 0;

  // Element_006: 세공 단계 보너스 "기본 공격력 X%"
  const bonusStr: string = tooltip['Element_006']?.value?.Element_001 ?? '';
  if (bonusStr.includes('기본 공격력')) {
    baseAtkBonus = extractPercent(bonusStr);
  }

  // 각인 파싱: "[원한] Lv.1" | "[아드레날린] Lv.3" | "[공격력 감소] Lv.0"
  Object.values(engravingGroup).forEach((item: any) => {
    const content: string = item?.contentStr ?? '';
    const clean   = stripHtml(content);
    const m       = clean.match(/\[([^\]]+)\]\s*Lv\.(\d+)/);
    if (!m) return;

    const name  = m[1];
    const level = parseInt(m[2]);

    // 빨간색 = 패널티
    if (content.toLowerCase().includes('#fe2e2e')) {
      penalty = {
        name : { text: name, color: '#FE2E2E' },
        level: { value: level, color: undefined },
      };
    } else {
      engravings.push({
        name : { text: name, color: '#FFFFAC' },
        level: { value: level, color: undefined },
      });
    }
  });

  return {
    name        : stone.Name,
    icon        : stone.Icon,
    grade       : toGradeColoredText(stone.Grade),
    baseAtkBonus,
    engravings,
    penalty,
  };
};


// ------------------------------------------------------------
// 2-7. 아바타
// ------------------------------------------------------------

export const normalizeAvatars = (raw: RawCharacterData): AvatarDisplay[] => {
  const targetTypes = ['무기 아바타', '상의 아바타', '하의 아바타'];

  // 부위별로 그룹핑
  const grouped: Record<string, typeof raw.avatars> = {};
  raw.avatars
    .filter(av => targetTypes.includes(av.Type))
    .forEach(av => {
      if (!grouped[av.Type]) grouped[av.Type] = [];
      grouped[av.Type].push(av);
    });

  return Object.entries(grouped).map(([type, avatars]) => {
    // 부위 내 최댓값 적용 (이너 아바타 포함)
    const bonuses = avatars.map(av => {
      const tooltip   = parseTooltip(av.Tooltip);
      const bonusStr: string = tooltip['Element_005']?.value?.Element_001 ?? '';
      return {
        avatar: av,
        bonus : bonusStr.includes('%') ? extractPercent(bonusStr) : 0,
      };
    });

    const best = bonuses.reduce((a, b) => a.bonus >= b.bonus ? a : b);

    return {
      type         : type,
      name         : best.avatar.Name,
      icon         : best.avatar.Icon,
      grade        : toGradeColoredText(best.avatar.Grade),
      mainStatBonus: best.bonus,
    };
  });
};


// ------------------------------------------------------------
// 2-8. 각인
// ------------------------------------------------------------

export const normalizeEngravings = (raw: RawCharacterData): EngravingDisplay[] =>
  raw.engravings.ArkPassiveEffects.map(eff => ({
    name             : { text: eff.Name,  color: '#FFFFAC' },
    grade            : toGradeColoredText(eff.Grade),
    level            : eff.Level,
    abilityStoneLevel: eff.AbilityStoneLevel,
    description      : stripHtml(eff.Description),
    icon             : '', // ⚠️ TODO: ENGRAVINGS_DB 에서 아이콘 매핑 필요
  }));


// ------------------------------------------------------------
// 2-9. 보석
// ------------------------------------------------------------

export const normalizeGems = (raw: RawCharacterData): GemSummaryDisplay => {
  const gemMap = Object.fromEntries(raw.gems.Gems.map(g => [g.Slot, g]));

  const gems: GemDisplay[] = raw.gems.Effects.Skills.map(skill => {
    const gem  = gemMap[skill.GemSlot];
    const desc = skill.Description[0] ?? '';

    // "피해 36.00% 증가" | "재사용 대기시간 18.00% 감소"
    const isDmg      = desc.includes('피해');
    const effectValue = extractPercent(desc);

    return {
      slot        : skill.GemSlot,
      level       : gem?.Level  ?? 0,
      grade       : toGradeColoredText(gem?.Grade ?? ''),
      icon        : gem?.Icon   ?? skill.Icon,
      skillName   : { text: skill.Name,    color: '#FFD200' },
      effectLabel : { text: isDmg ? '피해' : '재사용 대기시간', color: undefined },
      effectValue : { value: effectValue,  color: isDmg ? '#99ff99' : '#87CEEB' },
      baseAtkBonus: extractPercent(skill.Option),
    };
  });

  const totalBaseAtk = extractPercent(raw.gems.Effects.Description);

  return {
    gems,
    totalBaseAtk: { value: totalBaseAtk, color: '#B7FB00' },
  };
};


// ------------------------------------------------------------
// 2-10. 카드
// ------------------------------------------------------------

export const normalizeCards = (raw: RawCharacterData): CardSetDisplay | null => {
  if (!raw.cards.Effects?.length) return null;

  const effect     = raw.cards.Effects[0];
  const totalAwake = raw.cards.Cards.reduce((sum, c) => sum + c.AwakeCount, 0);

  // 세트 이름: "세상을 구하는 빛 6세트 (30각성합계)" → "세상을 구하는 빛"
  const setNameM = effect.Items[0]?.Name.match(/^(.+?)\s+\d+세트/);
  const setName  = setNameM ? setNameM[1] : '';

  // 현재 각성 합계 기준 발동된 효과만 필터링
  const activeItems = effect.Items
    .filter(item => {
      const awakeM = item.Name.match(/\((\d+)각성합계\)/);
      if (!awakeM) {
        const setM = item.Name.match(/(\d+)세트$/);
        return setM ? totalAwake >= parseInt(setM[1]) * 5 : true;
      }
      return totalAwake >= parseInt(awakeM[1]);
    })
    .map(item => ({
      name       : item.Name,
      description: stripHtml(item.Description),
      value      : item.Description.includes('%')
        ? toColoredValue(item.Description)
        : undefined,
    }));

  return { setName, totalAwake, activeItems };
};


// ------------------------------------------------------------
// 2-11. 아크패시브
// ------------------------------------------------------------

export const normalizeArkPassive = (raw: RawCharacterData) => {
  const p = raw.arkPassive;

  const getPoint = (name: string) => {
    const found = p.Points.find(pt => pt.Name === name);
    return { value: found?.Value ?? 0, description: found?.Description ?? '' };
  };

  const points: ArkPassivePointDisplay = {
    evolution: getPoint('진화'),
    insight  : getPoint('깨달음'),
    leap     : getPoint('도약'),
    title    : p.Title,
  };

  // Description 패턴: "진화 2티어 예리한 감각 Lv.2"
  const PATTERN = /(진화|깨달음|도약)\s+(\d+)티어\s+(.+?)\s+Lv\.(\d+)/;

  const effects: ArkPassiveEffectDisplay[] = p.Effects.map(eff => {
    const clean  = stripHtml(eff.Description);
    const m      = clean.match(PATTERN);

    // ToolTip JSON Element_002 에서 효과 설명 추출
    const ttJson = parseTooltip(eff.ToolTip);
    const descRaw: string = ttJson['Element_002']?.value ?? '';
    const desc   = stripHtml(descRaw.split('||')[0]);

    const category = m ? m[1] : eff.Name;

    return {
      category   : { text: category, color: ARK_PASSIVE_COLORS[category] },
      name       : { text: m ? m[3] : clean, color: undefined },
      tier       : m ? parseInt(m[2]) : 0,
      level      : m ? parseInt(m[4]) : 0,
      description: desc,
      icon       : eff.Icon,
    };
  });

  return { points, effects };
};


// ------------------------------------------------------------
// 2-12. 아크그리드
// ------------------------------------------------------------

export const normalizeArkGrid = (raw: RawCharacterData): ArkGridDisplay => {
  const cores: ArkGridCoreDisplay[] = raw.arkGrid.Slots.map(slot => ({
    index: slot.Index,
    name : { text: slot.Name,  color: GRADE_COLORS[slot.Grade] },
    point: { value: slot.Point, color: '#B7FB00' },
    grade: toGradeColoredText(slot.Grade),
    icon : slot.Icon,
  }));

  // Tooltip: "공격력 <font color='#ffd200'>+1.21%</font>"
  const effects: ArkGridEffectDisplay[] = raw.arkGrid.Effects.map(eff => ({
    label: { text: eff.Name, color: undefined },
    level: eff.Level,
    value: { value: extractPercent(eff.Tooltip), color: extractColor(eff.Tooltip) },
  }));

  return { cores, effects };
};


// ------------------------------------------------------------
// 2-13. 스킬
// ------------------------------------------------------------

export const normalizeSkills = (raw: RawCharacterData): SkillDisplay[] => {
  // 보석 적용 스킬명 목록 (사용 판별 조건 3)
  const gemSkillNames = raw.gems.Effects.Skills.map(s => s.Name);

  // 스킬 사용 여부 판별 함수
  const isSkillUsed = (skill: typeof raw.skills[0]): boolean => {
    if (skill.SkillType === 100 || skill.SkillType === 101) return true;
    if (skill.Level >= 4 || skill.Rune !== null) return true;
    return gemSkillNames.some(
      name => skill.Name.includes(name) || name.includes(skill.Name)
    );
  };

  return raw.skills
    .filter(isSkillUsed)
    .map(skill => {
      const tooltip  = parseTooltip(skill.Tooltip);
      const titleEl  = tooltip['Element_001']?.value ?? {};

      // 스킬 분류: "[발현 스킬]" | "[화신 스킬]" | "[일반 스킬]"
      const levelStr: string  = titleEl.level ?? '';
      const categoryM         = levelStr.match(/\[([^\]]+)\]/);
      const categoryText      = categoryM ? categoryM[1] : '일반 스킬';

      // 선택된 트라이포드만
      const selectedTripods: SelectedTripodDisplay[] = skill.Tripods
        .filter(t => t.IsSelected)
        .map(t => ({
          tier: t.Tier,
          slot: t.Slot,
          name: { text: t.Name, color: '#FFBB63' },
          icon: t.Icon,
        }));

      // 룬
      const rune: EquippedRuneDisplay | null = skill.Rune
        ? {
            name : { text: skill.Rune.Name,  color: GRADE_COLORS[skill.Rune.Grade] },
            grade: toGradeColoredText(skill.Rune.Grade),
            icon : skill.Rune.Icon,
          }
        : null;

      return {
        name           : skill.Name,
        icon           : skill.Icon,
        level          : skill.Level,
        type           : skill.Type,
        skillType      : skill.SkillType,
        category       : {
          text : categoryText,
          color: SKILL_CATEGORY_COLORS[categoryText],
        },
        isUsed         : true, // filter 통과한 것은 모두 true
        selectedTripods,
        rune,
      };
    });
};


// ============================================================
// 3. 최상위 통합 함수
// ============================================================

/**
 * API raw 데이터를 UI 표시용 전체 캐릭터 데이터로 변환합니다.
 * 컴포넌트에서 이 함수 하나만 호출하면 됩니다.
 *
 * 사용 예시:
 *   const displayData = normalizeCharacter(rawData);
 *   // displayData.profile.name               → "소르가나"
 *   // displayData.accessories[0].polishEffects[0].grade → "MID"
 *   // displayData.arkGrid.effects[0].value.color        → "#ffd200"
 */
export const normalizeCharacter = (raw: RawCharacterData): CharacterDisplayData => ({
  profile     : normalizeProfile(raw),
  combatStats : normalizeCombatStats(raw),
  equipment   : normalizeEquipment(raw),
  accessories : normalizeAccessories(raw),
  bracelet    : normalizeBracelet(raw),
  abilityStone: normalizeAbilityStone(raw),
  avatars     : normalizeAvatars(raw),
  engravings  : normalizeEngravings(raw),
  gems        : normalizeGems(raw),
  cards       : normalizeCards(raw),
  arkPassive  : normalizeArkPassive(raw),
  arkGrid     : normalizeArkGrid(raw),
  skills      : normalizeSkills(raw),
});