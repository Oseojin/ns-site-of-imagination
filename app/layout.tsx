// app/layout.tsx
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ns Site of Imagination",
  description: "N들의 상상터에 오신 걸 환영합니다",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <header className="flex justify-between items-center px-6 py-4 border-b">
          <Link href="/" className="text-xl font-bold">
            N들의 상상터
          </Link>
          <Link href="/profile" className="text-sm hover:underline">
            프로필
          </Link>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
