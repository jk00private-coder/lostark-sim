/**
 * @/data/accessory-option-grades.ts
 *
 * 악세서리/팔찌 연마효과 상/중/하 등급 판별 DB
 *
 * [설계 원칙]
 *   - 각 옵션마다 상/중/하 3개의 고정 수치가 존재합니다
 *   - 수치가 정확히 일치하는 경우 해당 등급을 반환합니다
 *   - 공격력 고정(+) 옵션은 색깔(#99ff99)로만 구분 — 상중하 판별 불필요
 *
 * [색깔 매핑]
 *   상 → #FE9600 (주황)
 *   중 → #CE43FC (보라)
 *   하 → #00B5FF (파랑)
 *   고정값 → #99ff99 (초록) — 상중하 판별 대상 아님
 *
 * [데이터 출처]
 *   로스트아크 공식 확률 페이지 + raw JSON 실측값 기반
 *   https://m-lostark.game.onstove.com/Probability/장신구 연마
 *
 * ⚠️ 패치로 수치가 변경되면 이 파일만 수정하면 됩니다
 */

import { OptionGrade } from '@/types/character-types';

/** 옵션 등급별 고정 수치 */
interface OptionGradeValues {
  high: number;  // 상 옵션 수치
  mid : number;  // 중 옵션 수치
  low : number;  // 하 옵션 수치
}

/**
 * 악세서리 연마효과 상/중/하 고정 수치 테이블
 * key: sim-types.ts 의 EffectTypeId
 *
 * [티어 4 수치 — 유물/고대 동일]
 */
export const ACCESSORY_GRADE_TABLE: Record<string, OptionGradeValues> = {
  // ── 목걸이 ──────────────────────────────────────────────
  'ADD_DMG': { high: 0.016, mid: 0.012, low: 0.008 }, // 추가 피해
  'DMG_INC': { high: 0.016, mid: 0.012, low: 0.008 }, // 적에게 주는 피해

  // ── 귀걸이 ──────────────────────────────────────────────
  'ATK_PERCENT'       : { high: 0.012,  mid: 0.0095, low: 0.0055 }, // 공격력 %
  'WEAPON_ATK_PERCENT': { high: 0.024,  mid: 0.018,  low: 0.010  }, // 무기 공격력 %

  // ── 반지 ────────────────────────────────────────────────
  'CRIT_DMG'   : { high: 0.032,  mid: 0.024,  low: 0.016  }, // 치명타 피해
  'CRIT_CHANCE': { high: 0.012,  mid: 0.0095, low: 0.0055 }, // 치명타 적중률

  // ── 공통 (고정 공격력 +) ─────────────────────────────────
  // ATK_STATIC 은 색깔(#99ff99)로만 구분하므로 수치 판별 불필요
  // 참고용: 상=390, 중=195, 하=80
};

/**
 * 팔찌 랜덤 옵션 상/중/하 고정 수치 테이블
 *
 * [티어 4 수치]
 */
export const BRACELET_GRADE_TABLE: Record<string, OptionGradeValues> = {
  'CRIT_DMG'    : { high: 0.10,  mid: 0.07,  low: 0.04  }, // 치명타 피해
  'CRIT_DMG_INC': { high: 0.015, mid: 0.010, low: 0.005 }, // 치명타 시 피해 증가
  'ADD_DMG'     : { high: 0.035, mid: 0.025, low: 0.015 }, // 추가 피해
  'DMG_INC'     : { high: 0.025, mid: 0.018, low: 0.010 }, // 헤드어택/백어택 피해
};

/**
 * 수치 기반으로 옵션 등급을 판별합니다.
 * data-normalizer.ts 의 detectOptionGrade() 를 대체합니다.
 *
 * 색깔 기반 판별(현재)과 병행 사용 가능:
 *   1차: color 기반 판별 (API가 색깔을 직접 제공)
 *   2차: 색깔 없는 경우 수치 기반 판별 (이 함수)
 *
 * @param effectType  - sim-types.ts 의 EffectTypeId
 * @param value       - 파싱된 수치 (소수, 예: 0.016)
 * @param isAccessory - true=악세서리, false=팔찌
 */
export const getOptionGrade = (
  effectType : string,
  value      : number,
  isAccessory: boolean = true
): OptionGrade => {
  const table = isAccessory ? ACCESSORY_GRADE_TABLE : BRACELET_GRADE_TABLE;
  const entry = table[effectType];

  if (!entry) return 'LOW'; // 테이블에 없는 옵션 → 하로 처리

  // 고정 수치와 정확히 비교 (부동소수점 오차 허용: ±0.0001)
  const EPSILON = 0.0001;
  if (Math.abs(value - entry.high) < EPSILON) return 'HIGH';
  if (Math.abs(value - entry.mid)  < EPSILON) return 'MID';
  if (Math.abs(value - entry.low)  < EPSILON) return 'LOW';

  // 고정 수치에 해당하지 않으면 범위로 판별 (fallback)
  if (value >= entry.high) return 'HIGH';
  if (value >= entry.mid)  return 'MID';
  return 'LOW';
};