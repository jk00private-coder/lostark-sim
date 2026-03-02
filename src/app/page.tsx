import React from 'react';

export default function CharacterDetailPage() {
  return (
    <main className="min-h-screen bg-[#0f1215] text-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* [1단] 기본정보 & 장비칸 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 왼쪽: 기본 정보 & 캐릭터 이미지 */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-600 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-orange-400">캐릭터 정보</h2>
            <div className="flex gap-6">
              <div className="flex-1 space-y-3">
                <p className="text-sm text-slate-400">서버: <span className="text-white">카제로스</span></p>
                <p className="text-sm text-slate-400">길드: <span className="text-white">아만서버최강</span></p>
                <p className="text-2xl font-black text-white">닉네임닉네임</p>
                <p className="text-lg font-bold text-orange-500">Lv. 1620.00</p>
              </div>
              <div className="w-32 h-40 bg-slate-700 rounded flex items-center justify-center text-xs text-slate-500">
                캐릭터 전신샷
              </div>
            </div>
          </div>
          
          {/* 오른쪽: 장비칸 */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-400">장비 (Equip)</h2>
            <div className="grid grid-cols-6 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-[10px]">
                  방어구 {i+1}
                </div>
              ))}
              <div className="col-span-2 aspect-square bg-orange-900/20 border border-orange-500/50 rounded flex items-center justify-center">무기</div>
            </div>
          </div>
        </section>

        {/* [2단] 전투스탯 & 보석칸 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 왼쪽: 전투 스탯 */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-green-400">전투 특성</h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>치명</span> <span className="font-bold text-white">1850</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>신속</span> <span className="font-bold text-white">650</span>
              </div>
            </div>
          </div>

          {/* 오른쪽: 보석칸 */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-400">보석 (Jewels)</h2>
            <div className="grid grid-cols-6 gap-2">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-800 rounded-full border border-purple-500/30 flex items-center justify-center text-[10px]">
                  {i+1}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* [3단] 아크그리드 & 아크패시브 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 왼쪽: 아크그리드 */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg min-h-[200px]">
            <h2 className="text-xl font-bold mb-4 text-yellow-500">아크 그리드</h2>
            <div className="grid grid-cols-5 gap-1 opacity-50">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="w-full aspect-square bg-slate-700/30 rounded-sm"></div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 아크패시브 */}
          <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg min-h-[200px]">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">아크 패시브</h2>
            <div className="space-y-3">
              <div className="h-4 bg-slate-800 rounded w-full"></div>
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}