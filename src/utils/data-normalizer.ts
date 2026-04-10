/**
 * @/utils/data-normalizer.ts
 * RawCharacterData → CharacterDisplayData 변환
 * UI 표시용 데이터만 생성 — 계산용 수치는 useCalculatorStore 담당
 */

import { RawCharacterData } from '@/types/raw-types';
import { COMMON_EFFECT_TYPES } from '@/types/sim-types';
import {
  ColoredText,
  ColoredValue,
  CharacterDisplayData,
  CharacterProfileDisplay,
  CombatStatsDisplay,
  EquipmentDisplay,
  EquipmentSetType,
  AccessoryDisplay, AccessoryEffect,
  OptionGrade,
  BraceletDisplay,
  AbilityStoneDisplay,
  BoJuDisplay,
  AvatarDisplay,
  EngravingDisplay,
  GemDisplay,
  CardSetDisplay,
  ArkPassivePointDisplay,
  ArkPassiveEffectDisplay,
  ArkGridDisplay,
  SkillDisplay,
  SelectedTripodDisplay,
  EquippedRuneDisplay,
} from '@/types/character-types';

import { COMBAT_EQUIP_DATA } from '@/data/equipment/combat-equip';
import { ACCESSORY_DATA }    from '@/data/equipment/accessory';


// ============================================================
// 내부 파싱 유틸
// ============================================================

/** HTML 태그 제거 */
const stripHtml = (html: string): string =>
  html.replace(/<[^>]+>/g, '').trim();

/** 첫 번째 font color 추출 */
const extractColor = (html: string): string | undefined => {
  const m = html.match(/color='([^']+)'/i);
  return m ? m[1] : undefined;
};

