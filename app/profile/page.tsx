// app/profile/page.tsx
import ClientGuard from "@/components/ClientGuard";

export default function ProfilePage() {
  return (
    <ClientGuard>
      <div>
        <h1 className="text-xl font-bold">내 프로필</h1>
        {/* 여기에 사용자 정보 등 출력 */}
      </div>
    </ClientGuard>
  );
}
