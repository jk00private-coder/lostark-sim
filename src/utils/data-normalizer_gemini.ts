/**
 * @/utils/data-normalizer.ts
 * 로스트아크 API 응답(RawCharacterData)을 시뮬레이터 내부 규격(CharacterDisplayData)으로 변환
 * 프로젝트의 모든 데이터 규격(초월, 엘릭서, 연마, 팔찌, 각인 등)을 포함합니다.
 */

import { 
  RawCharacterData, 
  RawEquipment, 
  RawAvatar, 
  RawCard, 
  RawGem, 
  RawEngraving,
  RawSkill 
} from '@/types/raw-types';
import { MultiKey } from '@/types/sim-types';
import {
  CharacterDisplayData,
  AvatarDisplay,
  GemDisplay,
  CardSetDisplay,
  EquipmentDisplay,
  AccessoryDisplay,
  EngravingDisplay,
  BraceletDisplay,
  SkillDisplay,
} from '@/types/character-types';

import { AVATAR_DATA } from '@/data/avatars';
import { CARD_DATA } from '@/data/cards';
import { GEM_DATA } from '@/data/gems';
import { ID as CARD_ID_MAP } from '@/data/cards';
import { ID as GEM_ID_MAP } from '@/data/gems';

// ============================================================
// 1. 유틸리티 및 파싱 헬퍼
// ============================================================

const stripHtml = (html: string): string => html?.replace(/<[^>]+>/g, '').trim() || '';

const toMultiKey = (grade: string): MultiKey => {
  switch (grade) {
    case '영웅': return 'HERO';
    case '전설': return 'LEGEND';
    case '유물': return 'RELIC';
    case '고대': return 'ANCIENT';
    default: return 'COMMON';
  }
};

/** 툴팁 JSON 파싱 유틸리티 */
const parseTooltip = (tooltipStr: string) => {
  try {
    return JSON.parse(tooltipStr);
  } catch (e) {
    return null;
  }
};

// ============================================================
// 2. 세부 섹션 노멀라이저
// ============================================================

/** 장비 파싱 (초월, 엘릭서 포함) */
const normalizeEquipment = (rawItems: RawEquipment[]): EquipmentDisplay[] => {
  const targetTypes = ['무기', '투구', '상의', '하의', '장갑', '어깨'];
  return rawItems
    .filter(item => targetTypes.includes(item.Type))
    .map(item => {
      const tooltip = parseTooltip(item.Tooltip);
      // 엘릭서/초월 정보 추출 로직 (프로젝트 규격에 맞게 확장 가능)
      return {
        name: item.Name,
        type: item.Type,
        grade: item.Grade,
        level: parseInt(item.Name.match(/\+(\d+)/)?.[1] || '0'),
        icon: item.Icon,
        quality: item.QualityValue,
      };
    });
};

/** 장신구 파서 (연마 효과 포함) */
const normalizeAccessories = (rawItems: RawEquipment[]): AccessoryDisplay[] => {
  const targetTypes = ['목걸이', '귀걸이', '반지'];
  return rawItems
    .filter(item => targetTypes.includes(item.Type))
    .map(item => {
      const tooltip = parseTooltip(item.Tooltip);
      // 연마 효과 추출 예시 (4티어 대응)
      return {
        name: item.Name,
        type: item.Type,
        grade: item.Grade,
        quality: item.QualityValue,
        icon: item.Icon,
        stats: [], // 툴팁에서 스탯 파싱 로직 추가 영역
      };
    });
};

/** 팔찌 파서 */
const normalizeBracelet = (rawItems: RawEquipment[]): BraceletDisplay | null => {
  const bracelet = rawItems.find(item => item.Type === '팔찌');
  if (!bracelet) return null;
  return {
    name: bracelet.Name,
    grade: bracelet.Grade,
    icon: bracelet.Icon,
    options: [] // 특수 옵션(순환, 기습 등) 파싱 로직 추가 영역
  };
};

/** 아바타 파서 (상하의 세트 가중치 적용) */
const normalizeAvatars = (rawAvatars: RawAvatar[] | null): AvatarDisplay => {
  if (!rawAvatars) return { items: [], totalMainStatRate: 0, weaponAtkRate: 0 };
  const activeAvatars: RawAvatar[] = [];
  const processedTypes = new Set<string>();

  rawAvatars.forEach(avatar => {
    if (processedTypes.has(avatar.Type)) return;
    const sameTypeAvatars = rawAvatars.filter(a => a.Type === avatar.Type);
    if (sameTypeAvatars.length > 1) {
      const inner = sameTypeAvatars.find(a => a.IsInner);
      if (inner) activeAvatars.push(inner);
    } else {
      activeAvatars.push(avatar);
    }
    processedTypes.add(avatar.Type);
  });

  let mainStatRate = 0;
  let weaponAtkRate = 0;

  activeAvatars.forEach(avatar => {
    const key = toMultiKey(avatar.Grade);
    const weight = (avatar.Type === '상의 아바타' && avatar.IsSet) ? 2 : 1;
    const avatarDef = AVATAR_DATA[0];

    const mainStatEffect = avatarDef.effects?.find(e => e.type === 'MAIN_STAT_P');
    if (mainStatEffect?.multiValues?.[key]) {
      mainStatRate += mainStatEffect.multiValues[key][0] * weight;
    }

    if (avatar.Type === '무기 아바타') {
      const atkEffect = avatarDef.effects?.find(e => e.type === 'ATK_P');
      if (atkEffect?.multiValues?.[key]) {
        weaponAtkRate += atkEffect.multiValues[key][0];
      }
    }
  });

  return {
    totalMainStatRate: mainStatRate,
    weaponAtkRate: weaponAtkRate,
    items: activeAvatars.map(a => ({ name: a.Name, grade: a.Grade, icon: a.Icon, type: a.Type }))
  };
};

