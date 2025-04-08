"use client";

import { useRouter } from "next/navigation";

export default function StartButton({ testId }: { testId: string }) {
  const router = useRouter();

  return (
    <div className="flex justify-center mt-8">
      <button
        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
        onClick={() => router.push(`/test/${testId}/questions`)}
      >
        시작하기
      </button>
    </div>
  );
}
