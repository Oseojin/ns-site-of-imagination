// 📄 app/api/tests/[id]/result/route.ts

import prisma from "@/lib/prisma";
import { IID } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, params: { params: IID }) {
  const testId = parseInt((await params.params).id, 10);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const body = await req.json();

  // 임시 처리: 결과 1번 항목을 무조건 반환
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: { results: true },
  });

  if (!test || test.results.length === 0) {
    return NextResponse.json({ result: null }, { status: 404 });
  }

  // TODO: 추후 OpenAI 분석 기반 결과 선택 로직 추가
  return NextResponse.json({ result: test.results[0] });
}
