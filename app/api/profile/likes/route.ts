import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: NextRequest) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tests = await prisma.test.findMany({
    where: {
      likes: {
        some: { userId },
      },
    },
    include: {
      _count: { select: { likes: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const enriched = tests.map((test) => ({
    ...test,
    isLiked: true, // 이 목록은 모두 좋아요한 테스트니까 true 고정
  }));

  return NextResponse.json(enriched);
}
