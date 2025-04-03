"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session?.user) {
    return (
      <Link href="/profile" className="block">
        <Image
          src={session.user.image || "/default-user.png"}
          alt="프로필"
          width={36}
          height={36}
          className="rounded-full hover:opacity-80"
        />
      </Link>
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
