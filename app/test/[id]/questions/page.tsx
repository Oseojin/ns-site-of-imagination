// app/test/[id]/questions/page.tsx
"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Question = {
  id: number;
  title: string;
  body: string;
  image: string;
  type: "subjective" | "objective";
  options?: { text: string }[];
};

type Result = {
  name: string;
  description: string;
  image: string;
  setting: string;
};

type TestData = {
  title: string;
  questions: Question[];
  results: Result[];
};

export default function QuestionsPage() {
  const { id } = useParams();

  const router = useRouter();

  const [test, setTest] = useState<TestData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch(`/api/tests/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTest(data);
      });
  }, [id]);

  const handleAnswer = async (answer: string | number) => {
    const updated = [...answers];
    updated[currentIndex] = answer;
    setAnswers(updated);

    if (test && currentIndex < test.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setInputValue("");
    } else if (test) {
      if (!test?.results || !Array.isArray(test.results)) {
        alert("결과 데이터가 유효하지 않습니다.");
        return;
      }
      const response = await fetch("/api/openai/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          questions: test.questions,
          results: test.results,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/test/${id}/result?t=${id}&r=${data.resultIndex}`);
      } else {
        alert("AI 분석에 실패했습니다.");
      }
    }
  };

  if (!test) return <div className="p-10">로딩 중...</div>;

  const question = test.questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-center">{test.title}</h1>

      <div className="border rounded-xl overflow-hidden">
        <Image
          src={question.image}
          alt="질문 이미지"
          width={800}
          height={300}
          className="w-full h-64 object-cover"
        />
      </div>

      <h2 className="text-xl font-semibold">{question.title}</h2>
      <p>{question.body}</p>

      {question.type === "objective" ? (
        <div className="grid gap-4 mt-4">
          {question.options?.map((opt, index) => (
            <button
              key={index}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              onClick={() => handleAnswer(index)}
            >
              {opt.text}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col mt-4 gap-2">
          <input
            type="text"
            className="border px-4 py-2 rounded"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => {
              if (inputValue.trim() !== "") handleAnswer(inputValue);
            }}
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
}
