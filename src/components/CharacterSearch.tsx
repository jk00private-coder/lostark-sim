import React, { useState } from 'react';

/**
 * 캐릭터 검색 및 Raw JSON 데이터 확인 컴포넌트입니다.
 * 20번 라인 근처: API 응답을 저장할 state와 로딩 상태를 관리합니다.
 */
export default function CharacterSearch() {
  const [characterName, setCharacterName] = useState('');
  const [rawData, setRawData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!characterName) return;
    
    setIsLoading(true);
    try {
      // 위에서 만든 우리 프로젝트 내부 API 라우트를 호출합니다.
      const response = await fetch(`/api/lostark/${characterName}`);
      const data = await response.json();
      setRawData(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!rawData) return;
    // JSON Crack에 바로 붙여넣기 좋게 예쁘게 정렬(indent 2)하여 복사합니다.
    const text = JSON.stringify(rawData, null, 2);
    document.execCommand('copy'); 
    // 브라우저 호환성을 위해 execCommand 사용 (iframe 환경 고려)
    alert('JSON 데이터가 클립보드에 복사되었습니다. JSON Crack 사이트에 붙여넣으세요!');
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-900 rounded-xl border border-slate-800">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="캐릭터명을 입력하세요"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded transition-colors disabled:opacity-50"
        >
          {isLoading ? '검색 중...' : '검색'}
        </button>
      </div>

      {rawData && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h3 className="text-cyan-400 font-bold">Raw JSON Data</h3>
            <button
              onClick={copyToClipboard}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-white py-1 px-3 rounded"
            >
              전체 복사하기
            </button>
          </div>
          <textarea
            readOnly
            className="w-full h-64 bg-black text-green-400 font-mono text-xs p-4 rounded border border-slate-700 overflow-auto"
            value={JSON.stringify(rawData, null, 2)}
          />
          <p className="text-[10px] text-slate-500">
            * 위 텍스트를 복사하여 <a href="https://jsoncrack.com/editor" target="_blank" className="underline text-cyan-600">JSON Crack</a>에서 확인하세요.
          </p>
        </div>
      )}
    </div>
  );
}