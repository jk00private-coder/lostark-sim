/**
 * @/utils/data-normalizer.ts
 * RawCharacterData → CharacterDisplayData 변환
 * UI 표시용 데이터만 생성 — 계산용 수치는 useCalculatorStore 담당
 */

import { RawCharacterData } from '@/types/raw-types';
import { MultiKey } from '@/types/sim-types';
import {
  ColoredText,
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
  SelectedTripodDisplay,
  EquippedRuneDisplay,
} from '@/types/character-types';

import { COMBAT_EQUIP_DB } from '@/data/equipment/combat-equip';
import { ACCESSORY_DB }    from '@/data/equipment/accessory';
import { BRACELET_DB }    from '@/data/equipment/bracelet';
import { ENGRAVINGS_DB }    from '@/data/engravings';
import { AVATAR_DATA }    from '@/data/avatars';


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
export const extractColoredValues = (text: string): ColoredValue[] => {
  const values: ColoredValue[] = [];
  const colorMatches = text.matchAll(/<FONT COLOR='([^']+)'>([^<]+)<\/FONT>/gi);
  
  for (const m of colorMatches) {
    values.push({
      color: normalizeColor(m[1]) || '',
      value: parseFloat(m[2].replace(/[+%]/g, ''))
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
  '고대': 'ANCIENT',
  '유물': 'RELIC'
};
export const getGradeKey = (gradeName: string): MultiKey => {
  return GRADE_MAP[gradeName] || 'RELIC';
};

/** Tooltip JSON 파싱 (안전 장치) */
const parseTooltip = (tooltipStr: string): Record<string, any> => {
  try { 
    return JSON.parse(tooltipStr); 
  } catch { 
    return {}; 
  }
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
const findEquipSetType = (itemName: string, grade: string): MultiKey => {
  if (grade === '에스더') return 'ESTHER';
  if (itemName.includes('전율')) return 'ANCIENT_2';
  if (itemName.includes('업화')) return 'ANCIENT';
  if (itemName.includes('결단')) return 'RELIC';

  return 'COMMON'; // 기본값
};

/** 연마효과 수치로 상/중/하 등급 판별 */
const findPolishGrade = (values: ColoredValue[]): OptionGrade => {
  // 1. 값이 없으면 기본값 반환
  if (!values || values.length === 0) return 'LOW';

  // 2. 등급 가중치 정의
  const gradeWeight: Record<OptionGrade, number> = {
    'HIGH': 3,
    'MID': 2,
    'LOW': 1
  };

  // 3. 각 색상별 등급 판별 로직 (내부 헬퍼)
  const getGradeByColor = (color?: string): OptionGrade => {
    if (color === '#FE9600') return 'HIGH'; // 주황색 (상)
    if (color === '#CE43FC') return 'MID';  // 보라색 (중)
    if (color === '#00B5FF') return 'LOW';  // 하늘색 (하)
    return 'LOW';
  };

  // 4. 전체 values를 돌면서 가장 높은 등급의 가중치를 찾음
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
        eqGrade: findEquipSetType(eq.Name, eq.Grade),
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

  const result = raw.equipment
    .filter(eq => accTypes.includes(eq.Type as any))
    .map(eq => {
      const tooltip = parseTooltip(eq.Tooltip);
      const titleEl = tooltip['Element_001']?.value ?? {};
      const itemTier = extractNum(titleEl.leftStr2 ?? '', /티어\s*(\d+)/);
      const currentType = eq.Type;
      const currentGradeKey = getGradeKey(eq.Grade);

      const effects: BaseDisplay[] = [];
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
            values: [{ value: parseInt(m[2]), color: '' }],  
            valueRange: createValueRange(gradeData),
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
          const cv = extractColoredValues(line);

          if (cv.length === 0) return;

          const isPercent = line.includes('%');
          const db = findFromDb(labelText, isPercent);

          if (db) {
            effects.push({
              id: db.id,
              name: db.name,
              label: labelText,
              isDb: true,
              values: cv,
              opGrade: findPolishGrade(cv),
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
        eqGrade: currentGradeKey,
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
  const currentGradeKey = getGradeKey(bracelet.Grade);

  const rawChunks = effectStr.split(/<img[^>]*>/).filter(c => c.trim());

  const effects: BaseDisplay[] = rawChunks.map(chunk => {
    const cleanLine = stripHtml(chunk.replace(/<br\s*\/?>/gi, ' ')).trim();
    
    // 1. 라벨 추출 및 주스탯 치환
    const labelMatch = cleanLine.match(/^[^+\d%]+/);
    let labelText = labelMatch ? labelMatch[0].trim() : cleanLine;

    if (['힘', '민첩', '지능'].includes(labelText)) labelText = '주스탯';

    // 2. 수치 추출 (ColoredValue 배열로 생성)
    const values: ColoredValue[] = [];
    const colorMatches = chunk.matchAll(/<FONT COLOR='([^']+)'>([^<]+)<\/FONT>/gi);
    for (const m of colorMatches) {
      values.push({
        color: normalizeColor(m[1]) || '',
        value: parseFloat(m[2].replace(/[+%]/g, ''))
      });
    }

    // 3. 매칭 로직
    const filteredDb = BRACELET_DB.filter((d): d is typeof d & { label: string } => {
      if (!d.label) return false;
      if (d.label === '주스탯') return labelText === '주스탯';

      const cleanDbLabel = d.label.replace(/\s+/g, '');
      const cleanTargetLine = cleanLine.replace(/\s+/g, '');
      return cleanTargetLine.includes(cleanDbLabel);
    });

    const db = filteredDb.sort((a, b) => {
      if (b.label.length !== a.label.length) {
        return b.label.length - a.label.length;
      }
      return cleanLine.indexOf(a.label) - cleanLine.indexOf(b.label);
    })[0];

    const effectDb = db?.effects?.[0];
    const gradeData = effectDb?.multiGrades?.[currentGradeKey];
    const showRange = db?.category === 'BASE' || db?.category === 'COMBAT';

    return {
      id: db?.id ?? 0,
      name: db?.name || labelText,
      label: db?.label || labelText,
      isDb: !!db,
      values: values, 
      valueRange: showRange ? createValueRange(gradeData) : undefined,
      eqGrade: currentGradeKey as any,
      opGrade: findPolishGrade(values),
    } as any;
  });

  const result: BraceletDisplay = {
    id: 0,
    name: stripHtml(tooltip['Element_000']?.value ?? bracelet.Name),
    label: stripHtml(tooltip['Element_000']?.value ?? bracelet.Name),
    isDb: true,
    icon: bracelet.Icon,
    itemTier: extractNum(tooltip['Element_001']?.value?.leftStr2 ?? '', /티어\s*(\d+)/) || 4,
    eqGrade: currentGradeKey as any,
    effects,
  };

  console.log("--- bracelet ---");
  console.log(result);
  return result;
};

// ── 어빌리티 스톤 ────────────────────────────────────────────
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
    
    if (content.includes('기본 공격력')) {
      baseAtkBonus = extractPercent(content);
      return;
    }

    // [각인 이름 추출]
    const clean = stripHtml(content);
    const m = clean.match(/\[([^\]]+)\]\s*Lv\.(\d+)/);
    if (!m) return;

    const labelName = m[1];
    const levelValue = parseInt(m[2]);
    const cvs = extractColoredValues(content);
    const db = ENGRAVINGS_DB.find(d => d.name === labelName);

    // 데이터 조립 (UI용)
    const engravingData = {
      id: db?.id ?? 0,
      isDb: !!db,
      name: { 
        text: db?.name || labelName, 
        color: cvs[0]?.color || '' 
      },
      level: { 
        value: levelValue, 
        color: '' 
      },
    };

    // [페널티 판별] 빨간색이면 penalty로, 아니면 engravings로
    if (engravingData.name.color.toUpperCase() === '#FE2E2E') {
      penalty = engravingData;
    } else {
      engravings.push(engravingData);
    }
  });

  const result: AbilityStoneDisplay = {
    id: 0,
    name: stone.Name,
    label: stone.Name,
    isDb: true,
    icon: stone.Icon,
    eqGrade: getGradeKey(stone.Grade), // 기존 공통함수
    baseAtkBonus,
    engravings,
    penalty,
  } as any;

  console.log("--- AbilityStone Result ---", result);
  return result;
};

// ── 보주 ────────────────────────────────────────────
export const normalizeBoJu = (raw: RawCharacterData): BoJuDisplay | null => {
  const boju = raw.equipment.find(eq => eq.Type === '보주');
  if (!boju) return null;

  const tooltip = parseTooltip(boju.Tooltip);
  const effectStr: string = tooltip['Element_004']?.value?.Element_001 ?? '';
  const seasonM = effectStr.match(/시즌(\d+)\s*달성\s*최대\s*낙원력\s*:\s*([\d,]+)/);

  const result: BoJuDisplay = {
    id: 0,
    name: boju.Name,
    label: boju.Name,
    isDb: false,
    icon: boju.Icon,
    eqGrade: getGradeKey(boju.Grade),
    seasonLabel: seasonM ? `시즌 ${seasonM[1]}` : '',
    paradoxPower: seasonM ? parseInt(seasonM[2].replace(/,/g, '')) : 0,
  } as any;

  console.log("--- BoJu Result ---", result);
  return result;
};

// ── 아바타 ──────────────────────────────────────────────────
export const normalizeAvatars = (raw: RawCharacterData): AvatarDisplay[] => {
  const targetTypes = ['무기 아바타', '머리 아바타', '상의 아바타', '하의 아바타'];

  // 1. 우선순위를 고려하여 부위별로 '하나의' 아바타만 선택
  const dbMatch = AVATAR_DATA[0];
  const representativeAvatars = raw.avatars
    .filter(av => targetTypes.includes(av.Type))
    .reduce((acc: any[], current) => {
      // 이미 같은 부위(Type)가 등록되어 있는지 확인
      const existingIdx = acc.findIndex(a => a.Type === current.Type);

      if (existingIdx > -1) {
        // 이미 있다면: 현재 아바타가 IsInner인 경우에만 교체 (능력치 아바타 우선)
        if (current.IsInner) {
          acc[existingIdx] = current;
        }
      } else {
        // 없다면: 일단 추가
        acc.push(current);
      }
      return acc;
    }, []);

  // 2. 선택된 아바타들만 가지고 최종 배열 생성 (전투장비와 동일한 map 구조)
  const result = representativeAvatars.map(av => {
    const tooltip = parseTooltip(av.Tooltip);
    const bonusStr: string = tooltip['Element_005']?.value?.Element_001 ?? '';
    
    return {
      id: dbMatch.id,
      name: av.Name,
      label: av.Name,
      isDb: !!dbMatch,
      icon: av.Icon,
      eqGrade: getGradeKey(av.Grade),
      mainStatBonus: bonusStr.includes('%') ? extractPercent(bonusStr) : 0,
    } as any;
  });

  console.log("--- [DEBUG] Avatar Result List ---");
  console.table(result);

  return result;
};

// ── 각인 ────────────────────────────────────────────────────
export const normalizeEngravings = (raw: RawCharacterData): EngravingDisplay[] => {
  const arkEngravings = raw.engravings?.ArkPassiveEffects ?? [];
  const result: EngravingDisplay[] = arkEngravings.map(eff => {
    const dbMatch = ENGRAVINGS_DB.find(d => (d.label || d.name) === eff.Name);
    return {
      id: dbMatch?.id ?? 0,
      name: eff.Name,
      label: eff.Name, 
      isDb: !!dbMatch,
      icon: dbMatch?.iconPath || '',
      eqGrade: getGradeKey(eff.Grade),
      level: eff.Level,
      abilityStoneLevel: eff.AbilityStoneLevel || 0,
    } as any;
  });

  console.log("--- [DEBUG] Engraving Final Result ---");
  console.table(result);
  return result;
};

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
  // TODO: 함수 수정이 안되어 있어 아래 내용 있으면 웹검색이 안됨
  // gems        : normalizeGems(raw),
  // cards       : normalizeCards(raw),
  // arkPassive  : normalizeArkPassive(raw),
  // arkGrid     : normalizeArkGrid(raw),
  // skills      : normalizeSkills(raw),
});