/** 보석 파서 */
const normalizeGems = (rawGems: any): GemDisplay[] => {
  if (!rawGems?.Gems) return [];
  return rawGems.Gems.map((gem: RawGem) => {
    const isT4 = gem.Name.includes('4티어') || gem.Grade === '고대';
    const gemId = isT4 ? GEM_ID_MAP.T4 : GEM_ID_MAP.T3;
    const level = parseInt(gem.Name.match(/(\d+)레벨/)?.[1] || '1');
    return { name: gem.Name, level, grade: gem.Grade, icon: gem.Icon, id: gemId };
  });
};

/** 카드 파서 */
const normalizeCards = (rawCards: any): CardSetDisplay => {
  if (!rawCards?.Cards) return { items: [], awakeTotal: 0, activeEffect: null };
  const awakeTotal = rawCards.Cards.reduce((sum: number, card: RawCard) => sum + card.AwakeCount, 0);
  const activeEffects = rawCards.Effects?.[0]?.Items || [];
  const lastEffectName = activeEffects.length > 0 ? activeEffects[activeEffects.length - 1].Name : '효과 없음';

  let step = -1;
  if (awakeTotal >= 30) step = 2;
  else if (awakeTotal >= 24) step = 1;
  else if (awakeTotal >= 18) step = 0;

  const cardDef = CARD_DATA[0];
  const effectValue = (step !== -1 && cardDef.effects?.[0].value) ? cardDef.effects[0].value[step] : 0;

  return {
    awakeTotal,
    activeEffect: { name: lastEffectName, value: effectValue },
    items: rawCards.Cards.map((c: RawCard) => ({ name: c.Name, awake: c.AwakeCount, grade: c.Grade, icon: c.Icon }))
  };
};

/** 각인 파서 */
const normalizeEngravings = (raw: RawCharacterData): EngravingDisplay[] => {
  const effects = raw.ArmoryEngraving?.Effects || [];
  return effects.map(eff => ({
    name: eff.Name.split(' Lv.')[0],
    level: parseInt(eff.Name.split(' Lv.')[1] || '0'),
    description: eff.Description
  }));
};

/** 스킬 파서 (트라이포드, 룬 포함) */
const normalizeSkills = (rawSkills: RawSkill[] | null): SkillDisplay[] => {
  if (!rawSkills) return [];
  return rawSkills
    .filter(s => s.Level > 1) // 1레벨 이상 스킬만 (보통 찍은 스킬들)
    .map(s => ({
      name: s.Name,
      level: s.Level,
      icon: s.Icon,
      tripods: s.Tripods.filter(t => t.IsSelected).map(t => ({
        name: t.Name,
        tier: t.Tier,
        slot: t.Slot,
        level: t.Level
      })),
      rune: s.Rune ? { name: s.Rune.Name, grade: s.Rune.Grade, icon: s.Rune.Icon } : null
    }));
};

// ============================================================
// 3. 메인 통합 함수
// ============================================================

export const normalizeCharacter = (raw: RawCharacterData): CharacterDisplayData => {
  const profile = raw.ArmoryProfile;

  return {
    profile: {
      name: profile.CharacterName,
      server: profile.ServerName,
      job: profile.CharacterClassName,
      level: profile.CharacterLevel,
      itemLevel: parseFloat(profile.ItemAvgLevel.replace(',', '')),
      title: profile.Title || '',
      guild: profile.GuildName || '',
      pvpGrade: profile.PvpGradeName,
      stats: profile.Stats,
    },
    combatStats: {
      critical: parseInt(profile.Stats?.find(s => s.Type === '치명')?.Value || '0'),
      specialization: parseInt(profile.Stats?.find(s => s.Type === '특화')?.Value || '0'),
      swiftness: parseInt(profile.Stats?.find(s => s.Type === '신속')?.Value || '0'),
      domination: parseInt(profile.Stats?.find(s => s.Type === '제압')?.Value || '0'),
      endurance: parseInt(profile.Stats?.find(s => s.Type === '인내')?.Value || '0'),
      expertise: parseInt(profile.Stats?.find(s => s.Type === '숙련')?.Value || '0'),
    },
    equipment: normalizeEquipment(raw.ArmoryEquipment || []),
    accessories: normalizeAccessories(raw.ArmoryEquipment || []),
    bracelet: normalizeBracelet(raw.ArmoryEquipment || []),
    avatars: normalizeAvatars(raw.ArmoryAvatars),
    gems: normalizeGems(raw.ArmoryGem),
    cards: normalizeCards(raw.ArmoryCard),
    engravings: normalizeEngravings(raw),
    skills: normalizeSkills(raw.ArmorySkills),
    // 초기화용 빈 필드들 (필요시 추가 확장)
    abilityStone: null,
    boJu: null, 
  };
};