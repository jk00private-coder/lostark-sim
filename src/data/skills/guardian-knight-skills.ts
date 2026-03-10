// @/data/skills/guardian-knight-skills

import { 
  GUARDIAN_KNIGHT_SKILL_ID as SKILL_ID, GUARDIAN_KNIGHT_SKILL_NAME as SKILL_NAME,
  GUARDIAN_KNIGHT_TRIPOD_ID as TRIPOD_ID, GUARDIAN_KNIGHT_TRIPOD_NAME as TRIPOD_NAME
} from '../../constants/skills/guardian-knight';
import { SkillData } from '../../types/skill-types';

export const GUARDIAN_KNIGHT_SKILLS_DB: SkillData[] = [
    {
    source: 'SKILL',
    id: SKILL_ID.CLEAVE,
    name: SKILL_NAME[SKILL_ID.CLEAVE],
    iconPath: '',
    category: ['BASIC'],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '',
    superArmorId: 'NONE',
    cooldown: 6,

    levels:{
      isStatic: false,
      damageSources: [
        {
          name: '1타', isCombined: true, hits: 1,
          constants: [1201, 1202, 1202, 1202, 1202],
          coefficients: [6.53053160919540, 7.10445402298851, 7.45847701149425, 7.73548850574713,
                          7.98146551724138]
        }
      ]
    },

    tripods: [
      {
        source: 'TRIPOD', id: TRIPOD_ID.CLEAVE_A1, name: TRIPOD_NAME[TRIPOD_ID.CLEAVE_A1], iconPath: '',
        slot: 1, index: 1, 
        special: [{ type: '적 받는 피해 증가', value: 0.06 }]
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.CLEAVE_A2, name: TRIPOD_NAME[TRIPOD_ID.CLEAVE_A2], iconPath: '',
        slot: 1, index: 2, 
        special: [{ type: '이동 거리 증가', value: 4 }]
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.CLEAVE_A3, name: TRIPOD_NAME[TRIPOD_ID.CLEAVE_A3], iconPath: '',
        slot: 1, index: 3, 
        special: [{ type: '시전 속도 증가', value: 0.1 }]
      },
      
      {
        source: 'TRIPOD', id: TRIPOD_ID.CLEAVE_B1, name: TRIPOD_NAME[TRIPOD_ID.CLEAVE_B1], iconPath: '',
        slot: 2, index: 1,
        effects: [{ type:'DMG_INC', value: 0.04, target: SKILL_ID.CLEAVE }],
        special: [{ type: '기운 추가 회복', value: 1 }]
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.CLEAVE_B2, name: TRIPOD_NAME[TRIPOD_ID.CLEAVE_B2], iconPath: '',
        slot: 2, index: 2,
        special: [{ type: '하급 및 일반 몬스터에게 주는 피해', value: 1.2 }]
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.CLEAVE_B3, name: TRIPOD_NAME[TRIPOD_ID.CLEAVE_B3], iconPath: '',
        slot: 2, index: 3, 
        effects: [{ type:'DMG_INC', value: 0.6, target: SKILL_ID.CLEAVE }]
      },
      
      {
        source: 'TRIPOD', id: TRIPOD_ID.CLEAVE_C1, name: TRIPOD_NAME[TRIPOD_ID.CLEAVE_C1], iconPath: '',
        slot: 3, index: 1,
        effects: [{ type:'DMG_INC', value: 0.6, target: SKILL_ID.CLEAVE }],
        addDamageSources: {
          damageSources: [
            {
              name: '화상', isCombined: false, hits: 6,
              constants:[10, 10, 10, 10, 10],
              coefficients:[10, 10, 10, 10, 10]
            }
          ]
        }
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.CLEAVE_C2, name: TRIPOD_NAME[TRIPOD_ID.CLEAVE_C2], iconPath: '',
        slot: 3, index: 2, 
        effects: [{ type:'DMG_INC', value: 0.7, target: SKILL_ID.CLEAVE }],
        special: [{ type: '공격 범위 증가', value: 0.3 }]
      }
    ]
  },

  {
    source: 'SKILL',
    id: SKILL_ID.RENDING_FINISHER,
    name: SKILL_NAME[SKILL_ID.RENDING_FINISHER],
    iconPath: '',
    category: ['ENLIGHTEN'],
    resource: { typeId: 'QI_EMBERES', isStatic: true, values: [6] },
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '중상',
    superArmorId: 'STIFF_IMMUNE',
    cooldown: 30,

    levels:{
      isStatic: false,
      damageSources: [
        {
          name: '1타', isCombined: true, hits: 1,
          constants: [3452, 3454, 3455, 3456, 3456],
          coefficients: [18.7566810344828, 20.4045258620690, 21.4204741379310, 22.2153735632184,
                          22.9224137931034]
        }
      ]
    },

    tripods: [
      {
        source: 'TRIPOD', id: TRIPOD_ID.RENDING_FINISHER_A1, name: TRIPOD_NAME[TRIPOD_ID.RENDING_FINISHER_A1], iconPath: '',
        slot: 1, index: 1,
        special: [{ type:'시전 속도 증가', value:0.15 }]
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.RENDING_FINISHER_A2, name: TRIPOD_NAME[TRIPOD_ID.RENDING_FINISHER_A2], iconPath: '',
        slot: 1, index: 2, 
        special: [{ type:'스킬 시전 중 받는 피해 감소', value:0.2 }]
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.RENDING_FINISHER_A3, name: TRIPOD_NAME[TRIPOD_ID.RENDING_FINISHER_A3], iconPath: '',
        slot: 1, index: 3, 
        overrides: { attackId: 'HEAD_ATK' }
      },

      {
        source: 'TRIPOD', id: TRIPOD_ID.RENDING_FINISHER_B1, name: TRIPOD_NAME[TRIPOD_ID.RENDING_FINISHER_B1], iconPath: '',
        slot: 2, index: 1,
        link: { slot: 3, index: 1 },
        overrides: { typeId: 'CHARGE', superArmorId: 'PUSH_IMMUNE' },
        effects: [{ type: 'DMG_INC', value: 0.5, target: SKILL_ID.RENDING_FINISHER }] 
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.RENDING_FINISHER_B2, name: TRIPOD_NAME[TRIPOD_ID.RENDING_FINISHER_B2], iconPath: '',
        slot: 2, index: 2,
        link: { slot: 3, index: 1 },
        effects: [{ type: 'DMG_INC', value: 0.7, target: SKILL_ID.RENDING_FINISHER }]
      },

      {
        source: 'TRIPOD', id: TRIPOD_ID.RENDING_FINISHER_C1, name: TRIPOD_NAME[TRIPOD_ID.RENDING_FINISHER_C1], iconPath: '',
        slot: 3, index: 1,
        effects: [{ type: 'DMG_INC', value: 0.5, target: SKILL_ID.RENDING_FINISHER }],
        special: [{ type: 'QI_DMG', value: 0.1, target: SKILL_ID.RENDING_FINISHER }]
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.RENDING_FINISHER_C2, name: TRIPOD_NAME[TRIPOD_ID.RENDING_FINISHER_C2], iconPath: '',
        slot: 3, index: 2, 
        effects: [{ type: 'DMG_INC', value: 1.0, target: SKILL_ID.RENDING_FINISHER }]
      }
    ]
  },

  {
    source: 'SKILL',
    id: SKILL_ID.EXPLOSION_FINISHER,
    name: SKILL_NAME[SKILL_ID.EXPLOSION_FINISHER],
    iconPath: '',
    category: ['GOD_FORM'],
    resource: { typeId: 'QI_EMBERES', isStatic: true, values: [6] },
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '상',
    superArmorId: 'NONE',
    cooldown: 52,

    levels:{
      isStatic: false,
      damageSources: [
        {
          name: '1타', isCombined: true, hits: 1,
          constants: [4317, 4319, 4320, 4321, 4322],
          coefficients: [23.4362787356322, 25.4951867816092, 26.7640804597701, 27.7570402298851,
                          28.6399425287356]
        }
      ]
    },

    tripods: [
      {
        source: 'TRIPOD', id: TRIPOD_ID.EXPLOSION_FINISHER_A1, name: TRIPOD_NAME[TRIPOD_ID.EXPLOSION_FINISHER_A1], iconPath: '',
        slot: 1, index: 1,
        special: [{ type:'시전 속도 증가', value:0.1 }]
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.EXPLOSION_FINISHER_A2, name: TRIPOD_NAME[TRIPOD_ID.EXPLOSION_FINISHER_A2], iconPath: '',
        slot: 1, index: 2, 
        special: [{ type:'스킬 시전 중 받는 피해 감소', value:0.2 }]
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.EXPLOSION_FINISHER_A3, name: TRIPOD_NAME[TRIPOD_ID.EXPLOSION_FINISHER_A3], iconPath: '',
        slot: 1, index: 3,
        overrides: { stagger: '최상' }
      },
      
      {
        source: 'TRIPOD', id: TRIPOD_ID.EXPLOSION_FINISHER_B1, name: TRIPOD_NAME[TRIPOD_ID.EXPLOSION_FINISHER_B1], iconPath: '',
        slot: 2, index: 1,
        link: { slot: 3, index: 1 },
        overrides: { typeId: 'CHARGE', superArmorId: 'PUSH_IMMUNE' },
        effects: [{ type: 'DMG_INC', value: 0.7, target: SKILL_ID.EXPLOSION_FINISHER }] 
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.EXPLOSION_FINISHER_B2, name: TRIPOD_NAME[TRIPOD_ID.EXPLOSION_FINISHER_B2], iconPath: '',
        slot: 2, index: 2, 
        link: { slot: 3, index: 2 },
        effects: [{ type: 'DMG_INC', value: 0.7, target: SKILL_ID.EXPLOSION_FINISHER }]
      },
      
      {
        source: 'TRIPOD', id: TRIPOD_ID.EXPLOSION_FINISHER_C1, name: TRIPOD_NAME[TRIPOD_ID.EXPLOSION_FINISHER_C1], iconPath: '',
        slot: 3, index: 1,
        effects: [{ type: 'DMG_INC', value: 0.75, target: SKILL_ID.EXPLOSION_FINISHER }],
        addDamageSources: {
          damageSources: [
            {
              name: '화염지대', isCombined: false, hits: 3,
              constants:[217, 217, 217, 217, 217],
              coefficients:[217, 217, 217, 217, 217]
            }
          ]
        }
      },
      {
        source: 'TRIPOD', id: TRIPOD_ID.EXPLOSION_FINISHER_C2, name: TRIPOD_NAME[TRIPOD_ID.EXPLOSION_FINISHER_C2], iconPath: '',
        slot: 3, index: 2,
        effects: [{ type: 'DMG_INC', value: 0.5, target: SKILL_ID.EXPLOSION_FINISHER }],
        special: [{ type: 'QI_COST', value: 4, target: SKILL_ID.EXPLOSION_FINISHER }]
      },
    ]
  },

  {
    source: 'SKILL',
    id: SKILL_ID.DEEP_IMPACT,
    name: SKILL_NAME[SKILL_ID.DEEP_IMPACT],
    iconPath: '',
    category: ['GOD_FORM', 'HYPER_SKILL'],
    resource: { typeId: 'QI_EMBERES', isStatic: true, values: [6] },
    typeId: 'POINT',
    attackId: 'NON_DIRECTIONAL',
    destruction: 1,
    stagger: '최상',
    superArmorId: 'PUSH_IMMUNE',
    cooldown: 90,

    levels:{
      isStatic: true,
      damageSources: [
        {
          name: '1타', isCombined: true, hits: 1,
          constants: [26786], coefficients: [177.806465517241]
        },
        {
          name: '2타', isCombined: true, hits: 1,
          constants: [26786], coefficients: [177.806465517241]
        }
      ]
    }
  },

  {
    source: 'SKILL',
    id: SKILL_ID.GUARDIAN_BACKRASH,
    name: SKILL_NAME[SKILL_ID.GUARDIAN_BACKRASH],
    iconPath: '',
    category: ['ULTIMATE'],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '최상',
    superArmorId: 'DEBUFF_IMMUNE',
    cooldown: 300,

    levels:{
      isStatic: true,
      damageSources: [
        {
          name: '1타', isCombined: true, hits: 1,
          constants: [31370], coefficients: [322.265983946859]
        },
        {
          name: '2타', isCombined: true, hits: 1,
          constants: [31354], coefficients: [322.269997232217]
        }
      ]
    }
  },

  {
    source: 'SKILL',
    id: SKILL_ID.BREATH_OF_EMBERES,
    name: SKILL_NAME[SKILL_ID.BREATH_OF_EMBERES],
    iconPath: '',
    category: ['HYPER_ULTIMATE'],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '최상',
    superArmorId: 'ALL_IMMUNE',
    cooldown: 300,

    levels:{
      isStatic: true,
      damageSources: [
        {
          name: '1타', isCombined: true, hits: 6,
          constants: [87303], coefficients: [897.388873512317]
        }
      ]
    }
  }
];