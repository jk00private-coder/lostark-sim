// src/app/page.tsx
import CharacterSearch from '@/components/CharacterSearch';

async function getCharacterData(characterName: string) {
  const apiKey = process.env.LOSTARK_API_KEY;
  // 검색어가 없을 때는 호출하지 않습니다.
  if (!characterName) return null;

  const response = await fetch(
    `https://developer-lostark.game.onstove.com/armories/characters/${encodeURIComponent(characterName)}/profiles`,
    {
      headers: {
        Authorization: `bearer ${apiKey}`,
      },
      cache: 'no-store' // 매번 새로운 검색을 위해 캐시를 끕니다.
    }
  );

  if (!response.ok) return null;
  return await response.json();
}

// 스탯 배열에서 원하는 타입을 찾아 숫자로 바꿔주는 함수
function getStatValue(stats: any[], targetType: string) {
  // 1. 배열에서 Type이 내가 찾는(targetType) 것인 요소를 찾습니다.
  const stat = stats?.find((s) => s.Type === targetType);
  
  // 2. 찾았다면 Value를 숫자로 바꾸고, 못 찾았다면 0을 돌려줍니다.
  return stat ? parseInt(stat.Value) : 0;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  const { name } = await searchParams;
  const data = await getCharacterData(name || "");

  // --- [데이터 가공 시작] ---
  let attackPower = 0;
  let crit = 0;
  let swiftness = 0;
  let specialization = 0;

  if (data && data.Stats) {
    // 1. 기본 공격력 뽑기 (문자열 "50,000"에서 쉼표 빼고 숫자로)
    const apStat = data.Stats.find((s: any) => s.Type === "공격력");
    attackPower = apStat ? parseInt(apStat.Value.replace(/,/g, "")) : 0;

    // 2. 아까 만든 함수로 전투 특성 뽑기
    crit = getStatValue(data.Stats, "치명");
    swiftness = getStatValue(data.Stats, "신속");
    specialization = getStatValue(data.Stats, "특화");
  }
  // --- [데이터 가공 끝] ---
  
  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-accent">가디언나이트 시뮬레이터</h1>
      <CharacterSearch />

      {data && (
        <div className="mt-10 space-y-4">
          <div className="border-2 border-accent p-6 rounded-xl bg-card-bg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-accent">{data.CharacterName} 스탯 분석</h2>
            
            <div className="grid grid-cols-2 gap-4 text-lg font-semibold">
              <div className="p-3 bg-white dark:bg-slate-700 rounded shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">공격력</p>
                <p className="text-xl text-red-500">{attackPower.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">치명</p>
                <p className="text-xl text-orange-500">{crit}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">신속</p>
                <p className="text-xl text-green-500">{swiftness}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">특화</p>
                <p className="text-xl text-purple-500">{specialization}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}