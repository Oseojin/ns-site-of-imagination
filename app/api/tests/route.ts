// 📄 app/api/tests/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { IID, TestPayload } from "@/types/type";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;

  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort") === "likes" ? "likes" : "recent";

  // 전체 테스트 목록
  const tests = await prisma.test.findMany({
    orderBy:
      sort === "likes" ? { likes: { _count: "desc" } } : { createdAt: "desc" },
    include: {
      _count: { select: { likes: true } },
    },
  });

  // 로그인한 경우 좋아요 누른 테스트 id 목록 조회
  let likedIds = new Set<number>();
  if (userId) {
    const likes = await prisma.like.findMany({
      where: { userId },
      select: { testId: true },
    });
    likedIds = new Set(likes.map((like) => like.testId));
  }

  // isLiked 필드 추가해서 응답
  const enrichedTests = tests.map((test) => ({
    ...test,
    isLiked: likedIds.has(test.id),
  }));

  return NextResponse.json(enrichedTests);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body: TestPayload = await req.json();

  try {
    const saved = await prisma.test.create({
      data: {
        title: body.title,
        titleImage: body.titleImage,
        setting: body.setting,
        userId: userId,
        questions: {
          create: body.questions.map((q) => ({
            title: q.title,
            body: "", // 기획상 공란 유지
            image: q.image,
            type: q.type,
            options: {
              create: q.options.map((text) => ({ text })),
            },
          })),
        },
        results: {
          create: body.results.map((r) => ({
            name: r.name,
            description: r.description,
            setting: r.setting,
            image: r.image,
          })),
        },
      },
    });

    return NextResponse.json({ id: saved.id });
  } catch (error) {
    console.error("테스트 저장 실패:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, params: { params: IID }) {
  const testId = parseInt((await params.params).id, 10);

  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const test = await prisma.test.findUnique({ where: { id: testId } });

  if (!test || test.userId !== userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body: TestPayload = await req.json();

  try {
    // 기존 하위 데이터 삭제
    await prisma.option.deleteMany({
      where: { question: { testId } },
    });
    await prisma.question.deleteMany({ where: { testId } });
    await prisma.result.deleteMany({ where: { testId } });

    // 테스트 기본 정보 업데이트
    const updated = await prisma.test.update({
      where: { id: testId },
      data: {
        title: body.title,
        titleImage: body.titleImage,
        setting: body.setting,
        questions: {
          create: body.questions.map((q) => ({
            title: q.title,
            body: "",
            image: q.image,
            type: q.type,
            options: {
              create: q.options.map((text) => ({ text })),
            },
          })),
        },
        results: {
          create: body.results.map((r) => ({
            name: r.name,
            description: r.description,
            setting: r.setting,
            image: r.image,
          })),
        },
      },
    });

    return NextResponse.json({ id: updated.id });
  } catch (error) {
    console.error("테스트 수정 실패:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
