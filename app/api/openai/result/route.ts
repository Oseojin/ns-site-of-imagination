// 📄 app/api/openai/result/route.ts
import { QuestionData, ResultData } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 🔐 .env에 설정 필요
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { answers, questions, results } = body;

  if (!answers || !questions || !results) {
    return NextResponse.json(
      { error: "질문, 답변, 결과 데이터가 모두 필요합니다." },
      { status: 400 }
    );
  }

  // ✅ 프롬프트 구성
  // 📄 app/api/openai/result/route.ts
  const prompt = `
너는 심리 테스트 결과를 분석하는 AI야.
사용자의 답변을 참고해서 아래 결과 중에서 가장 적절한 하나를 선택해.

각 결과에는 고유한 ID가 있어.
🎯 반드시 선택한 결과의 ID만 '숫자만'으로 반환해줘. (예: 3)
❌ 설명하지 마. 다른 텍스트는 절대 포함하지 마. 숫자만 반환해.

[질문과 답변]
${questions
  .map(
    (q: QuestionData, idx: number) =>
      `Q${idx + 1}: ${q.title}\nA: ${answers[idx]}`
  )
  .join("\n")}

[결과 후보]
${results
  .map((r: ResultData) => `ID: ${r.id}\n이름: ${r.name}\n설명: ${r.setting}`)
  .join("\n\n")}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const content = response.choices[0].message.content?.trim();
    const resultId = parseInt(content || "", 10);

    if (isNaN(resultId)) {
      throw new Error(`OpenAI 응답 파싱 실패: ${content}`);
    }

    return NextResponse.json({ resultId });
  } catch (err) {
    console.error("AI 분석 실패:", err);
    return NextResponse.json({ error: "AI 분석 실패" }, { status: 500 });
  }
}
