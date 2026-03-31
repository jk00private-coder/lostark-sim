// @/data/arc-grid/guardain-knight.ts

import { ArkGridCoreData, GET_GRID_ICON } from '@/types/ark-grid';
import { ID_AA, ID_BB } from '@/constants/id-config';
import { ID as SK_ID } from '@/data/skills/guardian-knight-skills';

// 공통 Base ID (80 81 0 0 00)
const BASE = (ID_AA.ARK_GRID * 1000000) + (ID_BB.GUARDIANKNIGHT * 10000);

// BB: 직업(질서 코어), 공통(혼돈 코어)
// C: 1(해, SN), 2(달, MN), 3(별, ST)
// D: 1(업화의 계승자, HELLFIRE, H), 2(드레드 로어, DREADFUL, D)
// EE: 인게임 순서
export const ID = {
  SNH_01: BASE + 1101, SNH_02: BASE + 1102, SNH_03: BASE + 1103,
  SND_01: BASE + 1201, SND_02: BASE + 1202, SND_03: BASE + 1203,
  
  MNH_01: BASE + 2101, MNH_02: BASE + 2102, MNH_03: BASE + 2103,
  MND_01: BASE + 2201, MND_02: BASE + 2202, MND_03: BASE + 2203,
  
  STH_01: BASE + 3101, STH_02: BASE + 3102, STH_03: BASE + 3103,
  STD_01: BASE + 3201, STD_02: BASE + 3202, STD_03: BASE + 3203,
};

export const NAMES = {
  [ID.SNH_01]: '피니셔', [ID.SNH_02]: '매니페스트', [ID.SNH_03]: '붉은 날개',
  [ID.SND_01]: '차지 인핸스', [ID.SND_02]: '브랜디쉬', [ID.SND_03]: '에이펙스',

  [ID.MNH_01]: '노바 플레임', [ID.MNH_02]: '리버레이션', [ID.MNH_03]: '복수귀',
  [ID.MND_01]: '위압', [ID.MND_02]: '플러리쉬', [ID.MND_03]: '도미넌트',
  
  [ID.STH_01]: '라스트 스탠드', [ID.STH_02]: '엑스큐셔너', [ID.STH_03]: '추격 시작',
  [ID.STD_01]: '그랜드 피날레', [ID.STD_02]: '일당백', [ID.STD_03]: '파멸',
} as const;

