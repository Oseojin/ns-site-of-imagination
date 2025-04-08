import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type IParams = Promise<{ id: string }>;
type ITest = Promise<{ id: number }>;
type QuestionType = "subjective" | "objective";

interface TestPayload {
  title: string;
  titleImage: string;
  questions: {
    text: string;
    type: QuestionType;
    imageUrl: string;
    options: string[];
  }[];
  results: {
    name: string;
    description: string;
    imageUrl: string;
  }[];
}

export async function GET(req: NextRequest, { params }: { params: IParams }) {
  const id = (await params).id;

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

export async function PUT(req: Request, { params }: { params: ITest }) {
  const testId = (await params).id;

  const session = await getServerSession(authConfig);
  const providerId = session?.user?.id;

  if (!providerId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { providerId },
  });

  if (!user) {
    return NextResponse.json(
      { message: "유저를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  try {
    const body: TestPayload = await req.json();

    // 1. 관련된 기존 하위 데이터 삭제 (option → question → result)
    await prisma.option.deleteMany({
      where: {
        question: {
          testId,
        },
      },
    });
    await prisma.question.deleteMany({ where: { testId } });
    await prisma.result.deleteMany({ where: { testId } });

    // 2. 테스트 기본 정보 수정
    await prisma.test.update({
      where: { id: testId },
      data: {
        title: body.title,
        titleImage: body.titleImage,
        description: "설명이 없습니다",
        image: body.titleImage,
      },
    });

    // 3. 질문/옵션 생성
    for (const q of body.questions) {
      const createdQuestion = await prisma.question.create({
        data: {
          testId,
          title: q.text,
          body: "",
          type: q.type === "objective" ? "objective" : "subjective",
          image: q.imageUrl || "",
        },
      });

      if (q.type === "objective" && q.options?.length > 0) {
        await prisma.option.createMany({
          data: q.options
            .filter((opt) => typeof opt === "string" && opt.trim() !== "")
            .map((text) => ({
              questionId: createdQuestion.id,
              text,
            })),
        });
      }
    }

    // 4. 결과 생성
    await prisma.result.createMany({
      data: body.results.map((r) => ({
        testId,
        name: r.name,
        description: r.description,
        image: r.imageUrl || "",
        setting: "",
      })),
    });

    return NextResponse.json({ id: testId }, { status: 200 });
  } catch (error) {
    console.error("테스트 수정 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// app/api/tests/[id]/route.ts (삭제용 API 추가)
// app/api/tests/[id]/route.ts

export async function DELETE(req: NextRequest, context: { params: IParams }) {
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
  context: { params: IParams }
) {
  const session = await getServerSession(authConfig);
  const user = session?.user;

  const id = (await context.params).id;

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
