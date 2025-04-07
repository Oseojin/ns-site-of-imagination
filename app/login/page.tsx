"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">로그인 방법 선택</h1>

      <div className="flex flex-col gap-4">
        {/*<button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full py-2 px-4 border rounded hover:bg-gray-100"
        >
          구글로 로그인
        </button>*/}
        <button
          onClick={() => signIn("kakao", { callbackUrl: "/" })}
          className="w-full py-2 px-4 border rounded hover:bg-yellow-100"
        >
          카카오로 로그인
        </button>
        <button
          onClick={() => signIn("discord", { callbackUrl: "/" })}
          className="w-full py-2 px-4 border rounded hover:bg-indigo-100"
        >
          디스코드로 로그인
        </button>
      </div>
    </div>
  );
}
