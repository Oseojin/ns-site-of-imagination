"use client";

import ImageUploader from "./ImageUploader"; // ✅ 이 줄 추가

type Props = {
  title: string;
  setTitle: (value: string) => void;
  titleImage: string;
  setTitleImage: (value: string) => void;
  setting: string;
  setSetting: (value: string) => void;
};

export default function TestHeaderSection({
  title,
  setTitle,
  titleImage,
  setTitleImage,
  setting,
  setSetting,
}: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">테스트 기본 정보</h2>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <label className="block font-medium">테스트 제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 나의 성향은?"
            className="w-full border px-4 py-2 rounded"
          />

          <label className="block font-medium mt-4">테스트 설명</label>
          <textarea
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            placeholder="예: 이 테스트는 당신의 선택을 분석해 결과를 도출합니다."
            rows={3}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div className="flex-shrink-0 w-40">
          <label className="block font-medium mb-2">메인 이미지</label>

          {/* ✅ 이미지 업로더로 교체 */}
          <ImageUploader imageUrl={titleImage} setImageUrl={setTitleImage} />
        </div>
      </div>
    </section>
  );
}
