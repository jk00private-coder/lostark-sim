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
 * [콘솔 디버그 구조]
 *   📋 0단계: 스킬 특성 확정 (category, typeId, attackId, 트라이포드, sources)
 *   🔵 1단계: StaticBuffer (type → subGroup → values, 기본연산 표시)
 *   🟡 2단계: Dynamic 버퍼 (스킬별 BufferMap 전체)
 *   🟠 3단계: Special 처리 후 버퍼 (스킬별 BufferMap 전체)
 *   ⚙️  확정: 공격력 4종 + 스킬별 DamageModifiers
 *   ⚪ 최종: 스킬 피해량
 */

"use client";

import { useState, useEffect } from 'react';
import { CharacterDisplayData } from '@/types/character-types';
import { StatModifiers, EffectTypeId, MultiKey } from '@/types/sim-types';
import { PipelineEffectLog, PipelineDebugData, BufferMap } from '@/engine/pipeline/types';
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
import { ARK_PASSIVE_RULES } from '@/data/arc-passive/meta';
import { getSkillMap, getArkGridMap, getArkPassiveNodeMap } from '@/data/_class-registry';
import { ARK_GRID_EFFECT_RULES } from '@/data/arc-grid/meta';


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

/**
* 퍼센트 기반 타입 정의
 * DB에 직접 추출하는 값이 아닌 display에서 추출한 값에만 사용
 * */
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

// ============================================================
// 기본 연산 맵 (DEFAULT_OPERATION_MAP)
// ============================================================

/**
 * type별 기본 연산 정의
 *
 * [설계 의도]
 *   subGroup이 없을 때의 기본 동작을 미리 정의해두어
 *   effectLog 작성 시 subGroup을 일일이 명시하는 수고를 줄임
 *
 *   MULTI: subGroup 없으면 독립 곱연산 → 효과마다 별도 곱연산
 *          (각인, 아크패시브 피해증가 등은 서로 독립적으로 곱해져야 함)
 *   SUM  : subGroup 없어도 합산 → 전체 합산 후 1회 적용
 *          (치명타 확률, 방어력 관통 등은 합산이 자연스러움)
 *
 *   ※ subGroup이 명시된 경우: 같은 그룹끼리 합산 후 1회 곱연산 (예외 동작)
 */
