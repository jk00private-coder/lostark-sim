/**
 * @/data/equipment-sets.ts
 *
 * 장비 이름 키워드 → 세트 타입 매핑 DB
 *
 * [설계 원칙]
 *   - 세트 이름은 직업과 무관하게 공통입니다
 *   - 장비 이름에 키워드가 포함되면 해당 세트 타입으로 판별합니다
 *   - 패치로 새 세트가 추가되면 이 파일에만 추가하면 됩니다
 *
 * [판별 우선순위]
 *   배열 순서대로 검사 → 첫 번째 매칭 반환
 *   더 구체적인 키워드를 앞에 배치합니다
 *
 * [티어별 세트 현황]
 *   티어 4:
 *     NORMAL_RELIC  → "결단" (일반 유물)
 *     AEGIR_ANCIENT → "업화" (에기르 고대)
 *     SERCA_ANCIENT → "전율" (세르카 고대)
 */

import { EquipmentSetType } from '@/types/character-types';

export interface EquipmentSetEntry {
  keyword: string;          // 장비 이름에서 찾을 키워드
  setType: EquipmentSetType; // 매핑할 세트 타입
}

/**
 * 장비 세트 키워드 매핑 테이블
 * data-normalizer.ts 의 detectSetType() 에서 사용합니다
 */
export const EQUIPMENT_SET_TABLE: EquipmentSetEntry[] = [
  // ── 티어 4 ──────────────────────────────────────────────
  { keyword: '업화', setType: 'AEGIR_ANCIENT'  }, // 에기르 고대
  { keyword: '전율', setType: 'SERCA_ANCIENT'  }, // 세르카 고대
  { keyword: '결단', setType: 'NORMAL_RELIC'   }, // 일반 유물

  // ── 추후 추가 예정 ───────────────────────────────────────
  // 새 레이드 세트가 추가되면 여기에 추가합니다
  // { keyword: 'XXX', setType: 'NEW_SET' },
];

/**
 * 장비 이름에서 세트 타입을 판별합니다.
 * data-normalizer.ts 의 detectSetType() 를 대체합니다.
 *
 * @param name - 장비 이름 (예: "+18 운명의 업화 할버드")
 * @returns EquipmentSetType
 */
export const getEquipmentSetType = (name: string): EquipmentSetType => {
  for (const entry of EQUIPMENT_SET_TABLE) {
    if (name.includes(entry.keyword)) return entry.setType;
  }
  return 'UNKNOWN';
};