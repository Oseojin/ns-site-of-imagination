// 📄 app/api/tests/[id]/route.ts

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { IID, QuestionData, ResultData, TestPayload } from "@/types/type";

export async function GET(_: NextRequest, params: { params: IID }) {
  const testId = parseInt((await params.params).id, 10);

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      questions: {
        include: { options: true },
      },
    },
  });

  if (!test) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    title: test.title,
    titleImage: test.titleImage,
    setting: test.setting,
    questions: test.questions.map((q) => ({
      title: q.title,
      image: q.image,
      type: q.type,
      options: q.options.map((o) => o.text),
    })),
  });
}

export async function DELETE(_: NextRequest, params: { params: IID }) {
  const session = await getServerSession(authConfig);
  const providerId = session?.user?.id;

  if (!providerId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const testId = parseInt((await params.params).id, 10);

  const user = await prisma.user.findUnique({
    where: { id: providerId },
  });

  const test = await prisma.test.findUnique({
    where: { id: testId },
  });

  if (!test || test.userId !== user?.id) {
    return NextResponse.json({ message: "접근 불가" }, { status: 403 });
  }

  // 하위 데이터 삭제
  await prisma.option.deleteMany({
    where: { question: { testId } },
  });
  await prisma.question.deleteMany({ where: { testId } });
  await prisma.result.deleteMany({ where: { testId } });
  await prisma.comment.deleteMany({ where: { testId } });
  await prisma.like.deleteMany({ where: { testId } });

  await prisma.test.delete({ where: { id: testId } });

  return NextResponse.json({ message: "삭제 완료" });
}

export async function PUT(req: NextRequest, params: { params: IID }) {
  const testId = parseInt((await params.params).id, 10);

  const session = await getServerSession(authConfig);
  const providerId = session?.user?.id;

  if (!providerId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: providerId },
  });

  const test = await prisma.test.findUnique({
    where: { id: testId },
  });

  if (!test || test.userId !== user?.id) {
    return NextResponse.json({ message: "접근 불가" }, { status: 403 });
  }

  const body: TestPayload = await req.json();

  try {
    // 기존 하위 데이터 삭제
    await prisma.option.deleteMany({
      where: { question: { testId } },
    });
    await prisma.question.deleteMany({ where: { testId } });
    await prisma.result.deleteMany({ where: { testId } });

    // 테스트 수정
    await prisma.test.update({
      where: { id: testId },
      data: {
        title: body.title,
        titleImage: body.titleImage,
        setting: body.setting,
        questions: {
          create: body.questions.map((q: QuestionData) => ({
            title: q.title,
            body: "",
            image: q.image,
            type: q.type,
            options: {
              create: q.options.map((text: string) => ({ text })),
            },
          })),
        },
        results: {
          create: body.results.map((r: ResultData) => ({
            name: r.name,
            description: r.description,
            image: r.image,
            setting: r.setting,
          })),
        },
      },
    });

    return NextResponse.json({ message: "수정 완료", id: testId });
  } catch (error) {
    console.error("테스트 수정 실패:", error);
    return NextResponse.json({ message: "수정 실패" }, { status: 500 });
  }
}
