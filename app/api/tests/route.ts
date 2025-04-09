// app/api/tests/route.ts
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { TestPayload } from "@/types/test";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
            title: q.title,
            body: "",
            type: q.type === "objective" ? "objective" : "subjective",
            image: q.image,
            options: {
              create: q.options.map((opt) => ({ text: opt.text })), // ✅ 핵심 수정
            },
          })),
        },
        results: {
          create: body.results.map((r) => ({
            name: r.name,
            description: r.description,
            image: r.image,
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

export async function GET(req: NextRequest) {
  try {
    const keyword =
      req.nextUrl.searchParams.get("keyword")?.toLowerCase() ?? "";
    const sort = req.nextUrl.searchParams.get("sort") ?? "recent";

    // 정렬 기준에 따라 ORDER BY 결정
    const orderByClause =
      sort === "likes"
        ? "ORDER BY likeCount DESC"
        : "ORDER BY t.createdAt DESC";

    const queryBase = `
      SELECT
        t.id,
        t.title,
        t.titleImage,
        t.createdAt,
        COUNT(l.id) AS likeCount
      FROM Test t
      LEFT JOIN \`Like\` l ON t.id = l.testId
    `;

    const query = keyword
      ? `
        ${queryBase}
        WHERE LOWER(t.title) LIKE CONCAT('%', ?, '%')
        GROUP BY t.id
        ${orderByClause}
      `
      : `
        ${queryBase}
        GROUP BY t.id
        ${orderByClause}
      `;

    const tests = keyword
      ? await prisma.$queryRawUnsafe<
          {
            id: number;
            title: string;
            titleImage: string;
            createdAt: Date;
            likeCount: bigint;
          }[]
        >(query, keyword)
      : await prisma.$queryRawUnsafe<
          {
            id: number;
            title: string;
            titleImage: string;
            createdAt: Date;
            likeCount: bigint;
          }[]
        >(query);

    return NextResponse.json(
      tests.map((test) => ({
        ...test,
        likeCount: Number(test.likeCount),
      }))
    );
  } catch (error) {
    console.error("테스트 목록 불러오기 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
