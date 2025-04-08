import AuthButtons from "@/components/AuthButtons";
import SessionProvider from "@/components/SessionProvider";
import { Analytics } from "@vercel/analytics/next";
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
          <nav className="w-full px-6 py-4 border-b">
            <div className="flex flex-row items-start gap-2">
              <Link href="/" className="text-xl font-bold">
                N들의 상상터
              </Link>
              <Link
                href="/make"
                className="text-sm text-gray-700 hover:underline"
              >
                상상공방
              </Link>
            </div>

            <div className="absolute top-4 right-6">
              <AuthButtons />
            </div>
          </nav>

          {children}
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
