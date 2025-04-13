"use client";
// 📄 components/QuestionEditorSection.tsx

import { QuestionData, QuestionType } from "@/types/type";
import ImageUploader from "./ImageUploader";

type Props = {
  questions: QuestionData[];
  setQuestions: (questions: QuestionData[]) => void;
};

export default function QuestionEditorSection({
  questions,
  setQuestions,
}: Props) {
  const handleQuestionChange = (
    index: number,
    key: keyof QuestionData,
    value: string | string[]
  ) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [key]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
    const updated = [...questions];
    const updatedOptions = [...updated[qIdx].options];
    updatedOptions[oIdx] = value;
    updated[qIdx].options = updatedOptions;
    setQuestions(updated);
  };

  const addOption = (qIdx: number) => {
    const updated = [...questions];
    updated[qIdx].options.push("");
    setQuestions(updated);
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const updated = [...questions];
    if (updated[qIdx].options.length > 2) {
      updated[qIdx].options.splice(oIdx, 1);
      setQuestions(updated);
    } else {
      alert("선택지는 최소 2개 이상 필요합니다.");
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { title: "", image: "", type: "objective", options: ["", ""] },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert("질문은 최소 1개 이상이어야 합니다.");
      return;
    }
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">질문 생성</h2>

      {questions.map((q, index) => (
        <div key={index} className="border p-4 rounded bg-gray-50 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">질문 {index + 1}</h3>
            <button
              onClick={() => removeQuestion(index)}
              className="text-red-500 text-sm"
            >
              삭제
            </button>
          </div>

          <input
            type="text"
            value={q.title}
            onChange={(e) =>
              handleQuestionChange(index, "title", e.target.value)
            }
            placeholder="질문 제목을 입력하세요"
            className="w-full border px-3 py-2 rounded"
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              질문 이미지
            </label>
            <ImageUploader
              imageUrl={q.image}
              setImageUrl={(url) => handleQuestionChange(index, "image", url)}
            />
          </div>

          <div className="flex items-center gap-4">
            <label>질문 유형:</label>
            <select
              value={q.type}
              onChange={(e) =>
                handleQuestionChange(
                  index,
                  "type",
                  e.target.value as QuestionType
                )
              }
              className="border rounded px-2 py-1"
            >
              <option value="objective">객관식</option>
              <option value="subjective">주관식</option>
            </select>
          </div>

          {q.type === "objective" && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">선택지</p>
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(index, oIdx, e.target.value)
                    }
                    className="flex-1 border px-3 py-1 rounded"
                    placeholder={`선택지 ${oIdx + 1}`}
                  />
                  <button
                    onClick={() => removeOption(index, oIdx)}
                    className="text-red-400 text-sm"
                    disabled={q.options.length <= 2}
                  >
                    삭제
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(index)}
                className="text-blue-500 text-sm mt-1"
              >
                + 선택지 추가
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + 질문 추가
      </button>
    </section>
  );
}
