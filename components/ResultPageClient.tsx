// 📄 components/ResultPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import { ResultData, QuestionData } from "@/types/type";
import ResultView from "./ResultView";

export default function ResultPageClient({ testId }: { testId: number }) {
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("latestAnswers");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const { answers } = parsed;

    const analyze = async () => {
      try {
        // 👉 DB에서 질문 + 결과 불러오기
        const testRes = await fetch(`/api/tests/${testId}`);
        const testData = await testRes.json();

        const questions: QuestionData[] = testData.questions;
        const results: ResultData[] = testData.results;

        const aiRes = await fetch("/api/openai/result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, questions, results }),
        });

        const { resultId } = await aiRes.json();

        const res = await fetch(`/api/result/${resultId}`);
        const data: ResultData = await res.json();
        setResult(data);
      } catch (err) {
        console.error("AI 분석 실패:", err);
      }
    };

    analyze();
  }, [testId]);

  if (!result) return <div className="p-10">AI가 결과를 분석 중입니다...</div>;

  return <ResultView result={result} />;
}
