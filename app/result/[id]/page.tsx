// 📄 app/result/[id]/page.tsx
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ResultView from "@/components/ResultView";
import { IID } from "@/types/type";

export async function generateMetadata(params: { params: IID }) {
  const saved = await prisma.savedResult.findUnique({
    where: { id: (await params.params).id },
    include: { result: true },
  });

  if (!saved) return {};

  const siteUrl = "https://ns-site-of-imagination.com";

  return {
    title: saved.result.name,
    description: saved.result.description,
    openGraph: {
      title: saved.result.name,
      description: saved.result.description,
      type: "website",
      url: `${siteUrl}/result/${(await params.params).id}`,
      images: [
        {
          url: saved.result.image || `${siteUrl}/default-og.png`,
          width: 1200,
          height: 630,
          alt: "결과 이미지",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: saved.result.name,
      description: saved.result.description,
      images: [saved.result.image || `${siteUrl}/default-og.png`],
    },
  };
}

export default async function SharedResultPage(params: { params: IID }) {
  const saved = await prisma.savedResult.findUnique({
    where: { id: (await params.params).id },
    include: {
      result: true,
    },
  });

  if (!saved) {
    notFound();
  }

  return <ResultView result={saved.result} />;
}
