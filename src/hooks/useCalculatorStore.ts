// @/hooks/useCalculatorStore.ts
"use client";

import { useState } from 'react';
import { CharacterProfile, CombatStats, StatModifiers, DamageModifiers } from '@/types/sim-types';
import { ENGRAVINGS_DB } from '@/data/engravings';

export const useCalculatorStore = () => {
  // 1. 캐릭터 기본 프로필 (이름, 레벨 등)
  const [profile, setProfile] = useState<CharacterProfile>({
    name: '소르가나',
    itemLevel: 1680,
    combatPower: 0,
    server: '카단',
    guild: '가디언나이트',
    className: '가디언나이트',
    enlightenment: '60',
    title: '성취자',
    honorLevel: 80,
    expeditionLevel: 300,
    territoryName: '내 영지'
  });

  // 2. 모든 전투 수치 (공격력, 피증, 치적 등) - 일단 다 0으로 시작!
  const [stats, setStats] = useState<CombatStats & StatModifiers & DamageModifiers>({
    baseAtk: 140586, mainStat: 501376, weaponAtk: 154804, 
    critical: 580, specialization: 1823, swiftness: 163,
    hp: 0, domination: 0, endurance: 0, expertise: 0,
    mainStatStatic: 0, mainStatPercent: 0,
    weaponAtkStatic: 0, weaponAtkPercent: 0,
    baseAtkPercent: 0, atkStatic: 0, atkPercent: 0,
    damageInc: 0.21, // 원한 21% 기본 적용 예시
    evolutionDamage: 0, specialDamage: 0,
    additionalDamage: 0, critChance: 0.15, // 아드레날린 15% 예시
    critDamage: 2.0, critDamageInc: 0,
    defensePenetration: 0, targetDamageTaken: 0,
    atkSpeed: 0, movSpeed: 0, cooldownReduction: 0
  });

  // 각인 슬롯 상태 (최대 5~6개)
  const [slots, setSlots] = useState([
    { engravingId: '', relicLevel: 0, abilityLevel: 0, displayValue: "0.00" },
    { engravingId: '', relicLevel: 0, abilityLevel: 0, displayValue: "0.00" },
    // 필요에 따라 슬롯 개수 조절
  ]);

  const updateSlot = (idx: number, field: string, value: any) => {
    const newSlots = [...slots];
    newSlots[idx] = { ...newSlots[idx], [field]: value };

    // 여기서 "실제 데미지 증가율"을 계산하여 displayValue를 업데이트합니다.
    const engraving = ENGRAVINGS_DB.find(e => e.id === newSlots[idx].engravingId);
    if (engraving) {
      // 단순화된 계산: 피해 증가(DMG_INC)나 공격력 증가 수치를 가져옵니다.
      // 실제로는 복잡한 데미지 공식이 들어가야 하지만, 
      // 우선 사용자님 요청대로 "피해 관련 수치"의 합산 혹은 효율을 계산합니다.
      let totalEff = 0;
      engraving.effects?.forEach(eff => {
        if (eff.type === 'DMG_INC' || eff.type === 'ATK_PERCENT') {
          totalEff += eff.value * 100;
        }
      });
      newSlots[idx].displayValue = totalEff.toFixed(2);
    } else {
      newSlots[idx].displayValue = "0.00";
    }

    setSlots(newSlots);
  };

  return { profile, stats, setProfile, setStats, slots, updateSlot };
};