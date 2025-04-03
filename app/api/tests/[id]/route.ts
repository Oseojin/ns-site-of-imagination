import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const testId = parseInt(context.params.id, 10);

    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: true,
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
