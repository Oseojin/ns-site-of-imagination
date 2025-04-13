"use client";

import { ResultData } from "@/types/type";
import Image from "next/image";
import { useState } from "react";

type Props = {
  result: ResultData;
};

export default function ResultView({ result }: Props) {
  const siteUrl = "https://ns-sangsangter.com";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const res = await fetch("/api/saved-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId: result.id }),
      });
      const data = await res.json();
      const shareUrl = `${siteUrl}/result/${data.id}`;

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("클립보드 복사에 실패했습니다.");
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-6 text-center">
      <h1 className="text-2xl font-bold mb-6">당신의 결과는...</h1>

      {result.image && (
        <Image
          src={result.image}
          alt={result.name}
          width={600}
          height={300}
          className="rounded mx-auto"
        />
      )}

      <h2 className="text-xl font-semibold mt-6">{result.name}</h2>
      <p className="text-gray-700 mt-2">{result.description}</p>

      <div className="mt-10 border-t pt-6">
        <p className="text-sm text-gray-500 mb-2">🔗 결과 링크</p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleCopy}
            className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700"
          >
            {copied ? "복사됨!" : "복사"}
          </button>
        </div>
      </div>
    </main>
  );
}
