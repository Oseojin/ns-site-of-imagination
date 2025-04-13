"use client";
// 📄 components/Header.tsx

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ 외부 클릭 시 로그인 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ 로딩 중에는 아무것도 렌더링하지 않음 (hydration mismatch 방지)
  if (status === "loading") return null;

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 shadow bg-white sticky top-0 z-50">
      {/* 로고 */}
      <Link href="/home" className="text-2xl font-bold">
        N들의 상상터
      </Link>

      {/* 우측 메뉴 */}
      <div className="flex items-center gap-4 relative" ref={menuRef}>
        {/* ✅ 상상공방 버튼 */}
        <Link
          href="/make"
          className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
        >
          상상공방
        </Link>

        {/* ✅ 로그인 상태 → 프로필 버튼 / 비로그인 상태 → 로그인 드롭다운 */}
        {session?.user ? (
          <button onClick={() => (window.location.href = "/profile")}>
            <Image
              src={session.user.image || "/default-profile.png"}
              alt="프로필"
              width={36}
              height={36}
              className="rounded-full"
            />
          </button>
        ) : (
          <>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              로그인
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border shadow rounded z-50">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => signIn("kakao")}
                >
                  Kakao로 로그인
                </button>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => signIn("discord")}
                >
                  Discord로 로그인
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
