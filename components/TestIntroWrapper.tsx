// 📄 components/TestIntroWrapper.tsx
"use client";

import { useRouter } from "next/navigation";
import { TestPayload } from "@/types/type";
import TestIntroSection from "./TestIntroSection";

type Props = {
  test: TestPayload;
  testId: number;
};

export default function TestIntroWrapper({ test, testId }: Props) {
  const router = useRouter();

  return (
    <TestIntroSection
      test={test}
      onStart={() => router.push(`/test/${testId}/questions`)}
    />
  );
}