const DEFAULT_OPERATION_MAP: Record<string, 'SUM' | 'MULTI'> = {
  // 피해 계열 → 독립 곱연산
  DMG_INC        : 'MULTI',
  EVO_DMG        : 'SUM',
  ADD_DMG        : 'SUM',
  CRIT_DMG_INC   : 'MULTI',

  // 확률/수치 합산 계열 → 합산
  CRIT_CHANCE    : 'SUM',
  CRIT_DMG       : 'SUM',
  DEF_PENETRATION: 'SUM',
  ENEMY_DMG_TAKEN: 'SUM',
  CDR_C          : 'SUM',
  CDR_P          : 'SUM',
  SPEED_ATK      : 'SUM',
  SPEED_MOV      : 'SUM',

  // 스탯 계열 → 합산
  MAIN_STAT_C    : 'SUM',
  MAIN_STAT_P    : 'SUM',
  WEAPON_ATK_C   : 'SUM',
  WEAPON_ATK_P   : 'SUM',
  BASE_ATK_P     : 'SUM',
  ATK_C          : 'SUM',
  ATK_P          : 'MULTI', // 공격력 퍼센트는 독립 곱
  STAT_CRIT      : 'SUM',
  STAT_SPEC      : 'SUM',
  STAT_SWIFT     : 'SUM',
  STAT_DOM       : 'SUM',
  STAT_END       : 'SUM',
  STAT_EXP       : 'SUM',
  STAT_HP_C      : 'SUM',
  STAT_HP_P      : 'SUM',
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
    desc?   : string,
  ) => {
    if (type === 'UNKNOWN' || !value) return;

    // StatModifiers 직접 누산 (atk-calculator 입력용)
    const statField = STAT_MOD_FIELD_MAP[type];
    if (statField) (statMods as any)[statField] += value;

    pipelineLogs.push({ label, type, value, subGroup, target, special, desc });
  };

    // ── 1. 장비 기본 스탯 ────────────────
    display.equipment.forEach(eq => {
      const db = EQUIP_MAP.get(eq.id);
      if (!db) return;
      const gradeKey = eq.eqGrade as MultiKey;

      // 기본 재련 스탯 계산 (db.effects 순회)
      db.effects?.forEach(eff => {
        if (!('multiValues' in eff) || !eff.multiValues) return;
        
        const values = eff.multiValues[gradeKey];
        if (!values) return;

        // 기본 재련 인덱스 (refineLv 1~25 대응)
        const baseIdx = Math.max(0, (eq.refineLv ?? 1) - 1);
        let totalValue = values[Math.min(baseIdx, values.length - 1)] ?? 0;

        // 상급 재련 스탯 합산
        const advEntry = db.adv_refine.find(a => a.refineLv === eq.refineLv);
        if (advEntry && eq.advRefineLv > 0) {
          const advEff = advEntry.effects.find(ae => ae.type === eff.type);
          if (advEff && 'multiValues' in advEff) {
            const advValues = advEff.multiValues![gradeKey];
            if (advValues) {
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

      const isRelicOrLegend = eng.eqGrade === 'RELIC';

      db.effects.forEach((eff) => {
        const baseValue = eff.value?.[0] ?? 0;
        let bonusValue = 0;

        const relic = db.bonus?.relic;
        const hasRelicBonus = isRelicOrLegend && relic?.type === eff.type;
        if (hasRelicBonus && relic?.value) {
          bonusValue += relic.value[eng.level - 1] ?? 0;
        }
        
        const ability = db.bonus?.ability;
        const hasAbilityBonus = eng.abilityStoneLevel && ability?.type === eff.type;
        if (hasAbilityBonus && ability?.value) {
          bonusValue += ability.value[eng.abilityStoneLevel - 1] ?? 0;
        }

        const total = baseValue + bonusValue;
        if (total === 0) return;

        const finalizedValue = Math.round(total * 10000) / 10000;

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
        '보석 기본 공격력 보너스',
        'BASE_ATK_P',
        finalAtkBonus,
      );
    }

  // ── 7. 카드 ─────────────────────────────
  if (display.cards?.id) {
      const db = CARD_MAP.get(display.cards.id);
      if (db?.effects) {
        const level = display.cards.level ?? 0;
        db.effects.forEach(eff => {
          if (!eff.value) return;
          const maxIdx = eff.value.length - 1;
          const targetIdx = Math.min(Math.max(Math.floor(level / 6) - 2, 0), maxIdx);
          const accumulatedValue = eff.value
            .slice(0, targetIdx + 1)
            .reduce((sum, val) => sum + val, 0);

          if (accumulatedValue <= 0) return;
          push('카드', eff.type, accumulatedValue, eff.subGroup, eff.target);
        });
      }
    }

  // ── 8. 아크패시브 ────────────────────────────────────────
  const ARKPASSIVE_MAP = getArkPassiveNodeMap(display.profile.className);
  display.arkPassive?.effects.forEach((eff) => {
    const db = ARKPASSIVE_MAP.get(eff.id);
    if (!db) return;

    db.effects?.forEach((dbEff) => {
      const levelIdx = Math.min(eff.level - 1, (dbEff.value?.length || 1) - 1);
      const val = dbEff.value?.[levelIdx] ?? 0;

      val !== 0 && push(
        `아크패시브:${eff.category.text} ${eff.name}`,
          dbEff.type,
          val,
          dbEff.subGroup,
          dbEff.target,
          (db as any).special
        );
      });
    });

  const points = display.arkPassive?.points;
  (['evolution', 'insight', 'leap'] as const).forEach((key) => {
    const userPoint = points?.[key];
    const rule = ARK_PASSIVE_RULES[key];
    const level = userPoint?.level ?? 0;
    
    if (level <= 0 || !rule) return;
    const { levelBonus: lv, rankBonus: rk } = rule.karma;
    
    const lvStep = lv?.value?.[0] ?? 0;
    const lvValue = Math.round(level * lvStep * 10000) / 10000;
    lvValue !== 0 && push(`아크패시브:${key} ${level}레벨 보너스`, lv!.type, lvValue, undefined, lv?.target);
    
    const rank = level > 0 ? Math.min(6, Math.floor((level - 1) / 4) + 1) : 0;
    const rkStep = rk?.value?.[0] ?? 0; 
    const rkValue = Math.round(rank * rkStep * 10000) / 10000;
    rkValue !== 0 && push(`아크패시브:${key} ${rank}랭크 보너스`, rk!.type, rkValue, undefined, rk?.target);
  });


  // ── 9. 아크그리드 ────────────────────────────────────────
  const ARKGRID_MAP = getArkGridMap(display.profile.className);
  display.arkGrid.cores.forEach((core) => {
    const db = ARKGRID_MAP.get(core.id);
    if (!db || !db.thresholds) return;

    const currentPoint = core.point;
    const gradeKey = (core.eqGrade as MultiKey) || 'COMMON';

    db.thresholds.forEach((threshold) => {
      if (currentPoint < threshold.point) return;
      if (!threshold.effects) return;

      threshold.effects.forEach((dbEff) => {
        let value = 0;

        if (dbEff.multiValues) {
          const values = dbEff.multiValues[gradeKey];
          value = values?.[0] ?? 0;
        } else if (dbEff.value) {
          value = dbEff.value[0] ?? 0;
        }

        if (value === 0) return;

          push(
          `아크그리드:${db.name} (${threshold.point}pt)`,
            dbEff.type,
            value,
            dbEff.subGroup,
            dbEff.target,
            (db as any).special
          );
      });
    });
  });

  display.arkGrid.effects.forEach(eff => {
    const rule = ARK_GRID_EFFECT_RULES[eff.label];
    const level = eff.level ?? 0;
    
    if (level <= 0 || !rule) return;
    const step = rule?.value?.[0] ?? 0; 
    const finalValue = Math.round(level * step * 10000) / 10000;
    
    finalValue !== 0 && push(`아크그리드 ${eff.label} Lv.${level}`, rule.type, finalValue);
  });

  return { pipelineLogs, statMods };
};


// ============================================================
// 콘솔 디버그 (effectLog 기반, UI 친화적)
// ============================================================

/**
 * effectLog를 effectType별로 그룹화
 * UI 렌더링과 디버그 출력 공용
 */
const groupLogsByType = (
  logs: PipelineEffectLog[],
): Record<string, PipelineEffectLog[]> => {
  const grouped: Record<string, PipelineEffectLog[]> = {};
  logs.forEach(log => {
    if (!grouped[log.type]) grouped[log.type] = [];
    grouped[log.type].push(log);
  });
  return grouped;
};

/**
 * effectLog 배열을 콘솔 테이블용 행으로 변환
 * 출처 / 타입 / 값 / subGroup 표시
 */
const logsToTableRows = (logs: PipelineEffectLog[]) =>
  logs.map(l => ({
    출처    : l.label,
    타입    : l.type,
    값      : l.value,
    subGroup: l.subGroup ?? '-',
    desc    : l.desc     ?? '-',
  }));

const debugPipeline = (
  statMods  : StatModifiers,
  results   : SkillDamageResult[],
  debug     : PipelineDebugData,
): void => {
  console.group('🚀 [파이프라인 디버그]');

  // inputLogs를 static / dynamic / special 로 분류
  const staticLogs  = debug.inputLogs.filter(l => !l.special && !l.target);
  const dynamicLogs = debug.inputLogs.filter(l => !l.special && !!l.target);
  const specialLogs = debug.inputLogs.filter(l => !!l.special);

  // ── 📋 0단계: 스킬 특성 확정 ────────────────────────────
  console.group(`📋 0단계: 스킬 특성 확정 (${debug.step0_resolvedSkills.length}개 스킬)`);
  debug.step0_resolvedSkills.forEach(skill => {
    console.group(`  🗡️ ${skill.skillName} (Lv.${skill.level})`);
    console.table([{
      카테고리    : skill.categories.join(', '),
      스킬타입    : skill.typeId,
      공격타입    : skill.attackId,
      쿨타임      : `${skill.cooldown}초`,
      자원타입    : skill.resourceType ?? '-',
      기운소모    : skill.qiCost ?? '-',
      적용트라이포드: skill.appliedTripods.length > 0
        ? skill.appliedTripods.join(', ')
        : '없음',
    }]);

    if (skill.sources.length > 0) {
      console.table(skill.sources.map(s => ({
        피해원  : s.name,
        합산여부: s.isCombined ? '✅ 합산' : '❌ 별도',
        타수    : s.hits,
        상수    : s.constant.toLocaleString(),
        계수    : s.coefficient.toFixed(2),
      })));
    }
    console.groupEnd();
  });
  console.groupEnd();

  // ── 🔵 1단계: Static 버퍼 — 공통 효과 ──────────────────
  console.group(`🔵 1단계: Static 버퍼 — 공통 효과 (${staticLogs.length}개)`);
  // 출처/타입/값/subGroup 그대로 표시
  console.table(logsToTableRows(staticLogs));
  console.groupEnd();

  // ── ⚙️ 공격력 4종 계산 ──────────────────────────────────
  console.group('⚙️ 공격력 4종 계산');
  const atk = debug.atkStats;

  // 무기 공격력에 사용된 항목 나열
  const weaponAtkLogs = debug.inputLogs.filter(
    l => l.type === 'WEAPON_ATK_C' || l.type === 'WEAPON_ATK_P'
  );
  console.group(`  최종 무기공격력: ${atk.weaponAtk.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
  console.table(logsToTableRows(weaponAtkLogs));
  console.groupEnd();

  // 주스탯에 사용된 항목 나열
  const mainStatLogs = debug.inputLogs.filter(
    l => l.type === 'MAIN_STAT_C' || l.type === 'MAIN_STAT_P'
  );
  console.group(`  최종 주스탯: ${atk.mainStat.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
  console.table(logsToTableRows(mainStatLogs));
  console.groupEnd();

  // 기본 공격력 / 최종 공격력 요약
  const atkLogs = debug.inputLogs.filter(
    l => l.type === 'ATK_C' || l.type === 'ATK_P' || l.type === 'BASE_ATK_P'
  );
  console.group(`  기본공격력: ${atk.baseAtk.toLocaleString(undefined, { maximumFractionDigits: 0 })}  →  최종공격력: ${atk.finalAtk.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
  console.log(`  📐 √(주스탯${atk.mainStat.toFixed(0)} × 무기공격력${atk.weaponAtk.toFixed(0)} / 6) = ${atk.baseAtk.toFixed(0)}`);
  if (atkLogs.length > 0) console.table(logsToTableRows(atkLogs));
  console.groupEnd();

  console.groupEnd();

  // ── 🟡 2단계: Dynamic 로그 원본 ─────────────────────────
  console.group(`🟡 2단계: Dynamic 로그 원본 — 스킬별 조건부 효과 (${dynamicLogs.length}개)`);
  console.table(dynamicLogs.map(l => ({
    출처      : l.label,
    타입      : l.type,
    값        : l.value,
    subGroup  : l.subGroup ?? '-',
    skillIds  : l.target?.skillIds?.join(', ')   ?? '-',
    categories: l.target?.categories?.join(', ') ?? '-',
    skillTypes: l.target?.skillTypes?.join(', ') ?? '-',
    attackType: l.target?.attackType?.join(', ') ?? '-',
  })));
  console.groupEnd();

  // ── 🟠 3단계: Special 로그 원본 ─────────────────────────
  console.group(`🟠 3단계: Special 로그 원본 (${specialLogs.length}개)`);
  specialLogs.length > 0
    ? console.table(logsToTableRows(specialLogs))
    : console.log('(없음)');
  console.groupEnd();

  // ── 📊 StatModifiers ────────────────────────────────────
  console.group('📊 StatModifiers (장비/악세 기본 스탯 누산값)');
  const nonZeroStats = Object.entries(statMods).filter(([, v]) => v !== 0);
  nonZeroStats.length > 0
    ? console.table(nonZeroStats.map(([k, v]) => ({ 필드: k, 값: v })))
    : console.log('(모두 0 — 장비 DB 매칭 확인 필요)');
  console.groupEnd();

  // ── 🎯 확정: 스킬별 DamageModifiers ─────────────────────
  // effectType별 groupBy → 항목 나열 + 최종값
  console.group('🎯 확정: 스킬별 DamageModifiers');

  // DamageModifiers 필드 → effectType 역매핑 (표시용)
  const FIELD_TO_TYPES: Record<string, string[]> = {
    damageInc      : ['DMG_INC'],
    evoDamage      : ['EVO_DMG'],
    addDamage      : ['ADD_DMG'],
    critChance     : ['CRIT_CHANCE'],
    critDamage     : ['CRIT_DMG'],
    critDamageInc  : ['CRIT_DMG_INC'],
    defPenetration : ['DEF_PENETRATION'],
    enemyDamageTaken: ['ENEMY_DMG_TAKEN'],
    cdrC           : ['CDR_C'],
    cdrP           : ['CDR_P'],
    spdAtk         : ['SPEED_ATK'],
    spdMov         : ['SPEED_MOV'],
  };

  // 표시 레이블
  const FIELD_LABEL: Record<string, string> = {
    damageInc      : '피해 증가',
    evoDamage      : '진화형 피해',
    addDamage      : '추가 피해',
    critChance     : '치명타 확률',
    critDamage     : '치명타 피해',
    critDamageInc  : '치명타시 피해 증가',
    defPenetration : '방어력 관통',
    enemyDamageTaken: '적 받는 피해 증가',
    cdrC           : '쿨타임 감소(고정)',
    cdrP           : '쿨타임 감소(%)',
    spdAtk         : '공격 속도',
    spdMov         : '이동 속도',
  };

  // 곱연산 계열은 ×배율, 합산 계열은 %로 표시
  const formatModValue = (field: string, value: number): string => {
    const sumFields = [
      'critChance', 'defPenetration', 'enemyDamageTaken', 'cdrP', 'spdAtk', 'spdMov'
    ];
    if (field === 'cdrC') return `${value.toFixed(1)}초`;
    if (sumFields.includes(field)) return `${(value * 100).toFixed(2)}%`;
    // 곱연산 계열: 초기값(1.0 또는 2.0)에서 얼마나 올랐는지 표시
    const baseVal = field === 'critDamage' ? 2.0 : 1.0;
    const gained = ((value - baseVal) * 100).toFixed(2);
    return `×${value.toFixed(4)} (+${gained}%)`;
  };

  Object.entries(debug.finalMods).forEach(([id, mods]) => {
    const skillName = debug.skillNameMap[Number(id)] ?? `skillId:${id}`;
    // 해당 스킬에 적용된 dynamic 로그 (target.skillIds 포함)
    const skillDynamicLogs = dynamicLogs.filter(
      l => !l.target?.skillIds || l.target.skillIds.includes(Number(id))
    );

    console.group(`  🗡️ ${skillName}`);

    Object.entries(FIELD_TO_TYPES).forEach(([field, types]) => {
      const modValue = (mods as any)[field] as number;
      const baseVal = field === 'critDamage' ? 2.0 : 1.0;
      // 기본값과 동일하면 변화 없음 → 생략
      if (Math.abs(modValue - baseVal) < 0.00001 && field !== 'critChance') return;

      // 이 field에 해당하는 effectLog 수집
      const relatedLogs = [
        ...staticLogs.filter(l => types.includes(l.type)),
        ...skillDynamicLogs.filter(l => types.includes(l.type)),
        ...specialLogs.filter(l => types.includes(l.type)),
      ];

      const displayValue = formatModValue(field, modValue);
      console.group(`    ${FIELD_LABEL[field] ?? field}: ${displayValue}`);

      if (relatedLogs.length > 0) {
        console.table(relatedLogs.map(l => ({
          출처    : l.label,
          타입    : l.type,
          값      : l.value,
          subGroup: l.subGroup ?? '-',
          desc    : l.desc     ?? '-',
        })));
      }
      console.groupEnd();
    });

    // 쿨타임 계산 (cdrC, cdrP 적용)
    // 0단계에서 수집한 쿨타임 원본
    const skillMeta = debug.step0_resolvedSkills.find(s => s.skillId === Number(id));
    if (skillMeta && skillMeta.cooldown > 0) {
      const baseCooldown = skillMeta.cooldown;
      const afterCdrC = Math.max(0, baseCooldown - mods.cdrC);
      const finalCooldown = afterCdrC * (1 - Math.min(mods.cdrP, 1));
      const cdrRelatedLogs = [
        ...staticLogs.filter(l => l.type === 'CDR_C' || l.type === 'CDR_P'),
        ...skillDynamicLogs.filter(l => l.type === 'CDR_C' || l.type === 'CDR_P'),
      ];

      console.group(`    쿨타임: ${baseCooldown}초 → 최종 ${finalCooldown.toFixed(1)}초`);
      if (cdrRelatedLogs.length > 0) {
        console.table(logsToTableRows(cdrRelatedLogs));
      } else {
        console.log('    (쿨타임 감소 없음)');
      }
      console.groupEnd();
    }

    console.groupEnd();
  });
  console.groupEnd();

  // ── ⚪ 최종: 스킬 피해량 ────────────────────────────────
  console.group(`⚪ 최종: 스킬 피해량 (${results.length}개)`);

  // 스킬명 + 총피해량 + 피해원별 damage를 한 행으로 집약
  const summaryRows = results
    .sort((a, b) => b.totalDamage - a.totalDamage)
    .map(r => {
      const row: Record<string, string> = {
        스킬명  : r.skillName,
        총피해량: r.totalDamage.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      };
      // 피해원별 열 추가 (최대 5개)
      r.sources.forEach((s, i) => {
        const label = `${s.name}(${s.isCombined ? '합' : '별'})`;
        row[label] = s.damage.toLocaleString(undefined, { maximumFractionDigits: 0 });
      });
      return row;
    });

  console.table(summaryRows);
  console.groupEnd();

  console.groupEnd(); // 🚀 [파이프라인 디버그]
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

    // runPipeline이 { results, debug } 를 반환하도록 변경됨
    const { results, debug } = runPipeline(displayData, pipelineLogs, statMods, combatInfo);

    setSkillDamageResults(results);
    debugPipeline(statMods, results, debug);

  }, [displayData]);

  const setDisplayData = (data: CharacterDisplayData) =>
    setDisplayDataState(data);

  return { displayData, setDisplayData, skillDamageResults };
};