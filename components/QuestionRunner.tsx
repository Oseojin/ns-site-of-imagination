"use client";
// 📄 components/QuestionRunner.tsx

import { useState } from "react";
import { QuestionData } from "@/types/type";
import Image from "next/image";

type Props = {
  questions: QuestionData[];
  onComplete: (answers: (string | number)[]) => void;
};

export default function QuestionRunner({ questions, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [inputValue, setInputValue] = useState("");

  const current = questions[currentIndex];

  const handleNext = (answer: string | number) => {
    const updated = [...answers];
    updated[currentIndex] = answer;
    setAnswers(updated);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setInputValue("");
    } else {
      onComplete(updated);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">
        Q{currentIndex + 1}. {current.title}
      </h2>

      {current.image && (
        <Image
          src={current.image}
          alt="질문 이미지"
          width={600}
          height={300}
          className="rounded w-full object-cover"
        />
      )}

      {current.type === "objective" ? (
        <div className="grid grid-cols-1 gap-4">
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleNext(opt)}
              className="border rounded px-4 py-2 hover:bg-blue-100"
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="답변을 입력하세요"
            rows={4}
            className="w-full border px-4 py-2 rounded"
          />
          <button
            onClick={() => {
              if (!inputValue.trim()) return alert("답변을 입력해주세요.");
              handleNext(inputValue.trim());
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
}
