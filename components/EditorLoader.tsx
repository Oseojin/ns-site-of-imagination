"use client";

import { useEffect, useState } from "react";
import MakeEditorPage from "./MakeEditorPage";
import { MakeEditorInitialData } from "@/types/type";

type Props = {
  testId: number;
  fallbackData: MakeEditorInitialData;
};

export default function EditorLoader({ testId, fallbackData }: Props) {
  const [initialData, setInitialData] = useState<MakeEditorInitialData | null>(
    null
  );

  useEffect(() => {
    const previewRaw = localStorage.getItem("previewData");
    if (previewRaw) {
      try {
        const preview = JSON.parse(previewRaw);
        setInitialData(preview);
        localStorage.removeItem("previewData");
      } catch (e) {
        console.error("previewData 복원 실패", e);
        setInitialData(fallbackData);
      }
    } else {
      setInitialData(fallbackData);
    }
  }, [fallbackData]);

  if (!initialData) return <div className="p-10">로딩 중...</div>;

  return (
    <MakeEditorPage mode="edit" testId={testId} initialData={initialData} />
  );
}
