/**
 * @/data/arc-passive/elighten/guardian-knight.ts
 *
 * 아크패시브 깨달음(가디언나이트) DB
 *
 * [설계 원칙]
 *   - 
 *
 * ⚠️ 
 */

import { ArkPassiveSectionData } from '@/types/ark-passive';
import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';

// ============================================================
// 아크패시브 깨달음(가디언나이트) ID 상수
// ============================================================

// 공통 Base ID (7081 2 0 00)
const BASE = (ID_AA.ARK_PASSIVE * 1000000) + (ID_BB.GUARDIANKNIGHT * 10000) + (ID_C.ARK_ENLIGHTEN * 1000);

// 스킬별 ID
// D: 티어(1,2,3,4)
// EE: 해당 티어의 노드
export const ID = {
    T1_1: BASE + 101, T1_2: BASE + 102,
    T2_1: BASE + 201, T2_2: BASE + 202,
    T3_1: BASE + 301, T3_2: BASE + 302, T3_3: BASE + 303, T3_4: BASE + 304,
    T4_1: BASE + 401, T4_2: BASE + 402, T4_3: BASE + 403, T4_4: BASE + 404,
};

export const NAMES = {
    [ID.T1_1]: '업화의 계승자', [ID.T1_2]: '드레드 로어',
    [ID.T2_1]: '깨어나는 힘', [ID.T2_2]: '완전 연소',
    [ID.T3_1]: '초비행',[ID.T3_2]: '힘의 제어', [ID.T3_3]: '돌파의 외침', [ID.T3_4]: '날카로운 비늘',
    [ID.T4_1]: '잔불', [ID.T4_2]: '완전 융화', [ID.T4_3]: '한계 초월', [ID.T4_4]: '할버드의 대가',
} as const;

export const ELIGHTEN_GUARDIAN_KNIGHT_DATA: ArkPassiveSectionData = {
    tierMeta: { 1: 24, 2: 24, 3: 34, 4: 34 },
    karma: {
        levelBonus: { type: 'WEAPON_ATK_P', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 0.001) }
    },
    nodes: [
        // ── 티어 1 ──────────────────────────────────
        { // 업화의 계승자
            id: ID.T1_1,
            name: NAMES[ID.T1_1],
            iconPath: `/images/arc-passive/enlightenment/${ID.T1_1}.webp`,
            pointCost: 8,
            effects: [
                { type: 'SPEED_ATK', value: [0.11, 0.13, 0.15], target: {categories: ['GOD_FORM']} },
                { type: 'SPEED_MOV', value: [0.11, 0.13, 0.15], target: {categories: ['GOD_FORM']} }
            ]
        },
        { // 드레드 로어
            id: ID.T1_2,
            name: NAMES[ID.T1_2],
            iconPath: `/images/arc-passive/enlightenment/${ID.T1_2}.webp`,
            pointCost: 24,
            // 일반 스킬 헤드 어택 변경 로직 포함
        },
        // ── 티어 2 ──────────────────────────────────────────────────
        { // 깨어나는 힘
            id: ID.T2_1,
            name: NAMES[ID.T2_1],
            iconPath: `/images/arc-passive/enlightenment/${ID.T2_1}.webp`,
            pointCost: 8,
            // precedeNode: ID.T1_1, // 업화의 계승자 3레벨 필요
            effects: [
                { type: 'CRIT_CHANCE', value: [0.06, 0.13, 0.2] }
            ]
        },
        { // 완전 연소
            id: ID.T2_2,
            name: NAMES[ID.T2_2],
            iconPath: `/images/arc-passive/enlightenment/${ID.T2_2}.webp`,
            pointCost: 8,
            // precedeNode: ID.T1_2, // 드레드 로어 1레벨 필요
            effects: [
                { type: 'CRIT_CHANCE', value: [0.05, 0.1, 0.15] },
            ]
        },
        // ── 티어 3 ──────────────────────────────────────────────────
        { // 초비행
            id: ID.T3_1,
            name: NAMES[ID.T3_1],
            iconPath: `/images/arc-passive/enlightenment/${ID.T3_1}.webp`,
            pointCost: 2,
            effects: [
                { type: 'DMG_INC', value: [0.01, 0.02, 0.03, 0.04, 0.05] }
            ]
        },
        { // 힘의 제어
            id: ID.T3_2,
            name: NAMES[ID.T3_2],
            iconPath: `/images/arc-passive/enlightenment/${ID.T3_2}.webp`,
            pointCost: 8,
            // precedeNode: ID.T2_1,
            effects: [
                { type: 'GK_QI_DMG', value: [0.06, 0.08, 0.1] }
            ]
        },
        { // 돌파의 외침
            id: ID.T3_3,
            name: NAMES[ID.T3_3],
            iconPath: `/images/arc-passive/enlightenment/${ID.T3_3}.webp`,
            pointCost: 8,
            // precedeNode: ID.T2_2,
            effects: [
            { type: 'DMG_INC', value: [0.06, 0.13, 0.2], target: {categories:['BASIC']} }
            ]
        },
        { // 날카로운 비늘 todo: 가디언스케일 해제시 데미지 추가 로직
            id: ID.T3_4,
            name: NAMES[ID.T3_4],
            iconPath: `/images/arc-passive/enlightenment/${ID.T3_4}.webp`,
            pointCost: 2,
            effects: [
                { type: 'DMG_INC', value: [0.01, 0.02, 0.03, 0.04, 0.05] }
            ]
        },
        // ── 티어 4 ──────────────────────────────────────────────────
        { // 잔불
            id: ID.T4_1,
            name: NAMES[ID.T4_1],
            iconPath: `/images/arc-passive/enlightenment/${ID.T4_1}.webp`,
            pointCost: 2,
            effects: [
                { type: 'DMG_INC', value: [0.01, 0.02, 0.03, 0.04, 0.05] },
                { type: 'SPEED_ATK', value: [0.05], target: {categories: ['ENLIGHTEN']} },
                { type: 'SPEED_MOV', value: [0.05], target: {categories: ['ENLIGHTEN']} } 
            ]
        },
        { // 완전 융화
            id: ID.T4_2,
            name: NAMES[ID.T4_2],
            iconPath: `/images/arc-passive/enlightenment/${ID.T4_2}.webp`,
            pointCost: 8,
            // precedeNode: ID.T3_2,
            effects: [
            { type: 'DMG_INC', value: [0.0, 0.04, 0.08] },
            { type: 'DMG_INC', value: [0.0, 0.6, 1.2], target: {skillIds: ['인페르노 버스트']} },
            { type: 'DMG_INC', value: [0.5, 0.5, 0.5], target: {skillIds: ['인페르노 버스트']} }
            ]
        },
        { // 한계 초월 todo: 가디언피어 사용시 5초간 초월상태, 공격속도 증가, 특정스킬5개 피해증가, 2회 제한, 가디언피어 레벨별뎀증 추가 로직
            id: ID.T4_3,
            name: NAMES[ID.T4_3],
            iconPath: `/images/arc-passive/enlightenment/${ID.T4_3}.webp`,
            pointCost: 8,
            // precedeNode: ID.T3_3
        },
        { // 할버드의 대가
            id: ID.T4_4,
            name: NAMES[ID.T4_4],
            iconPath: `/images/arc-passive/enlightenment/${ID.T4_4}.webp`,
            pointCost: 2,
            effects: [
                { type: 'CRIT_DMG_INC', value: [0.04, 0.07, 0.08, 0.11, 0.12] }
            ]
        }
    ]
}
