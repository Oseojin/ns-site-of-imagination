// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // 임시 테스트 데이터
  const tests = [
    { id: 1, title: "나의 색깔은?", image: "/images/test1.png" },
    { id: 2, title: "나는 어떤 캐릭터?", image: "/images/test2.png" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">심리 테스트 목록</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tests.map((test) => (
          <Link
            key={test.id}
            href={`/test/${test.id}`}
            className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <Image
              src={test.image}
              alt={test.title}
              className="w-full h-40 object-cover"
              width={200}
              height={100}
            />
            <div className="p-4 font-semibold">{test.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
