/**
 * @/utils/data-normalizer.ts
 * RawCharacterData → CharacterDisplayData 변환
 * UI 표시용 데이터만 생성 — 계산용 수치는 useCalculatorStore 담당
 */

import { RawCharacterData } from '@/types/raw-types';
import { COMMON_EFFECT_TYPES, MultiKey } from '@/types/sim-types';
import {
  ColoredText,
  ColoredValue,
  CharacterDisplayData,
  CharacterProfileDisplay,
  CombatStatsDisplay,
  EquipmentDisplay,
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

import { COMBAT_EQUIP_DB } from '@/data/equipment/combat-equip';
import { ACCESSORY_DB }    from '@/data/equipment/accessory';


// ============================================================
// 1. 기초 문자열 처리 유틸
// ============================================================

/** HTML 태그 제거 */
const stripHtml = (html: string): string =>
  html.replace(/<[^>]+>/g, '').trim();

/** * 어떤 색상 형식이 들어와도 #이 붙은 대문자 헥사코드로 통일 
 * 예: 'FE9600' -> '#FE9600', '#fe9600' -> '#FE9600'
 */
const normalizeColor = (color?: string): string | undefined => {
  if (!color) return undefined;
  // 따옴표, # 기호 제거 후 대문자로 변환
  const cleanColor = color.replace(/['"#]/g, '').toUpperCase();
  return `#${cleanColor}`;
};

/** 첫 번째 font color 추출 */
const extractColor = (html: string): string | undefined => {
  const m = html.match(/color=['"]?#?([0-9A-F]+)['"]?/i);
  return m ? normalizeColor(m[1]) : undefined;
};

/** * 문자열에서 특정 키워드 뒤의 숫자 추출 (재련, 티어, 아이템 레벨 등 공용)
 * @param str 원본 문자열
 * @param regex 추출할 패턴 (기본값은 숫자만)
 */
const extractNum = (str: string, regex: RegExp = /([\d.]+)/): number => {
  const clean = stripHtml(str).replace(/,/g, '');
  const m = clean.match(regex);
  return m ? parseFloat(m[1]) : 0;
};

/** 문자열 추출 (에스더 이름 등) */
const extractStr = (str: string, regex: RegExp): string => {
  const m = str.match(regex);
  return m ? m[1] : '';
};

/** 툴팁 단일 순회 스캐너 */
const scanTooltipFeatures = (tooltip: Record<string, any>) => {
  const features = {
    advRaw: '', 
    estherRaw: '', 
    ellaRaw: '',   
  };

  Object.keys(tooltip).forEach((key) => {
    const obj = tooltip[key];
    if (!obj) return;

    if (obj.type === 'SingleTextBox' && typeof obj.value === 'string') {
      if (obj.value.includes('[상급 재련]')) {
        features.advRaw = obj.value;
      }
    }

    if (obj.type === 'IndentStringGroup' && obj.value?.Element_000) {
      const target = obj.value.Element_000;
      
      if (target.topStr?.includes('에스더 효과')) {
        features.estherRaw = target.topStr; // "[실리안]" 추출용
        features.ellaRaw = JSON.stringify(target.contentStr || {}); // "3 단계" 추출용
      }
    }
  });

  return features;
};

// ============================================================
// 2. 데이터 규격 변환 유틸
// ============================================================

/** 퍼센트 문자열 → 소수 (10% -> 0.1) */
const extractPercent = (str: string): number =>
  extractNum(str) / 100; // extractRawNumber 대신 extractNum 사용

/** HTML 수치 문자열 → ColoredValue (수치 + 색상) */
const toColoredValue = (html: string): ColoredValue => {
  const isPercent = html.includes('%');
  const value = isPercent ? extractPercent(html) : extractNum(html);
  
  return { 
    value, 
    color: extractColor(html) // 여기서 정규화된 색상이 들어감 (#FE9600 등)
  };
};

/** HTML 문자열 → ColoredText (텍스트 + 색상) */
const toColoredText = (html: string): ColoredText => ({
  text : stripHtml(html),
  color: extractColor(html),
});

/** Tooltip JSON 파싱 (안전 장치) */
const parseTooltip = (tooltipStr: string): Record<string, any> => {
  try { 
    return JSON.parse(tooltipStr); 
  } catch { 
    return {}; 
  }
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

/** 아이템 이름과 등급을 기반으로 세트 타입을 결정 */
const findEquipSetType = (itemName: string, grade: string): MultiKey => {
  if (grade === '에스더') return 'ESTHER';
  if (itemName.includes('전율')) return 'ANCIENT_2';
  if (itemName.includes('업화')) return 'ANCIENT';
  if (itemName.includes('결단')) return 'RELIC';

  return 'COMMON'; // 기본값
};


/** 연마효과 수치로 상/중/하 등급 판별 */
const findPolishGrade = (colorHint?: string): OptionGrade => {
  if (colorHint === '#FE9600') return 'HIGH'; // 주황색 (상)
  if (colorHint === '#CE43FC') return 'MID';  // 보라색 (중)
  if (colorHint === '#00B5FF') return 'LOW';  // 하늘색 (하)

  return 'LOW'; // 기본값
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
  const equipTypes = ['무기', '투구', '상의', '하의', '장갑', '어깨'];

  //return raw.equipment
  const result = raw.equipment
    .filter(eq => equipTypes.includes(eq.Type))
    .map(eq => {
      const tooltip = parseTooltip(eq.Tooltip);
      const titleEl = tooltip['Element_001']?.value ?? {};
      const features = scanTooltipFeatures(tooltip);
      const dbMatch = COMBAT_EQUIP_DB[eq.Type];

      // 기본 데이터 구조
      const displayData: EquipmentDisplay = {
        id: dbMatch?.id || 0,
        name: dbMatch?.name || eq.Type,
        label: eq.Name,
        isDb: !!dbMatch,
        icon: eq.Icon,
        itemLv: extractNum(titleEl.leftStr2 ?? '', /아이템 레벨\s*(\d+)/),
        itemTier: extractNum(titleEl.leftStr2 ?? '', /티어\s*(\d+)/),
        refineLv: extractNum(eq.Name, /\+(\d+)/),
        advRefineLv: extractNum(features.advRaw, /\[상급 재련\]\s*(\d+)/),
        quality: titleEl.qualityValue ?? 0,
        setType: findEquipSetType(eq.Name, eq.Grade),
      };

      if (eq.Grade === '에스더') {
        displayData.estherName = extractStr(features.estherRaw, /\[(.*?)\]/);
        displayData.ellaLv = extractNum(features.ellaRaw, /(\d+)\s*단계/);
      }

      return displayData;
    });
  console.log("--- normalizeEquipment ---");
  console.table(result);
  return result;
};

// ── 악세서리 ────────────────────────────────────────────────
export const normalizeAccessories = (raw: RawCharacterData): AccessoryDisplay[] => {
  const accTypes = ['목걸이', '귀걸이', '반지'];
  
  // API 등급명을 DB 키값으로 매핑
  const gradeMap: Record<string, MultiKey> = {
    '고대': 'ANCIENT',
    '유물': 'RELIC'
  };

  const result = raw.equipment
    .filter(eq => accTypes.includes(eq.Type as any))
    .map(eq => {
      const tooltip = parseTooltip(eq.Tooltip);
      const titleEl = tooltip['Element_001']?.value ?? {};
      const itemTier = extractNum(titleEl.leftStr2 ?? '', /티어\s*(\d+)/);
      const currentType = eq.Type;
      const currentGradeKey = gradeMap[eq.Grade];

      const effects: AccessoryEffect[] = [];
      let mainStatProcessed = false;

      const findFromDb = (label: string, isPercent: boolean) => {
        return ACCESSORY_DB.find(d => 
          d.tier === itemTier && 
          d.type === currentType && 
          d.label === label &&
          (d.name.includes('%') === isPercent)
        );
      };

      // 1) 기본 효과 파싱
      const basePart = tooltip['Element_004']?.value;
      if (basePart?.Element_001) {
        const lines = basePart.Element_001.split(/<BR\s*\/?>/i);
        lines.forEach((line: string) => {
          const clean = stripHtml(line);
          const m = clean.match(/(힘|민첩|지능|체력)\s*\+(\d+)/);
          if (!m) return;

          let label = m[1];
          if (label === '힘' || label === '민첩' || label === '지능') {
            if (mainStatProcessed) return;
            label = '힘';
            mainStatProcessed = true;
          }

          const db = findFromDb(label, false);
          const effectDb = db?.effects?.[0]; 
          const gradeData = effectDb?.multiGrades?.[currentGradeKey];

          effects.push({
            id: db?.id ?? 0,
            name: db?.name || label,
            label: label,
            isDb: !!db,
            value: { value: parseInt(m[2]), color: '' },  
            valueRange: gradeData ? {
              min: gradeData.low[0],
              max: gradeData.high[1] || gradeData.high[0]
            } : undefined
          });
        });
      }

      // 2) 연마 효과 파싱
      const polishPart = tooltip['Element_006']?.value;
      if (polishPart?.Element_001) {
        const lines = polishPart.Element_001.split(/<br\s*\/?>/i);
        lines.forEach((line: string) => {
          const clean = stripHtml(line);
          const labelM = clean.match(/^([가-힣\s]+)/);
          if (!labelM) return;

          const labelText = labelM[1].trim();
          const cv = toColoredValue(line);
          const isPercent = line.includes('%');

          const db = findFromDb(labelText, isPercent);

          if (db) {
            effects.push({
              id: db.id,
              name: db.name,
              label: labelText,
              isDb: true,
              value: cv,
              opGrade: findPolishGrade(cv.color),
            });
          }
        });
      }

      return {
        id: 0, 
        name: eq.Name,
        label: eq.Name,
        isDb: true,
        icon: eq.Icon,
        quality: titleEl.qualityValue ?? 0,
        itemTier,
        type: currentType,
        eqGrade: eq.Grade,
        effects,
      };
    });
  console.log("--- accessoryEquipment ---");
  console.table(result);

  return result;
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
  // TODO: 함수 수정이 안되어 있어 아래 내용 있으면 웹검색이 안됨
  // bracelet    : normalizeBracelet(raw),
  // abilityStone: normalizeAbilityStone(raw),
  // boJu        : normalizeBoJu(raw),
  // avatars     : normalizeAvatars(raw),
  // engravings  : normalizeEngravings(raw),
  // gems        : normalizeGems(raw),
  // cards       : normalizeCards(raw),
  // arkPassive  : normalizeArkPassive(raw),
  // arkGrid     : normalizeArkGrid(raw),
  // skills      : normalizeSkills(raw),
});