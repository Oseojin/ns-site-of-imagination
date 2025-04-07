import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { UpdateTestInput } from "@/types/test";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, context: Context) {
  const { id } = context.params;
  const testId = parseInt(id, 10);

  try {
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        results: true,
      },
    });

    if (!test) {
      return NextResponse.json(
        { error: "테스트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      title: test.title,
      titleImage: test.titleImage,
      questions: test.questions,
      results: test.results,
    });
  } catch (err) {
    console.error("[GET /api/tests/:id]", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: Context) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { providerId: session.user.email },
  });

  const id = parseInt(context.params.id, 10);
  const body: UpdateTestInput = await req.json();

  const test = await prisma.test.findUnique({
    where: { id },
  });

  if (!test || test.userId !== user?.id) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  await prisma.test.update({
    where: { id },
    data: {
      title: body.title,
      titleImage: body.titleImage,
      questions: {
        deleteMany: {},
        create: body.questions.map((q) => ({
          title: q.title,
          body: q.body,
          image: q.image,
          type: q.type,
          options: {
            create: q.options?.map((o) => ({ text: o.text })) || [],
          },
        })),
      },
      results: {
        deleteMany: {},
        create: body.results.map((r) => ({
          name: r.name,
          description: r.description,
          image: r.image,
          setting: r.setting,
        })),
      },
    },
  });

  return NextResponse.json({ id });
}

// app/api/tests/[id]/route.ts (삭제용 API 추가)
// app/api/tests/[id]/route.ts

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);
  const providerId = session?.user?.id;

  if (!providerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { providerId },
  });

  // ❗ await 사용하지 않고 바로 context.params.id 사용
  const id = parseInt(context.params.id, 10);

  const test = await prisma.test.findUnique({ where: { id } });
  if (!test || test.userId !== user?.id) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  try {
    await prisma.option.deleteMany({
      where: {
        question: {
          testId: id,
        },
      },
    });

    await prisma.question.deleteMany({ where: { testId: id } });
    await prisma.result.deleteMany({ where: { testId: id } });
    await prisma.test.delete({ where: { id } });

    return NextResponse.json({ message: "삭제 완료" });
  } catch (error) {
    console.error("삭제 중 오류:", error);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
