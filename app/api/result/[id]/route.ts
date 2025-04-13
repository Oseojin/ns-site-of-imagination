// 📄 app/api/results/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { IID } from "@/types/type";

export async function GET(_: NextRequest, params: { params: IID }) {
  const resultId = parseInt((await params.params).id, 10);

  if (isNaN(resultId)) {
    return NextResponse.json({ message: "Invalid result ID" }, { status: 400 });
  }

  const result = await prisma.result.findUnique({
    where: { id: resultId },
  });

  if (!result) {
    return NextResponse.json(
      { message: "결과를 찾을 수 없습니다" },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
