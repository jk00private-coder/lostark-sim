"use client";

import React, { useState } from 'react';
import { ENGRAVINGS_DB } from '@/data/engravings';
import { BaseSimData } from '@/types/sim-types';

export default function EngravingSimulator() {
  // 5개의 각인 슬롯 상태 (id, 유물레벨, 어빌레벨을 관리)
  const [slots, setSlots] = useState(
    Array(5).fill(null).map(() => ({
      engravingId: "",
      relicLevel: 0,
      abilityLevel: 0,
    }))
  );

  const handleUpdateSlot = (index: number, key: string, value: any) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [key]: value };
    setSlots(newSlots);
  };

  return (
    <div className="p-6 bg-[#1c1f23] rounded-xl border border-slate-800 w-full max-w-4xl mx-auto">
      <h2 className="text-orange-400 font-bold mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-orange-400 rounded-full"></span>
        각인 설정 시뮬레이션
      </h2>
      
      {/* 헤더 부분 */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 mb-2 px-2 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
        <div>각인 선택</div>
        <div className="text-center">유물 레벨</div>
        <div className="text-center">어빌리티 스톤</div>
        <div className="text-right">데미지 증가율</div>
      </div>

      {/* 각인 슬롯 리스트 */}
      <div className="space-y-2">
        {slots.map((slot, idx) => (
          <div 
            key={idx} 
            className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center bg-[#0f1215] p-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          >
            {/* 1열: 각인명 선택 */}
            <select
              value={slot.engravingId}
              onChange={(e) => handleUpdateSlot(idx, "engravingId", e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none focus:text-orange-400 cursor-pointer"
            >
              <option value="">각인 선택 안함</option>
              {ENGRAVINGS_DB.map(eng => (
                <option key={eng.id} value={eng.id}>{eng.name}</option>
              ))}
            </select>

            {/* 2열: 유물 레벨 선택 (고정 1,2,3,4) */}
            <select 
              className="bg-[#1c1f23] border border-slate-700 rounded text-[11px] text-slate-400 p-1 text-center outline-none"
              onChange={(e) => handleUpdateSlot(idx, "relicLevel", e.target.value)}
            >
              {[0, 1, 2, 3, 4].map(v => <option key={v} value={v}>Lv.{v}</option>)}
            </select>

            {/* 3열: 어빌리티 스톤 (고정 1,2,3,4) */}
            <select 
              className="bg-[#1c1f23] border border-slate-700 rounded text-[11px] text-slate-400 p-1 text-center outline-none"
              onChange={(e) => handleUpdateSlot(idx, "abilityLevel", e.target.value)}
            >
              {[0, 1, 2, 3, 4].map(v => <option key={v} value={v}>스톤 Lv.{v}</option>)}
            </select>

            {/* 4열: 실제 데미지 증가율 (요청하신 대로 고정값 4.23%) */}
            <div className="text-right text-xs font-mono text-emerald-400">
              {slot.engravingId ? "+4.23%" : "0.00%"}
            </div>
          </div>
        ))}
      </div>

      {/* 하단 총합 섹션 (나중에 계산 엔진과 연결) */}
      <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-end">
        <div>
          <p className="text-[10px] text-slate-500 mb-1">SELECTED ENGRAVINGS</p>
          <div className="flex gap-2">
            {slots.filter(s => s.engravingId).map((s, i) => (
              <span key={i} className="text-[9px] bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
                {ENGRAVINGS_DB.find(e => e.id === s.engravingId)?.name}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-500 block">예상 최종 피해량</span>
          <span className="text-3xl font-black text-orange-400 italic">READY</span>
        </div>
      </div>
    </div>
  );
}