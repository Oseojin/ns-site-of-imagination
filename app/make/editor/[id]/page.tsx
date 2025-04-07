// app/test/[id]/page.tsx
"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Question {
  id: number;
  title: string;
  image: string;
  type: "subjective" | "objective";
  options: { text: string }[];
}

interface Result {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface TestData {
  title: string;
  titleImage: string;
  questions: Question[];
  results: Result[];
}

export default function TestPage() {
  const { id } = useParams();
  const router = useRouter();
  const [test, setTest] = useState<TestData | null>(null);
  const [step, setStep] = useState<"title" | "question" | "result">("title");
  const [currentIdx, setCurrentIdx] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch(`/api/tests/${id}`)
      .then((res) => res.json())
      .then((data: TestData) => setTest(data))
      .catch((err) => console.error("테스트 불러오기 실패", err));
  }, [id]);

  const currentQuestion = test?.questions[currentIdx];

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    if (currentIdx + 1 < test!.questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setStep("result");
    }
  };

  const randomResult =
    test?.results[Math.floor(Math.random() * test.results.length)];

  if (!test) return <div className="p-6">불러오는 중...</div>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      {step === "title" && (
        <div className="text-center">
          <Image
            src={test.titleImage}
            alt="타이틀 이미지"
            width={800}
            height={400}
            className="rounded w-full h-auto mb-6 object-cover"
          />
          <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
          <button
            onClick={() => setStep("question")}
            className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800"
          >
            시작하기
          </button>
        </div>
      )}

      {step === "question" && currentQuestion && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {currentQuestion.title}
          </h2>
          {currentQuestion.image && (
            <Image
              src={currentQuestion.image}
              alt={`질문 이미지`}
              width={800}
              height={300}
              className="rounded object-cover w-full h-auto mb-4"
            />
          )}

          {currentQuestion.type === "objective" ? (
            <div className="flex flex-col gap-2">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt.text)}
                  className="border px-4 py-2 rounded hover:bg-gray-100"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          ) : (
            <SubjectiveInput onSubmit={handleAnswer} />
          )}
        </div>
      )}

      {step === "result" && randomResult && (
        <div className="text-center">
          <Image
            src={randomResult.image}
            alt={randomResult.name}
            width={600}
            height={300}
            className="rounded object-cover w-full h-auto mb-6"
          />
          <h2 className="text-2xl font-bold mb-2">{randomResult.name}</h2>
          <p className="mb-6">{randomResult.description}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            메인으로
          </button>
        </div>
      )}
    </main>
  );
}

function SubjectiveInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <textarea
        className="border p-2 rounded resize-none h-28"
        placeholder="답변을 입력하세요..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          if (text.trim()) onSubmit(text.trim());
        }}
        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 self-end"
      >
        확인
      </button>
    </div>
  );
}
