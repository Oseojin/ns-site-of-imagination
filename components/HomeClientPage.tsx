"use client";
// 📄 components/HomeClientPage.tsx

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TestCard from "@/components/TestCard";
import { TestCardData } from "@/types/type";

export default function HomeClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSort = (
    searchParams.get("sort") === "likes" ? "likes" : "recent"
  ) as "likes" | "recent";

  const [sortType, setSortType] = useState<"likes" | "recent">(initialSort);
  const [tests, setTests] = useState<TestCardData[]>([]);

  useEffect(() => {
    const fetchTests = async () => {
      const res = await fetch(`/api/tests?sort=${sortType}`);
      const data: TestCardData[] = await res.json();
      setTests(data);
    };
    fetchTests();
  }, [sortType]);

  const handleSortChange = (type: "likes" | "recent") => {
    setSortType(type);
    router.replace(`/home?sort=${type}`); // ✅ 주소는 바꾸되 전체 새로고침 없이 처리됨
  };

  return (
    <main className="px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">전체 테스트</h1>
        <div className="space-x-2 text-sm">
          <button
            onClick={() => handleSortChange("recent")}
            className={`px-3 py-1 rounded ${
              sortType === "recent" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => handleSortChange("likes")}
            className={`px-3 py-1 rounded ${
              sortType === "likes" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            좋아요순
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tests.map((test) => (
          <TestCard
            key={test.id}
            id={test.id}
            title={test.title}
            titleImage={test.titleImage}
            likeCount={test._count.likes}
            isLiked={test.isLiked}
          />
        ))}
      </div>
    </main>
  );
}
