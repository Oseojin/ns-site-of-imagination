"use client";

import ClientGuard from "@/components/ClientGuard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const mockTests = [
  {
    id: "test-1",
    title: "어떤 감정 유형의 사람일까?",
    thumbnail: "/default-thumbnail.png",
  },
  {
    id: "test-2",
    title: "당신의 내면 동물은?",
    thumbnail: "/default-thumbnail.png",
  },
];

export default function TestManagePage() {
  const router = useRouter();
  const [tests, setTests] = useState(mockTests);

  const handleDelete = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setTests(tests.filter((test) => test.id !== id));
    }
  };

  return (
    <ClientGuard>
      {/* ✅ 전체 wrapper 기준점 설정 */}
      <div className="w-full p-6 relative">
        {/* ✅ 페이지 우측 상단 고정 버튼 */}
        <button
          className="absolute top-6 right-6 text-white bg-black py-2 px-4 rounded hover:bg-gray-800 text-sm z-10"
          onClick={() => router.push("/make/title")}
        >
          + 새 테스트 만들기
        </button>

        <div className="max-w-screen-lg">
          <h1 className="text-2xl font-bold mb-6">🛠️ 나의 상상공방</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tests.map((test) => (
              <div key={test.id} className="border p-4 rounded shadow-sm">
                <Image
                  src={test.thumbnail}
                  alt={test.title}
                  width={400}
                  height={200}
                  className="rounded mb-2 object-cover"
                />
                <h2 className="font-semibold text-lg mb-2">{test.title}</h2>
                <div className="flex gap-2">
                  <button
                    className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
                    onClick={() => router.push(`/make/title?id=${test.id}`)}
                  >
                    수정
                  </button>
                  <button
                    className="text-sm px-3 py-1 border rounded text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(test.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ClientGuard>
  );
}
