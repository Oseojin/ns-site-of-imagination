// app/api/upload/route.ts
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const { fileName, fileType } = await req.json();

  const fileKey = `uploads/${uuidv4()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileKey,
    ContentType: fileType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return NextResponse.json({
    uploadUrl: url,
    fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${fileKey}`,
  });
}
