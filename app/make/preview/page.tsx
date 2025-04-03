"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type QuestionType = "subjective" | "multiple";

type Question = {
  id: number;
  text: string;
  type: QuestionType;
  imageUrl: string;
  options: string[];
};

type Result = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

type PreviewData = {
  title: string;
  titleImage: string;
  questions: Question[];
  results: Result[];
};

export default function PreviewPage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [subjectiveAnswers, setSubjectiveAnswers] = useState<
    Record<number, string>
  >({});
  const [matchedResult, setMatchedResult] = useState<Result | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const testId = searchParams.get("id");
    if (!testId) {
      alert("테스트 ID가 없습니다.");
      router.push("/make/editor");
      return;
    }

    fetch(`/api/tests/${testId}`)
      .then((res) => res.json())
      .then((data) => setPreviewData(data))
      .catch(() => {
        alert("테스트 데이터를 불러올 수 없습니다.");
        router.push("/make/editor");
      });
  }, [router]);

  useEffect(() => {
    if (previewData && currentIndex === previewData.questions.length) {
      const allAnswers = Object.values(subjectiveAnswers)
        .join(" ")
        .toLowerCase();
      const scored = previewData.results.map((result) => {
        const keywords = result.description.toLowerCase();
        const score = keywords
          .split(/\s+/)
          .reduce((acc, word) => acc + (allAnswers.includes(word) ? 1 : 0), 0);
        return { result, score };
      });
      const best = scored.sort((a, b) => b.score - a.score)[0];
      setMatchedResult(best?.result ?? null);
    }
  }, [currentIndex, previewData, subjectiveAnswers]);

  if (!previewData) return null;

  const question = previewData.questions[currentIndex];
  const isLast = currentIndex === previewData.questions.length - 1;

  const handleNext = () => {
    if (isLast) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleOptionClick = (opt: string) => {
    handleNext();
    opt;
  };

  const handleSubjectiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectiveAnswers((prev) => ({
      ...prev,
      [question.id]: e.target.value,
    }));
  };

  return (
    <div className="max-w-screen-md mx-auto p-6 space-y-6">
      {previewData.titleImage && (
        <Image
          src={previewData.titleImage}
          alt="타이틀 이미지"
          width={800}
          height={300}
          className="rounded object-cover border"
        />
      )}
      <h1 className="text-3xl font-bold">{previewData.title}</h1>

      {currentIndex < previewData.questions.length && (
        <div className="mt-8 border p-4 rounded space-y-2">
          <p className="font-semibold">
            Q{currentIndex + 1}. {question.text}
          </p>
          {question.imageUrl && (
            <Image
              src={question.imageUrl}
              alt={`질문 이미지 ${currentIndex + 1}`}
              width={500}
              height={300}
              className="rounded border"
            />
          )}
          {question.type === "multiple" ? (
            <ul className="space-y-2">
              {question.options.map((opt, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleOptionClick(opt)}
                    className="w-full text-left border px-4 py-2 rounded hover:bg-gray-100"
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={subjectiveAnswers[question.id] || ""}
                onChange={handleSubjectiveChange}
                placeholder="주관식 답변 입력"
                className="border w-full px-3 py-2 rounded"
              />
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                다음
              </button>
            </div>
          )}
        </div>
      )}

      {currentIndex >= previewData.questions.length && (
        <div className="mt-10 p-6 border rounded bg-gray-50 space-y-4">
          <h2 className="text-xl font-semibold">🎉 테스트 완료</h2>
          {matchedResult ? (
            <div className="space-y-2">
              <h3 className="text-lg font-bold">
                ✨ 추천 결과: {matchedResult.name}
              </h3>
              {matchedResult.imageUrl && (
                <Image
                  src={matchedResult.imageUrl}
                  alt={matchedResult.name}
                  width={600}
                  height={300}
                  className="rounded object-cover border"
                />
              )}
              <p>{matchedResult.description}</p>
            </div>
          ) : (
            <p>결과를 분석할 수 없습니다.</p>
          )}
          <div>
            <h3 className="font-medium">주관식 답변 요약</h3>
            <ul className="list-disc list-inside text-sm">
              {previewData.questions.map((q) =>
                q.type === "subjective" ? (
                  <li key={q.id}>
                    <strong>{q.text}</strong>:{" "}
                    {subjectiveAnswers[q.id] || "응답 없음"}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
