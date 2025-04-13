"use client";
// 📄 app/test/[id]/page.tsx

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TestPayload } from "@/types/type";
import TestIntroSection from "@/components/TestIntroSection";

export default function TestIntroPage() {
  const router = useRouter();
  const { id } = useParams();
  const [test, setTest] = useState<TestPayload | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      const res = await fetch(`/api/tests/${id}`);
      if (!res.ok) {
        alert("테스트를 찾을 수 없습니다.");
        router.push("/home");
        return;
      }

      const data = await res.json();
      console.log(data);
      const parsed: TestPayload = {
        title: data.title,
        titleImage: data.titleImage,
        setting: data.setting,
        questions: [],
        results: [],
      };

      setTest(parsed);
    };

    fetchTest();
  }, [id, router]);

  if (!test) return <div className="p-10">로딩 중...</div>;

  return (
    <TestIntroSection
      test={test}
      onStart={() => router.push(`/test/${id}/questions`)}
    />
  );
}
