/**
 * @/hooks/useSimulatorStore.ts
 *
 * 파이프라인 기반 캐릭터 계산 Store
 *
 * [설계 원칙]
 *   CharacterDisplayData의 각 항목에 id가 명시되어 있으므로
 *   텍스트 매칭 없이 id로 DB를 직접 조회합니다.
 *
 * [id → DB 조회 방식]
 *   각 DB를 Map<id, data>로 변환하여 O(1) 조회
 *
 * [예외: 텍스트 매핑 불가피한 경우]
 *   arkGrid.effects — normalizer가 텍스트로 파싱, id 없음
 *
 * [콘솔 디버그]
 *   🔵 StaticBuffer  — target 없는 공통 효과
 *   🟡 DynamicLogs   — target 있는 조건부 효과
 *   🔴 SpecialLogs   — special=true 효과
 *   📊 StatModifiers — 장비/악세 기본 스탯 누산값
 *   ⚪ 스킬 피해량   — 최종 결과
 */

"use client";

import { useState, useEffect } from 'react';
import { CharacterDisplayData } from '@/types/character-types';
import { StatModifiers, EffectTypeId, MultiKey } from '@/types/sim-types';
import { PipelineEffectLog } from '@/engine/pipeline/types';
import { runPipeline } from '@/engine/pipeline/run-pipeline';
import { SkillDamageResult } from '@/engine/calc/damage-calculator';

// DB imports
import { ENGRAVINGS_DB }   from '@/data/engravings';
import { COMBAT_EQUIP_DATA } from '@/data/equipment/combat-equip';
import { ACCESSORY_DB }    from '@/data/equipment/accessory';
import { BRACELET_DB }     from '@/data/equipment/bracelet';
import { AVATAR_DATA }     from '@/data/avatars';
import { GEM_DATA }        from '@/data/gems';
import { CARD_DATA }       from '@/data/cards';
import { SKILLS_GUARDIAN_KNIGHT_DB } from '@/data/skills/guardian-knight-skills';
import { getSkillMap } from '@/data/_class-registry';


// ============================================================
// DB → Map 변환 (id 기반 O(1) 조회)
// ============================================================
const EQUIP_MAP     = new Map(COMBAT_EQUIP_DATA.map(c => [c.id, c]));
const ACCESSORY_MAP = new Map(ACCESSORY_DB.map(a  => [a.id, a]));
const ENGRAVING_MAP = new Map(ENGRAVINGS_DB.map(e => [e.id, e]));
const BRACELET_MAP  = new Map(BRACELET_DB.map(b   => [b.id, b]));
const AVATAR_MAP    = new Map(AVATAR_DATA.map(a   => [a.id, a]));
const GEM_MAP       = new Map(GEM_DATA.map(g      => [g.id, g]));
const CARD_MAP      = new Map(CARD_DATA.map(c     => [c.id, c]));

/** 퍼센트 기반 타입 정의 */
const getStandardValue = (type: EffectTypeId, value: number): number => {
  const percentageTypes = [
    'DMG_INC', 'EVO_DMG', 'ADD_DMG',
    'CRIT_CHANCE', 'CRIT_DMG', 'CRIT_DMG_INC',
    'DEF_PENETRATION', 'ENEMY_DMG_TAKEN', 'CDR_P',
    'SPEED_ATK', 'SPEED_MOV',
    'MAIN_STAT_P', 'WEAPON_ATK_P', 'BASE_ATK_P', 'ATK_P',
    'STAT_HP_P',
  ];

  const processedValue = percentageTypes.includes(type) ? value / 100 : value;
  return Math.round(processedValue * 10000) / 10000;
};

// ============================================================
// StatModifiers 초기값
// ============================================================

const createEmptyStatModifiers = (): StatModifiers => ({
  mainStatC : 0, mainStatP : 0,
  weaponAtkC: 0, weaponAtkP: 0,
  baseAtkP  : 0,
  atkC      : 0, atkP      : 0,
  critC     : 0, specC     : 0,
  swiftC    : 0, domC      : 0,
  endC      : 0, expC      : 0,
  hpC       : 0, hpP       : 0,
});

/** StatModifiers 직접 누산 대상 타입 → 필드 매핑 */
const STAT_MOD_FIELD_MAP: Record<string, keyof StatModifiers> = {
  MAIN_STAT_C : 'mainStatC',
  WEAPON_ATK_C: 'weaponAtkC',
  WEAPON_ATK_P: 'weaponAtkP',
  BASE_ATK_P  : 'baseAtkP',
  ATK_C       : 'atkC',
  STAT_CRIT   : 'critC',
  STAT_SPEC   : 'specC',
  STAT_SWIFT  : 'swiftC',
  STAT_DOM    : 'domC',
  STAT_END    : 'endC',
  STAT_EXP    : 'expC',
  STAT_HP_C   : 'hpC',
  STAT_HP_P   : 'hpP',
};

