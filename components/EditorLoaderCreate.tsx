"use client";
// 📄 components/EditorLoaderCreate.tsx

import { useEffect, useState } from "react";
import MakeEditorPage from "./MakeEditorPage";
import { MakeEditorInitialData } from "@/types/type";

export default function EditorLoaderCreate() {
  const [initialData, setInitialData] = useState<MakeEditorInitialData | null>(
    null
  );

  useEffect(() => {
    const previewRaw = localStorage.getItem("previewData");
    const backupRaw = sessionStorage.getItem("previewBackup");

    if (previewRaw) {
      try {
        const parsed = JSON.parse(previewRaw);
        setInitialData(parsed);

        // ✅ Fast Refresh 대비용 백업
        sessionStorage.setItem("previewBackup", previewRaw);

        // ✅ 원본은 제거
        localStorage.removeItem("previewData");
      } catch (e) {
        console.error("previewData 복원 실패", e);
      }
    } else if (backupRaw) {
      try {
        const parsed = JSON.parse(backupRaw);
        setInitialData(parsed);
      } catch (e) {
        console.error("previewBackup 복원 실패", e);
      }
    } else {
      // 신규 테스트 생성 기본값
      setInitialData({
        title: "",
        titleImage: "",
        setting: "",
        questions: [
          { title: "", image: "", type: "objective", options: ["", ""] },
        ],
        results: [{ name: "", description: "", setting: "", image: "" }],
      });
    }
  }, []);

  if (!initialData) return <div className="p-10">로딩 중...</div>;

  return <MakeEditorPage mode="create" initialData={initialData} />;
}
