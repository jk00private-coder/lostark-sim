// @/hooks/useCalculatorStore.ts
"use client";

import { useState, useEffect } from 'react';
import { CharacterDisplayData } from '@/types/character-types';
import {
  CombatStats, StatModifiers, DamageModifiers,
  CommonEffectTypeId, EFFECT_MAP, SUB_GROUPS,
} from '@/types/sim-types';
import {
  GkClassModifiers, GkEffectTypeId, GK_EFFECT_MAP,
  ClassEffectMapEntry, createEmptyGkClassModifiers,
} from '@/types/skills/guardian-knight-effects';
import { ENGRAVINGS_DB } from '@/data/engravings';
import {
  calcWeaponAtk,
  calcMainStat,
  calcFinalAtk,
} from '@/utils/atk-calculator';


// ============================================================
// EffectLog 타입
// ============================================================

/**
 * 개별 효과 적용 기록
 *
 * applyEffect() 호출 시마다 이 형태로 로그를 쌓습니다.
 * 디버그 패널에서 effectType 별로 그룹핑하여 표시합니다.
 *
 * @param label     - 출처 이름 (예: "원한", "목걸이 추가피해", "보석 공증")
 * @param type      - EffectTypeId (예: "DMG_INC", "CRIT_DMG")
 * @param value     - 적용된 수치 (소수, 예: 0.21)
 * @param operation - 연산 방식 (ADD | MULTIPLY)
 */
export interface EffectLog {
  label   : string;
  type    : string;
  value   : number;   // ColoredValue.value (계산용 순수 수치)
  subGroup?: string;
}

// calcModifiersFromLog
const calcModifiersFromLog = (
  logs      : EffectLog[],
  statMods  : StatModifiers,
  damageMods: DamageModifiers,
  classMods : GkClassModifiers,
) => {
  // type별 그룹핑
  const typeMap: Record<string, EffectLog[]> = {};
  logs.forEach(log => {
    if (!typeMap[log.type]) typeMap[log.type] = [];
    typeMap[log.type].push(log);
  });

  Object.entries(typeMap).forEach(([type, typeLogs]) => {
    const entry = EFFECT_MAP[type as CommonEffectTypeId];
    if (!entry) return;

    const statMod   = statMods   as unknown as Record<string, number>;
    const damageMod = damageMods as unknown as Record<string, number>;
    const targetMod = Object.prototype.hasOwnProperty.call(statMods, entry.field)
      ? statMod : damageMod;

    // subGroup별 재그룹핑
    // subGroup 없음 → 각 항목 인덱스를 키로 사용 (독립 곱연산)
    const groupMap: Record<string, number[]> = {};
    typeLogs.forEach((log, idx) => {
      const key = log.subGroup ?? `__solo_${idx}`;
      if (!groupMap[key]) groupMap[key] = [];
      groupMap[key].push(log.value);
    });

    // 그룹별 합산 후 독립 곱연산
    Object.values(groupMap).forEach(values => {
      const groupSum = values.reduce((s, v) => s + v, 0);
      targetMod[entry.field] *= (1 + groupSum);
    });
  });

  // GK 직업 특수 타입
  logs.forEach(log => {
    const entry = GK_EFFECT_MAP[log.type as GkEffectTypeId] as ClassEffectMapEntry | undefined;
    if (!entry) return;
    classMods[entry.field] += log.value;
  });
};

// ============================================================
// CalcData 타입
// ============================================================

/**
 * 계산 엔진이 소비하는 수치 묶음
 *
 * effectLog: 효과 적용 이력 (디버그 패널 표시용)
 *   type 별로 그룹핑하면 출처별 내역 확인 가능
 * classModifiers: 직업별 특수 보정치
 *   현재는 가디언나이트만 구현
 *   추후 직업별 유니온으로 확장 가능
 */
export interface CalcData {
  combatStats    : CombatStats;
  statModifiers  : StatModifiers;
  damageModifiers: DamageModifiers;
  classModifiers : GkClassModifiers | null;
  effectLog      : EffectLog[];  // ← 추가
  // 추후: | SorcClassModifiers | null 등 유니온 확장
}


// ============================================================
// 초기값 생성 함수
// ============================================================

