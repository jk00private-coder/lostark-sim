import { ENGRAVINGS_DB } from '@/data/engravings';
import { EFFECT_TYPES, EffectTypeId } from '@/types/sim-types';

/**
 * [자동 초기화 함수]
 * EFFECT_TYPES 배열을 순회하며 모든 키를 0으로 채운 객체를 생성합니다.
 */
const createEmptyTotals = (): Record<EffectTypeId, number> => {
  return EFFECT_TYPES.reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {} as Record<EffectTypeId, number>);
};

/**
 * 특정 슬롯의 각인 효과들을 성격별로 분류하여 합산합니다.
 */
export const getSlotStatTotals = (slot: { 
  engravingId: string; 
  relicLevel: number; 
  abilityLevel: number 
}) => {
  const totals = createEmptyTotals(); // 자동 초기화
  const engraving = ENGRAVINGS_DB.find(e => e.id === slot.engravingId);

  if (!engraving) return totals;

  // 1. 기본 수치 합산 (baseEffects)
  engraving.baseEffects.forEach(eff => {
    totals[eff.type] += eff.value;
  });

  // 2. 유물 보너스 합산
  if (slot.relicLevel > 0 && engraving.bonus?.relic) {
    const relic = engraving.bonus.relic;
    totals[relic.type] += relic.values[slot.relicLevel - 1];
  }

  // 3. 어빌리티 보너스 합산
  if (slot.abilityLevel > 0 && engraving.bonus?.ability) {
    const ability = engraving.bonus.ability;
    totals[ability.type] += ability.values[slot.abilityLevel - 1];
  }

  return totals;
};

/**
 * [통합 효율 계산 엔진]
 * 각인별 DMG_INC는 곱연산, ATK_INC_PERCENT는 합연산으로 계산합니다.
 */
export const calculateFinalEfficiency = (slots: { 
  engravingId: string; 
  relicLevel: number; 
  abilityLevel: number 
}[]) => {
  let totalDmgMult = 1;     // 피해 증가 곱연산용
  let totalAtkBonus = 0;    // 공격력 증가 합연산용
  
  slots.forEach(slot => {
    if (!slot.engravingId) return;
    
    const stats = getSlotStatTotals(slot);
    
    // 피해 증가(원한 등)는 각인마다 독립 곱연산
    if (stats.DMG_INC > 0) {
      totalDmgMult *= (1 + stats.DMG_INC);
    }
    
    // 공격력 증가(아드 등)는 각인간 합연산
    totalAtkBonus += stats.ATK_INC_PERCENT;
  });

  // 최종 배율 = (피증 곱) * (1 + 공증 합)
  const finalMultiplier = totalDmgMult * (1 + totalAtkBonus);
  
  return (finalMultiplier - 1) * 100; // 증가량 % 반환
};