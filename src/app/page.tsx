import React from 'react';

export default function CharacterDetailedPage() {
  return (
    <main className="min-h-screen bg-[#0f1215] text-slate-200 p-4 md:p-8 font-sans">
      {/* 전체 컨테이너를 2열로 나눕니다. 
         3:7 비율을 위해 grid-cols-[3fr_7fr] 사용 
      */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_7fr] gap-6">
        
        {/* [왼쪽 열 - 30% 영역] */}
        <div className="space-y-6">
          {/* 1. 기본 정보 */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-orange-400 border-b border-slate-700 pb-2">기본 정보</h2>
            <div className="space-y-4">
              <div className="w-full aspect-[3/4] bg-slate-800 rounded flex items-center justify-center text-slate-500 border border-slate-700">
                캐릭터 전신샷
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black text-white">닉네임닉네임</p>
                <p className="text-orange-500 font-bold">Lv. 1620.00</p>
                <div className="text-sm text-slate-400">
                  <p>서버: <span className="text-slate-200">카제로스</span></p>
                  <p>길드: <span className="text-slate-200">아만서버최강</span></p>
                  <p>직업: <span className="text-slate-200">슬레이어</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 전투 스탯 (세로로 자유롭게 길어짐) */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-green-400 border-b border-slate-700 pb-2">전투 특성</h2>
            <div className="space-y-3">
              {[["치명", 1850], ["신속", 650], ["특화", 50]].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 아크 그리드 */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-yellow-500 border-b border-slate-700 pb-2">아크 그리드</h2>
            <div className="grid grid-cols-5 gap-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-800 rounded-sm border border-slate-700"></div>
              ))}
            </div>
          </div>
        </div>

        {/* [오른쪽 열 - 70% 영역] */}
        <div className="space-y-6">
          {/* 1. 장비칸 */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-blue-400 border-b border-slate-700 pb-2">착용 장비</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* 장비 아이템 예시 */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded border border-slate-700">
                  <div className="w-12 h-12 bg-slate-700 rounded border border-orange-500/50"></div>
                  <div>
                    <p className="text-xs text-slate-400">머리 방어구</p>
                    <p className="text-sm font-bold text-orange-400">+25 고대</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 보석칸 (보석은 많으므로 70% 영역에 두는게 유리) */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-purple-400 border-b border-slate-700 pb-2">보석 세팅</h2>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-full aspect-square bg-slate-800 rounded-full border border-purple-500/40 flex items-center justify-center">
                    <span className="text-[10px] text-purple-300">10레벨</span>
                  </div>
                  <span className="text-[10px] text-slate-500">멸화</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 아크 패시브 */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-cyan-400 border-b border-slate-700 pb-2">아크 패시브</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-slate-800/30 rounded border border-slate-700">진화 (Point: 120)</div>
              <div className="p-4 bg-slate-800/30 rounded border border-slate-700">깨달음 (Point: 90)</div>
              <div className="p-4 bg-slate-800/30 rounded border border-slate-700">도약 (Point: 40)</div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}