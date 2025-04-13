// 📄 lib/auth.config.ts
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

    async signIn({ user }) {
      const existing = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!existing) {
        await prisma.user.create({
          data: {
            id: user.id,
            nickname: user.name ?? "이름 없음",
            image: user.image ?? "",
          },
        });
      }

      return true;
    },
  },
};
