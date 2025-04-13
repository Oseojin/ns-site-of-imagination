// 📄 app/home/page.tsx
import { Suspense } from "react";
import HomeClientPage from "@/components/HomeClientPage";

export default function HomePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <HomeClientPage />
    </Suspense>
  );
}
