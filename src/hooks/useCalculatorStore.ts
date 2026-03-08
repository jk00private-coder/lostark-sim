"use client";

import { useState, useMemo } from 'react';
import { calculateFinalEfficiency, getSlotStatTotals } from '@/utils/calculator';

export const useCalculatorStore = () => {
  // 1. 순수 데이터 상태
  const [slots, setSlots] = useState(
    Array(5).fill(null).map(() => ({
      engravingId: "",
      relicLevel: 0,
      abilityLevel: 0,
    }))
  );

  // 2. 데이터 수정 함수 (숫자 형변환 포함)
  const updateSlot = (index: number, key: string, value: any) => {
    setSlots((prev) => {
      const next = [...prev];
      // 레벨 값들은 계산을 위해 숫자로 변환하여 저장
      const formattedValue = (key === "relicLevel" || key === "abilityLevel") 
        ? Number(value) 
        : value;
        
      next[index] = { ...next[index], [key]: formattedValue };
      return next;
    });
  };

  // 3. [가공] 화면에 보여줄 슬롯별 개별 수치 합산
  const processedSlots = useMemo(() => {
    return slots.map(slot => {
      const stats = getSlotStatTotals(slot);
      // 각 슬롯이 가진 모든 수치(피증, 공증 등)를 단순 합산하여 % 문자열로 변환
      const total = Object.values(stats).reduce((a, b) => a + b, 0) * 100;
      return {
        ...slot,
        displayValue: total.toFixed(2)
      };
    });
  }, [slots]);

  // 4. [가공] 엔진을 이용한 최종 효율 계산
  const finalEfficiency = useMemo(() => {
    return calculateFinalEfficiency(slots);
  }, [slots]);

  return {
    slots: processedSlots, // 계산된 displayValue가 포함된 슬롯 리스트
    updateSlot,
    finalEfficiency,
  };
};