import { NextResponse } from 'next/server';

/**
 * [아키텍트 최종 수정: 전수 호출 모드]
 * 사용자님이 명시하신 11개 엔드포인트를 모두 호출합니다.
 * profiles, equipment, avatars, combat-skills, engravings, cards, gems, 
 * colosseums, collectibles, arkpassive, arkgrid
 */

async function fetchAllData(url: string, apiKey: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      return { 
        _isError: true, 
        status: response.status, 
        statusText: response.statusText,
        path: url.split('/').pop()
      };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return { _isError: true, message: 'JSON 응답 아님 (HTML 등)' };
    }

    return await response.json();
  } catch (err: any) {
    return { _isError: true, message: err.message };
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const apiKey = process.env.LOSTARK_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
  }

  const encodedName = encodeURIComponent(name);
  const baseUrl = `https://developer-lostark.game.onstove.com/armories/characters/${encodedName}`;
  
  // 사용자 요청 11개 엔드포인트 전수 조사
  const queryConfigs = [
    { key: 'profile', path: 'profiles' },
    { key: 'equipment', path: 'equipment' },
    { key: 'avatars', path: 'avatars' },
    { key: 'skills', path: 'combat-skills' },
    { key: 'engravings', path: 'engravings' },
    { key: 'cards', path: 'cards' },
    { key: 'gems', path: 'gems' },
    { key: 'colosseums', path: 'colosseums' },
    { key: 'collectibles', path: 'collectibles' },
    { key: 'arkPassive', path: 'arkpassive' },
    { key: 'arkGrid', path: 'arkgrid' }
  ];

  try {
    const results = await Promise.all(
      queryConfigs.map(config => fetchAllData(`${baseUrl}/${config.path}`, apiKey))
    );

    const combinedData: any = {};
    queryConfigs.forEach((config, index) => {
      combinedData[config.key] = results[index];
    });

    combinedData._metadata = {
      characterName: name,
      fetchedAt: new Date().toISOString(),
      requestedEndpoints: queryConfigs.map(c => c.key)
    };

    return NextResponse.json(combinedData);
  } catch (error: any) {
    return NextResponse.json({ error: "Fetch Failed", detail: error.message }, { status: 500 });
  }
}