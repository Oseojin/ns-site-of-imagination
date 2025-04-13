"use client";

import { useEffect, useState } from "react";
import { TestCardData } from "@/types/type";
import TestCard from "@/components/TestCard";

export default function LikedTestsPage() {
  const [tests, setTests] = useState<TestCardData[]>([]);

  useEffect(() => {
    const fetchLikes = async () => {
      const res = await fetch("/api/profile/likes");
      if (res.ok) {
        const data = await res.json();
        setTests(data);
      }
    };
    fetchLikes();
  }, []);

  return (
    <main className="px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">❤️ 좋아요한 테스트</h1>
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
