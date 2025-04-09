// app/api/likes/[testId]/route.ts
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { IParams } from "@/types/test";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: IParams }) {
  const session = await getServerSession(authConfig);
  const testId = parseInt((await params).id);

  if (isNaN(testId)) {
    return NextResponse.json({ message: "잘못된 테스트 ID" }, { status: 400 });
  }

  try {
    const total = await prisma.like.count({
      where: { testId },
    });

    let liked = false;
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { providerId: session.user.id },
      });

      if (user) {
        const found = await prisma.like.findUnique({
          where: {
            userId_testId: {
              userId: user.id,
              testId,
            },
          },
        });
        liked = !!found;
      }
    }

    return NextResponse.json({ liked, total });
  } catch (err) {
    console.error("좋아요 상태 조회 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
