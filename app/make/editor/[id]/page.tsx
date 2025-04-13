// 서버 컴포넌트
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditorLoader from "@/components/EditorLoader";
import { IID, MakeEditorInitialData } from "@/types/type";

export default async function EditTestPage(params: { params: IID }) {
  const session = await getServerSession(authConfig);
  const providerId = session?.user?.id;

  if (!providerId) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: providerId } });
  const testId = parseInt((await params.params).id, 10);

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      questions: { include: { options: true } },
      results: true,
    },
  });

  if (!test || test.userId !== user?.id) notFound();

  const initialData: MakeEditorInitialData = {
    title: test.title,
    titleImage: test.titleImage,
    setting: test.setting,
    questions: test.questions.map((q) => ({
      id: q.id,
      title: q.title,
      image: q.image,
      type: q.type as "objective" | "subjective",
      options: q.options.map((opt) => opt.text),
    })),
    results: test.results.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      image: r.image,
      setting: r.setting,
    })),
  };

  return <EditorLoader testId={testId} fallbackData={initialData} />;
}
