/**
 * @/data/arc-passive/leap/guardian-knight.ts
 *
 * 아크패시브 도약 2티어 가디언 나이트 DB
 *
 * [설계 원칙]
 *   - 
 *
 * ⚠️ 
 */

import { ArkPassiveNodeData } from '@/types/ark-passive';
import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';

// ============================================================
// 아크패시브-도약 ID 상수
// ============================================================

// 공통 Base ID (7081 3 0 00)
const BASE = (ID_AA.ARK_PASSIVE * 1000000) + (ID_BB.GUARDIANKNIGHT * 10000) + (ID_C.ARK_LEAP * 1000);

// 스킬별 ID
// D: 티어(1,2)
// EE: 해당 티어의 노드
export const ID = {
    T2_1: BASE + 201, T2_2: BASE + 202, T2_3: BASE + 203, T2_4: BASE + 204
};

export const NAMES = {
    [ID.T2_1]: '일점 돌파', [ID.T2_2]: '파멸의 피', [ID.T2_3]: '궤도 충돌', [ID.T2_4]: '대강하',
} as const;

export const LEAP_GUARDIAN_KNIGHT_DATA: ArkPassiveNodeData[] = [
    { // 일점 돌파
        id: ID.T2_1,
        name: NAMES[ID.T2_1],
        iconPath: `/images/arc-passive/leap/${ID.T2_1}.webp`,
        pointCost: 10,
        //todo: 4개 노드 상호 배타적 조건, 트포에있는 오버라이드 필요함
        // exclusiveWith: [ID.T2_2, ID.T2_3, ID.T2_4],
        effects: [
            { type: 'DMG_INC', value: [0.15, 0.34, 0.53], target: {skillIds: ['소울 디바이드']} }
        ]
    },
    { // 파멸의 피
        id: ID.T2_2,
        name: NAMES[ID.T2_2],
        iconPath: `/images/arc-passive/leap/${ID.T2_2}.webp`,
        pointCost: 10,
        // exclusiveWith: [ID.T2_1, ID.T2_3, ID.T2_4],
        effects: [
            { type: 'DMG_INC', value: [0.2, 0.4, 0.6], target: {skillIds: ['소울 디바이드']} }
        ]
    },
    { // 궤도 충돌
        id: ID.T2_3,
        name: NAMES[ID.T2_3],
        iconPath: `/images/arc-passive/leap/${ID.T2_3}.webp`,
        pointCost: 10,
        // exclusiveWith: [ID.T2_1, ID.T2_2, ID.T2_4],
        effects: [
            { type: 'DMG_INC', value: [0.32, 0.49, 0.66], target: {skillIds: ['딥 임팩트']} }
        ]
    },
    { // 대강하
        id: ID.T2_4,
        name: NAMES[ID.T2_4],
        iconPath: `/images/arc-passive/leap/${ID.T2_4}.webp`,
        pointCost: 10,
        // exclusiveWith: [ID.T2_1, ID.T2_2, ID.T2_3],
        effects: [
            { type: 'DMG_INC', value: [0.0, 0.16, 0.32], target: {skillIds: ['딥 임팩트']} },
            { type: 'GK_QI_COST', value: [4], target: {skillIds: ['딥 임팩트']} }
        ]
    }
]
