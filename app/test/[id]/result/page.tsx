// app/test/[id]/result/page.tsx
"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Result = {
  name: string;
  description: string;
  image: string;
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("r"); // URL ?r=2
  const testId = searchParams.get("t");

  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!testId || !resultId) return;

    fetch(`/api/tests/${testId}`)
      .then((res) => res.json())
      .then((data) => {
        const matched = data.results.find(
          (r: Result, idx: number) => idx.toString() === resultId
        );
        setResult(matched || null);
      });
  }, [testId, resultId]);

  if (!result) return <div className="p-10">결과를 불러오는 중...</div>;

  return (
    <div className="max-w-xl mx-auto p-8 space-y-6 text-center">
      <h1 className="text-2xl font-bold">당신의 결과는?</h1>
      <Image
        src={result.image}
        alt={result.name}
        width={600}
        height={300}
        className="mx-auto rounded-xl object-cover"
      />
      <h2 className="text-xl font-semibold">{result.name}</h2>
      <p className="text-gray-700">{result.description}</p>
    </div>
  );
}
