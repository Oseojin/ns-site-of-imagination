export const dynamic = "force-dynamic";

import StartButton from "@/components/StartButton";
import Image from "next/image";
import { notFound } from "next/navigation";

type IParams = Promise<{ id: string }>;

export default async function TestDetailPage({ params }: { params: IParams }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/tests/${(await params).id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const data = await res.json();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">{data.title}</h1>

      <div className="w-full h-64 relative rounded-xl overflow-hidden border">
        <Image
          src={data.titleImage}
          alt="타이틀 이미지"
          fill
          className="object-cover"
        />
      </div>

      <StartButton testId={`${(await params).id}`} />
    </div>
  );
}