export const ARKGRID_GUARDIAN_KNIGHT_DATA: ArkGridCoreData[] = [
  // ── [🌞 해 코어] ──────────────────────────────────
  { // <해1> 피니셔 (업화의 계승자)
    id: ID.SNH_01,
    name: NAMES[ID.SNH_01],
    iconPath: GET_GRID_ICON('O_SN'),
    thresholds: [
      { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
      { point: 14, effects: [{ type: 'DMG_INC', value: [0.05] }] },
      {
        point: 17,
        effects: [
          {
            type: 'DMG_INC', multiValues: { relic: [0.25], ancient: [0.3] },
            target: { skillIds: [SK_ID.RENDING_FINISHER.BODY, SK_ID.EXPLOSION_FINISHER.BODY] }
          }
        ]
      },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.007], target: {skillIds: [SK_ID.EXPLOSION_FINISHER.BODY]} }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.007], target: {skillIds: [SK_ID.EXPLOSION_FINISHER.BODY]} }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.007], target: {skillIds: [SK_ID.EXPLOSION_FINISHER.BODY]} }] }
    ]
  },
  { // <해2> 메니페스트 (업화의 계승자)
    id: ID.SNH_02,
    name: NAMES[ID.SNH_02],
    iconPath: GET_GRID_ICON('O_SN'),
    thresholds: [
      { 
        point: 10, 
        effects: [
          {
            type: 'GK_QI_COST', value: [2],
            target: { skillIds: [SK_ID.RENDING_FINISHER.BODY, SK_ID.BLAZE_SWEEP.BODY] }
          }
        ]
      },
      { 
        point: 14, 
        effects: [
          { 
            type: 'DMG_INC', value: [-0.7], 
            target: { skillIds: [SK_ID.ABADDON_FLAME.BODY, SK_ID.AVENGING_SPEAR.BODY, SK_ID.BLAZE_FLASH.BODY, SK_ID.WING_LASH.BODY] } 
          },
          { type: 'CDR_C', value: [12], target: { skillIds: [SK_ID.RENDING_FINISHER.BODY] } },
          { type: 'SPEED_ATK', value: [0.1] },
          { type: 'SPEED_MOV', value: [0.1] },
          { type: 'DMG_INC', value: [0.5], target: {categories: ['ENLIGHTEN']} },
        ] 
      },
      {
        point: 17,
        effects: [
          {
            type: 'DMG_INC', multiValues: { relic: [0.24], ancient: [0.3] }, // 레조넌스 6중첩 기준 (0.04*6 / 0.05*6)
            target: { skillIds: [SK_ID.INFERNO_BURST.BODY, SK_ID.EXPLOSION_FINISHER.BODY] }
          }
        ]
      },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.0032], target: { categories: ['ENLIGHTEN'] } }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.0032], target: { categories: ['ENLIGHTEN'] } }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.0032], target: { categories: ['ENLIGHTEN'] } }] }
    ]
  },
  { // <해3> 붉은날개 (업화의 계승자)
    id: ID.SNH_03,
    name: NAMES[ID.SNH_03],
    iconPath: GET_GRID_ICON('O_SN'),
    thresholds: [
      { point: 10, effects: [{ type: "DMG_INC", value: [0.015] }] },
      { 
        point: 14, 
        effects: [
          { type: "DMG_INC", value: [-0.9], target: {skillIds: [SK_ID.ABADDON_FLAME.BODY]} },
          { 
            type: "DMG_INC", value: [0.7], subGroup: 'SNH_03',
            target: {skillIds: [SK_ID.AVENGING_SPEAR.BODY]}
          }
        ] 
      },
      {
        point: 17,
        effects: [
          {
            // 14P의 0.7을 대체하여 1.0 / 1.14가 됨
            type: "DMG_INC", multiValues: { relic: [0.3], ancient: [0.44] }, subGroup: 'SNH_03', 
            target: { skillIds: [SK_ID.AVENGING_SPEAR.BODY] }
          }
        ]
      },
      { point: 18, effects: [{ type: "DMG_INC", value: [0.0023], target: { categories: ['GOD_FORM'] } }] },
      { point: 19, effects: [{ type: "DMG_INC", value: [0.0023], target: { categories: ['GOD_FORM'] } }] },
      { point: 20, effects: [{ type: "DMG_INC", value: [0.0023], target: { categories: ['GOD_FORM'] } }] }
    ]
  },

  { // <해1> 차지 인핸스 (드레드 로어)
    id: ID.SND_01,
    name: NAMES[ID.SND_01],
    iconPath: GET_GRID_ICON('O_SN'),
    thresholds: [
      { 
        point: 10, 
        effects: [
          { type: 'DMG_INC', value: [-0.7], target: {skillIds: [SK_ID.SOARING_STRIKE.BODY]} },
          { type: 'DMG_INC', value: [0.04], target: {skillTypes: ['CHARGE']} }
        ] 
      },
      { 
        point: 14, 
        effects: [
          // todo: 소울 디바이드(일반, 초각성스킬)제외인데 어떻게 할지 고민
          { type: 'DMG_INC', value: [-0.45], target: { skillTypes: ['NORMAL'] } }, 
          { 
            type: 'DMG_INC', value: [1.38], 
            target: { skillIds: [SK_ID.QUAKE_SMASH.BODY, SK_ID.PIERCING_SHOCK.BODY, SK_ID.RENDING_FINISHER.BODY] } 
          }
        ] 
      },
      { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.06], ancient: [0.075] }, target: { skillTypes: ['CHARGE'] } }] },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.002], target: { skillTypes: ['CHARGE'] } }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.002], target: { skillTypes: ['CHARGE'] } }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.002], target: { skillTypes: ['CHARGE'] } }] }
    ]
  },
  { // <해2> 브랜디쉬 (드레드 로어)
    id: ID.SND_02,
    name: NAMES[ID.SND_02],
    iconPath: GET_GRID_ICON('O_SN'),
    thresholds: [
      { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
      { 
        point: 14, 
        effects: [
          { type: 'DMG_INC', value: [-0.3], target: { skillIds: [SK_ID.PIERCING_SHOCK.BODY] } },
          { type: 'DMG_INC', value: [0.2], target: { skillIds: [SK_ID.GUILLOTINE_SPIN.BODY] } }
        ] 
      },
      { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0], ancient: [0.05] }, target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }] },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
    ]
  },
  { // <해3> 에이펙스 (드레드 로어)
    id: ID.SND_03,
    name: NAMES[ID.SND_03],
    iconPath: GET_GRID_ICON('O_SN'),
    thresholds: [
      { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
      { point: 14, effects: [{ type: 'DMG_INC', subGroup: 'SND_03', value: [0.06] }] },
      // 14P의 0.6을 대체하여 0.11 / 0.12가 됨
      { point: 17, effects: [{ type: 'DMG_INC', subGroup: 'SND_03', multiValues: { relic: [0.11], ancient: [0.12] } }] },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
    ]
  },

  // ── [🌙 달 코어] ──────────────────────────────────
  { // <달1> 노바 플레임 (업화의 계승자)
    id: ID.MNH_01,
    name: NAMES[ID.MNH_01],
    iconPath: GET_GRID_ICON('O_MN'),
    thresholds: [
      { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
      { point: 14 }, // 화신화 사용 시 '운명'이 발동한다.
      // todo: 조건이 화신상태에서 주는 피해량 증가임, 화신상태에서 쓰는 일반스킬도 데미지 늘어나는지 검토 필요
      { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.05], ancient: [0.065] }, target: { categories: ['GOD_FORM'] } }] },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.0023], target: { categories: ['GOD_FORM'] } }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.0023], target: { categories: ['GOD_FORM'] } }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.0023], target: { categories: ['GOD_FORM'] } }] }
    ]
  },
  { // <달2> 리버레이션 (업화의 계승자)
    id: ID.MNH_02,
    name: NAMES[ID.MNH_02],
    iconPath: GET_GRID_ICON('O_MN'),
    thresholds: [
      { point: 10 }, // 더 이상 발현 스킬이 소켓을 잠그지 않는다.
      { point: 14 }, // 발현 스킬 사용 시 '운명'이 발동한다.
      { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.08], ancient: [0.1] }, target: { categories: ['ENLIGHTEN'] } }] },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.0032], target: { categories: ['ENLIGHTEN'] } }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.0032], target: { categories: ['ENLIGHTEN'] } }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.0032], target: { categories: ['ENLIGHTEN'] } }] }
    ]
  },
  { // <달3> 복수귀 (업화의 계승자)
    id: ID.MNH_03,
    name: NAMES[ID.MNH_03],
    iconPath: GET_GRID_ICON('O_MN'),
    thresholds: [
      { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
      { point: 14, effects: [] }, // 화신화 사용 시 '운명'이 발동한다.
      { 
        point: 17, 
        effects: [
          { type: 'CDR_C', value: [-28.0], target: { skillIds: [SK_ID.AVENGING_SPEAR.BODY] } },
          { type: 'DMG_INC', multiValues: { relic: [1.0], ancient: [1.14] }, target: { skillIds: [SK_ID.AVENGING_SPEAR.BODY] } }
        ] 
      },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.0023], target: { categories: ['GOD_FORM'] } }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.0023], target: { categories: ['GOD_FORM'] } }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.0023], target: { categories: ['GOD_FORM'] } }] }
    ]
  },

  { // <달1> 위압 (드레드 로어)
    id: ID.MND_01,
    name: NAMES[ID.MND_01],
    iconPath: GET_GRID_ICON('O_MN'),
    thresholds: [
      { point: 10, effects: [{ type: 'DMG_INC', value: [0.02], target: { skillTypes: ['CHARGE'] } }] },
      { point: 14 }, // 가디언 피어 사용 시 '운명'이 발동한다.
      { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.4], ancient: [0.46] }, target: { skillIds: [SK_ID.PIERCING_SHOCK.BODY] } }] },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.002], target: { skillTypes: ['CHARGE'] } }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.002], target: { skillTypes: ['CHARGE'] } }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.002], target: { skillTypes: ['CHARGE'] } }] }
    ]
  },
  { // <달2> 플러리쉬 (드레드 로어)
    id: ID.MND_02,
    name: NAMES[ID.MND_02],
    iconPath: GET_GRID_ICON('O_MN'),
    thresholds: [
      { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
      { point: 14 }, // 클리브 사용 시 '운명'이 발동한다.
      { 
        point: 17, 
        effects: [{ 
          type: 'DMG_INC', multiValues: { relic: [0.1], ancient: [0.125] },
          target: { skillIds: [SK_ID.GUILLOTINE_SPIN.BODY, SK_ID.FRENZY_SWEEP.BODY] } 
        }] 
      },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
    ]
  },
  { // <달3> 도미넌트 (드레드 로어)
    id: ID.MND_03,
    name: NAMES[ID.MND_03],
    iconPath: GET_GRID_ICON('O_MN'),
    thresholds: [
      { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
      { point: 14 }, // 가디언 피어 사용 시 '운명'이 발동한다.
      // todo: 초월 상태에서 피해 증가, 그냥 상시 초월상태 or 사이클의 몇퍼센트 고려, 초월 상태따로 선언한 곳이 없음.
      { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.04], ancient: [0.055] } }] },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
    ]
  },

  // ── [⭐ 별 코어] (업화의 계승자) ──────────────────────────────────
  { // <별1> 라스트 스탠드 (업화의 계승자)
    id: ID.STH_01,
    name: NAMES[ID.STH_01],
    iconPath: GET_GRID_ICON('O_ST'),
    thresholds: [
      { point: 10 }, // 렌딩 피니셔의 시전 속도가 20.0% 증가한다.
      { point: 14, effects: [{ type: 'DMG_INC', value: [0.08], target: { skillIds: [SK_ID.BLAZE_FLASH.BODY, SK_ID.WING_LASH.BODY] } }] },
      { 
        point: 17, 
        effects: [{ 
          // todo: 익스플로전 피니셔의 '푸른 심장' 트라이포드 적용 시 피해 증가 및 피격 이상 면역
          type: 'DMG_INC', multiValues: { relic: [0.2], ancient: [0.27] }, 
          target: { skillIds: [SK_ID.EXPLOSION_FINISHER.BODY] }
        }] 
      },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.007], target: { skillIds: [SK_ID.EXPLOSION_FINISHER.BODY] } }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.007], target: { skillIds: [SK_ID.EXPLOSION_FINISHER.BODY] } }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.007], target: { skillIds: [SK_ID.EXPLOSION_FINISHER.BODY] } }] }
    ]
  },
  { // <별2> 엑스큐셔너 (업화의 계승자)
    id: ID.STH_02,
    name: NAMES[ID.STH_02],
    iconPath: GET_GRID_ICON('O_ST'),
    thresholds: [
      { point: 10, effects: [{ type: 'DMG_INC', value: [0.05], target: { categories: ['ENLIGHTEN'] } }] },
      // todo: 임페일 쇼크의 '즉결심판' 트라이포드 적용 시 재사용 대기시간이 "추가"로 감소한다, 트라이포드의 기존 6초감소에 10초 더 감소
      { point: 14, effects: [{ type: 'CDR_C', value: [10.0], target: { skillIds: [SK_ID.PIERCING_SHOCK.BODY] } }] },
      { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.1], ancient: [0.15] }, target: { skillIds: [SK_ID.RENDING_FINISHER.BODY] } }] },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.RENDING_FINISHER.BODY] } }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.RENDING_FINISHER.BODY] } }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.RENDING_FINISHER.BODY] } }] }
    ]
  },
  { // <별3> 추격 시작 (업화의 계승자)
    id: ID.STH_03,
    name: NAMES[ID.STH_03],
    iconPath: GET_GRID_ICON('O_ST'),
    thresholds: [
      { point: 10 }, // 리벤지 블로우 사용 시 엠버레스 오브 게이지를 10.0% 회복하고, 리벤지 스피어의 시전 속도가 20.0% 증가한다.
      { point: 14, effects: [{ type: 'DMG_INC', value: [0.2], target: { skillIds: [SK_ID.VENGEFUL_BLOW.BODY] } }] },
       // todo: 블레이즈 플래시의 '맹렬한 추격' 트라이포드 적용 시
      { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.16], ancient: [0.25] }, target: { skillIds: [SK_ID.BLAZE_FLASH.BODY] }}] },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.AVENGING_SPEAR.BODY] } }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.AVENGING_SPEAR.BODY] } }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.AVENGING_SPEAR.BODY] } }] }
    ]
  },

  { // <별1> 그랜드 피날레 (드레드 로어)
    id: ID.STD_01,
    name: NAMES[ID.STD_01],
    iconPath: GET_GRID_ICON('O_ST'),
    thresholds: [
      // todo: 렌딩 피니셔의 '응축된 힘' 트라이포드 적용 시
      { point: 10, effects: [{ type: 'CDR_C', value: [6.0], target: { skillIds: [SK_ID.RENDING_FINISHER.BODY] } }] },
      { 
        point: 14, 
        effects: [
          // todo: 차지 조작 피증 12% + 죽음의 일격 트포일 때 피증 20% 합인지 곱인지 검토
          { type: 'DMG_INC', value: [0.12], target: { skillIds: [SK_ID.PIERCING_SHOCK.BODY] } },
          { type: 'DMG_INC', value: [0.20], target: { skillIds: [SK_ID.PIERCING_SHOCK.BODY] } }
        ] 
      },
      // todo: 퀘이크 스매시의 '말살' 트라이포드 적용 시
      { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.14], ancient: [0.18] }, target: { skillIds: [SK_ID.QUAKE_SMASH.BODY] } }] },
      { point: 18, effects: [{ type: 'CRIT_DMG_INC', value: [0.0021], target: { skillTypes: ['CHARGE'] } }] },
      { point: 19, effects: [{ type: 'CRIT_DMG_INC', value: [0.0021], target: { skillTypes: ['CHARGE'] } }] },
      { point: 20, effects: [{ type: 'CRIT_DMG_INC', value: [0.0021], target: { skillTypes: ['CHARGE'] } }] }
    ]
  },
  { // <별2> 일당백 (드레드 로어)
    id: ID.STD_02,
    name: NAMES[ID.STD_02],
    iconPath: GET_GRID_ICON('O_ST'),
    thresholds: [
      // todo: 클리브 경직 면역 추가
      { point: 10, effects: [{ type: 'DMG_INC', value: [0.08], target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }] },
      // todo: 길로틴 스핀의 '천부적인 힘' 트라이포드 적용 시
      { point: 14, effects: [{ type: 'DMG_INC', value: [0.08], target: { skillIds: [SK_ID.GUILLOTINE_SPIN.BODY] } }] },
      // todo: 프렌지 스윕의 '맹습' 트라이포드 적용 시
      { 
        point: 17, 
        effects: [
          { type: 'CDR_C', value: [-18.0], target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } },
          { type: 'DMG_INC', multiValues: { relic: [0.8], ancient: [0.88] }, target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }
        ] 
      },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }] }
    ]
  },
  { // <별3> 파멸 (드레드 로어)
    id: ID.STD_03,
    name: NAMES[ID.STD_03],
    iconPath: GET_GRID_ICON('O_ST'),
    thresholds: [
      { point: 10, effects: [{ type: 'DMG_INC', value: [0.1], target: { skillIds: [SK_ID.GUILLOTINE_SPIN.BODY] } }] },
      // todo: 프렌지 스윕의 '파멸의 오브' 트라이포드 적용 시
      { point: 14, effects: [{ type: 'DMG_INC', value: [0.15], target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }] },
      { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.15], ancient: [0.2] }, target: { skillIds: [SK_ID.QUAKE_SMASH.BODY] } }] },
      { point: 18, effects: [{ type: 'DMG_INC', value: [0.009], target: { skillIds: [SK_ID.QUAKE_SMASH.BODY] } }] },
      { point: 19, effects: [{ type: 'DMG_INC', value: [0.009], target: { skillIds: [SK_ID.QUAKE_SMASH.BODY] } }] },
      { point: 20, effects: [{ type: 'DMG_INC', value: [0.009], target: { skillIds: [SK_ID.QUAKE_SMASH.BODY] } }] }
    ]
  },
]