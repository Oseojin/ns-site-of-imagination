// 📁 app/api/openai/result/route.ts

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 🔐 .env에 설정 필요
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { answers, questions, results } = body;

  // ✅ results undefined인 경우 에러 방어
  if (!results || !Array.isArray(results)) {
    return NextResponse.json(
      { error: "결과 데이터가 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const prompt = `
  너는 심리 테스트 결과를 분석하는 AI야.
  사용자의 답변을 참고해서 아래 결과 중에서 가장 적절한 하나를 선택해줘.
  
  --- 질문과 응답 ---
  ${questions

    .map(
      (q: number, i: number) =>
        `Q${i + 1}: ${questions[i].title}\nA: ${answers[i]}`
    )
    .join("\n")}
  
  --- 결과 목록 ---
  ${results
    .map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: any, i: number) => `결과${i + 1}: ${r.name}\n설명: ${r.description}`
    )
    .join("\n\n")}
  
  가장 적절한 결과 하나를 숫자로 선택해줘. 예시: "결과1"
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const content = completion.choices[0].message?.content ?? "";
    const match = content.match(/결과(\d+)/);
    const index = match ? parseInt(match[1], 10) - 1 : 0;

    return NextResponse.json({ resultIndex: index });
  } catch (error) {
    console.error("[OpenAI Error]", error);
    return NextResponse.json({ error: "AI 분석 실패" }, { status: 500 });
  }
}
