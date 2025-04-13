import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json(); // { resultId: number }

  if (!body.resultId || typeof body.resultId !== "number") {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  try {
    // 이미 동일한 resultId로 저장된 데이터가 있는지 확인
    const existing = await prisma.savedResult.findFirst({
      where: { resultId: body.resultId },
      orderBy: { createdAt: "asc" }, // 가장 오래된 것 하나만 반환
    });

    // 있으면 기존 ID 반환
    if (existing) {
      return NextResponse.json({ id: existing.id });
    }

    // 없으면 새로 생성
    const saved = await prisma.savedResult.create({
      data: { resultId: body.resultId },
    });

    return NextResponse.json({ id: saved.id });
  } catch (error) {
    console.error("결과 저장 실패:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
