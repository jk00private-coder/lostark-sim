/**
 * @/data/skills/guardian-knight-skills.ts
 *
 * 가디언나이트 스킬 DB
 *
 * [설계 원칙]
 *   - GK_SKILL_IDS 를 이 파일에서 직접 정의합니다.
 *   - effects → EffectEntry (type, value, operation, target?)
 *   - memo    → 계산 무관 메모
 *   - target.skillCategory 로 발현/화신 구분
 *
 * ⚠️ 화상/폭발 등 addDamageSources 의 임시값은 추후 실제값으로 교체 필요
 * ⚠️ QI_SPECIALIZATION_COEFF 는 guardian-knight-effects.ts 에서 관리
 */

import { SkillData } from '@/types/skill';
import { GkEffectTypeId } from '@/types/skills/guardian-knight-effects';


// ============================================================
// 스킬 ID 상수
// ============================================================

export const GK_SKILL_IDS = {
  CLEAVE             : 'GK_CLEAVE',
  RENDING_FINISHER   : 'GK_RENDING_FINISHER',
  EXPLOSION_FINISHER : 'GK_EXPLOSION_FINISHER',
  DEEP_IMPACT        : 'GK_DEEP_IMPACT',
  GUARDIAN_BACKRASH  : 'GK_GUARDIAN_BACKRASH',
  BREATH_OF_EMBERES  : 'GK_BREATH_OF_EMBERES',
} as const;

export type GkSkillId = typeof GK_SKILL_IDS[keyof typeof GK_SKILL_IDS];


// ============================================================
// 스킬 DB
// ============================================================

