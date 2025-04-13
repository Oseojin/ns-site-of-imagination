"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MakeEditorInitialData } from "@/types/type";
import QuestionRunner from "./QuestionRunner";

type Props = {
  mode: "create" | "edit";
  testId?: number;
};

export default function PreviewQuestionPage({ mode, testId }: Props) {
  const router = useRouter();
  const [questions, setQuestions] = useState<
    MakeEditorInitialData["questions"]
  >([]);

  useEffect(() => {
    const raw = localStorage.getItem("previewData");
    if (!raw) {
      alert("프리뷰할 테스트 정보가 없습니다.");
      router.push(
        mode === "edit" && testId ? `/make/editor/${testId}` : "/make/editor"
      );
      return;
    }

    try {
      const parsed: MakeEditorInitialData = JSON.parse(raw);
      if (!parsed.questions?.length) throw new Error("질문 정보 없음");
      setQuestions(parsed.questions);
    } catch (err) {
      alert("프리뷰 데이터를 불러오는 데 실패했습니다.\n" + err);
      router.push(
        mode === "edit" && testId ? `/make/editor/${testId}` : "/make/editor"
      );
    }
  }, [mode, testId, router]);

  if (!questions.length)
    return <div className="p-10">질문을 불러오는 중...</div>;

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

          const nextUrl =
            mode === "edit" && testId
              ? `/test/preview/${testId}/result`
              : `/test/preview/result`;

          router.push(nextUrl);
        }}
      />
    </main>
  );
}
