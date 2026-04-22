// @/app/page.tsx
"use client";

import { useMemo } from 'react';
import CharacterSearch from '@/components/CharacterSearch';
import { useSimulatorStore } from '@/hooks/useSimulatorStore';

export default function EngravingSimulator() {
  const { displayData, setDisplayData, skillDamageResults } = useSimulatorStore();

  // 그래프용 최대값
  const maxDamage = useMemo(() =>
    Math.max(...skillDamageResults.map(r => r.totalDamage), 1),
    [skillDamageResults]
  );

  return (
    <main className="min-h-screen bg-[#0f1215] text-slate-200 p-4 md:p-8 font-sans">

      {/* 캐릭터 검색 */}
      <CharacterSearch onDataLoaded={setDisplayData} />

      {/* 데이터 미로드 */}
      {!displayData && (
        <div className="flex items-center justify-center h-64 text-slate-500">
          <p className="text-sm">캐릭터명을 검색하면 정보가 표시됩니다.</p>
        </div>
      )}

      {/* 데이터 로드 완료 */}
      {displayData && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_7fr] gap-4">

          {/* ── 왼쪽 열 ─────────────────────────────────── */}
          <div className="space-y-4">

            {/* 1. 기본 정보 */}
            <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
              <div className="flex justify-between items-stretch gap-4">
                <div className="flex flex-col justify-center space-y-1">
                  <p className="text-xl font-black text-white">
                    {displayData.profile.name}
                  </p>
                  <p className="text-orange-500 text-base">
                    아이템 {displayData.profile.itemAvgLevel.toFixed(2)}
                  </p>
                  <p className="text-orange-500 text-base leading-none">
                    전투력 {displayData.profile.combatPower.toFixed(2)}
                  </p>
                  <div className="text-sm text-slate-400 pt-2">
                    {[
                      ['서버', displayData.profile.serverName],
                      ['길드', displayData.profile.guildName],
                      ['직업', displayData.profile.className],
                      ['칭호', displayData.profile.title],
                      ['명예', String(displayData.profile.honorLevel)],
                      ['원정대', String(displayData.profile.expeditionLevel)],
                      ['영지', displayData.profile.townName],
                    ].map(([label, value]) => (
                      <p key={label}>
                        <span className="inline-block w-11">{label}</span>
                        <span className="text-slate-200">{value}</span>
                      </p>
                    ))}
                  </div>
                </div>
                <div className="w-[150px] h-[250px] bg-slate-800 rounded border border-slate-700
                                relative overflow-hidden flex-shrink-0">
                  <img
                    src={displayData.profile.characterImage}
                    alt={displayData.profile.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* 2. 전투 특성 */}
            <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
              <div className="grid grid-cols-2 gap-x-6 text-sm">
                {[
                  ['공격력'   , displayData.combatStats.attackPower.toLocaleString()],
                  ['최대생명력', displayData.combatStats.maxHp.toLocaleString()],
                  ['치명'     , displayData.combatStats.critical.toLocaleString()],
                  ['제압'     , displayData.combatStats.domination.toLocaleString()],
                  ['특화'     , displayData.combatStats.specialization.toLocaleString()],
                  ['인내'     , displayData.combatStats.endurance.toLocaleString()],
                  ['신속'     , displayData.combatStats.swiftness.toLocaleString()],
                  ['숙련'     , displayData.combatStats.expertise.toLocaleString()],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between pb-1">
                    <span className="text-slate-400 text-xs">{label}</span>
                    <span className="font-bold text-slate-200">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 각인 */}
            <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
              <h2 className="text-sm font-bold mb-4 text-orange-400 border-b border-slate-700 pb-2">
                각인 효과
              </h2>
              <div className="space-y-2">
                {displayData.engravings.map((eng, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="font-bold text-white">
                      {typeof eng.name === 'string' ? eng.name : eng.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded border border-slate-600 text-slate-300">
                      Lv.{eng.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── 오른쪽 열 ────────────────────────────────── */}
          <div className="space-y-4">

            {/* 4. 스킬 피해량 — 파이프라인 결과 확인용 */}
            <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
              <h2 className="text-sm font-bold mb-4 text-emerald-400 border-b border-slate-700 pb-2">
                스킬 피해량
                <span className="text-xs text-slate-500 ml-2 font-normal">
                  (콘솔에서 파이프라인 상세 확인 가능)
                </span>
              </h2>

              {skillDamageResults.length === 0 ? (
                <p className="text-xs text-slate-500">
                  DB에 등록된 스킬이 없거나 계산 결과가 없습니다.
                </p>
              ) : (
                <div className="space-y-3">
                  {skillDamageResults
                    .sort((a, b) => b.totalDamage - a.totalDamage)
                    .map((result, i) => {
                      const pct = (result.totalDamage / maxDamage) * 100;
                      return (
                        <div key={i} className="space-y-1">
                          {/* 스킬명 + 수치 */}
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              {/* 스킬 아이콘 */}
                              {(() => {
                                const skill = displayData.skills.find(
                                  s => (typeof s.name === 'string' ? s.name : s.name) === result.skillName
                                );
                                return skill?.icon ? (
                                  <div className="w-6 h-6 rounded bg-slate-700 overflow-hidden flex-shrink-0">
                                    <img src={skill.icon} alt={result.skillName}
                                      className="w-full h-full object-cover" />
                                  </div>
                                ) : null;
                              })()}
                              <span className="text-slate-200 font-bold">
                                {result.skillName}
                              </span>
                            </div>
                            <span className="text-emerald-400 font-mono">
                              {result.totalDamage.toLocaleString(undefined, {
                                maximumFractionDigits: 0
                              })}
                            </span>
                          </div>
                          {/* 바 그래프 */}
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {/* 피해원 상세 (isCombined=false) */}
                          {result.sources.filter(s => !s.isCombined).map((src, j) => (
                            <div key={j}
                              className="flex justify-between text-[10px] text-slate-500 pl-8">
                              <span>{src.name}</span>
                              <span>{src.damage.toLocaleString(undefined, {
                                maximumFractionDigits: 0
                              })}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* 5. 스킬 목록 */}
            <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
              <h2 className="text-sm font-bold mb-4 text-emerald-400 border-b border-slate-700 pb-2">
                스킬
              </h2>
              <div className="space-y-2">
                {displayData.skills.map((skill, i) => (
                  <div key={i}
                    className="flex items-center gap-3 p-2 bg-slate-800/20 rounded border border-slate-800">
                    <div className="w-8 h-8 rounded bg-slate-700 overflow-hidden flex-shrink-0">
                      <img src={skill.icon} alt={String(skill.name)}
                        className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {String(skill.name)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Lv.{skill.level}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-0.5">
                        {skill.selectedTripods.map((t, j) => (
                          <span key={j} className="text-[10px] text-slate-400">
                            {typeof t.name === 'string' ? t.name : t.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