export const GUARDIAN_KNIGHT_SKILLS_DB: SkillData[] = [

  // ──────────────────────────────────────────────────────────
  // 클리브 (일반)
  // ──────────────────────────────────────────────────────────
  {
    source: 'SKILL',
    id    : GK_SKILL_IDS.CLEAVE,
    name  : '클리브',
    iconPath    : '',
    category    : ['BASIC'],
    typeId      : 'NORMAL',
    attackId    : 'NON_DIRECTIONAL',
    destruction : 0,
    stagger     : '',
    superArmorId: 'NONE',
    cooldown    : 6,

    levels: {
      isStatic: false,
      damageSources: [{
        name: '1타', isCombined: true, hits: 1,
        constants   : [1201, 1202, 1202, 1202, 1202],
        coefficients: [6.5305316091954, 7.1044540229885, 7.4584770114943,
                       7.7354885057471, 7.9814655172414],
      }],
    },

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        source: 'TRIPOD', id: 'GK_CLEAVE_A1', name: '피해증폭', iconPath: '',
        slot: 1, index: 1,
        effects: [{
          type: 'TARGET_DMG_TAKEN', value: 0.06, operation: 'ADD',
          target: { skillId: GK_SKILL_IDS.CLEAVE },
        }],
      },
      {
        source: 'TRIPOD', id: 'GK_CLEAVE_A2', name: '돌진', iconPath: '',
        slot: 1, index: 2,
        memo: [{ type: '이동 거리 증가', value: 4 }],
      },
      {
        source: 'TRIPOD', id: 'GK_CLEAVE_A3', name: '재빠른 손놀림', iconPath: '',
        slot: 1, index: 3,
        memo: [{ type: '시전 속도 증가', value: 0.1 }],
      },

      // ── 2티어 ─────────────────────────────────────────────
      {
        source: 'TRIPOD', id: 'GK_CLEAVE_B1', name: '증강', iconPath: '',
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: 0.04, operation: 'MULTIPLY',
          target: { skillId: GK_SKILL_IDS.CLEAVE },
        }],
        memo: [{ type: '기운 추가 회복', value: 1 }],
      },
      {
        source: 'TRIPOD', id: 'GK_CLEAVE_B2', name: '약육강식', iconPath: '',
        slot: 2, index: 2,
        memo: [{ type: '하급 및 일반 몬스터에게 주는 피해', value: 1.2 }],
      },
      {
        source: 'TRIPOD', id: 'GK_CLEAVE_B3', name: '약점 포착', iconPath: '',
        slot: 2, index: 3,
        effects: [{
          type: 'DMG_INC', value: 0.6, operation: 'MULTIPLY',
          target: { skillId: GK_SKILL_IDS.CLEAVE },
        }],
      },

      // ── 3티어 ─────────────────────────────────────────────
      {
        source: 'TRIPOD', id: 'GK_CLEAVE_C1', name: '화염 폭풍', iconPath: '',
        slot: 3, index: 1,
        effects: [{
          type: 'DMG_INC', value: 0.6, operation: 'MULTIPLY',
          target: { skillId: GK_SKILL_IDS.CLEAVE },
        }],
        // ⚠️ 화상 계수/상수 임시값
        addDamageSources: {
          isStatic: false,
          damageSources: [{
            name: '화상', isCombined: false, hits: 6,
            constants   : [10, 10, 10, 10, 10],
            coefficients: [10, 10, 10, 10, 10],
          }],
        },
      },
      {
        source: 'TRIPOD', id: 'GK_CLEAVE_C2', name: '휩쓸기', iconPath: '',
        slot: 3, index: 2,
        effects: [{
          type: 'DMG_INC', value: 0.7, operation: 'MULTIPLY',
          target: { skillId: GK_SKILL_IDS.CLEAVE },
        }],
        memo: [{ type: '공격 범위 증가', value: 0.3 }],
      },
    ],
  },


  // ──────────────────────────────────────────────────────────
  // 렌딩 피니셔 (발현)
  // ──────────────────────────────────────────────────────────
  {
    source: 'SKILL',
    id    : GK_SKILL_IDS.RENDING_FINISHER,
    name  : '렌딩 피니셔',
    iconPath    : '',
    category    : ['ENLIGHTEN'],
    resource    : { typeId: 'QI_EMBERES', isStatic: true, value: 6 },
    typeId      : 'NORMAL',
    attackId    : 'NON_DIRECTIONAL',
    destruction : 0,
    stagger     : '중상',
    superArmorId: 'STIFF_IMMUNE',
    cooldown    : 30,

    levels: {
      isStatic: false,
      damageSources: [{
        name: '1타', isCombined: true, hits: 1,
        constants   : [3452, 3454, 3455, 3456, 3456],
        coefficients: [18.7566810344828, 20.4045258620690, 21.4204741379310,
                       22.2153735632184, 22.9224137931034],
      }],
    },

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        source: 'TRIPOD', id: 'GK_RENDING_FINISHER_A1', name: '재빠른 손놀림', iconPath: '',
        slot: 1, index: 1,
        memo: [{ type: '시전 속도 증가', value: 0.15 }],
      },
      {
        source: 'TRIPOD', id: 'GK_RENDING_FINISHER_A2', name: '단단한 비늘', iconPath: '',
        slot: 1, index: 2,
        memo: [{ type: '스킬 시전 중 받는 피해 감소', value: 0.2 }],
      },
      {
        source: 'TRIPOD', id: 'GK_RENDING_FINISHER_A3', name: '정면 승부', iconPath: '',
        slot: 1, index: 3,
        overrides: { attackId: 'HEAD_ATK' },
      },

      // ── 2티어 ─────────────────────────────────────────────
      {
        source: 'TRIPOD', id: 'GK_RENDING_FINISHER_B1', name: '응축된 힘', iconPath: '',
        slot: 2, index: 1,
        link    : { slot: 3, index: 1 },
        overrides: { typeId: 'CHARGE', superArmorId: 'PUSH_IMMUNE' },
        effects: [{
          type: 'DMG_INC', value: 0.5, operation: 'MULTIPLY',
          target: { skillId: GK_SKILL_IDS.RENDING_FINISHER },
        }],
      },
      {
        source: 'TRIPOD', id: 'GK_RENDING_FINISHER_B2', name: '약점 포착', iconPath: '',
        slot: 2, index: 2,
        link   : { slot: 3, index: 1 },
        effects: [{
          type: 'DMG_INC', value: 0.7, operation: 'MULTIPLY',
          target: { skillId: GK_SKILL_IDS.RENDING_FINISHER },
        }],
      },

      // ── 3티어 ─────────────────────────────────────────────
      {
        source: 'TRIPOD', id: 'GK_RENDING_FINISHER_C1', name: '깨어난 본능', iconPath: '',
        slot: 3, index: 1,
        effects: [
          {
            type: 'DMG_INC', value: 0.5, operation: 'MULTIPLY',
            target: { skillId: GK_SKILL_IDS.RENDING_FINISHER },
          },
          {
            // 기운 소모당 피해 증가 — 발현 스킬에만 적용
            type: 'GK_QI_DMG' as GkEffectTypeId, value: 0.1, operation: 'ADD',
            target: { skillId: GK_SKILL_IDS.RENDING_FINISHER },
          },
        ],
      },
      {
        source: 'TRIPOD', id: 'GK_RENDING_FINISHER_C2', name: '공간절삭', iconPath: '',
        slot: 3, index: 2,
        effects: [{
          type: 'DMG_INC', value: 1.0, operation: 'MULTIPLY',
          target: { skillId: GK_SKILL_IDS.RENDING_FINISHER },
        }],
      },
    ],
  },


  // ──────────────────────────────────────────────────────────
  // 익스플로전 피니셔 (화신)
  // ──────────────────────────────────────────────────────────
  {
    source: 'SKILL',
    id    : GK_SKILL_IDS.EXPLOSION_FINISHER,
    name  : '익스플로전 피니셔',
    iconPath    : '',
    category    : ['GOD_FORM'],
    resource    : { typeId: 'QI_EMBERES', isStatic: true, value: 6 },
    typeId      : 'NORMAL',
    attackId    : 'NON_DIRECTIONAL',
    destruction : 0,
    stagger     : '상',
    superArmorId: 'NONE',
    cooldown    : 52,

    levels: {
      isStatic: false,
      damageSources: [{
        name: '1타', isCombined: true, hits: 1,
        constants   : [4317, 4319, 4320, 4321, 4322],
        coefficients: [23.4362787356322, 25.4951867816092, 26.7640804597701,
                       27.7570402298851, 28.6399425287356],
      }],
    },

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        source: 'TRIPOD', id: 'GK_EXPLOSION_FINISHER_A1', name: '재빠른 손놀림', iconPath: '',
        slot: 1, index: 1,
        memo: [{ type: '시전 속도 증가', value: 0.1 }],
      },
      {
        source: 'TRIPOD', id: 'GK_EXPLOSION_FINISHER_A2', name: '단단한 비늘', iconPath: '',
        slot: 1, index: 2,
        memo: [{ type: '스킬 시전 중 받는 피해 감소', value: 0.2 }],
      },
      {
        source: 'TRIPOD', id: 'GK_EXPLOSION_FINISHER_A3', name: '뇌진탕', iconPath: '',
        slot: 1, index: 3,
        overrides: { stagger: '최상' },
      },

      // ── 2티어 ─────────────────────────────────────────────
      {
        source: 'TRIPOD', id: 'GK_EXPLOSION_FINISHER_B1', name: '응축된 힘', iconPath: '',
        slot: 2, index: 1,
        link    : { slot: 3, index: 1 },
        overrides: { typeId: 'CHARGE', superArmorId: 'PUSH_IMMUNE' },
        effects: [{
          type: 'DMG_INC', value: 0.7, operation: 'MULTIPLY',
          target: { skillId: GK_SKILL_IDS.EXPLOSION_FINISHER },
        }],
      },
      {
        source: 'TRIPOD', id: 'GK_EXPLOSION_FINISHER_B2', name: '약점 포착', iconPath: '',
        slot: 2, index: 2,
        link   : { slot: 3, index: 2 },
        effects: [{
          type: 'DMG_INC', value: 0.7, operation: 'MULTIPLY',
          target: { skillId: GK_SKILL_IDS.EXPLOSION_FINISHER },
        }],
      },

      // ── 3티어 ─────────────────────────────────────────────
      {
        source: 'TRIPOD', id: 'GK_EXPLOSION_FINISHER_C1', name: '붉은 심장', iconPath: '',
        slot: 3, index: 1,
        effects: [{
          type: 'DMG_INC', value: 0.75, operation: 'MULTIPLY',
          target: { skillId: GK_SKILL_IDS.EXPLOSION_FINISHER },
        }],
        // ⚠️ 화염지대 계수/상수 임시값
        addDamageSources: {
          isStatic: false,
          damageSources: [{
            name: '화염지대', isCombined: false, hits: 3,
            constants   : [217, 217, 217, 217, 217],
            coefficients: [217, 217, 217, 217, 217],
          }],
        },
      },
      {
        source: 'TRIPOD', id: 'GK_EXPLOSION_FINISHER_C2', name: '푸른 심장', iconPath: '',
        slot: 3, index: 2,
        effects: [
          {
            type: 'DMG_INC', value: 0.5, operation: 'MULTIPLY',
            target: { skillId: GK_SKILL_IDS.EXPLOSION_FINISHER },
          },
          {
            // 기운 소모 개수 증가
            type: 'GK_QI_COST' as GkEffectTypeId, value: 4, operation: 'ADD',
            target: { skillId: GK_SKILL_IDS.EXPLOSION_FINISHER },
          },
        ],
      },
    ],
  },


  // ──────────────────────────────────────────────────────────
  // 딥 임팩트 (초각성 스킬)
  // ──────────────────────────────────────────────────────────
  {
    source: 'SKILL',
    id    : GK_SKILL_IDS.DEEP_IMPACT,
    name  : '딥 임팩트',
    iconPath    : '',
    category    : ['GOD_FORM', 'HYPER_SKILL'],
    resource    : { typeId: 'QI_EMBERES', isStatic: true, value: 6 },
    typeId      : 'POINT',
    attackId    : 'NON_DIRECTIONAL',
    destruction : 1,
    stagger     : '최상',
    superArmorId: 'PUSH_IMMUNE',
    cooldown    : 90,

    levels: {
      isStatic: true,
      damageSources: [
        {
          name: '1타', isCombined: true, hits: 1,
          constants   : [26786],
          coefficients: [177.806465517241],
        },
        {
          name: '2타', isCombined: true, hits: 1,
          constants   : [26786],
          coefficients: [177.806465517241],
        },
      ],
    },
  },


  // ──────────────────────────────────────────────────────────
  // 가디언 백래시 (각성기)
  // ──────────────────────────────────────────────────────────
  {
    source: 'SKILL',
    id    : GK_SKILL_IDS.GUARDIAN_BACKRASH,
    name  : '가디언 백래시',
    iconPath    : '',
    category    : ['ULTIMATE'],
    typeId      : 'NORMAL',
    attackId    : 'NON_DIRECTIONAL',
    destruction : 0,
    stagger     : '최상',
    superArmorId: 'DEBUFF_IMMUNE',
    cooldown    : 300,

    levels: {
      isStatic: true,
      damageSources: [
        {
          name: '1타', isCombined: true, hits: 1,
          constants   : [31370],
          coefficients: [322.265983946859],
        },
        {
          name: '2타', isCombined: true, hits: 1,
          constants   : [31354],
          coefficients: [322.269997232217],
        },
      ],
    },
  },


  // ──────────────────────────────────────────────────────────
  // 브레스 오브 엠버레스 (초각성기)
  // ──────────────────────────────────────────────────────────
  {
    source: 'SKILL',
    id    : GK_SKILL_IDS.BREATH_OF_EMBERES,
    name  : '브레스 오브 엠버레스',
    iconPath    : '',
    category    : ['HYPER_ULTIMATE'],
    typeId      : 'NORMAL',
    attackId    : 'NON_DIRECTIONAL',
    destruction : 0,
    stagger     : '최상',
    superArmorId: 'ALL_IMMUNE',
    cooldown    : 300,

    levels: {
      isStatic: true,
      damageSources: [{
        name: '1타', isCombined: true, hits: 6,
        constants   : [87303],
        coefficients: [897.388873512317],
      }],
    },
  },
];