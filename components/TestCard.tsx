"use client";
// 📄 components/TestCard.tsx

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  id: number;
  title: string;
  titleImage: string;
  likeCount: number;
  isLiked: boolean;
};

export default function TestCard({
  id,
  title,
  titleImage,
  likeCount,
  isLiked,
}: Props) {
  const router = useRouter();
  const [likes, setLikes] = useState(likeCount);
  const [liked, setLiked] = useState(isLiked);
  const [isPending, startTransition] = useTransition();

  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation(); // 💡 카드 클릭과 이벤트 분리

    startTransition(async () => {
      const res = await fetch(`/api/tests/${id}/like`, {
        method: "POST",
      });

      if (res.ok) {
        const result = await res.json();
        setLiked(result.liked);
        setLikes((prev) => prev + (result.liked ? 1 : -1));
      }
    });
  };

  return (
    <div
      onClick={() => router.push(`/test/${id}`)}
      className="cursor-pointer rounded-lg shadow hover:shadow-md transition p-2 bg-white"
    >
      <Image
        src={titleImage}
        alt={title}
        width={300}
        height={180}
        className="w-full h-[180px] object-cover rounded-md"
      />
      <div className="mt-2 text-lg font-semibold line-clamp-1">{title}</div>
      <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
        <span>❤️ {likes}</span>
        <button
          onClick={handleLike}
          disabled={isPending}
          className="text-pink-600 hover:text-pink-700"
        >
          {liked ? "❤️ 취소" : "🤍 좋아요"}
        </button>
      </div>
    </div>
  );
}
