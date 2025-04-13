// 📄 app/api/upload-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// 환경변수에서 설정 (환경 파일에 입력 필요)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  const filetype = searchParams.get("type");

  if (!filename || !filetype) {
    return NextResponse.json(
      { error: "Missing filename or type" },
      { status: 400 }
    );
  }

  // 업로드 키 생성 (경로 포함 가능)
  const key = `uploads/${uuidv4()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: filetype,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 유효시간 60초

  return NextResponse.json({ url, key });
}
