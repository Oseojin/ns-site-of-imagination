// 📄 app/api/tests/[id]/like/route.ts
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { IID } from "@/types/type";

export async function POST(req: NextRequest, params: { params: IID }) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  const testId = parseInt((await params.params).id, 10);

  if (!userId) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  // 좋아요 존재 여부 확인
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_testId: { userId, testId },
    },
  });

  if (existingLike) {
    // 이미 좋아요 → 삭제
    await prisma.like.delete({
      where: {
        userId_testId: { userId, testId },
      },
    });
    return NextResponse.json({ liked: false });
  } else {
    // 좋아요 추가
    await prisma.like.create({
      data: {
        userId,
        testId,
      },
    });
    return NextResponse.json({ liked: true });
  }
}
