// app/api/tests/route.ts
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type QuestionType = "subjective" | "multiple";

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

// app/api/tests/route.ts
export async function POST(req: Request) {
  const session = await getServerSession(authConfig);
  console.log("Session: ", session);

  // 세션에서 providerId 추출하기 (카카오는 profile.sub을 사용)
  const providerId = session?.user?.id;

  if (!providerId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // providerId로 유저 찾기
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

    const saved = await prisma.test.create({
      data: {
        title: body.title,
        titleImage: body.titleImage,
        description: "설명이 없습니다",
        image: body.titleImage,
        userId: user.id,
        questions: {
          create: body.questions.map((q) => ({
            title: q.text,
            body: "",
            type: q.type === "multiple" ? "objective" : "subjective",
            image: q.imageUrl,
            options: {
              create: q.options.map((text) => ({ text })),
            },
          })),
        },
        results: {
          create: body.results.map((r) => ({
            name: r.name,
            description: r.description,
            image: r.imageUrl,
            setting: "",
          })),
        },
      },
    });

    return NextResponse.json({ id: saved.id }, { status: 201 });
  } catch (error) {
    console.error("테스트 저장 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const tests = await prisma.test.findMany({
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
    console.error("테스트 목록 불러오기 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
