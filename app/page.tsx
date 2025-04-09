// app/page.tsx
"use client";

import { TestWithLikes } from "@/types/test";
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
  const [tests, setTests] = useState<TestWithLikes[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [likedTests, setLikedTests] = useState<Record<number, boolean>>({});
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sort, setSort] = useState<"recent" | "likes">("recent");

  const fetchTests = async (keyword: string, sort: "recent" | "likes") => {
    try {
      const res = await fetch(
        `/api/tests?keyword=${encodeURIComponent(keyword)}&sort=${sort}`
      );
      if (!res.ok) throw new Error("API 호출 실패");

      const data = await res.json();
      if (Array.isArray(data)) {
        setTests(data);

        // 좋아요 수 직접 포함된 경우
        const likeMap: Record<number, number> = {};
        const likedMap: Record<number, boolean> = {};

        await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map(async (test: any) => {
            likeMap[test.id] = test.likeCount ?? 0;

            // 좋아요 여부는 여전히 개별 확인이 필요
            const res = await fetch(`/api/likes/${test.id}`);
            if (res.ok) {
              const { liked } = await res.json();
              likedMap[test.id] = liked;
            }
          })
        );

        setLikeCounts(likeMap);
        setLikedTests(likedMap);
      }
    } catch (err) {
      console.error("데이터 불러오기 실패", err);
    }
  };

  const debouncedFetchTests = debounce(fetchTests, 300);

  useEffect(() => {
    debouncedFetchTests(searchKeyword, sort);
  }, [searchKeyword, sort]);

  useEffect(() => {
    fetchTests("", sort);
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
      <h1 className="text-2xl font-bold mb-6">🧠 상상 테스트 목록 </h1>

      <div className="mb-8">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="테스트 제목을 검색해보세요"
          className="w-full max-w-md border px-4 py-2 rounded shadow-sm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "recent" | "likes")} // ✅ 여기서 사용됨
          className="ml-4 border rounded px-3 py-2 text-sm"
        >
          <option value="recent">📅 최신순</option>
          <option value="likes">❤️ 좋아요순</option>
        </select>
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
      <div>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1291810764124876"
          crossOrigin="anonymous"
        ></script>
      </div>
    </div>
  );
}
