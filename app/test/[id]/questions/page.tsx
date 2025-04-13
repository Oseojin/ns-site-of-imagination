"use client";
// 📄 app/test/[id]/questions/page.tsx

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuestionData } from "@/types/type";
import QuestionRunner from "@/components/QuestionRunner";

export default function TestQuestionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  useEffect(() => {
    const fetchTest = async () => {
      const res = await fetch(`/api/tests/${id}`);
      if (!res.ok) {
        alert("테스트를 불러오는 데 실패했습니다.");
        router.push("/home");
        return;
      }

      const data = await res.json();
      setQuestions(data.questions);
    };

    fetchTest();
  }, [id, router]);

  if (!questions.length) return <div className="p-10">로딩 중...</div>;

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <QuestionRunner
        questions={questions}
        onComplete={(answers) => {
          localStorage.setItem(
            "latestAnswers",
            JSON.stringify({
              questions,
              answers,
            })
          );
          router.push(`/test/${id}/result`);
        }}
      />
    </main>
  );
}
