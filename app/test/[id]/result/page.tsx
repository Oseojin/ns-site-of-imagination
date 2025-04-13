// 📄 app/test/[id]/result/page.tsx
import ResultPageClient from "@/components/ResultPageClient";
import { IID } from "@/types/type";

export async function generateMetadata(params: { params: IID }) {
  const id = parseInt((await params.params).id, 10);
  const siteUrl = "https://ns-site-of-imagination.com";

  return {
    title: "테스트 결과",
    openGraph: {
      title: "내 결과는 어떤 타입일까?",
      description: "Ns_Site_of_Imagination에서 만든 심리 테스트 결과입니다.",
      type: "website",
      url: `${siteUrl}/test/${id}/result`,
      images: [
        {
          url: `${siteUrl}/api/og/${id}`, // 기존대로 유지
          width: 1200,
          height: 630,
          alt: "심리 테스트 결과 미리보기",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "내 결과는 어떤 타입일까?",
      description: "Ns_Site_of_Imagination에서 만든 심리 테스트 결과입니다.",
      images: [`${siteUrl}/api/og/${id}`],
    },
  };
}

export default async function ResultPage(params: { params: IID }) {
  return <ResultPageClient testId={parseInt((await params.params).id, 10)} />;
}
