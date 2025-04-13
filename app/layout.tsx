// 📄 app/layout.tsx
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react";
import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: { title: "%s | N들의 상상터", default: "N들의 상상터" },
  description: "상상력의 공간",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Analytics />
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
