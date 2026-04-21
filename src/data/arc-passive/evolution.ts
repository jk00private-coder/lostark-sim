/**
 * @/data/arc-passive/evolution.ts
 *
 * 아크패시브 진화 DB
 *
 * [설계 원칙]
 *   - 
 *
 * ⚠️ 
 */

import { ArkPassiveSectionData } from '@/types/ark-passive';
import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';

// ============================================================
// 아크패시브-진화 ID 상수
// ============================================================

// 공통 Base ID (70 10 1 0 00)
const BASE = (ID_AA.ARK_PASSIVE * 1000000) + (ID_BB.COMMON * 10000) + (ID_C.ARK_EVOLUTION * 1000);

// 스킬별 ID
// D: 티어(1,2,3,4,5)
// EE: 해당 티어의 노드
export const ID = {
    T1_1: BASE + 101, T1_2: BASE + 102, T1_3: BASE + 103, T1_4: BASE + 104, T1_5: BASE + 105, T1_6: BASE + 106,
    T2_1: BASE + 201, T2_2: BASE + 202, T2_3: BASE + 203, T2_4: BASE + 204, T2_5: BASE + 205, T2_6: BASE + 206,
    T3_1: BASE + 301, T3_2: BASE + 302, T3_3: BASE + 303, T3_4: BASE + 304, T3_5: BASE + 305, T3_6: BASE + 306,
    T4_1: BASE + 401, T4_2: BASE + 402, T4_3: BASE + 403, T4_4: BASE + 404, T4_5: BASE + 405, T4_6: BASE + 406,
    T5_1: BASE + 501, T5_2: BASE + 502, T5_3: BASE + 503, T5_4: BASE + 504, T5_5: BASE + 505, T5_6: BASE + 506,
};

export const NAMES = {
    [ID.T1_1]: '치명', [ID.T1_2]: '특화', [ID.T1_3]: '제압',
    [ID.T1_4]: '신속', [ID.T1_5]: '인내', [ID.T1_6]: '숙련',

    [ID.T2_1]: '끝없는 마나', [ID.T2_2]: '금단의 주문', [ID.T2_3]: '예리한 감각',
    [ID.T2_4]: '한계 돌파', [ID.T2_5]: '최적화 훈련', [ID.T2_6]: '축복의 여신',

    [ID.T3_1]: '무한한 마력', [ID.T3_2]: '혼신의 강타', [ID.T3_3]: '일격',
    [ID.T3_4]: '파괴 전차', [ID.T3_5]: '타이밍 지배', [ID.T3_6]: '정열의 춤사위',

    [ID.T4_1]: '회심', [ID.T4_2]: '달인', [ID.T4_3]: '분쇄',
    [ID.T4_4]: '선각자', [ID.T4_5]: '진군', [ID.T4_6]: '기원',

    [ID.T5_1]: '뭉툭한 가시', [ID.T5_2]: '음속 돌파', [ID.T5_3]: '인파이팅',
    [ID.T5_4]: '입식 타격가', [ID.T5_5]: '마나 용광로', [ID.T5_6]: '안정된 관리자'
} as const;

