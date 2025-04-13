// 📄 app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/Header";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: { title: "%s | N들의 상상터", default: "상상터" },
  description: "상상력의 공간",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