const createEmptyCombatStats = (): CombatStats => ({
  baseAtk: 0, mainStat: 0, weaponAtk: 0, finalAtk: 0,
  critical: 0, specialization: 0, swiftness: 0,
  hp: 0, domination: 0, endurance: 0, expertise: 0,
});

const createEmptyStatModifiers = (): StatModifiers => ({
  mainStatC: 0, mainStatP: 0,
  weaponAtkC: 0, weaponAtkP: 0,
  baseAtkP: 0, atkC: 0, atkP: 0,
});

/**
 * DamageModifiers 초기값
 * MULTIPLY 계열(damageInc, critDamageInc)은 1.0
 * ADD 계열은 0
 * critDamage 기본값 2.0 (기본 치명타 피해 200%)
 */
const createEmptyDamageModifiers = (): DamageModifiers => ({
  damageInc    : 1.0,  // MULTIPLY 초기값
  critDamageInc: 1.0,  // MULTIPLY 초기값
  cdrC    : 0,
  cdrP    : 0,
  evoDamage        : 0,
  addDamage        : 0,
  critChance       : 0,
  critDamage       : 2.0,  // 기본 치명타 피해 200%
  defPenetration   : 0,
  enemyDamageTaken : 0,
  atkSpeed: 0,
  movSpeed: 0,
});

const createEmptyCalcData = (): CalcData => ({
  combatStats    : createEmptyCombatStats(),
  statModifiers  : createEmptyStatModifiers(),
  damageModifiers: createEmptyDamageModifiers(),
  classModifiers : createEmptyGkClassModifiers(),
  effectLog      : [],  // ← 추가
});


// ============================================================
// extractCalcData
// ============================================================

/** 
 * Record → 순서 보장 배열로 변경
 * '피해 감소'를 '피해'보다 먼저 검사해서 오매칭 방지
 * 속성명(성/암/화 등)이 앞에 붙어도 키워드 포함 여부로 판단하므로
 * '피해 감소' 먼저 체크 → 매칭 시 스킵, 이후 '피해' 체크
 */
const CARD_EFFECT_LIST: Array<[string, CommonEffectTypeId | null]> = [
  ['피해 감소'  , null          ],  // null = 딜 계산 무관, 무시
  ['피해'       , 'DMG_INC'    ],
  ['공격력'     , 'ATK_P'      ],
  ['치명타 피해', 'CRIT_DMG'   ],
  ['치명타 확률', 'CRIT_CHANCE'],
];

/** 아크그리드 효과명 → EffectTypeId 매핑 */
const ARK_GRID_EFFECT_MAP: Record<string, CommonEffectTypeId> = {
  '공격력': 'ATK_P',
  '보스 피해': 'DMG_INC',
  '추가 피해': 'ADD_DMG',
};

/**
 * CharacterDisplayData → CalcData 추출
 *
 * [applyEffect 처리 순서]
 *   1. EFFECT_MAP 공통 타입 → statModifiers / damageModifiers 누적
 *   2. GK_EFFECT_MAP 가디언나이트 타입 → classModifiers 누적
 *   3. effectLog 에 출처 이름(label) + 타입 + 수치 기록
 *   4. 둘 다 없는 타입 → 무시 (특수 계산은 계산 엔진에서 처리)
 */
