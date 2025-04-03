// components/ClientGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/"); // 로그인 안된 경우 홈으로
    } else {
      setIsReady(true);
    }
  }, [status, router]);

  if (!isReady) {
    return <p className="text-center mt-10">접근 권한 확인 중...</p>;
  }

  return <>{children}</>;
}
