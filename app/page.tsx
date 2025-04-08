// app/page.tsx
"use client";

import { Test } from "@/types/test";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    fetch("/api/tests")
      .then(async (res) => {
        if (!res.ok) {
          console.error("API 호출 실패:", res.status);
          return [];
        }

        const text = await res.text(); // 먼저 문자열로 받기
        if (!text) return [];

        try {
          return JSON.parse(text); // 안전하게 파싱
        } catch (err) {
          console.error("JSON 파싱 오류:", err);
          return [];
        }
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTests(data);
        }
      });
  }, []);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">🧠 상상 테스트 목록</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tests.map((test) => (
          <Link
            key={test.id}
            href={`/test/${test.id}`}
            className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            {test.titleImage === "" ? null : (
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
    </div>
  );
}
