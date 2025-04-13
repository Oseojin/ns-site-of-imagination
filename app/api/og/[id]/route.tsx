// 📄 app/api/og/[id]/route.tsx
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { IID } from "@/types/type";

export const runtime = "edge";

export async function GET(req: NextRequest, params: { params: IID }) {
  const testId = parseInt((await params.params).id, 10);
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: { results: true },
  });

  if (!test) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          fontSize: 48,
          background: "white",
          color: "black",
          padding: 60,
        }}
      >
        <div style={{ fontSize: 60, fontWeight: "bold" }}>{test.title}</div>
        <div style={{ marginTop: 20, fontSize: 30 }}>
          결과 수: {test.results.length}개
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
