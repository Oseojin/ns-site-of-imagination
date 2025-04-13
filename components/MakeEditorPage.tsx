"use client";
// 📄 components/MakeEditorPage.tsx

import { useEffect, useState } from "react";
import TestHeaderSection from "./TestHeaderSection";
import QuestionEditorSection from "./QuestionEditorSection";
import ResultEditorSection from "./ResultEditorSection";
import FooterButtons from "./FooterButtons";
import { MakeEditorInitialData, QuestionData, ResultData } from "@/types/type";

type Props = {
  mode: "create" | "edit";
  initialData?: MakeEditorInitialData;
  testId?: number;
};

export default function MakeEditorPage({ mode, initialData, testId }: Props) {
  const [title, setTitle] = useState("");
  const [titleImage, setTitleImage] = useState("");
  const [setting, setSetting] = useState("");
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [results, setResults] = useState<ResultData[]>([]);

  // 🔥 초기 데이터가 들어오면 한 번만 상태 반영
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setTitleImage(initialData.titleImage);
      setSetting(initialData.setting);
      setQuestions(initialData.questions);
      setResults(initialData.results);
    }
  }, [initialData]);

  // 🔒 로딩 전 방어
  if (!initialData) return <div className="p-10">로딩 중...</div>;

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto space-y-10">
      <TestHeaderSection
        title={title}
        setTitle={setTitle}
        titleImage={titleImage}
        setTitleImage={setTitleImage}
        setting={setting}
        setSetting={setSetting}
      />

      <QuestionEditorSection
        questions={questions}
        setQuestions={setQuestions}
      />

      <ResultEditorSection results={results} setResults={setResults} />

      <FooterButtons
        mode={mode}
        testId={testId}
        title={title}
        titleImage={titleImage}
        setting={setting}
        questions={questions}
        results={results}
      />
    </div>
  );
}
