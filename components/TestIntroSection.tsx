"use client";
// 📄 components/TestIntroSection.tsx

import { TestPayload } from "@/types/type";
import Image from "next/image";

type Props = {
  test: TestPayload;
  onStart: () => void;
};

export default function TestIntroSection({ test, onStart }: Props) {
  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">{test.title}</h1>

      {test.titleImage ? (
        <Image
          src={test.titleImage}
          alt={test.title}
          width={600}
          height={300}
          className="rounded w-full object-cover"
        />
      ) : null}

      <p className="text-gray-700">{test.setting}</p>

      <div className="flex justify-center mt-8">
        <button
          onClick={onStart}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          시작하기
        </button>
      </div>
    </main>
  );
}