const extractCalcData = (display: CharacterDisplayData): CalcData => {

  const combatStats     = createEmptyCombatStats();
  const statModifiers   = createEmptyStatModifiers();
  const damageModifiers = createEmptyDamageModifiers();
  const classModifiers  = createEmptyGkClassModifiers();
  const effectLog       : EffectLog[] = [];

  // ── 단순 로그 수집 (즉시 누적 없음, 마지막에 일괄 계산) ──
  const applyEffect = (
    label   : string,
    type    : string,
    value   : number,
    subGroup?: string,
  ) => {
    effectLog.push({ label, type, value, subGroup });
  };

  // ── 1. 전투 특성 ──────────────────────────────────────────
  combatStats.critical       = display.combatStats.critical;
  combatStats.specialization = display.combatStats.specialization;
  combatStats.swiftness      = display.combatStats.swiftness;
  combatStats.domination     = display.combatStats.domination;
  combatStats.endurance      = display.combatStats.endurance;
  combatStats.expertise      = display.combatStats.expertise;
  combatStats.hp             = display.combatStats.maxHp;
  combatStats.baseAtk        = display.combatStats.attackPower;

  // ── 2. 장비 효과 ──────────────────────────────────────────
  display.equipment.forEach(eq =>
    eq.effects?.forEach(eff =>
      applyEffect(`${eq.type} ${eff.type}`, eff.type, eff.value.value, eff.subGroup)
    )
  );

  // ── 3. 악세서리 연마효과 ──────────────────────────────────
  display.accessories.forEach(acc =>
    acc.polishEffects.forEach(eff =>
      applyEffect(`${acc.type} ${eff.type}`, eff.type, eff.value.value, eff.subGroup)
    )
  );

  // ── 4. 팔찌 효과 (랜덤 옵션만) ───────────────────────────
  display.bracelet?.effects.forEach(eff => {
    if (!eff.isFixed)
      applyEffect(`팔찌 ${eff.type}`, eff.type, eff.value.value, eff.subGroup);
  });

  // ── 5. 아바타 주스탯 보너스 ───────────────────────────────
  const totalAvatarBonus = display.avatars.reduce(
    (sum, av) => sum + av.mainStatBonus, 0
  );
  applyEffect('아바타 주스탯', 'MAIN_STAT_P', totalAvatarBonus);

  // ── 6. 각인 효과 ──────────────────────────────────────────
  display.engravings.forEach(eng => {
    const db = ENGRAVINGS_DB.find(e => e.name.text === eng.name.text);
    if (!db?.effects) return;
    db.effects.forEach(eff =>
      applyEffect(eng.name.text, eff.type, eff.value.value, eff.subGroup)
    );
  });

  // ── 7. 보석 공증 ──────────────────────────────────────────
  applyEffect('보석 공증', 'BASE_ATK_P', display.gems.totalBaseAtk.value);

  // ── 8. 카드 효과 ──────────────────────────────────────────
  display.cards?.activeItems.forEach(item => {
    if (!item.value) return;
    for (const [keyword, effectType] of CARD_EFFECT_LIST) {
      if (item.description.includes(keyword)) {
        if (effectType !== null) {
          // 카드 DMG_INC 는 subGroup: 'card' 로 합산
          const subGroup = effectType === 'DMG_INC' ? SUB_GROUPS.CARD : undefined;
          applyEffect(`카드 ${keyword}`, effectType, item.value.value, subGroup);
        }
        break;
      }
    }
  });

  // ── 9. 아크그리드 효과 ────────────────────────────────────
  display.arkGrid.effects.forEach(eff => {
    const effectType = ARK_GRID_EFFECT_MAP[eff.label.text];
    if (effectType)
      applyEffect(`아크그리드 ${eff.label.text}`, effectType, eff.value.value);
  });

  // ── 10. effectLog → Modifiers 일괄 계산 ──────────────────
  calcModifiersFromLog(effectLog, statModifiers, damageModifiers, classModifiers);

  // ── 11. 공격력 3종 계산 ───────────────────────────────────
  combatStats.weaponAtk = calcWeaponAtk(
    statModifiers.weaponAtkC,
    statModifiers.weaponAtkP,
  );
  combatStats.mainStat = calcMainStat(
    combatStats.baseAtk,
    statModifiers.baseAtkP,
    combatStats.weaponAtk,
  );
  const atkPLogs = effectLog.filter(l => l.type === 'ATK_P');
  combatStats.finalAtk = calcFinalAtk(
    combatStats.baseAtk,
    statModifiers.atkC,
    atkPLogs,
  );

  return { combatStats, statModifiers, damageModifiers, classModifiers, effectLog };
};


// ============================================================
// useCalculatorStore
// ============================================================

export const useCalculatorStore = () => {

  const [displayData, setDisplayDataState] =
    useState<CharacterDisplayData | null>(null);

  const [calcData, setCalcData] = useState<CalcData>(createEmptyCalcData());

  useEffect(() => {
    if (!displayData) {
      setCalcData(createEmptyCalcData());
      return;
    }
    setCalcData(extractCalcData(displayData));
  }, [displayData]);

  const setDisplayData = (data: CharacterDisplayData) => setDisplayDataState(data);

  const overrideCalcData = (partial: Partial<CalcData>) => {
    setCalcData(prev => ({ ...prev, ...partial }));
  };

  return {
    displayData,
    setDisplayData,
    calcData,
    overrideCalcData,
  };
};