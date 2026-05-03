/**
 * @/hooks/useSimulatorStore.ts
 *
 * 파이프라인 기반 캐릭터 계산 Store
 *
 * [설계 원칙]
 *   CharacterDisplayData의 각 항목에 id가 명시되어 있으므로
 *   텍스트 매칭 없이 id로 DB를 직접 조회합니다.
 *
 * [변경 이력]
 *   - debugPipeline에서 static/dynamic/special 재분류 코드 제거
 *   - run-pipeline이 반환하는 debug.staticLogs, debug.dynamicLogs,
 *     debug.specialLogs, debug.atkDetailLogs, debug.skillDetailLogs 직접 참조
 *   - inputLogs 직접 참조 제거 (분류된 로그만 사용)
 *
 * [콘솔 디버그 구조]
 *   📋 0단계: 스킬 특성 확정
 *   📊 피해원 상세 수치
 *   ⚙️  공격력 4종 계산 (atkDetailLogs 기반)
 *   🔵 1단계: Static 로그
 *   🟡 2단계: Dynamic 로그
 *   🟠 3단계: Special 로그
 *   📊 StatModifiers
 *   🎯 확정: 스킬별 DamageModifiers (skillDetailLogs 기반)
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
 */
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

const DEFAULT_OPERATION_MAP: Record<string, 'SUM' | 'MULTI'> = {
  DMG_INC        : 'MULTI',
  EVO_DMG        : 'SUM',
  ADD_DMG        : 'SUM',
  CRIT_DMG_INC   : 'MULTI',
  CRIT_CHANCE    : 'SUM',
  CRIT_DMG       : 'SUM',
  DEF_PENETRATION: 'SUM',
  ENEMY_DMG_TAKEN: 'SUM',
  CDR_C          : 'SUM',
  CDR_P          : 'SUM',
  SPEED_ATK      : 'SUM',
  SPEED_MOV      : 'SUM',
  MAIN_STAT_C    : 'SUM',
  MAIN_STAT_P    : 'SUM',
  WEAPON_ATK_C   : 'SUM',
  WEAPON_ATK_P   : 'SUM',
  BASE_ATK_P     : 'SUM',
  ATK_C          : 'SUM',
  ATK_P          : 'MULTI',
  STAT_CRIT      : 'SUM',
  STAT_SPEC      : 'SUM',
  STAT_SWIFT     : 'SUM',
  STAT_DOM       : 'SUM',
  STAT_END       : 'SUM',
  STAT_EXP       : 'SUM',
  STAT_HP_C      : 'SUM',
  STAT_HP_P      : 'SUM',
};

/** 등급 키에 따른 한글 명칭 매핑 */
const GRADE_NAME: Partial<Record<MultiKey, string>> = {
  RELIC    : "에기르 유물",
  ANCIENT  : "에기르 고대",
  ANCIENT_2: "세르카 고대",
  ESTHER   : "에스더",
  ESTHER_E2: "에스더 엘라2",
  ESTHER_E3: "에스더 엘라3",
};

