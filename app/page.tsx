// app/page.tsx
"use client";

import { Test } from "@/types/test";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [likedTests, setLikedTests] = useState<Record<number, boolean>>({});
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
      if (Array.isArray(data)) {
        setTests(data);
        // 테스트별 좋아요 수 및 상태 로딩
        data.forEach(async (test: Test) => {
          const res = await fetch(`/api/likes/${test.id}`);
          if (res.ok) {
            const { total, liked } = await res.json();
            setLikeCounts((prev) => ({ ...prev, [test.id]: total }));
            setLikedTests((prev) => ({ ...prev, [test.id]: liked }));
          }
        });
      }
    } catch (err) {
      console.error("데이터 불러오기 실패", err);
    }
  };

  const debouncedFetchTests = debounce(fetchTests, 300);

  useEffect(() => {
    debouncedFetchTests(searchKeyword);
  }, [searchKeyword]);

  useEffect(() => {
    fetchTests("");
  }, []);

  const toggleLike = async (testId: number) => {
    const isLiked = likedTests[testId] ?? false;

    const res = await fetch("/api/likes", {
      method: isLiked ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testId }),
    });

    if (res.ok) {
      setLikedTests((prev) => ({ ...prev, [testId]: !isLiked }));
      setLikeCounts((prev) => ({
        ...prev,
        [testId]: (prev[testId] ?? 0) + (isLiked ? -1 : 1),
      }));
    }
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">🧠 상상 테스트 목록</h1>

      <div className="mb-8">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="테스트 제목을 검색해보세요"
          className="w-full max-w-md border px-4 py-2 rounded shadow-sm"
        />
      </div>

      {tests.length === 0 ? (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <Link href={`/test/${test.id}`}>
                {test.titleImage && (
                  <Image
                    src={test.titleImage}
                    alt={test.title}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                )}
              </Link>

              <div className="p-4 flex justify-between items-center">
                <Link href={`/test/${test.id}`} className="font-semibold">
                  {test.title}
                </Link>
                <button
                  onClick={() => toggleLike(test.id)}
                  className="flex items-center text-sm text-gray-600 hover:scale-105 transition"
                >
                  <span className="mr-1">
                    {likedTests[test.id] ? "❤️" : "🤍"}
                  </span>
                  {likeCounts[test.id] ?? 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
