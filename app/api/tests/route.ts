// app/api/tests/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 추후 DB 저장 로직 추가 예정
    console.log("🧪 저장된 테스트 데이터:", body);

    return NextResponse.json({ message: "저장 성공" }, { status: 200 });
  } catch (error) {
    console.error("저장 중 오류 발생:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
