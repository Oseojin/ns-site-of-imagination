"use client";
// 📄 components/TestCardEditable.tsx

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: number;
  title: string;
  titleImage: string;
  likeCount: number;
};

export default function TestCardEditable({
  id,
  title,
  titleImage,
  likeCount,
}: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setDeleting(true);

    const res = await fetch(`/api/tests/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("삭제에 실패했습니다.");
      setDeleting(false);
    }
  };

  return (
    <div className="p-2 bg-white shadow rounded relative">
      <Image
        src={titleImage}
        alt={title}
        width={300}
        height={180}
        className="w-full h-[180px] object-cover rounded-md"
      />
      <div className="mt-2 text-lg font-semibold">{title}</div>
      <div className="text-sm text-gray-500 mb-2">❤️ {likeCount}</div>

      <div className="flex gap-2">
        <button
          onClick={() => router.push(`/make/editor/${id}`)}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          수정
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          {deleting ? "삭제 중..." : "삭제"}
        </button>
      </div>
    </div>
  );
}
