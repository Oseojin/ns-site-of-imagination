// components/AuthButtons.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button onClick={() => signOut()} className="text-sm hover:underline">
        로그아웃
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => signIn("google")}
        className="text-sm hover:underline"
      >
        구글 로그인
      </button>
      <button
        onClick={() => signIn("kakao")}
        className="text-sm hover:underline"
      >
        카카오 로그인
      </button>
      <button
        onClick={() => signIn("discord")}
        className="text-sm hover:underline"
      >
        디스코드 로그인
      </button>
    </div>
  );
}
