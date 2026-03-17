// @/app/page

"use client";

import { Suspense } from 'react';
import CharacterSearch from '@/components/CharacterSearch';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';

export default function EngravingSimulator() {
  const { displayData, setDisplayData, calcData } = useCalculatorStore();

  return (
    <main className="min-h-screen bg-[#0f1215] text-slate-200 p-4 md:p-8 font-sans">

      {/* 캐릭터 검색 — 로드 완료 시 setDisplayData 호출 */}
      <CharacterSearch onDataLoaded={setDisplayData} />

      {/* 데이터 미로드 상태 */}
      {!displayData && (
        <div className="flex items-center justify-center h-64 text-slate-500">
          <p className="text-sm">캐릭터명을 검색하면 정보가 표시됩니다.</p>
        </div>
      )}

      {/* 데이터 로드 완료 상태 */}
      {displayData && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_7fr] gap-4">

          {/* ── 왼쪽 열 ───────────────────────────────────── */}
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
                      ['서버',   displayData.profile.serverName],
                      ['길드',   displayData.profile.guildName],
                      ['직업',   displayData.profile.className],
                      ['칭호',   displayData.profile.title],
                      ['명예',   String(displayData.profile.honorLevel)],
                      ['원정대', String(displayData.profile.expeditionLevel)],
                      ['영지',   displayData.profile.townName],
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
                  ['공격력',   displayData.combatStats.attackPower.toLocaleString()],
                  ['최대생명력', displayData.combatStats.maxHp.toLocaleString()],
                  ['치명',     displayData.combatStats.critical.toLocaleString()],
                  ['제압',     displayData.combatStats.domination.toLocaleString()],
                  ['특화',     displayData.combatStats.specialization.toLocaleString()],
                  ['인내',     displayData.combatStats.endurance.toLocaleString()],
                  ['신속',     displayData.combatStats.swiftness.toLocaleString()],
                  ['숙련',     displayData.combatStats.expertise.toLocaleString()],
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
                    <span
                      className="font-bold"
                      style={{ color: eng.name.color ?? '#ffffff' }}
                    >
                      {eng.name.text}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded border"
                      style={{
                        color      : eng.grade.color,
                        borderColor: eng.grade.color ? `${eng.grade.color}50` : undefined,
                      }}
                    >
                      {eng.grade.text} Lv.{eng.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. 카드 세트 */}
            {displayData.cards && (
              <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
                <h2 className="text-sm font-bold mb-4 text-blue-300 border-b border-slate-700 pb-2">
                  카드 세트
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">
                      {displayData.cards.setName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-900/30 text-blue-400
                                     border border-blue-500/30 rounded">
                      {displayData.cards.totalAwake}각성
                    </span>
                  </div>
                  <div className="p-3 bg-slate-800/40 rounded-md text-[11px] text-slate-400 leading-relaxed">
                    {displayData.cards.activeItems.map((item, i) => (
                      <p key={i}>• {item.description}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. 계산용 수치 디버그 패널 (개발 중 확인용) */}
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500 mb-2 font-bold">
                [DEV] calcData 동기화 확인
              </p>
              <div className="grid grid-cols-2 gap-1 text-xs text-slate-400">
                <span>baseAtk:</span>
                <span className="text-cyan-400">
                  {calcData.combatStats.baseAtk.toLocaleString()}
                </span>
                <span>dmgInc:</span>
                <span className="text-cyan-400">
                  {(calcData.damageModifiers.damageInc * 100).toFixed(2)}%
                </span>
                <span>atkP:</span>
                <span className="text-cyan-400">
                  {(calcData.statModifiers.atkP * 100).toFixed(2)}%
                </span>
                <span>critChance:</span>
                <span className="text-cyan-400">
                  {(calcData.damageModifiers.critChance * 100).toFixed(2)}%
                </span>
                <span>critDmg:</span>
                <span className="text-cyan-400">
                  {(calcData.damageModifiers.critDamage * 100).toFixed(2)}%
                </span>
                <span>baseAtkP:</span>
                <span className="text-cyan-400">
                  {(calcData.statModifiers.baseAtkP * 100).toFixed(2)}%
                </span>
              </div>
            </div>

          </div>

          {/* ── 오른쪽 열 ──────────────────────────────────── */}
          <div className="space-y-4">

            {/* 6. 장비 및 악세서리 */}
            <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
              <h2 className="text-sm font-bold mb-4 text-blue-400 border-b border-slate-700 pb-2">
                장비 및 악세서리
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 전투 장비 */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 mb-2 underline">전투 장비</p>
                    {['투구', '어깨', '상의', '하의', '장갑', '무기'].map(type => {
                      const eq = displayData.equipment.find(e => e.type === type);
                      if (!eq) return null;
                      return (
                        <div key={type}
                            className="flex items-center gap-3 p-2 bg-slate-800/30 rounded
                                        border border-slate-700/50">
                          <div className="w-10 h-10 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                            <img src={eq.icon} alt={eq.name}
                                className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs" style={{ color: eq.grade.color }}>
                              {eq.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {eq.setType !== 'UNKNOWN' ? eq.setType : ''} 티어{eq.itemTier}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* 보주 — 무기 아래 */}
                    {displayData.boJu && (
                      <div className="flex items-center gap-3 p-2 bg-slate-800/30 rounded
                                      border border-slate-700/50">
                        <div className="w-10 h-10 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                          <img src={displayData.boJu.icon} alt={displayData.boJu.name}
                              className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: displayData.boJu.grade.color }}>
                            {displayData.boJu.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {displayData.boJu.seasonLabel} 최대 낙원력{' '}
                            {displayData.boJu.paradoxPower.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                </div>

                {/* 장신구 */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 mb-2 underline">장신구</p>
                  {displayData.accessories.map((acc, i) => (
                    <div key={i}
                         className="flex items-center gap-3 p-2 bg-slate-800/30 rounded
                                    border border-slate-700/50">
                      <div className="w-10 h-10 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                        <img src={acc.icon} alt={acc.name}
                             className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs" style={{ color: acc.grade.color }}>
                          {acc.name}
                        </p>
                        {/* 연마효과 */}
                        {acc.polishEffects.map((eff, j) => (
                          <p key={j} className="text-[10px]"
                             style={{ color: eff.value.color }}>
                            {eff.label.text} +{
                              eff.value.value < 1
                                ? `${(eff.value.value * 100).toFixed(2)}%`
                                : eff.value.value
                            }
                            <span className="text-slate-600 ml-1">
                              [{eff.grade}]
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* 팔찌 */}
                  {displayData.bracelet && (
                    <div className="flex items-center gap-3 p-2 bg-slate-800/30 rounded
                                    border border-slate-700/50">
                      <div className="w-10 h-10 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                        <img src={displayData.bracelet.icon}
                             alt={displayData.bracelet.name}
                             className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs"
                           style={{ color: displayData.bracelet.grade.color }}>
                          {displayData.bracelet.name}
                        </p>
                        {displayData.bracelet.effects.map((eff, j) => (
                          <p key={j} className="text-[10px]"
                             style={{ color: eff.value.color }}>
                            {eff.label.text} +{
                              eff.value.value < 1
                                ? `${(eff.value.value * 100).toFixed(2)}%`
                                : eff.value.value
                            }
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 어빌리티 스톤 */}
                  {displayData.abilityStone && (
                    <div className="flex items-center gap-3 p-2 bg-slate-800/30 rounded
                                    border border-slate-700/50">
                      <div className="w-10 h-10 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                        <img src={displayData.abilityStone.icon}
                            alt={displayData.abilityStone.name}
                            className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs" style={{ color: displayData.abilityStone.grade.color }}>
                          {displayData.abilityStone.name}
                        </p>
                        {displayData.abilityStone.engravings.map((eng, j) => (
                          <p key={j} className="text-[10px]"
                            style={{ color: eng.name.color }}>
                            {eng.name.text} Lv.{eng.level.value}
                          </p>
                        ))}
                        {displayData.abilityStone.penalty && (
                          <p className="text-[10px]"
                            style={{ color: displayData.abilityStone.penalty.name.color }}>
                            {displayData.abilityStone.penalty.name.text} Lv.{displayData.abilityStone.penalty.level.value}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 7. 보석 */}
            <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
              <div className="flex justify-between items-end mb-4 border-b border-slate-700 pb-2">
                <h2 className="text-sm font-bold text-purple-400">보석 세팅</h2>
                <p className="text-xs text-slate-400">
                  공증합:{' '}
                  <span style={{ color: displayData.gems.totalBaseAtk.color }}>
                    +{(displayData.gems.totalBaseAtk.value * 100).toFixed(2)}%
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {displayData.gems.gems.map((gem, i) => (
                  <div key={i}
                       className="flex items-center justify-between p-2 bg-slate-800/20
                                  rounded text-[11px] border border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border border-slate-600
                                      overflow-hidden flex-shrink-0">
                        <img src={gem.icon} alt=""
                             className="w-full h-full object-cover" />
                      </div>
                      <span style={{ color: gem.skillName.color }}>
                        {gem.skillName.text}
                      </span>
                    </div>
                    <span style={{ color: gem.effectValue.color }}>
                      {gem.effectLabel.text}{' '}
                      +{(gem.effectValue.value * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. 아크패시브 */}
            <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg relative">
              <h2 className="text-sm font-bold mb-4 text-cyan-400 border-b border-slate-700 pb-2">
                아크 패시브
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { key: 'evolution', label: '진화',   color: '#F1D594' },
                  { key: 'insight',   label: '깨달음', color: '#83E9FF' },
                  { key: 'leap',      label: '도약',   color: '#C2EA55' },
                ].map(({ key, label, color }) => {
                  const pt = displayData.arkPassive.points[
                    key as keyof typeof displayData.arkPassive.points
                  ];
                  if (typeof pt === 'string') return null;
                  return (
                    <div key={key}
                         className="p-4 bg-slate-800/50 rounded-lg text-center
                                    border border-slate-700">
                      <p className="text-xs mb-1" style={{ color }}>{label}</p>
                      <p className="text-lg font-bold text-white">
                        {pt.value}{' '}
                        <span className="text-[10px] font-normal text-slate-500">pt</span>
                      </p>
                      <p className="text-[10px] text-slate-500">{pt.description}</p>
                    </div>
                  );
                })}
              </div>
              <div className="absolute bottom-4 right-6 text-right">
                <p className="text-[10px] text-slate-500">
                  칭호{' '}
                  <span className="text-cyan-400 ml-1 font-bold">
                    {displayData.arkPassive.points.title}
                  </span>
                </p>
              </div>
            </div>

            {/* 9. 아크그리드 */}
            <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
              <h2 className="text-sm font-bold mb-4 text-yellow-500 border-b border-slate-700 pb-2">
                아크 그리드
              </h2>
              <div className="space-y-4">
                {/* 코어 목록 */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {displayData.arkGrid.cores.map((core, i) => (
                    <div key={i}
                         className="flex items-center gap-2 bg-slate-800/40 p-2 rounded">
                      <div className="w-4 h-4 rounded-full bg-slate-600 overflow-hidden">
                        <img src={core.icon} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="flex-1 text-slate-300 truncate">
                        {core.name.text}
                      </span>
                      <span style={{ color: core.point.color }} className="font-bold">
                        {core.point.value}pt
                      </span>
                    </div>
                  ))}
                </div>
                {/* 합산 효과 */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs
                                border-t border-slate-800 pt-3">
                  {displayData.arkGrid.effects.map((eff, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-slate-500">{eff.label.text}</span>
                      <span style={{ color: eff.value.color }}>
                        +{(eff.value.value * 100).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 10. 스킬 목록 */}
            <div className="bg-[#1c1f23] rounded-lg p-6 border border-slate-800 shadow-lg">
              <h2 className="text-sm font-bold mb-4 text-emerald-400 border-b border-slate-700 pb-2">
                스킬
              </h2>
              <div className="space-y-2">
                {displayData.skills.map((skill, i) => (
                  <div key={i}
                       className="flex items-center gap-3 p-2 bg-slate-800/20 rounded
                                  border border-slate-800">
                    <div className="w-8 h-8 rounded bg-slate-700 overflow-hidden flex-shrink-0">
                      <img src={skill.icon} alt={skill.name}
                           className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {skill.name}
                        </span>
                        <span className="text-[10px]"
                              style={{ color: skill.category.color }}>
                          {skill.category.text}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Lv.{skill.level}
                        </span>
                      </div>
                      {/* 선택된 트라이포드 */}
                      <div className="flex gap-1 mt-0.5">
                        {skill.selectedTripods.map((t, j) => (
                          <span key={j} className="text-[10px]"
                                style={{ color: t.name.color }}>
                            {t.name.text}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* 룬 */}
                    {skill.rune && (
                      <span className="text-[10px]"
                            style={{ color: skill.rune.grade.color }}>
                        {skill.rune.name.text}
                      </span>
                    )}
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
