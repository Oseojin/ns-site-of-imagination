"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  imageUrl: string;
  setImageUrl: (url: string) => void;
};

export default function ImageUploader({ imageUrl, setImageUrl }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const filename = encodeURIComponent(file.name);
      const res = await fetch(
        `/api/upload-url?filename=${filename}&type=${file.type}`
      );
      const { url, key } = await res.json();

      // S3에 PUT 업로드
      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("S3 업로드 실패");

      // ✅ S3 public URL 구성
      const s3url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${key}`;
      setImageUrl(s3url);
    } catch (err) {
      alert("업로드 실패: " + err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {uploading && <p className="text-sm text-gray-500">업로드 중...</p>}
      {imageUrl && (
        <div className="relative w-full max-w-xs aspect-video">
          <Image
            src={imageUrl}
            alt="업로드된 이미지"
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
      )}
    </div>
  );
}
