"use client";
// 📄 components/ResultEditorSection.tsx

import { ResultData } from "@/types/type";
import ImageUploader from "./ImageUploader";

type Props = {
  results: ResultData[];
  setResults: (results: ResultData[]) => void;
};

export default function ResultEditorSection({ results, setResults }: Props) {
  const handleChange = (
    index: number,
    key: keyof ResultData,
    value: string
  ) => {
    const updated = [...results];
    updated[index] = { ...updated[index], [key]: value };
    setResults(updated);
  };

  const addResult = () => {
    setResults([
      ...results,
      { name: "", description: "", setting: "", image: "" },
    ]);
  };

  const removeResult = (index: number) => {
    if (results.length <= 1) {
      alert("결과는 최소 1개 이상이어야 합니다.");
      return;
    }
    const updated = [...results];
    updated.splice(index, 1);
    setResults(updated);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">결과 생성</h2>

      {results.map((result, index) => (
        <div key={index} className="border p-4 rounded bg-gray-50 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">결과 {index + 1}</h3>
            <button
              onClick={() => removeResult(index)}
              className="text-red-500 text-sm"
            >
              삭제
            </button>
          </div>

          <input
            type="text"
            value={result.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
            placeholder="결과 이름"
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            value={result.description}
            onChange={(e) => handleChange(index, "description", e.target.value)}
            placeholder="사용자용 결과 설명"
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />

          <textarea
            value={result.setting}
            onChange={(e) => handleChange(index, "setting", e.target.value)}
            placeholder="AI용 결과 설명"
            className="w-full border px-3 py-2 rounded"
            rows={2}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              결과 이미지
            </label>
            <ImageUploader
              imageUrl={result.image}
              setImageUrl={(url) => handleChange(index, "image", url)}
            />
          </div>
        </div>
      ))}

      <button
        onClick={addResult}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + 결과 추가
      </button>
    </section>
  );
}
