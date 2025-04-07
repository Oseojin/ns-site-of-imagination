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

export async function GET(
  req: NextRequest,
  context: { params: { id?: string } }
) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json(
      { error: "ID가 제공되지 않았습니다." },
      { status: 400 }
    );
  }

  const testId = parseInt(id, 10);
  if (isNaN(testId)) {
    return NextResponse.json(
      { error: "올바르지 않은 ID입니다." },
      { status: 400 }
    );
  }

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

  const { id } = await context.params;
  const parsedId = parseInt(id, 10);

  const test = await prisma.test.findUnique({ where: { id: parsedId } });
  if (!test || test.userId !== user?.id) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  try {
    await prisma.option.deleteMany({
      where: {
        question: {
          testId: parsedId,
        },
      },
    });

    await prisma.question.deleteMany({ where: { testId: parsedId } });
    await prisma.result.deleteMany({ where: { testId: parsedId } });
    await prisma.test.delete({ where: { id: parsedId } });

    return NextResponse.json({ message: "삭제 완료" });
  } catch (error) {
    console.error("삭제 중 오류:", error);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}

// 📁 app/api/tests/[id]/route.ts

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);
  const user = session?.user;

  const id = context.params.id;

  if (typeof id !== "string") {
    return new Response(
      JSON.stringify({ error: "ID가 제공되지 않았습니다." }),
      { status: 400 }
    );
  }

  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    return new Response(JSON.stringify({ error: "올바르지 않은 ID입니다." }), {
      status: 400,
    });
  }

  const existingTest = await prisma.test.findUnique({
    where: { id: parsedId },
  });

  if (!existingTest || existingTest.userId !== Number(user?.id)) {
    return new Response(JSON.stringify({ error: "수정 권한이 없습니다." }), {
      status: 403,
    });
  }

  const body = await request.json();

  const updatedTest = await prisma.test.update({
    where: { id: parsedId },
    data: {
      title: body.title,
      titleImage: body.titleImage,
      description: body.description,
      questions: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateMany: body.questions.map((q: any) => ({
          where: { id: q.id },
          data: {
            title: q.title,
            type: q.type,
            image: q.image,
            options: q.options,
          },
        })),
      },
      results: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateMany: body.results.map((r: any) => ({
          where: { id: r.id },
          data: {
            name: r.name,
            detail: r.detail,
            image: r.image,
            config: r.config,
          },
        })),
      },
    },
  });

  return new Response(JSON.stringify(updatedTest));
}
