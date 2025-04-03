"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="w-full text-sm text-center border rounded px-4 py-2 hover:bg-gray-100"
    >
      로그아웃
    </button>
  );
}
