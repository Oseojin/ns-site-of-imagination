import prisma from "@/lib/prisma";
import { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";

interface KakaoProfile {
  id: string;
  properties?: {
    nickname?: string;
    profile_image?: string;
  };
}

export const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: { params: { scope: "profile_nickname profile_image" } },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signIn({ account, profile }) {
      if (!profile) return false;

      const providerId =
        "sub" in profile
          ? profile.sub
          : "id" in profile
          ? String(profile.id)
          : null;

      if (!providerId) return false;

      const existing = await prisma.user.findUnique({
        where: { providerId },
      });

      if (!existing) {
        const kakaoProfile = profile as KakaoProfile;

        await prisma.user.create({
          data: {
            providerId,
            name:
              profile.name ?? kakaoProfile.properties?.nickname ?? "이름 없음",
            image: kakaoProfile.properties?.profile_image ?? null,
          },
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.id = token.sub as string; // ✅ 필수
      }
      return session;
    },
  },
};