/** 문자열에서 첫 번째 숫자 추출 */
const extractRawNumber = (str: string): number => {
  const m = stripHtml(str).match(/([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
};

/** 퍼센트 문자열 → 소수 */
const extractPercent = (str: string): number =>
  extractRawNumber(str) / 100;

/** HTML 수치 문자열 → ColoredValue */
const toColoredValue = (html: string): ColoredValue => {
  const isPercent = html.includes('%');
  const value     = isPercent ? extractPercent(html) : extractRawNumber(html);
  return { value, color: extractColor(html) };
};

/** HTML 문자열 → ColoredText */
const toColoredText = (html: string): ColoredText => ({
  text : stripHtml(html),
  color: extractColor(html),
});

/** Tooltip JSON 파싱 */
const parseTooltip = (tooltipStr: string): Record<string, any> => {
  try { return JSON.parse(tooltipStr); }
  catch { return {}; }
};

/** 장비 이름에서 재련 단계 추출 */
const extractRefineStep = (name: string): number => {
  const m = name.match(/^\+(\d+)/);
  return m ? parseInt(m[1]) : 0;
};

/** leftStr2에서 아이템 티어 추출 */
const extractItemTier = (leftStr2: string): number => {
  const m = leftStr2.match(/티어\s*(\d+)/);
  return m ? parseInt(m[1]) : 0;
};

/** 등급명 → 색상 상수 */
const GRADE_COLORS: Record<string, string> = {
  '고대': '#E3C7A1', '유물': '#FA5D00', '전설': '#F99200',
  '영웅': '#CE43FC', '희귀': '#00B0FA', '일반': '#FFFFFF',
};

/** 등급명 → ColoredText */
const toGradeColoredText = (grade: string): ColoredText => ({
  text : grade,
  color: GRADE_COLORS[grade],
});

/** 아크패시브 카테고리 색상 */
const ARK_PASSIVE_COLORS: Record<string, string> = {
  '진화': '#F1D594', '깨달음': '#83E9FF', '도약': '#C2EA55',
};

/** 스킬 분류 색상 */
const SKILL_CATEGORY_COLORS: Record<string, string> = {
  '일반 스킬': '#83DCB7', '발현 스킬': '#FE9A2E',
  '화신 스킬': '#FF0000', '각성기'  : '#E73517', '초각성기': '#E73517',
};


// ============================================================
// DB 조회 헬퍼
// ============================================================

/**
 * 장비 이름으로 세트 타입 판별
 *
 * combat-equip.ts의 multiName을 기준으로 매칭합니다.
 * multiName 예: { ancient: '운명의 업화 투구', serca: '운명의 전율 투구' }
 * "운명의 업화" → AEGIR_ANCIENT
 * "운명의 전율" → SERCA_ANCIENT
 * 매칭 없음    → UNKNOWN
 */
const findEquipSetType = (itemName: string): EquipmentSetType => {
  for (const db of COMBAT_EQUIP_DATA) {
    if (db.multiName.serca   && itemName.includes(db.multiName.serca.split(' ')[2]   ?? '')) return 'SERCA_ANCIENT';
    if (db.multiName.ancient && itemName.includes(db.multiName.ancient.split(' ')[2] ?? '')) return 'AEGIR_ANCIENT';
    if (db.multiName.relic   && itemName.includes(db.multiName.relic.split(' ')[2]   ?? '')) return 'NORMAL_RELIC';
  }
  return 'UNKNOWN';
};

/**
 * 연마효과 수치로 상/중/하 등급 판별
 *
 * accessory.ts의 grades 범위를 기준으로 판별합니다.
 * grades.high[0] 이상 → HIGH
 * grades.mid[0]  이상 → MID
 * 그 외           → LOW
 *
 * color가 명시된 경우 color 우선 적용 (API가 색상을 직접 주는 경우)
 */
const findPolishGrade = (
  effectType : string,
  value      : number,
  colorHint ?: string,
): OptionGrade => {
  // API 색상이 있으면 색상 기준으로 우선 판별
  if (colorHint === '#FE9600') return 'HIGH';
  if (colorHint === '#CE43FC') return 'MID';
  if (colorHint === '#00B5FF') return 'LOW';

  // DB grades 범위로 판별
  for (const db of ACCESSORY_DATA) {
    const eff = db.effects?.find(e => e.type === effectType && e.grades);
    if (!eff?.grades) continue;
    if (value >= eff.grades.high[0]) return 'HIGH';
    if (value >= eff.grades.mid[0])  return 'MID';
    return 'LOW';
  }

  // DB에 해당 타입 없으면 LOW 기본값
  return 'LOW';
};

/**
 * 연마효과 label → effectType 감지
 * 순서 중요 — 무기공격력을 공격력보다 먼저 검사
 */
const POLISH_EFFECT_TYPE_LIST: Array<[string, string]> = [
  ['적에게 주는 피해', 'DMG_INC'     ],
  ['추가 피해'       , 'ADD_DMG'     ],
  ['무기 공격력'     , 'WEAPON_ATK_P'],
  ['공격력'          , 'ATK_P'       ],
  ['치명타 피해'     , 'CRIT_DMG'    ],
  ['치명타 적중률'   , 'CRIT_CHANCE' ],
];

const detectPolishEffectType = (label: string, value: number): string => {
  // 공격력 C/P 구분: % 여부로 판단 (value < 1이면 퍼센트)
  if (label.includes('공격력') && !label.includes('무기') && value >= 1) return 'ATK_C';
  for (const [key, typeId] of POLISH_EFFECT_TYPE_LIST) {
    if (label.includes(key)) return typeId;
  }
  return 'UNKNOWN';
};


// ============================================================
// 섹션별 정규화
// ============================================================

// ── 프로필 ──────────────────────────────────────────────────

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

// ── 전투 특성 ────────────────────────────────────────────────

export const normalizeCombatStats = (raw: RawCharacterData): CombatStatsDisplay => {
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

// ── 전투 장비 ────────────────────────────────────────────────

export const normalizeEquipment = (raw: RawCharacterData): EquipmentDisplay[] => {
  const weaponTypes = ['무기', '투구', '상의', '하의', '장갑', '어깨'];
  return raw.equipment
    .filter(eq => weaponTypes.includes(eq.Type))
    .map(eq => {
      const tooltip = parseTooltip(eq.Tooltip);
      const titleEl = tooltip['Element_001']?.value ?? {};
      const tier    = extractItemTier(titleEl.leftStr2 ?? '');
      return {
        type      : eq.Type,
        name      : eq.Name,
        icon      : eq.Icon,
        grade     : toGradeColoredText(eq.Grade),
        refineStep: extractRefineStep(eq.Name),
        quality   : titleEl.qualityValue ?? 0,
        itemTier  : tier,
        setType   : findEquipSetType(eq.Name),
      };
    });
};

// ── 악세서리 ────────────────────────────────────────────────
export const normalizeAccessories = (raw: RawCharacterData): AccessoryDisplay[] => {
  const accTypes = ['목걸이', '귀걸이', '반지'];
  return raw.equipment
    .filter(eq => accTypes.includes(eq.Type))
    .map(eq => {
      const tooltip = parseTooltip(eq.Tooltip);
      const titleEl = tooltip['Element_001']?.value ?? {};
      const tier    = extractItemTier(titleEl.leftStr2 ?? '');

      const effects: AccessoryEffect[] = [];

      // 1) 기본 효과 파싱 (힘/민첩/지능/체력)
      const baseStr: string = tooltip['Element_004']?.value?.Element_001 ?? '';
      baseStr.split(/<br\s*\/?>/i).filter(Boolean).forEach(line => {
        const clean = stripHtml(line);
        const m     = clean.match(/(힘|민첩|지능|체력)\s*\+(\d+)/);
        if (m) {
          const name = m[1];
          const value = parseInt(m[2]);
          const isNonMain = line.toLowerCase().includes('#686660'); // 비주스탯(회색) 체크

          effects.push({
            id: 0, // 필요 시 DB ID 매칭 (예: MAIN_STAT)
            name: name,
            label: { text: name, color: isNonMain ? '#686660' : undefined },
            isDb: true,
            value: { value, color: undefined },
            // 주스탯은 범위값이 없으므로 생략
          });
        }
      });

      // 2) 연마 효과 파싱
      const polishStr: string = tooltip['Element_006']?.value?.Element_001 ?? '';
      polishStr.split(/<br\s*\/?>/i).filter(Boolean).forEach(line => {
        const clean     = stripHtml(line);
        const labelM    = clean.match(/^([가-힣\s]+)/);
        const labelText = labelM ? labelM[1].trim() : clean;
        const cv        = toColoredValue(line);
        const effectType = detectPolishEffectType(labelText, cv.value);

        // TODO: ACCESSORY_DATA에서 해당 effectType의 min/max를 가져오는 로직 추가
        const dbInfo = ACCESSORY_DATA.find(d => d.effects?.some(e => e.type === effectType));
        const effectDb = dbInfo?.effects?.find(e => e.type === effectType);

        effects.push({
          id: effectDb?.id ?? 0,
          name: labelText,
          label: { text: labelText, color: undefined },
          isDb: !!effectDb,
          value: cv,
          valueRange: effectDb?.range, // { min, max }
          opGrade: findPolishGrade(effectType, cv.value, cv.color),
        });
      });

      return {
        id: 0, // 악세서리 자체 ID는 필요 시 정의
        name: eq.Name,
        label: { text: eq.Name, color: undefined },
        isDb: true,
        icon: eq.Icon,
        type: eq.Type,
        grade: toGradeColoredText(eq.Grade),
        quality: titleEl.qualityValue ?? 0,
        itemTier: tier,
        effects, // 통합된 배열
      };
    });
};

// ── 팔찌 ────────────────────────────────────────────────────
export const normalizeBracelet = (raw: RawCharacterData): BraceletDisplay | null => {
  const bracelet = raw.equipment.find(eq => eq.Type === '팔찌');
  if (!bracelet) return null;

  const tooltip = parseTooltip(bracelet.Tooltip);
  const effectStr: string = tooltip['Element_005']?.value?.Element_001 ?? '';

  const effects: AccessoryEffect[] = effectStr
    .split(/<br\s*\/?>/i)
    .filter(Boolean)
    .map(line => {
      const clean = stripHtml(line);
      // ... (기존 effectType 감지 로직 동일) ...
      
      const labelM    = clean.match(/^([^+\d]+)/);
      const labelText = labelM ? labelM[1].trim() : clean;
      const cv        = toColoredValue(line);
      
      // 팔찌 DB(BRACELET_DATA)에서 정보 조회 (가정)
      // const effectDb = BRACELET_DATA.find(...) 

      return {
        id: 0, // DB ID
        name: labelText,
        label: { text: labelText, color: undefined },
        isDb: true, 
        value: cv,
        // valueRange: effectDb?.range, // 범위값 추가
        opGrade: line.includes('color') ? findPolishGrade('UNKNOWN', cv.value, cv.color) : undefined,
      };
    });

  return {
    id: 0,
    name: bracelet.Name,
    label: { text: bracelet.Name, color: undefined },
    isDb: true,
    icon: bracelet.Icon,
    grade: toGradeColoredText(bracelet.Grade),
    effects,
  };
};

// ── 어빌리티 스톤 ────────────────────────────────────────────

export const normalizeAbilityStone = (raw: RawCharacterData): AbilityStoneDisplay | null => {
  const stone = raw.equipment.find(eq => eq.Type === '어빌리티 스톤');
  if (!stone) return null;

  const tooltip        = parseTooltip(stone.Tooltip);
  const engravingGroup = tooltip['Element_007']?.value?.Element_000?.contentStr ?? {};
  const bonusStr: string = tooltip['Element_006']?.value?.Element_001 ?? '';
  const baseAtkBonus   = bonusStr.includes('기본 공격력')
    ? extractPercent(bonusStr)
    : 0;

  const engravings: AbilityStoneDisplay['engravings'] = [];
  let   penalty:    AbilityStoneDisplay['penalty']    = null;

  Object.values(engravingGroup).forEach((item: any) => {
    const content: string = item?.contentStr ?? '';
    const clean = stripHtml(content);
    const m     = clean.match(/\[([^\]]+)\]\s*Lv\.(\d+)/);
    if (!m) return;
    const name  = m[1];
    const level = parseInt(m[2]);

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
    name: stone.Name, icon: stone.Icon,
    grade: toGradeColoredText(stone.Grade),
    baseAtkBonus, engravings, penalty,
  };
};

// ── 보주 ────────────────────────────────────────────────────

export const normalizeBoJu = (raw: RawCharacterData): BoJuDisplay | null => {
  const boju = raw.equipment.find(eq => eq.Type === '보주');
  if (!boju) return null;

  const tooltip   = parseTooltip(boju.Tooltip);
  const effectStr: string = tooltip['Element_004']?.value?.Element_001 ?? '';
  const seasonM   = effectStr.match(/시즌(\d+)\s*달성\s*최대\s*낙원력\s*:\s*([\d,]+)/);

  return {
    name        : boju.Name,
    icon        : boju.Icon,
    grade       : toGradeColoredText(boju.Grade),
    seasonLabel : seasonM ? `시즌${seasonM[1]}` : '',
    paradoxPower: seasonM ? parseInt(seasonM[2].replace(/,/g, '')) : 0,
  };
};

// ── 아바타 ──────────────────────────────────────────────────

export const normalizeAvatars = (raw: RawCharacterData): AvatarDisplay[] => {
  const targetTypes = ['무기 아바타', '상의 아바타', '하의 아바타'];
  const grouped: Record<string, typeof raw.avatars> = {};

  raw.avatars
    .filter(av => targetTypes.includes(av.Type))
    .forEach(av => {
      if (!grouped[av.Type]) grouped[av.Type] = [];
      grouped[av.Type].push(av);
    });

  return Object.entries(grouped).map(([type, avatars]) => {
    const bonuses = avatars.map(av => {
      const tooltip  = parseTooltip(av.Tooltip);
      const bonusStr: string = tooltip['Element_005']?.value?.Element_001 ?? '';
      return { avatar: av, bonus: bonusStr.includes('%') ? extractPercent(bonusStr) : 0 };
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

// ── 각인 ────────────────────────────────────────────────────

export const normalizeEngravings = (raw: RawCharacterData): EngravingDisplay[] =>
  raw.engravings.ArkPassiveEffects.map(eff => ({
    name             : { text: eff.Name,  color: '#FFFFAC' },
    grade            : toGradeColoredText(eff.Grade),
    level            : eff.Level,
    abilityStoneLevel: eff.AbilityStoneLevel,
    description      : stripHtml(eff.Description),
    icon             : '',
  }));

// ── 보석 ────────────────────────────────────────────────────

export const normalizeGems = (raw: RawCharacterData): GemSummaryDisplay => {
  const gemMap = Object.fromEntries(raw.gems.Gems.map(g => [g.Slot, g]));
  const gems: GemDisplay[] = raw.gems.Effects.Skills.map(skill => {
    const gem     = gemMap[skill.GemSlot];
    const desc    = skill.Description[0] ?? '';
    const isDmg   = desc.includes('피해');
    const effectValue = extractPercent(desc);
    return {
      slot        : skill.GemSlot,
      level       : gem?.Level  ?? 0,
      grade       : toGradeColoredText(gem?.Grade ?? ''),
      icon        : gem?.Icon   ?? skill.Icon,
      skillName   : { text: skill.Name, color: '#FFD200' },
      effectLabel : { text: isDmg ? '피해' : '재사용 대기시간', color: undefined },
      effectValue : { value: effectValue, color: isDmg ? '#99ff99' : '#87CEEB' },
      baseAtkBonus: extractPercent(skill.Option),
    };
  });
  return {
    gems,
    totalBaseAtk: { value: extractPercent(raw.gems.Effects.Description), color: '#B7FB00' },
  };
};

// ── 카드 ────────────────────────────────────────────────────

export const normalizeCards = (raw: RawCharacterData): CardSetDisplay | null => {
  if (!raw.cards.Effects?.length) return null;
  const effect     = raw.cards.Effects[0];
  const totalAwake = raw.cards.Cards.reduce((sum: number, c: any) => sum + c.AwakeCount, 0);
  const setNameM   = effect.Items[0]?.Name.match(/^(.+?)\s+\d+세트/);

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

  return {
    setName: setNameM ? setNameM[1] : '',
    totalAwake,
    activeItems,
  };
};

// ── 아크패시브 ───────────────────────────────────────────────

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

  const PATTERN = /(진화|깨달음|도약)\s+(\d+)티어\s+(.+?)\s+Lv\.(\d+)/;

  const effects: ArkPassiveEffectDisplay[] = p.Effects.map(eff => {
    const clean    = stripHtml(eff.Description);
    const m        = clean.match(PATTERN);
    const ttJson   = parseTooltip(eff.ToolTip);
    const descRaw: string = ttJson['Element_002']?.value ?? '';
    const desc     = stripHtml(descRaw.split('||')[0]);
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

// ── 아크그리드 ───────────────────────────────────────────────

export const normalizeArkGrid = (raw: RawCharacterData): ArkGridDisplay => {
  const cores = raw.arkGrid.Slots.map(slot => ({
    index: slot.Index,
    name : { text: slot.Name,   color: GRADE_COLORS[slot.Grade] },
    point: { value: slot.Point, color: '#B7FB00' as string | undefined },
    grade: toGradeColoredText(slot.Grade),
    icon : slot.Icon,
  }));

  const effects = raw.arkGrid.Effects.map(eff => ({
    label: { text: eff.Name, color: undefined as string | undefined },
    level: eff.Level,
    value: { value: extractPercent(eff.Tooltip), color: extractColor(eff.Tooltip) },
  }));

  return { cores, effects };
};

// ── 스킬 ────────────────────────────────────────────────────

export const normalizeSkills = (raw: RawCharacterData): SkillDisplay[] => {
  const gemSkillNames = raw.gems.Effects.Skills.map(s => s.Name);

  const isSkillUsed = (skill: typeof raw.skills[0]): boolean => {
    if (skill.SkillType === 100 || skill.SkillType === 101) return true;
    if (skill.Level >= 4 || skill.Rune !== null) return true;
    return gemSkillNames.some(
      name => skill.Name.includes(name) || name.includes(skill.Name)
    );
  };

  return raw.skills.filter(isSkillUsed).map(skill => {
    const tooltip      = parseTooltip(skill.Tooltip);
    const titleEl      = tooltip['Element_001']?.value ?? {};
    const levelStr     : string = titleEl.level ?? '';
    const categoryM    = levelStr.match(/\[([^\]]+)\]/);
    const categoryText = categoryM ? categoryM[1] : '일반 스킬';

    const selectedTripods: SelectedTripodDisplay[] = skill.Tripods
      .filter(t => t.IsSelected)
      .map(t => ({
        tier: t.Tier,
        slot: t.Slot,
        name: { text: t.Name, color: '#FFBB63' },
        icon: t.Icon,
      }));

    const rune: EquippedRuneDisplay | null = skill.Rune ? {
      name : { text: skill.Rune.Name,  color: GRADE_COLORS[skill.Rune.Grade] },
      grade: toGradeColoredText(skill.Rune.Grade),
      icon : skill.Rune.Icon,
    } : null;

    return {
      name           : skill.Name,
      icon           : skill.Icon,
      level          : skill.Level,
      type           : skill.Type,
      skillType      : skill.SkillType,
      category       : { text: categoryText, color: SKILL_CATEGORY_COLORS[categoryText] },
      isUsed         : true,
      selectedTripods,
      rune,
    };
  });
};


// ============================================================
// 최상위 통합
// ============================================================

export const normalizeCharacter = (raw: RawCharacterData): CharacterDisplayData => ({
  profile     : normalizeProfile(raw),
  combatStats : normalizeCombatStats(raw),
  equipment   : normalizeEquipment(raw),
  accessories : normalizeAccessories(raw),
  bracelet    : normalizeBracelet(raw),
  abilityStone: normalizeAbilityStone(raw),
  boJu        : normalizeBoJu(raw),
  avatars     : normalizeAvatars(raw),
  engravings  : normalizeEngravings(raw),
  gems        : normalizeGems(raw),
  cards       : normalizeCards(raw),
  arkPassive  : normalizeArkPassive(raw),
  arkGrid     : normalizeArkGrid(raw),
  skills      : normalizeSkills(raw),
});