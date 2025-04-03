// app/profile/page.tsx
import ClientGuard from "@/components/ClientGuard";
import LogoutButton from "@/components/LogoutButton";
import { authConfig } from "@/lib/auth.config";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return <p>로그인 정보가 없습니다.</p>;
  }

  const { name, email, image } = session.user;

  return (
    <ClientGuard>
      <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">내 프로필</h1>

        <div className="flex items-center gap-4 mb-6">
          {image && (
            <Image
              src={image}
              alt="프로필 이미지"
              width={60}
              height={60}
              className="rounded-full"
            />
          )}
          <div>
            <p className="text-lg font-semibold">{name}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        <LogoutButton />

        {/* ✅ 디버깅용 세션 출력 */}
        <div className="mt-6">
          <h2 className="text-sm font-bold mb-1 text-gray-500">
            🔍 세션 정보 (Debug)
          </h2>
          <pre className="text-xs bg-gray-100 p-4 rounded text-gray-700 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </ClientGuard>
  );
}
