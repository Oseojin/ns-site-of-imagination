"use client";

import ClientGuard from "@/components/ClientGuard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 타입 정의
type QuestionType = "subjective" | "objective";

type Question = {
  id: number;
  text: string;
  type: QuestionType;
  imageUrl: string;
  options: string[];
};

type Result = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

async function uploadImageToS3(file: File): Promise<string> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  const { uploadUrl, fileUrl } = await res.json();

  // 실제 이미지 업로드
  await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  return fileUrl; // 👉 이 URL을 DB에 저장
}

export default function MakeEditorPage() {
  const router = useRouter();
  const [titleImage, setTitleImage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: "", type: "subjective", imageUrl: "", options: ["", ""] },
  ]);
  const [results, setResults] = useState<Result[]>([
    { id: 1, name: "", description: "", imageUrl: "" },
  ]);

  useEffect(() => {
    const raw = localStorage.getItem("previewData");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.titleImage) setTitleImage(parsed.titleImage);
      if (parsed.questions) setQuestions(parsed.questions);
      if (parsed.results) setResults(parsed.results);
    } catch (err) {
      console.error("previewData 로딩 실패", err);
    }

    // 로딩 후 previewData 삭제 (새로 작성 시작 시 방해되지 않도록)
    return () => {
      localStorage.removeItem("previewData");
    };
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleQuestionChange = (
    id: number,
    field: keyof Omit<Question, "id" | "options">,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (qid: number, index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      )
    );
  };

  const addOption = (qid: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const removeOption = (qid: number, index: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qid && q.options.length > 2) {
          return {
            ...q,
            options: q.options.filter((_, i) => i !== index),
          };
        }
        return q;
      })
    );
  };

  const addQuestion = () => {
    const nextId =
      questions.length > 0 ? questions[questions.length - 1].id + 1 : 1;
    setQuestions([
      ...questions,
      {
        id: nextId,
        text: "",
        type: "subjective",
        imageUrl: "",
        options: ["", ""],
      },
    ]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length <= 1) {
      alert("질문은 최소 하나 이상이어야 합니다.");
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleResultChange = (
    id: number,
    field: keyof Omit<Result, "id">,
    value: string
  ) => {
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const addResult = () => {
    const nextId = results.length > 0 ? results[results.length - 1].id + 1 : 1;
    setResults([
      ...results,
      { id: nextId, name: "", description: "", imageUrl: "" },
    ]);
  };

  const removeResult = (id: number) => {
    if (results.length <= 1) {
      alert("결과는 최소 하나 이상이어야 합니다.");
      return;
    }
    setResults(results.filter((r) => r.id !== id));
  };

  const handleQuestionImageChange = async (id: number, file: File) => {
    const uploadedUrl = await uploadImageToS3(file);
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, imageUrl: uploadedUrl } : q))
    );
  };

  const handleResultImageChange = async (id: number, file: File) => {
    const uploadedUrl = await uploadImageToS3(file);
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, imageUrl: uploadedUrl } : r))
    );
  };

  const isFormValid = () => {
    // 필수 항목 확인
    if (!title || !questions.length || !results.length) {
      alert("모든 필수 항목을 채워주세요.");
      return false;
    }

    const hasEmptyQuestionText = questions.some((q) => !q.text);
    const hasEmptyResultName = results.some((r) => !r.name || !r.description);

    if (hasEmptyQuestionText) {
      alert("모든 질문에 내용을 입력해 주세요.");
      return false;
    }

    if (hasEmptyResultName) {
      alert("모든 결과에 이름, 설명을 입력해주세요.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!isFormValid()) return;

    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, titleImage, questions, results }),
        credentials: "include",
      });

      if (res.ok) {
        alert("테스트가 성공적으로 저장되었습니다!");
        router.push(`/`);
      } else {
        alert("저장 실패: 서버 오류");
      }
    } catch (err) {
      alert("저장 중 문제가 발생했습니다.");
      console.error(err);
    }
  };

  const handlePreview = () => {
    if (!isFormValid()) return;

    const testData = {
      title,
      titleImage,
      questions,
      results,
    };
    localStorage.setItem("previewData", JSON.stringify(testData));
    router.push("/make/preview");
  };

  return (
    <ClientGuard>
      <div className="w-full max-w-screen-lg p-6 space-y-12">
        <div>
          <label className="block text-xl font-bold mb-2">
            📝 테스트 타이틀
          </label>
          <label className="block text-sm font-semibold mb-1">
            🖼️ 테스트 메인 이미지
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const uploadUrl = await uploadImageToS3(file);
                setTitleImage(uploadUrl);
              }
            }}
            className="w-full border px-4 py-2 rounded mb-2"
          />
          {titleImage && (
            <Image
              src={titleImage}
              alt="메인 타이틀 이미지"
              width={800}
              height={200}
              className="rounded object-cover border mb-4"
            />
          )}
          <label className="block text-sm font-semibold mb-1">
            테스트 이름
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="예: 어떤 감정 유형의 사람일까?"
            className="w-full border px-4 py-2 rounded mb-4"
          />
        </div>

        {/* 질문 섹션 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">❓ 질문 목록</h2>
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id} className="border rounded p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="font-medium">질문 {q.id}</label>
                  <button
                    onClick={() => removeQuestion(q.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) =>
                    handleQuestionChange(q.id, "text", e.target.value)
                  }
                  placeholder="질문 내용을 입력하세요"
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleQuestionImageChange(q.id, file);
                  }}
                  className="w-full border px-3 py-2 rounded mb-2"
                />
                {q.imageUrl && (
                  <Image
                    src={q.imageUrl}
                    alt={`질문 ${q.id} 이미지`}
                    width={400}
                    height={250}
                    className="rounded object-cover border"
                  />
                )}
                <div className="flex items-center gap-2">
                  <label className="text-sm">답변 형식:</label>
                  <select
                    value={q.type}
                    onChange={(e) =>
                      handleQuestionChange(
                        q.id,
                        "type",
                        e.target.value as QuestionType
                      )
                    }
                    className="border px-2 py-1 rounded"
                  >
                    <option value="subjective">주관식</option>
                    <option value="objective">객관식</option>
                  </select>
                </div>
                {q.type === "objective" && (
                  <div className="space-y-2">
                    {q.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(q.id, idx, e.target.value)
                          }
                          placeholder={`보기 ${idx + 1}`}
                          className="w-full border px-3 py-1 rounded"
                        />
                        {q.options.length > 2 && (
                          <button
                            onClick={() => removeOption(q.id, idx)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(q.id)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      + 보기 추가
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={addQuestion}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              + 질문 추가
            </button>
          </div>
        </div>

        {/* 결과 섹션 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">🎯 결과 목록</h2>
          <div className="space-y-8">
            {results.map((r) => (
              <div key={r.id} className="border rounded p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-medium">결과 {r.id}</label>
                  <button
                    onClick={() => removeResult(r.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
                <input
                  type="text"
                  value={r.name}
                  onChange={(e) =>
                    handleResultChange(r.id, "name", e.target.value)
                  }
                  placeholder="결과 이름"
                  className="w-full border px-3 py-2 rounded"
                />
                <textarea
                  value={r.description}
                  onChange={(e) =>
                    handleResultChange(r.id, "description", e.target.value)
                  }
                  placeholder="결과 설명"
                  className="w-full border px-3 py-2 rounded"
                  rows={3}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleResultImageChange(r.id, file);
                  }}
                  className="w-full border px-3 py-2 rounded mb-2"
                />
                {r.imageUrl && (
                  <Image
                    src={r.imageUrl}
                    alt={`결과 ${r.id} 이미지`}
                    width={400}
                    height={250}
                    className="rounded object-cover border"
                  />
                )}
              </div>
            ))}
            <button
              onClick={addResult}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              + 결과 추가
            </button>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="pt-10 flex gap-4">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            💾 테스트 저장하기
          </button>
          <button
            onClick={handlePreview}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            🔍 미리보기
          </button>
        </div>
      </div>
    </ClientGuard>
  );
}
