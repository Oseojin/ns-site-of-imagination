// app/api/likes/route.ts
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authConfig);
  const { testId } = await req.json();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { providerId: session.user.id },
    });

    // 이미 좋아요가 존재하는지 확인
    const existing = await prisma.like.findUnique({
      where: {
        userId_testId: {
          userId: user.id,
          testId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "이미 좋아요했습니다." },
        { status: 200 }
      );
    }

    await prisma.like.create({
      data: {
        userId: user.id,
        testId,
      },
    });

    return NextResponse.json({ message: "좋아요 완료" }, { status: 201 });
  } catch (err) {
    console.error("좋아요 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authConfig);
  const { testId } = await req.json();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { providerId: session.user.id },
    });

    await prisma.like.delete({
      where: {
        userId_testId: {
          userId: user.id,
          testId,
        },
      },
    });

    return NextResponse.json({ message: "좋아요 취소 완료" }, { status: 200 });
  } catch (err) {
    console.error("좋아요 취소 실패:", err);
    return NextResponse.json({ message: "좋아요 취소 실패" }, { status: 500 });
  }
}
