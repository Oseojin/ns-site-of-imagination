"use client";
// 📄 app/profile/page.tsx

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div className="p-10">로딩 중...</div>;
  if (!session?.user) {
    alert("로그인이 필요합니다.");
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/home" });
  };

  return (
    <main className="max-w-md mx-auto px-6 py-10 text-center space-y-6">
      <h1 className="text-2xl font-bold mb-6">내 프로필</h1>

      <Image
        src={session.user.image ?? "/default-profile.png"}
        alt="프로필 이미지"
        width={120}
        height={120}
        className="rounded-full mx-auto"
      />

      <p className="text-xl font-semibold">
        {session.user.name ?? "이름 없음"}
      </p>

      <div className="mt-4">
        <Link
          href="/profile/likes"
          className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 border border-pink-300 rounded-full px-4 py-1.5 hover:bg-pink-50 transition"
        >
          <span>❤️</span>
          <span>좋아요한 테스트</span>
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
      >
        로그아웃
      </button>
    </main>
  );
}
