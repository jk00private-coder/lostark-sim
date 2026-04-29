/**
 * @/utils/data-normalizer.ts
 * RawCharacterData → CharacterDisplayData 변환
 * UI 표시용 데이터만 생성 — 계산용 수치는 useCalculatorStore 담당
 */

import { RawCharacterData } from '@/types/raw-types';
import { MultiKey } from '@/types/sim-types';
import {
  ColoredValue,
  BaseDisplay,
  CharacterDisplayData,
  CharacterProfileDisplay,
  CombatStatsDisplay,
  EquipmentDisplay,
  AccessoryDisplay,
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
} from '@/types/character-types';

import { COMBAT_EQUIP_DATA } from '@/data/equipment/combat-equip';
import { ACCESSORY_DB }    from '@/data/equipment/accessory';
import { BRACELET_DB }    from '@/data/equipment/bracelet';
import { ENGRAVINGS_DB }    from '@/data/engravings';
import { AVATAR_DATA }    from '@/data/avatars';
import { GEM_DATA }    from '@/data/gems';
import { CARD_DATA } from '@/data/cards';
import { findSkillByName, findArkPassiveNode, findArkGridCore} from '@/data/_class-registry';

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
  const features = { advRaw: '', estherRaw: '', ellaRaw: '' };
  Object.keys(tooltip).forEach((key) => {
    const obj = tooltip[key];
    if (!obj) return;

    if (obj.type === 'SingleTextBox' && typeof obj.value === 'string') {
      if (obj.value.includes('[상급 재련]')) features.advRaw = obj.value;
    }

    if (obj.type === 'IndentStringGroup' && obj.value?.Element_000) {
      const target = obj.value.Element_000;
      
      if (target.topStr?.includes('에스더 효과')) {
        features.estherRaw = target.topStr;
        features.ellaRaw = JSON.stringify(target.contentStr || {});
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
export const extractColoredValues = (text: string): ColoredValue[] => {
  const values: ColoredValue[] = [];
  const colorMatches = text.matchAll(/<FONT COLOR='([^']+)'>([^<]+)<\/FONT>/gi);
  
  for (const m of colorMatches) {
    values.push({
      color: normalizeColor(m[1]) || '',
      value: parseFloat(m[2].replace(/[+%]/g, '')) ?? 0
    });
  }
  return values;
};

// ============================================================
// 3. 공통 유틸
// ============================================================

/** DB의 multiGrades 데이터를 기반으로 ValueRange 생성 */
export const createValueRange = (gradeData: any) => {
  if (!gradeData) return undefined;
  return {
    min: gradeData.low[0],
    max: gradeData.high[1] || gradeData.high[0]
  };
};

/** API 등급명을 시스템 MultiKey로 변환 */
export const GRADE_MAP: Record<string, MultiKey> = {
  '희귀': 'RARE', '영웅': 'HERO', '전설': 'LEGEND', '고대': 'ANCIENT', '유물': 'RELIC', '에스더': 'ESTHER',
};
export const getGradeKey = (gradeName: string): MultiKey => GRADE_MAP[gradeName] || 'COMMON';

const parseTooltip = (tooltipStr: string): Record<string, any> => {
  try { return JSON.parse(tooltipStr); } catch { return {}; }
};

// ============================================================
// 4. 공통 색상 정의
// ============================================================

/** 등급명 → 색상 상수 */
const GRADE_COLORS: Record<string, string> = {
  '고대': '#E3C7A1', '유물': '#FA5D00', '전설': '#F99200',
  '영웅': '#CE43FC', '희귀': '#00B0FA', '일반': '#FFFFFF',
};

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
const findEquipSetType = (itemName: string, ellaLv: number): MultiKey => {
  if (itemName.includes('전율')) return 'ANCIENT_2';
  if (itemName.includes('업화')) return 'ANCIENT';
  if (itemName.includes('결단')) return 'RELIC';
  if (ellaLv === 2) return 'ESTHER_E2';
  if (ellaLv === 3) return 'ESTHER_E3';

  return 'COMMON'; // 기본값
};

/** 연마효과 수치로 상/중/하 등급 판별 */
const findPolishGrade = (values: ColoredValue[]): OptionGrade => {
  if (!values || values.length === 0) return 'LOW';
  const gradeWeight: Record<OptionGrade, number> = { 'HIGH': 3, 'MID': 2, 'LOW': 1 };
  const getGradeByColor = (color?: string): OptionGrade => {
    if (color === '#FE9600') return 'HIGH';
    if (color === '#CE43FC') return 'MID';
    if (color === '#00B5FF') return 'LOW';
    return 'LOW';
  };
  let bestWeight = 0;
  let bestGrade: OptionGrade = 'LOW';
  for (const v of values) {
    const currentGrade = getGradeByColor(v.color);
    const currentWeight = gradeWeight[currentGrade];
    if (currentWeight > bestWeight) {
      bestWeight = currentWeight;
      bestGrade = currentGrade;
    }
  }
  return bestGrade;
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
  const atkStat = raw.profile.Stats.find(s => s.Type === '공격력');
  const baseAtkFromApi = extractNum(atkStat?.Tooltip?.[1] ?? '');

  return {
    critical      : statsMap['치명']        ?? 0,
    specialization: statsMap['특화']        ?? 0,
    swiftness     : statsMap['신속']        ?? 0,
    domination    : statsMap['제압']        ?? 0,
    endurance     : statsMap['인내']        ?? 0,
    expertise     : statsMap['숙련']        ?? 0,
    maxHp         : statsMap['최대 생명력'] ?? 0,
    attackPower   : statsMap['공격력']      ?? 0,
    baseAtkFromApi,
  };
};

// ── 전투 장비 ────────────────────────────────────────────────
export const normalizeEquipment = (raw: RawCharacterData): EquipmentDisplay[] => {
  const equipTypes = ['무기', '투구', '상의', '하의', '장갑', '어깨'];
  return raw.equipment
    .filter(eq => equipTypes.includes(eq.Type))
    .map(eq => {
      const tooltip = parseTooltip(eq.Tooltip);
      const titleEl = tooltip['Element_001']?.value ?? {};
      const features = scanTooltipFeatures(tooltip);
      const dbMatch = COMBAT_EQUIP_DATA.find(item => item.name === eq.Type);

      let estherName = '';
      let ellaLv = 0;
      if (eq.Grade === '에스더') {
        estherName = extractStr(features.estherRaw, /\[(.*?)\]/) || '';
        ellaLv = extractNum(features.ellaRaw, /(\d+)\s*단계/) || 0;
      }

      const displayData: EquipmentDisplay = {
        id: dbMatch?.id || 0,
        name: dbMatch?.name || eq.Type,
        label: eq.Name,
        isDb: !!dbMatch,
        icon: eq.Icon,
        itemLv: extractNum(titleEl.leftStr2 ?? '', /아이템 레벨\s*(\d+)/) || 0,
        itemTier: extractNum(titleEl.leftStr2 ?? '', /티어\s*(\d+)/) || 0,
        refineLv: extractNum(eq.Name, /\+(\d+)/) || 0,
        advRefineLv: extractNum(features.advRaw, /\[상급 재련\]\s*(\d+)/) || 0,
        quality: titleEl.qualityValue ?? 0,
        eqGrade: findEquipSetType(eq.Name, ellaLv),
      };

      if (eq.Grade === '에스더') {
        displayData.estherName = estherName;
        displayData.ellaLv = ellaLv;
      }
      return displayData;
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
      const itemTier = extractNum(titleEl.leftStr2 ?? '', /티어\s*(\d+)/);
      const currentType = eq.Type;
      const currentGradeKey = getGradeKey(eq.Grade);
      const effects: BaseDisplay[] = [];
      let mainStatProcessed = false;

      const findFromDb = (label: string, isPercent: boolean) => 
        ACCESSORY_DB.find(d => d.tier === itemTier && d.type === currentType && d.label === label && (d.name.includes('%') === isPercent));

      const basePart = tooltip['Element_004']?.value;
      if (basePart?.Element_001) {
        basePart.Element_001.split(/<BR\s*\/?>/i).forEach((line: string) => {
          const clean = stripHtml(line);
          const m = clean.match(/(힘|민첩|지능|체력)\s*\+(\d+)/);
          if (!m) return;
          let label = m[1];
          if (['힘', '민첩', '지능'].includes(label)) {
            if (mainStatProcessed) return;
            label = '힘'; mainStatProcessed = true;
          }
          const db = findFromDb(label, false);
          const gradeData = db?.effects?.[0]?.multiGrades?.[currentGradeKey];
          effects.push({
            id: db?.id ?? 0, name: db?.name || label, label: label, isDb: !!db,
            values: [{ value: parseInt(m[2]) ?? 0, color: '' }],
            valueRange: createValueRange(gradeData),
          });
        });
      }

      const polishPart = tooltip['Element_006']?.value;
      if (polishPart?.Element_001) {
        polishPart.Element_001.split(/<br\s*\/?>/i).forEach((line: string) => {
          const clean = stripHtml(line);
          const labelM = clean.match(/^([가-힣\s]+)/);
          if (!labelM) return;
          const labelText = labelM[1].trim();
          const cv = extractColoredValues(line);
          if (cv.length === 0) return;
          const db = findFromDb(labelText, line.includes('%'));
          if (db) {
            effects.push({
              id: db.id, name: db.name, label: labelText, isDb: true,
              values: cv, opGrade: findPolishGrade(cv),
            });
          }
        });
      }

      return {
        id: 0, name: eq.Name, label: eq.Name, isDb: true, icon: eq.Icon,
        quality: titleEl.qualityValue ?? 0, tier: itemTier, type: currentType,
        eqGrade: currentGradeKey, effects,
      };
    });
};

// ── 팔찌 ────────────────────────────────────────────────────
export const normalizeBracelet = (raw: RawCharacterData): BraceletDisplay | null => {
  const bracelet = raw.equipment.find(eq => eq.Type === '팔찌');
  if (!bracelet) return null;
  const tooltip = parseTooltip(bracelet.Tooltip);
  const effectStr: string = tooltip['Element_005']?.value?.Element_001 ?? '';
  const currentGradeKey = getGradeKey(bracelet.Grade);
  const rawChunks = effectStr.split(/<img[^>]*>/).filter(c => c.trim());

  const effects: BaseDisplay[] = rawChunks.map(chunk => {
    const cleanLine = stripHtml(chunk.replace(/<br\s*\/?>/gi, ' ')).trim();
    const labelMatch = cleanLine.match(/^[^+\d%]+/);
    let labelText = labelMatch ? labelMatch[0].trim() : cleanLine;
    if (['힘', '민첩', '지능'].includes(labelText)) labelText = '주스탯';

    const values = extractColoredValues(chunk);
    const db = BRACELET_DB.filter(d => {
      if (!d.label) return false;
      if (d.label === '주스탯') return labelText === '주스탯';
      return cleanLine.replace(/\s+/g, '').includes(d.label.replace(/\s+/g, ''));
    }).sort((a, b) => (b.label?.length || 0) - (a.label?.length || 0))[0];

    const gradeData = db?.effects?.[0]?.multiGrades?.[currentGradeKey];
    const showRange = db?.category === 'BASE' || db?.category === 'COMBAT';

    return {
      id: db?.id ?? 0, name: db?.name || labelText, label: db?.label || labelText, isDb: !!db,
      values: values, valueRange: showRange ? createValueRange(gradeData) : undefined,
      eqGrade: currentGradeKey, opGrade: findPolishGrade(values),
    };
  });

  return {
    id: 0, name: stripHtml(tooltip['Element_000']?.value ?? bracelet.Name),
    label: stripHtml(tooltip['Element_000']?.value ?? bracelet.Name),
    isDb: true, icon: bracelet.Icon,
    itemTier: extractNum(tooltip['Element_001']?.value?.leftStr2 ?? '', /티어\s*(\d+)/) || 4,
    eqGrade: currentGradeKey, effects,
  };
};

export const normalizeAbilityStone = (raw: RawCharacterData): AbilityStoneDisplay | null => {
  const stone = raw.equipment.find(eq => eq.Type === '어빌리티 스톤');
  if (!stone) return null;
  const tooltip = parseTooltip(stone.Tooltip);
  const engravingGroup = tooltip['Element_007']?.value?.Element_000?.contentStr ?? {};
  const engravings: AbilityStoneDisplay['engravings'] = [];
  let penalty: AbilityStoneDisplay['penalty'] = null;
  let baseAtkBonus = 0;

  Object.values(engravingGroup).forEach((item: any) => {
    const content: string = item?.contentStr ?? '';
    if (content.includes('기본 공격력')) { baseAtkBonus = extractPercent(content); return; }
    const m = stripHtml(content).match(/\[([^\]]+)\]\s*Lv\.(\d+)/);
    if (!m) return;
    const labelName = m[1];
    const cvs = extractColoredValues(content);
    const db = ENGRAVINGS_DB.find(d => d.name === labelName);
    const data = {
      id: db?.id ?? 0, isDb: !!db,
      name: { text: db?.name || labelName, color: cvs[0]?.color || '' },
      level: { value: parseInt(m[2]), color: '' },
    };
    if (data.name.color.toUpperCase() === '#FE2E2E') penalty = data;
    else engravings.push(data);
  });

  return { id: 0, name: stone.Name, label: stone.Name, isDb: true, icon: stone.Icon, eqGrade: getGradeKey(stone.Grade), baseAtkBonus, engravings, penalty };
};

export const normalizeBoJu = (raw: RawCharacterData): BoJuDisplay | null => {
  const boju = raw.equipment.find(eq => eq.Type === '보주');
  if (!boju) return null;
  const tooltip = parseTooltip(boju.Tooltip);
  const effectStr: string = tooltip['Element_004']?.value?.Element_001 ?? '';
  const seasonM = effectStr.match(/시즌(\d+)\s*달성\s*최대\s*낙원력\s*:\s*([\d,]+)/);
  return { id: 0, name: boju.Name, label: boju.Name, isDb: false, icon: boju.Icon, eqGrade: getGradeKey(boju.Grade), seasonLabel: seasonM ? `시즌 ${seasonM[1]}` : '', paradoxPower: seasonM ? parseInt(seasonM[2].replace(/,/g, '')) : 0 };
};

export const normalizeAvatars = (raw: RawCharacterData): AvatarDisplay[] => {
  const targetTypes = ['무기 아바타', '머리 아바타', '상의 아바타', '하의 아바타'];
  const representativeAvatars = raw.avatars
    .filter(av => targetTypes.includes(av.Type))
    .reduce((acc: any[], current) => {
      const idx = acc.findIndex(a => a.Type === current.Type);
      if (idx > -1) { if (current.IsInner) acc[idx] = current; }
      else acc.push(current);
      return acc;
    }, []);

  return representativeAvatars.map(av => {
    const tooltip = parseTooltip(av.Tooltip);
    const bonusStr: string = tooltip['Element_005']?.value?.Element_001 ?? '';
    return { id: AVATAR_DATA[0].id, name: av.Name, label: av.Name, isDb: true, icon: av.Icon, eqGrade: getGradeKey(av.Grade), values: [{ value: bonusStr.includes('%') ? extractNum(bonusStr) : 0, color: '' }] };
  });
};

export const normalizeEngravings = (raw: RawCharacterData): EngravingDisplay[] => {
  return (raw.engravings?.ArkPassiveEffects ?? []).map(eff => {
    const dbMatch = ENGRAVINGS_DB.find(d => (d.label || d.name) === eff.Name);
    return { id: dbMatch?.id ?? 0, name: eff.Name, label: eff.Name, isDb: !!dbMatch, icon: dbMatch?.iconPath || '', eqGrade: getGradeKey(eff.Grade), level: eff.Level, abilityStoneLevel: eff.AbilityStoneLevel || 0 };
  });
};

export const normalizeGems = (raw: RawCharacterData): GemDisplay[] => {
  const gemMap = Object.fromEntries(raw.gems.Gems.map(g => [g.Slot, g]));
  return raw.gems.Effects.Skills.map(skill => {
    const gem = gemMap[skill.GemSlot];
    const rawDesc = skill.Description[0] ?? '';
    const isDmg = rawDesc.includes('피해');
    const pureName = stripHtml(gem?.Name || '').replace(/^\d+레벨\s+/, '');
    let matchLabel = pureName;
    if (pureName.includes("광휘의 보석")) matchLabel = isDmg ? "겁화의 보석" : "작열의 보석";
    const dbMatch = GEM_DATA.find(d => (d.label || d.name) === matchLabel);
    return { id: dbMatch?.id ?? 0, name: stripHtml(gem?.Name || ''), label: matchLabel, values: [{value: extractNum(rawDesc), color: '' }], isDb: !!dbMatch, icon: gem?.Icon || skill.Icon, eqGrade: getGradeKey(gem?.Grade ?? ''), level: gem?.Level ?? 0, skillName: skill.Name, effectType: isDmg ? '피해 증가' : '쿨타임 감소', baseAtkBonus: extractNum(skill.Option || '') };
  });
};

export const normalizeCards = (raw: RawCharacterData): CardSetDisplay | null => {
  if (!raw.cards.Effects?.length) return null;
  const lastItem = raw.cards.Effects[0].Items.slice(-1)[0];
  if (!lastItem) return null;
  const setName = lastItem.Name.replace(/\s*\d+세트/, '').replace(/\s*\((\d+)각성합계\)/, ' $1각').trim();
  return { id: CARD_DATA[0]?.id ?? 0, label: lastItem.Name, name: setName, isDb: true, level: parseInt(setName.replace(/[^0-9]/g, '')) || 0 };
};

export const normalizeArkPassive = (raw: RawCharacterData, jobName: string) => {
  const p = raw.arkPassive;
  if (!p) return null;
  const getPointLevel = (name: string) => {
    const found = p.Points.find(pt => pt.Name === name);
    const m = found?.Description.match(/(\d+)레벨/);
    return { level: m ? parseInt(m[1]) : 0, description: '' };
  };
  const points: ArkPassivePointDisplay = { evolution: getPointLevel('진화'), insight: getPointLevel('깨달음'), leap: getPointLevel('도약'), title: p.Title };
  const PATTERN = /(진화|깨달음|도약)\s+(\d+)티어\s+(.+?)\s+Lv\.(\d+)/;
  const effects: ArkPassiveEffectDisplay[] = p.Effects.map(eff => {
    const m = stripHtml(eff.Description).match(PATTERN);
    const cat = m ? m[1] : eff.Name;
    const node = m ? m[3] : eff.Name;
    const dbMatch = findArkPassiveNode(cat, node, jobName);
    return { id: dbMatch?.id ?? 0, label: node, name: node, isDb: !!dbMatch, icon: eff.Icon, category: { text: cat, color: ARK_PASSIVE_COLORS[cat] || '#ffffff' }, tier: m ? parseInt(m[2]) : 0, level: m ? parseInt(m[4]) : 0, description: stripHtml((parseTooltip(eff.ToolTip)['Element_002']?.value ?? '').split('||')[0]).trim() };
  });
  return { points, effects };
};

export const normalizeArkGrid = (raw: RawCharacterData, jobName: string): ArkGridDisplay => {
  const g = raw.arkGrid;
  return {
    cores: g.Slots.map(slot => {
      const dbMatch = findArkGridCore(jobName, slot.Name);
      return { id: dbMatch?.id ?? 0, label: slot.Name, name: dbMatch?.name || slot.Name, isDb: !!dbMatch, icon: slot.Icon, eqGrade: getGradeKey(slot.Grade), point: slot.Point };
    }),
    effects: g.Effects.map(eff => ({ label: eff.Name, level: eff.Level, value: { value: extractPercent(eff.Tooltip), color: extractColor(eff.Tooltip) } }))
  };
};

export const normalizeSkills = (raw: RawCharacterData, jobName: string): SkillDisplay[] => {
  const gemSkillNames = raw.gems.Effects.Skills.map(s => s.Name);
  const activeTitle = raw.arkPassive?.Title || '';
  const isUsed = (s: any) => {
    const db = findSkillByName(jobName, s.Name);
    if (db?.requiredTitle && activeTitle !== db.requiredTitle) return false;
    if ([100, 101, 1].includes(s.SkillType) || s.Level >= 4 || s.Rune !== null) return true;
    return gemSkillNames.some(n => s.Name.includes(n) || n.includes(s.Name));
  };

  return raw.skills.filter(isUsed).map(skill => {
    const dbMatch = findSkillByName(jobName, skill.Name);
    const catRaw = stripHtml(parseTooltip(skill.Tooltip)['Element_001']?.value?.level || '');
    const catText = catRaw.match(/\[([^\]]+)\]/)?.[1] || catRaw || '일반';
    return {
      id: dbMatch?.id ?? 0, label: skill.Name, name: dbMatch?.name || skill.Name, icon: skill.Icon, isDb: !!dbMatch, level: skill.Level,
      category: { text: catText, color: SKILL_CATEGORY_COLORS[catText] || '#ffffff' },
      selectedTripods: skill.Tripods.filter(t => t.IsSelected).map(t => {
        const tdb = dbMatch?.tripods?.find(td => td.label === t.Name || td.name === t.Name);
        return { id: tdb?.id ?? 0, label: t.Name, name: tdb?.name || t.Name, icon: t.Icon, isDb: !!tdb, tier: tdb?.tier || t.Tier, slot: tdb?.slot || t.Slot };
      }),
      rune: skill.Rune ? { id: 0, label: skill.Rune.Name, name: skill.Rune.Name, eqGrade: getGradeKey(skill.Rune.Grade), icon: skill.Rune.Icon, isDb: false } : null as any
    };
  });
};

// ============================================================
// 최상위 통합
// ============================================================

export const normalizeCharacter = (raw: RawCharacterData): CharacterDisplayData => {
  const jobName = raw.profile.CharacterClassName;
  
  const data: CharacterDisplayData = {
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
    arkPassive  : normalizeArkPassive(raw, jobName),
    arkGrid     : normalizeArkGrid(raw, jobName),
    skills      : normalizeSkills(raw, jobName),
  };

  // 통합 디버그 출력
  console.group(`🚀 [전체 데이터 상세 리포트] ${data.profile.name} (${jobName})`);
    
    console.groupCollapsed("🛡️ 전투 장비");
      console.table(data.equipment);
    console.groupEnd();

    console.groupCollapsed("💍 악세서리 상세 연마 수치");
      const accessoryDetails = data.accessories.flatMap(acc => 
        acc.effects.map(eff => ({
          ID: eff.id,
          부위: acc.type,
          장비명: acc.name,
          효과명: eff.label,
          등급: acc.eqGrade,
          연마등급: eff.opGrade,
          수치: eff.values?.map(v => v.value).join(', ')
        }))
      );
      console.table(accessoryDetails);
    console.groupEnd();

    console.groupCollapsed("💎 보석 세부 수치");
      console.table(data.gems.map(g => ({
        ...g,
        values: g.values?.[0].value,
      })));
    console.groupEnd();
    
    console.groupCollapsed("🗡️ 스킬 및 트라이포드 설정");
      const skillSummary = data.skills.map(s => ({
        ID: s.id,
        스킬명: s.name,
        레벨: s.level,
        분류: s.category.text,
        트라이포드: s.selectedTripods.length > 0 
          ? s.selectedTripods
              .sort((a, b) => a.tier - b.tier)
              .map(t => `${t.name}${t.isDb ? '✅' : '❌'}`)
              .join(', ') 
          : '없음',
        룬: s.rune?.name || '-'
      }));
      console.table(skillSummary);
    console.groupEnd();

    console.groupCollapsed("⚡ 아크 패시브 & 그리드");
      if (data.arkPassive) {
        const p = data.arkPassive.points;
        console.table([{
          제목: p.title,
          "진화 Lv": p.evolution.level,
          "깨달음 Lv": p.insight.level,
          "도약 Lv": p.leap.level
        }]);
        console.table(data.arkPassive.effects.map(e => ({
          ...e,
          category: e.category.text
        })));
      }
      console.table(data.arkGrid.cores);
    console.groupEnd();

    console.log("🛠️ 최종 정규화 객체:", data);
    console.log("📦 원본 Raw 데이터:", raw);

  console.groupEnd();

  return data;
};