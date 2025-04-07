import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token?.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        providerId: token.sub, // sub는 카카오 사용자 고유 ID
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "유저를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const tests = await prisma.test.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        titleImage: true,
        createdAt: true,
      },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error("❌ 테스트 목록 불러오기 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