const ARK_PASSIVE_NAME: Record<string, string> = {
  'evolution': '진화',
  'insight'  : '깨달음',
  'leap'     : '도약',
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
    label     : string,
    type      : string,
    value     : number,
    subGroup? : string,
    target?   : PipelineEffectLog['target'],
    overrides?: PipelineEffectLog['overrides'],
    special?  : boolean,
    desc?     : string,
  ) => {
    if (!value && !overrides) return;

    // StatModifiers 직접 누산 (atk-calculator 입력용)
    const statField = STAT_MOD_FIELD_MAP[type];
    if (statField) (statMods as any)[statField] += value;

    pipelineLogs.push({ label, type, value, subGroup, target, overrides, special, desc });
  };

  // ── 1. 장비 기본 스탯 ────────────────
  display.equipment.forEach(eq => {
    const db = EQUIP_MAP.get(eq.id);
    if (!db) return;
    const gradeKey = eq.eqGrade as MultiKey;

    db.effects?.forEach(eff => {
      if (!('multiValues' in eff) || !eff.multiValues) return;
      
      const values = eff.multiValues[gradeKey];
      if (!values) return;

      const baseIdx = Math.max(0, (eq.refineLv ?? 1) - 1);
      let totalValue = values[Math.min(baseIdx, values.length - 1)] ?? 0;

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
        const advText   = eq.advRefineLv > 0 ? `(+${eq.advRefineLv})` : "";
        const gradeName = GRADE_NAME[gradeKey] ?? gradeKey;
        const label     = `${eq.name} ${gradeName} ${eq.refineLv}강${advText}`;
        push(label, eff.type, totalValue);
      }
    });
  });

  // ── 2. 악세서리 ────────────────────
  display.accessories.forEach(acc => {
    acc.effects.forEach(eff => {
      const db = ACCESSORY_MAP.get(eff.id);
      if (!db || !db.effects) return;

      db.effects.forEach(dbEff => {
        const label           = `${acc.type} ${db.category === 'BASE' ? '기본 효과' : '연마 효과'}`;
        const rawValue        = eff.values?.[0]?.value ?? 0;
        const standardizedVal = getStandardValue(dbEff.type, rawValue);
        push(label, dbEff.type, standardizedVal, dbEff.subGroup, dbEff.target);
      });
    });
  });

  // ── 3. 팔찌 ─────────────────────────
  display.bracelet?.effects.forEach(eff => {
    const db = BRACELET_MAP.get(eff.id);
    if (!db || !db.effects) return;
    
    db.effects.forEach((dbEff, idx) => {
      const label           = `팔찌 ${db.category === 'BASE' ? '기본 효과' : db.category === 'COMBAT' ? '전투 특성' : '특수 효과'}`;
      const rawValue        = eff.values?.[idx]?.value ?? 0;
      const standardizedVal = getStandardValue(dbEff.type, rawValue);
      if (standardizedVal !== 0) {
        push(label, dbEff.type, standardizedVal, dbEff.subGroup, dbEff.target);
      }
    });
  });

  // ── 4. 아바타 ─────────────────────────
  display.avatars.forEach(av => {
    const db = AVATAR_MAP.get(av.id);
    if (!db || !db.effects) return;

    db.effects.forEach(dbEff => {
      const label           = `아바타 ${av.label ?? av.name}`;
      const rawValue        = av.values?.[0]?.value ?? 0;
      const standardizedVal = getStandardValue(dbEff.type, rawValue);
      if (standardizedVal !== 0) {
        push(label, dbEff.type, standardizedVal, dbEff.subGroup, dbEff.target);
      }
    });
  });

  // ── 5. 각인 ─────────────────────────
  display.engravings.forEach(eng => {
    if (!eng.id) return;
    const db = ENGRAVING_MAP.get(eng.id);
    if (!db || !db.effects) return;

    const isRelicOrLegend = eng.eqGrade === 'RELIC';

    db.effects.forEach((eff) => {
      const baseValue = eff.value?.[0] ?? 0;
      let bonusValue  = 0;

      const relic          = db.bonus?.relic;
      const hasRelicBonus  = isRelicOrLegend && relic?.type === eff.type;
      if (hasRelicBonus && relic?.value) {
        bonusValue += relic.value[eng.level - 1] ?? 0;
      }
      
      const ability          = db.bonus?.ability;
      const hasAbilityBonus  = eng.abilityStoneLevel && ability?.type === eff.type;
      if (hasAbilityBonus && ability?.value) {
        bonusValue += ability.value[eng.abilityStoneLevel - 1] ?? 0;
      }

      const total = baseValue + bonusValue;
      if (total === 0) return;

      const finalizedValue = Math.round(total * 10000) / 10000;
      push(db.name, eff.type, finalizedValue, eff.subGroup, eff.target, (db as any).overrides, (db as any).special);
    });
  });

  // ── 6. 보석 ─────────────────────────
  let totalGemBaseAtkBonus = 0;

  display.gems.forEach(gem => {
    if (!gem.id) return;
    const db      = GEM_MAP.get(gem.id);
    if (!db || !db.effects) return;
    const skillID = getSkillMap(display.profile.className).get(gem.skillName)?.id;

    db.effects.forEach(eff => {
      if (eff.type === 'BASE_ATK_P') {
        totalGemBaseAtkBonus += eff.value?.[gem.level - 1] ?? 0;
        return;
      }
      const rawValue = eff.value?.[gem.level - 1] ?? 0;
      if (rawValue === 0) return;
      const finalizedValue = Math.round(rawValue * 10000) / 10000;
      push(
        gem.name, eff.type, finalizedValue, eff.subGroup,
        { ...eff.target, skillIds: skillID ? [skillID] : undefined }
      );
    });
  }); 
    
  if (totalGemBaseAtkBonus > 0) {
    const finalAtkBonus = Math.round(totalGemBaseAtkBonus * 10000) / 10000;
    push('보석 기본 공격력 보너스', 'BASE_ATK_P', finalAtkBonus);
  }

  // ── 7. 카드 ─────────────────────────
  if (display.cards?.id) {
    const db = CARD_MAP.get(display.cards.id);
    if (db?.effects) {
      const level = display.cards.level ?? 0;
      db.effects.forEach(eff => {
        if (!eff.value) return;
        const maxIdx    = eff.value.length - 1;
        const targetIdx = Math.min(Math.max(Math.floor(level / 6) - 3, 0), maxIdx);
        const accumulatedValue = eff.value
          .slice(0, targetIdx + 1)
          .reduce((sum, val) => sum + val, 0);
        if (accumulatedValue <= 0) return;
        push(`카드 ${display.cards?.name}`, eff.type, accumulatedValue, eff.subGroup, eff.target);
      });
    }
  }

  // ── 8. 아크패시브 ────────────────────
  const ARKPASSIVE_MAP = getArkPassiveNodeMap(display.profile.className);
  display.arkPassive?.effects.forEach((eff) => {
    const db = ARKPASSIVE_MAP.get(eff.id);
    if (!db) return;
    const label = `아크패시브:${eff.category.text} ${eff.name}`;

    db.effects?.forEach((dbEff) => {
      const levelIdx = Math.min(eff.level - 1, (dbEff.value?.length || 1) - 1);
      const val      = dbEff.value?.[levelIdx] ?? 0;
      val !== 0 && push(label, dbEff.type, val, dbEff.subGroup, dbEff.target, (db as any).overrides, (db as any).special);
    });
    if (db.overrides) {
      const { target, ...pureOverrides } = db.overrides;
      push(label, 'OVERRIDE', 0,  (db as any).subGroup, target, pureOverrides, (db as any).special);
    }
  });

  const points = display.arkPassive?.points;
  (['evolution', 'insight', 'leap'] as const).forEach((key) => {
    const userPoint = points?.[key];
    const rule      = ARK_PASSIVE_RULES[key];
    const level     = userPoint?.level ?? 0;
    if (level <= 0 || !rule) return;

    const { levelBonus: lv, rankBonus: rk } = rule.karma;
    const lvStep  = lv?.value?.[0] ?? 0;
    const lvValue = Math.round(level * lvStep * 10000) / 10000;
    lvValue !== 0 && push(
      `아크패시브:카르마 ${ARK_PASSIVE_NAME[key]} ${level}레벨`,
      lv!.type, lvValue, undefined, lv?.target
    );
    
    const rank    = level > 0 ? Math.min(6, Math.floor((level - 1) / 4) + 1) : 0;
    const rkStep  = rk?.value?.[0] ?? 0; 
    const rkValue = Math.round(rank * rkStep * 10000) / 10000;
    rkValue !== 0 && push(
      `아크패시브:카르마 ${ARK_PASSIVE_NAME[key]} ${rank}랭크`,
      rk!.type, rkValue, undefined, rk?.target
    );
  });

  // ── 9. 아크그리드 ────────────────────
  const ARKGRID_MAP = getArkGridMap(display.profile.className);
  display.arkGrid.cores.forEach((core) => {
    const db = ARKGRID_MAP.get(core.id);
    if (!db || !db.thresholds) return;

    const currentPoint = core.point;
    const gradeKey     = (core.eqGrade as MultiKey) || 'COMMON';
    db.thresholds.forEach((threshold) => {
      if (currentPoint < threshold.point) return;
      if (!threshold.effects) return;
      const label = `아크그리드:${db.name} (${threshold.point}pt)`;

      threshold.effects.forEach((dbEff) => {
        let value = 0;
        if (dbEff.multiValues) {
          value = dbEff.multiValues[gradeKey]?.[0] ?? 0;
        } else if (dbEff.value) {
          value = dbEff.value[0] ?? 0;
        }
        value !== 0 && push(label, dbEff.type, value, dbEff.subGroup, dbEff.target, (db as any).overrides, (db as any).special);
        
        if (db.overrides) {
          const { target, ...pureOverrides } = db.overrides;
          push(label, 'OVERRIDE', 0, (db as any).subGroup, target, pureOverrides, (db as any).special);
        }
      });
    });
  });

  display.arkGrid.effects.forEach(eff => {
    const rule  = ARK_GRID_EFFECT_RULES[eff.label];
    const level = eff.level ?? 0;
    if (level <= 0 || !rule) return;
    const step       = rule?.value?.[0] ?? 0; 
    const finalValue = Math.round(level * step * 10000) / 10000;
    finalValue !== 0 && push(`아크그리드 ${eff.label} Lv.${level}`, rule.type, finalValue);
  });

  return { pipelineLogs, statMods };
};


