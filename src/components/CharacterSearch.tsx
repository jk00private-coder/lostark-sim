// src/components/CharacterSearch.tsx
"use client"; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CharacterSearch() {
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (!input.trim()) return;
    // 주소창을 /?name=입력값 으로 바꿉니다. 
    // 그러면 Home 컴포넌트가 이걸 보고 데이터를 다시 가져옵니다.
    router.push(`/?name=${encodeURIComponent(input)}`);
  };

  return (
    <div className="flex gap-2">
      <input 
        type="text" 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="캐릭터명을 입력하세요"
        // bg-white: 배경 흰색
        // text-black: 글자 검정색 (어떤 모드에서도 잘 보이게 고정하거나 아래처럼 분리)
        className="border p-2 rounded bg-card-bg text-acent"
/>
      <button 
        onClick={handleSearch}
        className="bg-card-bg hover:bg-card-bg text-accent px-6 py-2 rounded-lg font-bold transition-colors"
      >
        조회
      </button>
    </div>
  );
}