/** 아크그리드 effects는 id 없음 — label 텍스트 매핑 불가피 */
const ARK_GRID_EFFECT_TYPE_MAP: Record<string, EffectTypeId> = {
  '공격력'  : 'ATK_P',
  '보스 피해': 'DMG_INC',
  '추가 피해': 'ADD_DMG',
};


// ============================================================
// effectLog 수집 (id 기반)
// ============================================================

const collectEffectLogs = (
  display: CharacterDisplayData,
): { pipelineLogs: PipelineEffectLog[]; statMods: StatModifiers } => {
  const pipelineLogs: PipelineEffectLog[] = [];
  const statMods = createEmptyStatModifiers();

  /** effectLog push 헬퍼 */
  const push = (
    label   : string,
    type    : string,
    value   : number,
    subGroup?: string,
    target? : PipelineEffectLog['target'],
    special?: boolean,
  ) => {
    if (type === 'UNKNOWN' || !value) return;

    // StatModifiers 직접 누산 (atk-calculator 입력용)
    const statField = STAT_MOD_FIELD_MAP[type];
    if (statField) (statMods as any)[statField] += value;

    pipelineLogs.push({ label, type, value, subGroup, target, special });
  };

    // ── 1. 장비 기본 스탯 ────────────────
    display.equipment.forEach(eq => {
      const db = EQUIP_MAP.get(eq.id);
      if (!db) return;
      const gradeKey = eq.eqGrade as MultiKey;

      // 2. 기본 재련 스탯 계산 (db.effects 순회)
      db.effects?.forEach(eff => {
        if (!('multiValues' in eff) || !eff.multiValues) return;
        
        const values = eff.multiValues[gradeKey];
        if (!values) return;

        // 기본 재련 인덱스 (refineLv 1~25 대응)
        const baseIdx = Math.max(0, (eq.refineLv ?? 1) - 1);
        let totalValue = values[Math.min(baseIdx, values.length - 1)] ?? 0;

        // 3. 상급 재련 스탯 합산 (adv_refine 배열 참조)
        // 현재 기본 재련 레벨에 해당하는 상급 재련 테이블을 찾습니다.
        const advEntry = db.adv_refine.find(a => a.refineLv === eq.refineLv);
        if (advEntry && eq.advRefineLv > 0) {
          // 상급 재련 항목 중 동일한 타입(MAIN_STAT_C 등)의 수치를 찾습니다.
          const advEff = advEntry.effects.find(ae => ae.type === eff.type);
          if (advEff && 'multiValues' in advEff) {
            const advValues = advEff.multiValues![gradeKey];
            if (advValues) {
              // 상급 재련 레벨(advRefineLv)을 인덱스로 수치 합산
              const advIdx = Math.max(0, eq.advRefineLv - 1);
              totalValue += advValues[Math.min(advIdx, advValues.length - 1)] ?? 0;
            }
          }
        }

        if (totalValue > 0) {
          push(`${eq.name}`, eff.type, totalValue);
        }
      });
    });

    // ── 2. 악세서리  ────────────────────
    display.accessories.forEach(acc => {
      acc.effects.forEach(eff => {
        const db = ACCESSORY_MAP.get(eff.id);
        if (!db || !db.effects) return;

        db.effects.forEach(dbEff => {
          const label = `${acc.type}`;
          const rawValue = eff.values?.[0]?.value ?? 0;
          const standardizedValue = getStandardValue(dbEff.type, rawValue);
          
          push(
            label, 
            dbEff.type, 
            standardizedValue,
            dbEff.subGroup, 
            dbEff.target
          );
        });
      });
    });

    // ── 3. 팔찌 효과  ─────────────────────────────
    display.bracelet?.effects.forEach(eff => {
      const db = BRACELET_MAP.get(eff.id);
      if (!db || !db.effects) return;

      db.effects.forEach((dbEff, idx) => {
        const label = `팔찌 ${db.label ?? db.name}`;
        const rawValue = eff.values?.[idx]?.value ?? 0;
        const standardizedValue = getStandardValue(dbEff.type, rawValue);

        if (standardizedValue !== 0) {
          push(
            label,
            dbEff.type,
            standardizedValue,
            dbEff.subGroup,
            dbEff.target
          );
        }
      });
    });

    // ── 4. 아바타 ─────────────────────────────
    display.avatars.forEach(av => {
      const db = AVATAR_MAP.get(av.id);
      if (!db || !db.effects) return;

      db.effects.forEach(dbEff => {
        const label = `아바타 ${av.label ?? av.name}`;
        const rawValue = av.values?.[0]?.value ?? 0;
        const standardizedValue = getStandardValue(dbEff.type, rawValue);

        if (standardizedValue !== 0) {
          push(
            label,
            dbEff.type,
            standardizedValue,
            dbEff.subGroup,
            dbEff.target
          );
        }
      });
    });

    // ── 5. 각인 ─────────────────────────────
    display.engravings.forEach(eng => {
      if (!eng.id) return;
      
      const db = ENGRAVING_MAP.get(eng.id);
      if (!db || !db.effects) return;

      // 등급 판정은 루프 밖에서 한 번만 수행
      const isRelicOrLegend = eng.eqGrade === 'RELIC';

      db.effects.forEach((eff) => {
        const baseValue = eff.value?.[0] ?? 0;
        let bonusValue = 0;

        // 1. 유물 각인서 보너스 계산
        const relic = db.bonus?.relic;
        const hasRelicBonus = isRelicOrLegend && relic?.type === eff.type;

        if (hasRelicBonus && relic?.value) {
          bonusValue += relic.value[eng.level - 1] ?? 0;
        }
        
        // 2. 어빌리티 스톤 보너스 계산
        const ability = db.bonus?.ability;
        const hasAbilityBonus = eng.abilityStoneLevel && ability?.type === eff.type;

        if (hasAbilityBonus && ability?.value) {
          bonusValue += ability.value[eng.abilityStoneLevel - 1] ?? 0;
        }

        // 3. 합산 및 최종 수치 결정
        const total = baseValue + bonusValue;
        if (total === 0) return;

        const finalizedValue = Math.round(total * 10000) / 10000;

        // 각 효과별로 push가 호출됨 (효과가 2개면 로그도 2줄 생성)
        push(
          db.name,
          eff.type,
          finalizedValue,
          eff.subGroup,
          eff.target,
          (db as any).special
        );
      });
    });

    // ── 6. 보석 ─────────────────────────────
    let totalGemBaseAtkBonus = 0;

    display.gems.forEach(gem => {
      if (!gem.id) return;
      const db = GEM_MAP.get(gem.id);
      if (!db || !db.effects) return;
      const skillID = getSkillMap(display.profile.className).get(gem.skillName)?.id;

      db.effects.forEach(eff => {
        if (eff.type === 'BASE_ATK_P') {
          const bonusValue = eff.value?.[gem.level - 1] ?? 0;
          totalGemBaseAtkBonus += bonusValue;
          return;
        }

        const rawValue = eff.value?.[gem.level - 1] ?? 0;
        if (rawValue === 0) return;
        const finalizedValue = Math.round(rawValue * 10000) / 10000;
        push(
          gem.name,
          eff.type,
          finalizedValue,
          eff.subGroup,
          {
          ...eff.target,
          skillIds: skillID ? [skillID] : undefined,
          }
        );
      });
    }); 
    
    if (totalGemBaseAtkBonus > 0) {
      const finalAtkBonus = Math.round(totalGemBaseAtkBonus * 10000) / 10000;
      push(
        '보석 기본 공격력 보너스', // 합산용 라벨
        'BASE_ATK_P',
        finalAtkBonus,
      );
    }

  // // ── 8. 카드 ──────────────────────────────────────────────
  // // cards.id → CARD_MAP 조회
  // if (display.cards?.id) {
  //   const db = CARD_MAP.get(display.cards.id);
  //   if (db?.effects) {
  //     const totalAwake = (display.cards as any).totalAwake ?? 0;

  //     db.effects.forEach(eff => {
  //       if (!eff.value) return;
  //       // 각성 합계에 맞는 인덱스 선택 (0-based, 클램프)
  //       const idx   = Math.min(Math.max(totalAwake - 1, 0), eff.value.length - 1);
  //       const value = eff.value[idx] ?? 0;
  //       if (!value) return;

  //       const subGroup = eff.type === 'DMG_INC' ? SUB_GROUPS.CARD : eff.subGroup;
  //       push('카드', eff.type, value, subGroup, eff.target);
  //     });
  //   }
  // }

  // // ── 9. 아크그리드 ────────────────────────────────────────
  // // arkGrid.effects는 normalizer가 최종 수치로 파싱 완료
  // // label 텍스트 매핑 불가피 (id 없음)
  // display.arkGrid.effects.forEach(eff => {
  //   const labelText  = typeof eff.label === 'string' ? eff.label : eff.label.text;
  //   const effectType = ARK_GRID_EFFECT_TYPE_MAP[labelText];
  //   if (effectType)
  //     push(`아크그리드 ${labelText}`, effectType, eff.value.value);
  // });

  return { pipelineLogs, statMods };
};


