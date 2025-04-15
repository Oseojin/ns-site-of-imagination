"use client";
// 📄 components/TestIntroWrapper.tsx

import { TestPayload } from "@/types/type";
import { useRouter } from "next/navigation";
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
