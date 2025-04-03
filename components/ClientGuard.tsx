"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      alert("로그인이 필요합니다.");
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") return null;
  if (status === "authenticated") return <>{children}</>;

  return null;
}
