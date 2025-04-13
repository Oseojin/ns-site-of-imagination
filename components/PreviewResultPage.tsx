"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultData, TestPayload } from "@/types/type";
import ResultView from "./ResultView";

type Props = {
  mode: "create" | "edit";
  testId?: number;
};

export default function PreviewResultPage({ mode, testId }: Props) {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    const answersRaw = localStorage.getItem("latestAnswers");
    const previewRaw = localStorage.getItem("previewData");

    if (!answersRaw || !previewRaw) {
      alert("프리뷰 데이터를 찾을 수 없습니다.");
      router.push(
        mode === "edit" && testId ? `/make/editor/${testId}` : "/make/editor"
      );
      return;
    }

    try {
      JSON.parse(answersRaw);
      const preview: TestPayload = JSON.parse(previewRaw);

      // 임시 결과 추출 로직 (1번 결과 고정)
      if (preview.results.length > 0) {
        setResult(preview.results[0]);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      alert("프리뷰 데이터 파싱 실패");
      router.push(
        mode === "edit" && testId ? `/make/editor/${testId}` : "/make/editor"
      );
    }
  }, [mode, testId, router]);

  if (!result) return <div className="p-10">결과 계산 중...</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8 text-center">
      <ResultView result={result} />

      <div className="pt-8">
        <button
          onClick={() =>
            router.push(
              mode === "edit" && testId
                ? `/make/editor/${testId}`
                : "/make/editor"
            )
          }
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          질문 수정으로 돌아가기
        </button>
      </div>
    </div>
  );
}
