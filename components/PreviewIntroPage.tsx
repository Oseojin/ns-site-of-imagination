"use client";
// 📄 components/PreviewIntroPage.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TestPayload } from "@/types/type";
import TestIntroSection from "@/components/TestIntroSection";

type Props = {
  mode: "create" | "edit";
  testId?: number;
};

export default function PreviewIntroPage({ mode, testId }: Props) {
  const router = useRouter();
  const [test, setTest] = useState<TestPayload | null>(null);

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
      const parsed: TestPayload = JSON.parse(raw);
      setTest(parsed);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      alert("프리뷰 데이터가 손상되었습니다.");
      router.push(
        mode === "edit" && testId ? `/make/editor/${testId}` : "/make/editor"
      );
    }
  }, [mode, testId, router]);

  if (!test) return <div className="p-10">프리뷰 준비 중...</div>;

  return (
    <TestIntroSection
      test={test}
      onStart={() =>
        router.push(
          mode === "edit" && testId
            ? `/test/preview/${testId}/questions`
            : `/test/preview/questions`
        )
      }
    />
  );
}
