// @/components/CharacterSearch.tsx
"use client";

import React, { useState } from 'react';
import { normalizeCharacter } from '@/utils/data-normalizer';
import { CharacterDisplayData } from '@/types/character-types';
import { RawCharacterData } from '@/types/raw-types';

interface CharacterSearchProps {
  /** 검색 완료 시 정규화된 데이터를 부모로 전달 */
  onDataLoaded: (data: CharacterDisplayData) => void;
}

/**
 * 캐릭터 검색 컴포넌트
 *
 * [역할]
 *   1. 캐릭터명 입력 → API 호출 (raw 데이터 수집)
 *   2. normalizeCharacter() 로 변환
 *   3. onDataLoaded() 콜백으로 부모(store)에 전달
 *
 * [변경 이력]
 *   - raw JSON 표시 기능 제거 (디버깅용이었으므로)
 *   - normalizeCharacter() 연결
 *   - onDataLoaded 콜백 추가
 */
export default function CharacterSearch({ onDataLoaded }: CharacterSearchProps) {
  const [characterName, setCharacterName] = useState('');
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [loadedName, setLoadedName]       = useState<string | null>(null);

  const handleSearch = async () => {
    if (!characterName.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. API 호출 — raw 데이터 수집
      const response = await fetch(`/api/lostark/${encodeURIComponent(characterName)}`);

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const raw: RawCharacterData = await response.json();

      // API 오류 응답 체크 (route.ts 에서 _isError 플래그 사용)
      if ((raw as any).error) {
        throw new Error((raw as any).error);
      }

      // 2. normalizeCharacter() 로 변환
      const displayData = normalizeCharacter(raw);

      // 3. 부모(store)에 전달
      onDataLoaded(displayData);
      setLoadedName(characterName);

    } catch (err: any) {
      setError(err.message ?? '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-900 rounded-xl border border-slate-800 mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 bg-slate-800 text-white border border-slate-700 rounded px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          placeholder="캐릭터명을 입력하세요"
          value={characterName}
          onChange={e => setCharacterName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded
                     transition-colors disabled:opacity-50 text-sm"
        >
          {isLoading ? '검색 중...' : '검색'}
        </button>
      </div>

      {/* 성공 메시지 */}
      {loadedName && !error && (
        <p className="text-xs text-cyan-400">
          ✓ {loadedName} 데이터 로드 완료
        </p>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className="text-xs text-red-400">
          ✗ {error}
        </p>
      )}
    </div>
  );
}