// ============================================================
// 콘솔 디버그
// ============================================================

/**
 * effectLog 배열을 콘솔 테이블용 행으로 변환
 */
const logsToTableRows = (logs: PipelineEffectLog[]) =>
  logs.map(l => ({
    출처    : l.label,
    타입    : l.type,
    값      : l.value,
    subGroup: l.subGroup ?? '-',
    desc    : l.desc     ?? '-',
  }));

/**
 * BufferMap에서 특정 type의 EffectRow를 콘솔 출력용 행으로 변환
 *
 * [기존 debugPipeline의 bufferTypeToRows와 동일하나]
 *  이제 skillCalcLogs를 기준으로 역탐색합니다.
 *  (atkDetailLogs는 버퍼에 포함되지 않으므로 역탐색 대상에서 제외)
 */

const debugPipeline = (
  statMods : StatModifiers,
  results  : SkillDamageResult[],
  debug    : PipelineDebugData,
): void => {
  // run-pipeline에서 분류된 로그를 직접 참조 (재분류 불필요)
  const { atkDetailLogs, staticLogs, dynamicLogs, specialLogs, skillDetailLogs } = debug;

  // skillCalcLogs = staticLogs + dynamicLogs + specialLogs
  // (버퍼 역탐색 시 공격력 로그 제외)
  const skillCalcLogs = [...staticLogs, ...dynamicLogs, ...specialLogs];

  console.group('🚀 [파이프라인 디버그]');
    console.groupCollapsed('All effectLogs');
      console.table(debug.inputLogs.map(l => ({
        출처    : l.label,
        타입    : l.type,
        값      : l.value,
        target: l.target ? JSON.stringify(l.target) : '-',
        subGroup: l.subGroup ?? '-',
        override: l.overrides ? JSON.stringify(l.overrides) : '-',
        special: l.special ? '✅' : '❌',
        desc    : l.desc     ?? '-',
      })));
    console.groupEnd();

    // ── 📋 0단계: 스킬 특성 확정 ────────────────────────────
    console.groupCollapsed(`📋 0단계: 스킬 특성 확정 (${debug.step0_resolvedSkills.length}개 스킬)`);
      console.table(debug.step0_resolvedSkills.map(skill => ({
        스킬명  : skill.skillName,
        Lv      : skill.level,  
        카테고리: skill.categories.join(' / '),
        스킬타입: skill.typeId,
        공격타입: skill.attackId,
        쿨타임  : `${skill.cooldown}초`,
        자원타입: skill.resourceType ?? '-',
        기운소모: skill.cost ?? '-',
        트라이포드: skill.appliedTripods.join(', ') || '없음'
      })));
    console.groupEnd();

    console.groupCollapsed("📊 피해원(Sources) 상세 수치 검증");
      console.table(debug.step0_resolvedSkills.flatMap(skill => 
        skill.sources.map(s => ({
          부모스킬: skill.skillName,
          피해원명: s.name,
          타수    : s.hits,
          상수    : s.constant.toLocaleString(),
          계수    : s.coefficient.toFixed(2),
          합산여부: s.isCombined ? '✅' : '❌'
        }))
      ));
    console.groupEnd();

    // ── 📊 StatModifiers ────────────────────────────────────
    console.groupCollapsed('📊 StatModifiers (장비/악세 기본 스탯 누산값)');
    const nonZeroStats = Object.entries(statMods).filter(([, v]) => v !== 0);
    nonZeroStats.length > 0
      ? console.table(nonZeroStats.map(([k, v]) => ({ 필드: k, 값: v })))
      : console.log('(모두 0 — 장비 DB 매칭 확인 필요)');
    console.groupEnd();

    // ── ⚙️ 공격력 4종 계산 ──────────────────────────────────
    // atkDetailLogs: run-pipeline에서 분리된 공격력 전용 로그
    console.groupCollapsed('⚙️ 공격력 4종 계산');
    const atk = debug.atkStats;

    const weaponAtkLogs = atkDetailLogs.filter(l => l.type === 'WEAPON_ATK_C' || l.type === 'WEAPON_ATK_P');
    console.group(`  최종 무기공격력: ${atk.weaponAtk.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
    console.table(logsToTableRows(weaponAtkLogs));
    console.groupEnd();

    const mainStatLogs = atkDetailLogs.filter(l => l.type === 'MAIN_STAT_C' || l.type === 'MAIN_STAT_P');
    console.group(`  최종 주스탯: ${atk.mainStat.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
    console.table(logsToTableRows(mainStatLogs));
    console.groupEnd();

    const atkLogs = atkDetailLogs.filter(l => l.type === 'ATK_C' || l.type === 'ATK_P' || l.type === 'BASE_ATK_P');
    console.group(`  기본공격력: ${atk.baseAtk.toLocaleString(undefined, { maximumFractionDigits: 0 })}  →  최종공격력: ${atk.finalAtk.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
    console.log(`  📐 √(주스탯${atk.mainStat.toFixed(0)} × 무기공격력${atk.weaponAtk.toFixed(0)} / 6) = ${atk.baseAtk.toFixed(0)}`);
    if (atkLogs.length > 0) console.table(logsToTableRows(atkLogs));
    console.groupEnd();

    console.groupEnd(); // ⚙️ 공격력

    // ── 🔵 1단계: Static 로그 ───────────────────────────────
    // run-pipeline에서 분류된 staticLogs 직접 사용
    console.groupCollapsed(`🔵 1단계: Static 로그 — 모든 스킬 공통 적용 (${staticLogs.length}개)`);
    staticLogs.length > 0
      ? console.table(logsToTableRows(staticLogs))
      : console.log('(없음)');
    console.groupEnd();

    // ── 🟡 2단계: Dynamic 로그 ──────────────────────────────
    console.groupCollapsed(`🟡 2단계: Dynamic 로그 — 스킬별 조건부 효과 (${dynamicLogs.length}개)`);
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

    // ── 🟠 3단계: Special 로그 ──────────────────────────────
    console.groupCollapsed(`🟠 3단계: Special 로그 (${specialLogs.length}개)`);
    specialLogs.length > 0
      ? console.table(logsToTableRows(specialLogs))
      : console.log('(없음)');
    console.groupEnd();

    // ── 🎯 확정: 스킬별 DamageModifiers ─────────────────────
    // skillDetailLogs(run-pipeline 생성)에서 bufferRows를 직접 참조
    console.group('🎯 확정: 스킬별 DamageModifiers');

    Object.entries(skillDetailLogs).forEach(([id, detail]: [string, any]) => {
    console.groupCollapsed(`  🗡️ ${detail.skillName}`);

    // 파이프라인에서 이미 분류해준 groups를 순회[cite: 8]
    Object.values(detail.groups).forEach((group: any) => {
      // 수치 포맷팅 로직만 가볍게 유지[cite: 8]
      const displayValue = typeof group.finalValue === 'number' 
        ? group.finalValue.toFixed(4) 
        : group.finalValue;

      console.group(`    ${group.label}: ${displayValue}`);
      console.table(group.rows.map((r: any) => ({
        출처: r.label,
        타입: r.type,
        값: r.value,
        그룹: r.subGroup,
        설명: r.desc
      })));
      console.groupEnd();
    });

    console.groupEnd();
  });

  console.groupEnd(); // 🎯 확정 종료


    // ── ⚪ 최종: 스킬 피해량 ────────────────────────────────
    console.groupCollapsed(`⚪ 최종: 스킬 피해량 (${results.length}개)`);
    const summaryRows = results
      .sort((a, b) => b.totalDamage - a.totalDamage)
      .map(r => {
        const row: Record<string, string> = {
          스킬명  : r.skillName,
          총피해량: r.totalDamage.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        };
        r.sources.forEach(s => {
          const label = `${s.name}(${s.isCombined ? '합' : '별'})`;
          row[label]  = s.damage.toLocaleString(undefined, { maximumFractionDigits: 0 });
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
  displayData         : CharacterDisplayData | null;
  skillDamageResults  : SkillDamageResult[];
  pipelineDebug       : PipelineDebugData | null;
  setDisplayData      : (data: CharacterDisplayData) => void;
}


// ============================================================
// useSimulatorStore
// ============================================================

export const useSimulatorStore = (): SimulatorStore => {
  const [displayData, setDisplayDataState] =
    useState<CharacterDisplayData | null>(null);

  const [skillDamageResults, setSkillDamageResults] =
    useState<SkillDamageResult[]>([]);

  /** UI 상세 모달 등에서 직접 소비할 수 있도록 debug 전체를 상태로 보관 */
  const [pipelineDebug, setPipelineDebug] =
    useState<PipelineDebugData | null>(null);

  useEffect(() => {
    if (!displayData) {
      setSkillDamageResults([]);
      setPipelineDebug(null);
      return;
    }

    const { pipelineLogs, statMods } = collectEffectLogs(displayData);

    const combatInfo = {
      baseAtk       : displayData.combatStats.attackPower,
      specialization: displayData.combatStats.specialization,
    };

    const { results, debug } = runPipeline(displayData, pipelineLogs, statMods, combatInfo);

    setSkillDamageResults(results);
    setPipelineDebug(debug);
    debugPipeline(statMods, results, debug);

  }, [displayData]);

  const setDisplayData = (data: CharacterDisplayData) =>
    setDisplayDataState(data);

  return { displayData, setDisplayData, skillDamageResults, pipelineDebug };
};