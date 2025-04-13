"use client";

import { useRouter } from "next/navigation";

export default function NewTestButton() {
  const router = useRouter();

  const handleClick = () => {
    sessionStorage.removeItem("previewBackup"); // ✅ 프리뷰 백업 초기화
    router.push("/make/editor"); // ✅ 새 테스트 생성 페이지로 이동
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      새 테스트 만들기
    </button>
  );
}
