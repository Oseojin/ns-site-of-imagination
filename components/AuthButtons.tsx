// components/AuthButtons.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <button onClick={() => signOut()} className="text-sm hover:underline">
        로그아웃
      </button>
    );
  }

  return (
    <button
      onClick={() => router.push("/login")}
      className="text-sm hover:underline"
    >
      로그인
    </button>
  );
}
