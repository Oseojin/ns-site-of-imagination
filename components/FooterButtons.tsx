// 📄 components/FooterButtons.tsx
"use client";

import { useRouter } from "next/navigation";
import { FooterButtonProps } from "@/types/type";

export default function FooterButtons({
  mode,
  testId,
  title,
  titleImage,
  setting,
  questions,
  results,
}: FooterButtonProps) {
  const router = useRouter();

  const validate = (): string | null => {
    if (!title.trim()) return "테스트 제목을 입력하세요.";
    if (!titleImage) return "테스트 메인 이미지를 업로드하세요.";
    if (!setting.trim()) return "테스트 설정 설명을 입력하세요.";

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.title.trim()) return `질문 ${i + 1}의 제목을 입력하세요.`;
      if (q.type === "objective") {
        if (q.options.length < 2 || q.options.some((opt) => !opt.trim())) {
          return `질문 ${i + 1}의 객관식 선택지를 2개 이상 모두 입력하세요.`;
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (!r.name.trim()) return `결과 ${i + 1}의 이름을 입력하세요.`;
      if (!r.description.trim()) return `결과 ${i + 1}의 설명을 입력하세요.`;
      if (!r.setting.trim()) return `결과 ${i + 1}의 AI 설명을 입력하세요.`;
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const payload = {
      title,
      titleImage,
      setting,
      questions,
      results,
    };

    const method = mode === "create" ? "POST" : "PUT";
    const url = mode === "create" ? "/api/tests" : `/api/tests/${testId}`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/make");
    } else {
      alert("저장에 실패했습니다.");
    }
  };

  const handlePreview = () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const previewData = {
      title,
      titleImage,
      setting,
      questions,
      results,
    };

    // 👉 localStorage에 저장
    localStorage.setItem("previewData", JSON.stringify(previewData));

    // 👉 복귀용 플래그 저장
    sessionStorage.setItem("fromPreview", "true");

    // ✅ 모드에 따라 미리보기 페이지로 이동
    if (mode === "edit" && testId) {
      router.push(`/test/preview/${testId}`);
    } else {
      router.push("/test/preview");
    }
  };

  return (
    <div className="flex justify-end gap-4 mt-8">
      <button
        onClick={handlePreview}
        className="px-4 py-2 rounded border border-blue-500 text-blue-500 hover:bg-blue-50"
      >
        미리보기
      </button>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        작성 완료
      </button>
    </div>
  );
}
