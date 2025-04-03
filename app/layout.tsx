// app/layout.tsx
import AuthButtons from "@/components/AuthButtons";
import SessionProvider from "@/components/SessionProvider";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ns_Site_of_Imagination",
  description: "상상력으로 만드는 심리 테스트 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <SessionProvider>
          <nav className="w-full px-6 py-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-bold">
                N들의 상상터
              </Link>

              <Link href="/make" className="text-sm hover:underline">
                상상공방
              </Link>
            </div>

            <AuthButtons />
          </nav>

          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