export const EVOLUTION_DATA: ArkPassiveSectionData = {
    tierMeta: { 1: 40, 2: 30, 3: 20, 4: 20, 5: 30 },
    karma: {
        rankBonus: { type: 'EVO_DMG', value: Array.from({ length: 6 }, (_, i) => (i + 1) * 0.01) },
        levelBonus: { type: 'STAT_HP_C', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 400) }
    },
    nodes: [
        // ── 티어 1 ─────────────────────────────────────────────
        { // 치명
            id: ID.T1_1,
            name: NAMES[ID.T1_1],
            iconPath: `/images/arc-passive/evolution/${ID.T1_1}.webp`,
            pointCost: 1,
            effects: [{
                type: 'STAT_CRIT', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 50)
            }]
        },
        { // 특화
            id: ID.T1_2,
            name: NAMES[ID.T1_2],
            iconPath: '/icons/ark-passive/evolution/stat_2.png',
            pointCost: 1,
            effects: [{
                type: 'STAT_SPEC', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 50)
            }]
        },
        { // 제압
            id: ID.T1_3,
            name: NAMES[ID.T1_3],
            iconPath: '/icons/ark-passive/evolution/stat_3.png',
            pointCost: 1,
            effects: [{
                type: 'STAT_DOM', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 50)
            }]
        },
        { // 신속
            id: ID.T1_4,
            name: NAMES[ID.T1_4],
            iconPath: '/icons/ark-passive/evolution/stat_4.png',
            pointCost: 1,
            effects: [{
                type: 'STAT_SWIFT', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 50)
            }]
        },
        { // 인내
            id: ID.T1_5,
            name: NAMES[ID.T1_5],
            iconPath: '/icons/ark-passive/evolution/stat_5.png',
            pointCost: 1,
            effects: [{
                type: 'STAT_END', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 50)
            }]
        },
        { // 숙련
            id: ID.T1_6,
            name: NAMES[ID.T1_6],
            iconPath: '/icons/ark-passive/evolution/stat_6.png',
            pointCost: 1,
            effects: [{
                type: 'STAT_EXP', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 50)
            }]
        },
        // ── 티어 2 ─────────────────────────────────────────────
        { // 끝없는 마나
            id: ID.T2_1,
            name: NAMES[ID.T2_1],
            iconPath: `/images/arc-passive/evolution/${ID.T2_1}.webp`,
            pointCost: 10,
            effects: [{
                type: 'CDR_P', value: [0.07, 0.14], target: { resourceTypes: ['MANA'] }
            }]
        },
        { // 금단의 주문
            id: ID.T2_2,
            name: NAMES[ID.T2_2],
            iconPath: `/images/arc-passive/evolution/${ID.T2_2}.webp`,
            pointCost: 10,
            effects: [
                { type: 'EVO_DMG', value: [0.05, 0.1] },
                { type: 'EVO_DMG', value: [0.05, 0.1], target: { resourceTypes: ['MANA'] } }
            ]
        },
        { // 예리한 감각
            id: ID.T2_3,
            name: NAMES[ID.T2_3],
            iconPath: `/images/arc-passive/evolution/${ID.T2_3}.webp`,
            pointCost: 10,
            effects: [
                { type: 'CRIT_CHANCE', value: [0.04, 0.08] },
                { type: 'EVO_DMG', value: [0.05, 0.1] }
            ]
        },
        { // 한계 돌파
            id: ID.T2_4,
            name: NAMES[ID.T2_4],
            iconPath: `/images/arc-passive/evolution/${ID.T2_4}.webp`,
            pointCost: 10,
            effects: [
                { type: 'EVO_DMG', value: [0.1, 0.2, 0.3] }
            ]
        },
        { // 최적화 훈련
            id: ID.T2_5,
            name: NAMES[ID.T2_5],
            iconPath: `/images/arc-passive/evolution/${ID.T2_5}.webp`,
            pointCost: 10,
            effects: [
                { type: 'CDR_P', value: [0.04, 0.08] },
                { type: 'EVO_DMG', value: [0.05, 0.1] }
            ]
        },
        { // 축복의 여신
            id: ID.T2_6,
            name: NAMES[ID.T2_6],
            iconPath: `/images/arc-passive/evolution/${ID.T2_6}.webp`,
            pointCost: 10,
            effects: [
                { type: 'SPEED_MOV', value: [0.03, 0.06, 0.09] },
                { type: 'SPEED_ATK', value: [0.03, 0.06, 0.09] }
            ]
        },

        // ── 티어 3 ─────────────────────────────────────────────
        { // 무한한 마력
            id: ID.T3_1,
            name: NAMES[ID.T3_1],
            iconPath: `/images/arc-passive/evolution/${ID.T3_1}.webp`,
            pointCost: 10,
            effects: [
                { type: 'EVO_DMG', value: [0.08, 0.16] },
                { type: 'CDR_P', value: [0.07, 0.14], target: {resourceTypes: ['MANA']} }
            ]
        },
        { // 혼신의 강타
            id: ID.T3_2,
            name: NAMES[ID.T3_2],
            iconPath: `/images/arc-passive/evolution/${ID.T3_2}.webp`,
            pointCost: 10,
            effects: [
                { type: 'CRIT_CHANCE', value: [0.12, 0.24] },
                { type: 'EVO_DMG', value: [0.02, 0.04] }
            ]
        },
        { // 일격
            id: ID.T3_3,
            name: NAMES[ID.T3_3],
            iconPath: `/images/arc-passive/evolution/${ID.T3_3}.webp`,
            pointCost: 10,
            effects: [
                { type: 'CRIT_CHANCE', value: [0.1, 0.2] },
                { type: 'CRIT_DMG', value: [0.16, 0.32], target: {attackType: ['BACK_ATK', 'HEAD_ATK']} }
            ]
        },
        { // 파괴 전차
            id: ID.T3_4,
            name: NAMES[ID.T3_4],
            iconPath: `/images/arc-passive/evolution/${ID.T3_4}.webp`,
            pointCost: 10,
            effects: [
                { type: 'EVO_DMG', value: [0.12, 0.24] },
                { type: 'SPEED_MOV', value: [0.04, 0.08] }
            ]
        },
        { // 타이밍 지배
            id: ID.T3_5,
            name: NAMES[ID.T3_5],
            iconPath: `/images/arc-passive/evolution/${ID.T3_5}.webp`,
            pointCost: 10,
            effects: [
                { type: 'CDR_P', value: [0.05, 0.1] },
                { type: 'EVO_DMG', value: [0.08, 0.16] }
            ]
        },
        { // 정열의 춤사위
            id: ID.T3_6,
            name: NAMES[ID.T3_6],
            iconPath: `/images/arc-passive/evolution/${ID.T3_6}.webp`,
            pointCost: 10,
            effects: [
                { type: 'EVO_DMG', value: [0.07, 0.14] }
            ]
        },
        // ── 티어 4 ─────────────────────────────────────────────
        { // 회심
            id: ID.T4_1,
            name: NAMES[ID.T4_1],
            iconPath: `/images/arc-passive/evolution/${ID.T4_1}.webp`,
            pointCost: 10,
            effects: [
                { type: 'CRIT_DMG_INC', value: [0.12] }
            ]
        },
        { // 달인
            id: ID.T4_2,
            name: NAMES[ID.T4_2],
            iconPath: `/images/arc-passive/evolution/${ID.T4_2}.webp`,
            pointCost: 10,
            effects: [
                { type: 'CRIT_CHANCE', value: [0.07] },
                { type: 'ADD_DMG', value: [0.085] }
            ]
        },
        { // 분쇄
            id: ID.T4_3,
            name: NAMES[ID.T4_3],
            iconPath: `/images/arc-passive/evolution/${ID.T4_3}.webp`,
            pointCost: 10,
            effects: [
                { type: 'EVO_DMG', value: [0.2] }
            ]
        },
        { // 선각자
            id: ID.T4_4,
            name: NAMES[ID.T4_4],
            iconPath: `/images/arc-passive/evolution/${ID.T4_4}.webp`,
            pointCost: 10,
            effects: [
                { type: 'STAT_HP_P', value: [0.06] },
                { type: 'CDR_P', value: [0.05] }
            ]
        },
        { // 진군
            id: ID.T4_5,
            name: NAMES[ID.T4_5],
            iconPath: `/images/arc-passive/evolution/${ID.T4_5}.webp`,
            pointCost: 10,
            effects: [
                { type: 'STAT_HP_P', value: [0.06] },
                { type: 'SPEED_ATK', value: [0.04] },
                { type: 'SPEED_MOV', value: [0.04] }
            ]
        },
        { // 기원
            id: ID.T4_6,
            name: NAMES[ID.T4_6],
            iconPath: `/images/arc-passive/evolution/${ID.T4_6}.webp`,
            pointCost: 10,
            effects: [
                { type: 'STAT_HP_P', value: [0.06] }
            ]
        },

        // ── 티어 5 ─────────────────────────────────────────────
        { // 뭉툭한 가시
            id: ID.T5_1,
            name: NAMES[ID.T5_1],
            iconPath: `/images/arc-passive/evolution/${ID.T5_1}.webp`,
            special: true,
            pointCost: 15,
            effects: [
                { type: 'EVO_DMG', value: [0.075, 0.15] }
            ]
        },
        { // 음속 돌파
            id: ID.T5_2,
            name: NAMES[ID.T5_2],
            iconPath: `/images/arc-passive/evolution/${ID.T5_2}.webp`,
            special: true,
            pointCost: 15,
            effects: [
                { type: 'EVO_DMG', value: [0.04, 0.08] }
            ]
        },
        { // 인파이팅
            id: ID.T5_3,
            name: NAMES[ID.T5_3],
            iconPath: `/images/arc-passive/evolution/${ID.T5_3}.webp`,
            pointCost: 15,
            effects: [
                { type: 'EVO_DMG', value: [0.09, 0.18] }
            ]
        },
        { // 입식 타격가
            id: ID.T5_4,
            name: NAMES[ID.T5_4],
            iconPath: `/images/arc-passive/evolution/${ID.T5_4}.webp`,
            pointCost: 15,
            effects: [
                { type: 'EVO_DMG', value: [0.105, 0.21] }
            ]
        },
        { // 마나 용광로
            id: ID.T5_5,
            name: NAMES[ID.T5_5],
            iconPath: `/images/arc-passive/evolution/${ID.T5_5}.webp`,
            special: true,
            pointCost: 15,
            effects: [
                { type: 'EVO_DMG', value: [0.12, 0.24] }
            ]
        },
        { // 안정된 관리자
            id: ID.T5_6,
            name: NAMES[ID.T5_6],
            iconPath: `/images/arc-passive/evolution/${ID.T5_6}.webp`,
            pointCost: 15,
        },
    ]
};