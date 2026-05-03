/**
 * @/engine/pipeline/finalize-buffer.ts
 *
 * [최종 확정] BufferMap → DamageModifiers
 *
 * [역할]
 *   3단계까지 완성된 SkillBuffer의 BufferMap을
 *   계산 엔진이 소비할 DamageModifiers로 변환
 *
 * [연산 규칙]
 *   같은 type + 같은 subGroup → 합산 후 1회 곱연산
 *   다른 subGroup              → 독립 곱연산
 *
 * [초기값]
 *   MULTIPLY 계열(damageInc, critDamageInc, evoDamage, addDamage,
 *                 critChance, critDamage, spdAtk, spdMov): 기본값 참조
 *   ADD 계열(defPenetration, enemyDamageTaken, cdrC, cdrP): 0
 */

import { DamageModifiers, CommonEffectTypeId, EFFECT_MAP } from '@/types/sim-types';
import { BufferMap, SkillStatsBuffer } from './types';


// ============================================================
// DamageModifiers 초기값
// ============================================================

export const createEmptyDamageModifiers = (): DamageModifiers => ({
  damageInc       : 1.0,
  evoDamage       : 1.0,
  addDamage       : 1.0,
  critChance      : 0,    // 합산형 (기본 0에서 시작, 치명 수치로 별도 계산)
  critDamage      : 2.0,  // 기본 치명타 피해 200%
  critDamageInc   : 1.0,
  defPenetration  : 0,
  enemyDamageTaken: 0,
  cdrC            : 0,
  cdrP            : 0,
  spdAtk          : 1.0,
  spdMov          : 1.0,
});


// ============================================================
// 메인: finalizeBuffer
// ============================================================

/**
 * 스킬 하나의 BufferMap → DamageModifiers 확정
 *
 * EFFECT_MAP을 참조하여 type → field 매핑 후 곱연산 적용
 */
export const finalizeBuffer = (bufferMap: BufferMap): DamageModifiers => {
  const mods = createEmptyDamageModifiers();
  const modRecord = mods as unknown as Record<string, number>;

  Object.entries(bufferMap).forEach(([type, subGroups]) => {
    const entry = EFFECT_MAP[type as CommonEffectTypeId];
    if (!entry) return;

    Object.values(subGroups).forEach(items => {
      const groupSum = items.reduce((s, item) => s + item.v, 0);
      modRecord[entry.field] *= (1 + groupSum);
    });
  });

  return mods;
};


// ============================================================
// 전체 스킬 버퍼 확정
// ============================================================

/**
 * SkillStatsBuffer 전체에 finalizeBuffer 적용
 * 각 스킬 버퍼에 finalMods를 세팅
 */
export const finalizeAllBuffers = (
  skillStatsBuffer: SkillStatsBuffer,
): void => {
  Object.values(skillStatsBuffer).forEach(skillBuffer => {
    skillBuffer.finalMods = finalizeBuffer(skillBuffer.bufferMap);
  });
};
