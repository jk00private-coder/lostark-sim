/**
 * @/engine/skill-damage-runner.ts
 *
 * 캐릭터의 전체 스킬 피해량 계산 진입점
 *
 * [역할]
 *   1. DisplayData의 스킬 목록 순회
 *   2. 스킬 이름으로 DB 조회
 *   3. 선택된 트라이포드 DB 조회
 *   4. resolveSkill → 트라이포드 적용
 *   5. 스킬 전용 effectLog → 스킬별 DamageModifiers 생성
 *   6. calcSourceDamage / calcHyperUltimateDamage 호출
 *   7. SkillDamageResult 목록 반환
 *
 * [직업 DB 매핑]
 *   className → 해당 직업 스킬 DB
 *   현재: 가디언나이트만 구현
 */

import { CharacterDisplayData, SkillDisplay } from '@/types/character-types';
import { CalcData, EffectLog }                 from '@/hooks/useCalculatorStore';
import { SkillData, TripodData }               from '@/types/skill';
import {
  DamageModifiers,
  CommonEffectTypeId,
  EFFECT_MAP,
  SkillCategory,
} from '@/types/sim-types';
import { resolveSkill }                        from '@/engine/skill-resolver';
import {
  calcSourceDamage,
  calcHyperUltimateDamage,
  SkillDamageResult,
  DamageSourceResult,
}                                              from '@/engine/damage-calculator';
import { SKILLS_GUARDIAN_KNIGHT_DB }           from '@/data/skills/guardian-knight-skills';


// ============================================================
// 직업 → 스킬 DB 매핑
// ============================================================

/** 직업명 → 스킬 DB */
const CLASS_SKILL_DB: Record<string, SkillData[]> = {
  '가디언나이트': SKILLS_GUARDIAN_KNIGHT_DB,
};


// ============================================================
// 스킬별 DamageModifiers 생성
// ============================================================

/**
 * 기본 DamageModifiers에 스킬/트라이포드 전용 effectLog를 추가 적용
 * 원본 dmgMods를 변경하지 않고 새 객체로 반환
 *
 * @param baseMods       - 캐릭터 전체 DamageModifiers
 * @param skillLogs      - 스킬/트라이포드 전용 effectLog
 * @param skillId        - 현재 스킬 ID (target 필터용)
 * @param categories     - 스킬 카테고리 목록 (target 필터용)
 * @param typeId         - 스킬 타입 (target 필터용)
 */
const buildSkillDamageModifiers = (
  baseMods  : DamageModifiers,
  skillLogs : EffectLog[],
  skillId   : number,
  categories: SkillCategory[],
): DamageModifiers => {
  // 깊은 복사
  const mods: DamageModifiers = { ...baseMods };

  if (skillLogs.length === 0) return mods;

  // type별 그룹핑
  const typeMap: Record<string, EffectLog[]> = {};
  skillLogs.forEach(log => {
    if (!typeMap[log.type]) typeMap[log.type] = [];
    typeMap[log.type].push(log);
  });

  Object.entries(typeMap).forEach(([type, typeLogs]) => {
    const entry = EFFECT_MAP[type as CommonEffectTypeId];
    if (!entry) return;

    const mod = mods as unknown as Record<string, number>;

    // subGroup별 합산 후 독립 곱연산
    const groupMap: Record<string, number[]> = {};
    typeLogs.forEach((log, idx) => {
      const key = log.subGroup ?? `__solo_${idx}`;
      if (!groupMap[key]) groupMap[key] = [];
      groupMap[key].push(log.value);
    });

    Object.values(groupMap).forEach(values => {
      const sum = values.reduce((s, v) => s + v, 0);
      mod[entry.field] *= (1 + sum);
    });
  });

  return mods;
};


// ============================================================
// 카테고리 판별 헬퍼
// ============================================================

const isHyperUltimate = (categories: SkillCategory[]): boolean =>
  categories.includes('HYPER_ULTIMATE');

const isUltimate = (categories: SkillCategory[]): boolean =>
  categories.includes('ULTIMATE') || categories.includes('HYPER_ULTIMATE');


// ============================================================
// 초각성기 피해 증가 배율 추출
// ============================================================

/**
 * effectLog에서 HYPER_ULTIMATE 카테고리 대상 DMG_INC 합산
 * calcHyperUltimateDamage에 전달할 배율 계산
 */
const getHyperUltimateInc = (effectLog: EffectLog[]): number => {
  // TODO: target.categories 필터링은 엔진 고도화 시 추가
  // 현재는 전체 DMG_INC를 그대로 사용
  return 1.0;
};


// ============================================================
// 선택된 트라이포드 DB 조회
// ============================================================

/**
 * DisplayData의 selectedTripods(이름 기반)를
 * 스킬 DB의 TripodData(ID 기반)로 변환
 */
const resolveSelectedTripods = (
  skillDb         : SkillData,
  displayTripods  : SkillDisplay['selectedTripods'],
): TripodData[] => {
  if (!skillDb.tripods) return [];

  return displayTripods
    .map(dt => skillDb.tripods!.find(
      t => t.slot === dt.slot && t.name === dt.name.text
    ))
    .filter((t): t is TripodData => t !== undefined);
};


// ============================================================
// 메인: 전체 스킬 피해량 계산
// ============================================================

/**
 * 캐릭터 전체 스킬 피해량 계산
 *
 * @param display  - CharacterDisplayData
 * @param calcData - useCalculatorStore의 CalcData
 * @returns SkillDamageResult 배열
 */
export const runSkillDamage = (
  display : CharacterDisplayData,
  calcData: CalcData,
): SkillDamageResult[] => {
  const skillDb = CLASS_SKILL_DB[display.profile.className];
  if (!skillDb) return [];

  const results: SkillDamageResult[] = [];

  display.skills.forEach(displaySkill => {
    // DB에서 스킬 찾기
    const dbSkill = skillDb.find(s => s.name === displaySkill.name);
    if (!dbSkill) return;

    // 선택된 트라이포드 DB 매핑
    const selectedTripods = resolveSelectedTripods(dbSkill, displaySkill.selectedTripods);

    // resolveSkill: 트라이포드 적용 후 계산 준비
    const resolved = resolveSkill(dbSkill, displaySkill.level, selectedTripods);

    // 스킬 전용 DamageModifiers 생성
    const skillMods = buildSkillDamageModifiers(
      calcData.damageModifiers,
      resolved.skillEffectLogs,
      resolved.skillId,
      resolved.categories,
    );

    const hyperUltimateInc = isHyperUltimate(resolved.categories)
      ? getHyperUltimateInc(calcData.effectLog)
      : 1.0;

    // 피해원별 계산
    const sources: DamageSourceResult[] = resolved.sources.map(src => {
      const damage = isHyperUltimate(resolved.categories)
        ? calcHyperUltimateDamage(
            src.input,
            calcData.combatStats.baseAtk,
            skillMods,
            hyperUltimateInc,
          )
        : calcSourceDamage(
            src.input,
            calcData.combatStats.finalAtk,
            skillMods,
            isUltimate(resolved.categories),
          );

      return {
        name      : src.name,
        damage,
        isCombined: src.isCombined,
      };
    });

    // isCombined=true 피해원 합산
    const totalDamage = sources
      .filter(s => s.isCombined)
      .reduce((sum, s) => sum + s.damage, 0);

    results.push({
      skillName  : resolved.skillName,
      totalDamage,
      sources,
    });
  });

  return results;
};