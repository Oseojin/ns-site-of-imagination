// app/page.tsx
"use client";

import { Test } from "@/types/test";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// 디바운스 함수
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  } as T;
}

export default function Home() {
  const [tests, setTests] = useState<Test[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const fetchTests = async (keyword: string) => {
    try {
      const res = await fetch(
        `/api/tests?keyword=${encodeURIComponent(keyword)}`
      );
      if (!res.ok) throw new Error("API 호출 실패");

      const text = await res.text();
      if (!text) return;

      const data = JSON.parse(text);
      if (Array.isArray(data)) setTests(data);
    } catch (err) {
      console.error("데이터 불러오기 실패", err);
    }
  };

  // 디바운싱된 검색 함수
  const debouncedFetchTests = debounce(fetchTests, 300);

  // 검색어 변경 시 API 호출
  useEffect(() => {
    debouncedFetchTests(searchKeyword);
  }, [searchKeyword]);

  // 초기 전체 리스트 로딩
  useEffect(() => {
    fetchTests("");
  }, []);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">🧠 상상 테스트 목록</h1>

      {/* 검색 입력창 */}
      <div className="mb-8">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="테스트 제목을 검색해보세요"
          className="w-full max-w-md border px-4 py-2 rounded shadow-sm"
        />
      </div>

      {/* 결과 리스트 */}
      {tests.length === 0 ? (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tests.map((test) => (
            <Link
              key={test.id}
              href={`/test/${test.id}`}
              className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              {test.titleImage && (
                <Image
                  src={test.titleImage}
                  alt={test.title}
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4 font-semibold">{test.title}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
