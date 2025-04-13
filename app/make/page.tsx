// 📄 app/make/page.tsx
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import TestCardEditable from "@/components/TestCardEditable";
import NewTestButton from "@/components/NewTestButton";

export default async function MakePage() {
  const session = await getServerSession(authConfig);
  const providerId = session?.user?.id;

  if (!providerId) {
    return (
      <main className="p-10">
        <p>로그인이 필요합니다.</p>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: providerId },
  });

  if (!user) {
    return (
      <main className="p-10">
        <p>유저 정보를 찾을 수 없습니다.</p>
      </main>
    );
  }

  const tests = await prisma.test.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { likes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">내가 만든 테스트</h1>
        <NewTestButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tests.map((test) => (
          <TestCardEditable
            key={test.id}
            id={test.id}
            title={test.title}
            titleImage={test.titleImage}
            likeCount={test._count.likes}
          />
        ))}
      </div>
    </main>
  );
}
