"use client";

import React from 'react';
import { ENGRAVINGS_DB } from '@/data/engravings';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';

export default function EngravingSimulator() {
  const { slots, updateSlot, finalEfficiency } = useCalculatorStore();

  return (
    <main className="min-h-screen bg-[#0f1215] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_7fr] gap-4">

        {/* [왼쪽 열 - 30% 영역] */}
        <div className="space-y-4">
          {/* 1. 기본 정보 (기존 코드 유지) */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <div className="flex justify-between items-stretch gap-4">
              <div className="flex flex-col justify-center space-y-1">
                <p className="text-xl font-black text-white">소르가나</p>
                <p className="text-orange-500 text-base">아이템 1710.00</p>
                <p className="text-orange-500 text-base leading-none">전투력 2222.22</p>
                <div className="text-sm text-slate-400 pt-2">
                  {[
                    ["서버", "아브렐슈드"],
                    ["길드", "IOl"],
                    ["직업", "가디언나이트"],
                    ["깨달음", "업화의계승자"],
                    ["칭호", "없음"],
                    ["명예", "13"],
                    ["원정대", "265"],
                    ["영지", "이름있는영지"],
                  ].map(([label, value]) => (
                    <p key={label}>
                      <span className="inline-block w-11">{label}</span>
                      <span className="text-slate-200">{value}</span>
                    </p>
                  ))}
                </div>
              </div>
              <div className="w-[150px] h-[250px] bg-slate-800 rounded border border-slate-700 relative overflow-hidden flex-shrink-0">
                <img src="https://img.lostark.co.kr/armory/6/3BABD7DDE88F6BEE01CF19940559FB48264DABF217E51B3A46BC9970DAD04BA6.jpg" alt="Char" className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </div>

          {/* 요청1: 전투 스탯 (2열 표시) */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <div className="grid grid-cols-2 gap-x-6 text-sm">
              {[
                ["공격력", "58,230"], ["최대생명력", "185,000"],
                ["치명", "1850"], ["제압", "54"],
                ["특화", "650"], ["인내", "52"],
                ["신속", "550"], ["숙련", "48"],
                ["힘/민/지", "185,200"], ["무기공격력", "45,200"]
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between border-slate-800/50 pb-1">
                  <span className="text-slate-400 text-xs">{label}</span>
                  <span className="font-bold text-slate-200">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 요청3: 아크 그리드 (2행 분리) */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <h2 className="text-sm font-bold mb-4 text-yellow-500 border-b border-slate-700 pb-2">아크 그리드</h2>
            <div className="space-y-6">
              {/* 1행: 코어 정보 */}
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                {["질서-해", "질서-달", "질서-별", "혼돈-해", "혼돈-달", "혼돈-별"].map((core) => (
                  <div key={core} className="flex items-center gap-2 bg-slate-800/40 p-2 rounded">
                    <div className="w-4 h-4 bg-yellow-600/50 rounded-full"></div>
                    <span className="flex-1 text-slate-300">{core}</span>
                    <span className="text-yellow-500 font-bold">20pt</span>
                  </div>
                ))}
              </div>
              {/* 2행: 부가 옵션 */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs border-t border-slate-800 pt-3">
                {["보스피해", "추가피해", "공격력", "낙인력", "아군피해강화", "아군공격강화"].map((opt) => (
                  <div key={opt} className="flex justify-between">
                    <span className="text-slate-500">{opt}</span>
                    <span className="text-slate-300">+4.5%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. 각인 정보 섹션 */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg relative">
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
              <h2 className="text-sm font-bold text-orange-400">각인 효과</h2>
              
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-slate-500 font-medium">각인 총 피해량</span>
                {/* 실시간 계산된 합계 표시 */}
                <span className="text-xl font-black text-orange-400 italic">
                  {finalEfficiency > 0 ? `${finalEfficiency.toFixed(2)}%` : "READY"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] mb-2 px-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <div>각인 선택</div>
              <div className="text-center">유물</div>
              <div className="text-center">스톤</div>
              <div className="text-right">딜 증가율</div>
            </div>

            <div className="space-y-1">
              {slots.map((slot, idx) => (
                <div key={idx} className="grid grid-cols-[2fr_0.4fr_0.4fr_1fr] gap-1 items-center hover:border-slate-700 transition-colors">
                  <select
                    value={slot.engravingId}
                    onChange={(e) => updateSlot(idx, "engravingId", e.target.value)}
                    className="bg-transparent text-sm text-slate-200 outline-none focus:text-orange-400 cursor-pointer"
                  >
                    <option value="">각인 선택 안함</option>
                    {ENGRAVINGS_DB.map(eng => (
                      <option key={eng.id} value={eng.id}>{eng.name}</option>
                    ))}
                  </select>

                  <select 
                    value={slot.relicLevel}
                    className="bg-[#1c1f23] border border-slate-700 rounded text-sm text-slate-400 p-1 text-center outline-none"
                    onChange={(e) => updateSlot(idx, "relicLevel", e.target.value)}
                  >
                    {[0, 1, 2, 3, 4].map(v => <option key={v} value={v}>Lv.{v}</option>)}
                  </select>

                  <select 
                    value={slot.abilityLevel}
                    className="bg-[#1c1f23] border border-slate-700 rounded text-sm text-slate-400 p-1 text-center outline-none"
                    onChange={(e) => updateSlot(idx, "abilityLevel", e.target.value)}
                  >
                    {[0, 1, 2, 3, 4].map(v => <option key={v} value={v}>Lv.{v}</option>)}
                  </select>

                  {/* 훅에서 이미 계산되어 넘어온 값을 그대로 출력 */}
                  <div className="text-right text-sm font-mono text-emerald-400">
                    +{slot.displayValue}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. 카드 세트 정보 */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <h2 className="text-sm font-bold mb-4 text-blue-300 border-b border-slate-700 pb-2">카드 세트</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white">세상을 구하는 빛</span>
                <span className="text-[10px] px-2 py-0.5 bg-blue-900/30 text-blue-400 border border-blue-500/30 rounded">30각성</span>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-md text-[11px] text-slate-400 leading-relaxed">
                <p>• 공격 속성 성속성으로 변경</p>
                <p>• 성속성 피해량 <span className="text-slate-200">+15.0%</span> 증가</p>
              </div>
            </div>
          </div>
        </div>

        {/* [오른쪽 열 - 70% 영역] */}
        <div className="space-y-4">
          {/* 요청2: 장비칸 (2개 열 추가 분리) */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <h2 className="text-sm font-bold mb-4 text-blue-400 border-b border-slate-700 pb-2">장비 및 악세서리</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 1열: 방어구/무기/보구 */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 mb-2 underline">전투 장비</p>
                {["무기", "머리", "상의", "하의", "장갑", "어깨", "보구"].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-2 bg-slate-800/30 rounded border border-slate-700/50">
                    <div className="w-10 h-10 bg-orange-900/20 border border-orange-500/50 rounded"></div>
                    <span className="text-sm">{item} <span className="text-xs text-slate-500 ml-2">고대 25강</span></span>
                  </div>
                ))}
              </div>
              {/* 2열: 장신구/팔찌/스톤 */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 mb-2 underline">장신구</p>
                {["목걸이", "귀걸이 1", "귀걸이 2", "반지 1", "반지 2", "팔찌", "어빌리티 스톤"].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-2 bg-slate-800/30 rounded border border-slate-700/50">
                    <div className="w-10 h-10 bg-purple-900/20 border border-purple-500/50 rounded"></div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 요청4: 보석칸 (간략화 정보) */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <div className="flex justify-between items-end mb-4 border-b border-slate-700 pb-2">
              <h2 className="text-sm font-bold text-purple-400">보석 세팅</h2>
              <p className="text-xs text-slate-400">겁화 <span className="text-orange-400">6</span> / 작열 <span className="text-cyan-400">5</span> <span className="ml-2 text-slate-500">공증합: +42%</span></p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-800/20 rounded text-[11px] border border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-900/40 rounded-full border border-purple-500/30 flex items-center justify-center text-[8px]">10</div>
                    <span className="text-slate-300">스킬명 {i+1}</span>
                  </div>
                  <span className={i < 6 ? "text-orange-400" : "text-cyan-400"}>{i < 6 ? "겁화" : "작열"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 요청5: 아크 패시브 (3열 표시 + 카르마) */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg relative">
            <h2 className="text-sm font-bold mb-4 text-cyan-400 border-b border-slate-700 pb-2">아크 패시브</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {["진화", "깨달음", "도약"].map((tab) => (
                <div key={tab} className="p-4 bg-slate-800/50 rounded-lg text-center border border-slate-700">
                  <p className="text-xs text-slate-500 mb-1">{tab}</p>
                  <p className="text-lg font-bold text-white">120 <span className="text-[10px] font-normal text-slate-500">pt</span></p>
                </div>
              ))}
            </div>
            {/* 우측 하단 카르마 정보 */}
            <div className="absolute bottom-4 right-6 text-right">
              <p className="text-[10px] text-slate-500">카르마 랭크 <span className="text-cyan-400 ml-1 italic font-bold">RANK 4</span></p>
              <p className="text-[10px] text-slate-500">카르마 레벨 <span className="text-white ml-1">Lv. 80</span></p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}