// ============================================================
// 콘솔 디버그
// ============================================================

const debugPipeline = (
  logs   : PipelineEffectLog[],
  mods   : StatModifiers,
  results: SkillDamageResult[],
): void => {
  console.group('🚀 [파이프라인 디버그]');

  const staticLogs  = logs.filter(l => !l.special && !l.target);
  const dynamicLogs = logs.filter(l => !l.special && !!l.target);
  const specialLogs = logs.filter(l => !!l.special);

  console.group(`🔵 StaticBuffer (${staticLogs.length}개)`);
  console.table(staticLogs.map(l => ({
    출처: l.label, 타입: l.type, 값: l.value, 서브그룹: l.subGroup ?? '-',
  })));
  console.groupEnd();

  console.group(`🟡 DynamicLogs (${dynamicLogs.length}개)`);
  console.table(dynamicLogs.map(l => ({
    출처      : l.label,
    타입      : l.type,
    값        : l.value,
    서브그룹  : l.subGroup ?? '-',
    skillIds  : l.target?.skillIds?.join(',')   ?? '-',
    categories: l.target?.categories?.join(',') ?? '-',
    skillTypes: l.target?.skillTypes?.join(',') ?? '-',
    attackType: l.target?.attackType?.join(',') ?? '-',
    resourceTypes: l.target?.resourceTypes?.join(',') ?? '-',
  })));
  console.groupEnd();

  console.group(`🔴 SpecialLogs (${specialLogs.length}개)`);
  specialLogs.length > 0
    ? console.table(specialLogs.map(l => ({ 출처: l.label, 타입: l.type, 값: l.value })))
    : console.log('(없음)');
  console.groupEnd();

  console.group('📊 StatModifiers');
  const nonZero = Object.entries(mods).filter(([, v]) => v !== 0);
  nonZero.length > 0
    ? console.table(nonZero.map(([k, v]) => ({ 필드: k, 값: v })))
    : console.log('(모두 0 — 장비 DB 매칭 확인 필요)');
  console.groupEnd();

  console.group(`⚪ 스킬 피해량 (${results.length}개)`);
  console.table(
    results
      .sort((a, b) => b.totalDamage - a.totalDamage)
      .map(r => ({
        스킬명  : r.skillName,
        총피해량: r.totalDamage.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        피해원수: r.sources.length,
      }))
  );
  results.forEach(r => {
    if (!r.sources.length) return;
    console.group(`  📌 ${r.skillName}`);
    console.table(r.sources.map(s => ({
      피해원  : s.name,
      피해량  : s.damage.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      합산여부: s.isCombined ? '✅' : '❌',
    })));
    console.groupEnd();
  });
  console.groupEnd();

  console.groupEnd();
};


// ============================================================
// Store 타입
// ============================================================

export interface SimulatorStore {
  displayData       : CharacterDisplayData | null;
  skillDamageResults: SkillDamageResult[];
  setDisplayData    : (data: CharacterDisplayData) => void;
}


// ============================================================
// useSimulatorStore
// ============================================================

export const useSimulatorStore = (): SimulatorStore => {
  const [displayData, setDisplayDataState] =
    useState<CharacterDisplayData | null>(null);

  const [skillDamageResults, setSkillDamageResults] =
    useState<SkillDamageResult[]>([]);

  useEffect(() => {
    if (!displayData) {
      setSkillDamageResults([]);
      return;
    }

    const { pipelineLogs, statMods } = collectEffectLogs(displayData);

    const combatInfo = {
      baseAtk       : displayData.combatStats.attackPower,
      specialization: displayData.combatStats.specialization,
    };

    const results = runPipeline(displayData, pipelineLogs, statMods, combatInfo);
    setSkillDamageResults(results);
    debugPipeline(pipelineLogs, statMods, results);

  }, [displayData]);

  const setDisplayData = (data: CharacterDisplayData) =>
    setDisplayDataState(data);

  return { displayData, setDisplayData, skillDamageResults };
};