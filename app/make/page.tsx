"use client";

import ClientGuard from "@/components/ClientGuard";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TestItem {
  id: number;
  title: string;
  titleImage: string;
  createdAt: string;
}

export default function TestManagePage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: _session, status } = useSession();
  const [tests, setTests] = useState<TestItem[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/tests/user")
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            console.error("API 호출 실패:", res.status, text);
            return [];
          }
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setTests(data);
          }
        })
        .catch((err) => {
          console.error("데이터 불러오기 실패:", err);
        });
    }
  }, [status]);

  const handleDelete = async (id: number) => {
    const confirmed = confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    const res = await fetch(`/api/tests/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      alert("삭제되었습니다.");
      // 새로고침 혹은 목록 재로딩
      window.location.reload();
    } else {
      alert("삭제 실패");
    }
  };

  return (
    <ClientGuard>
      <div className="w-full p-6 relative">
        {/* 새 테스트 만들기 버튼 */}
        <button
          className="absolute top-6 right-6 text-white bg-black py-2 px-4 rounded hover:bg-gray-800 text-sm z-10"
          onClick={() => router.push("/make/editor")}
        >
          + 새 테스트 만들기
        </button>

        <div className="max-w-screen-lg">
          <h1 className="text-2xl font-bold mb-6">🛠️ 나의 상상공방</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tests.map((test) => (
              <div key={test.id} className="border p-4 rounded shadow-sm">
                <Image
                  src={test.titleImage}
                  alt={test.title}
                  width={400}
                  height={200}
                  className="rounded mb-2 object-cover"
                />
                <h2 className="font-semibold text-lg mb-2">{test.title}</h2>
                <div className="flex gap-2">
                  {/*<button
                    className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
                    onClick={() => router.push(`/make/title?id=${test.id}`)}
                  >
                    수정
                  </button>*/}
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
