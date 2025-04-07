import { authConfig } from "@/lib/auth.config"; // ✅ 이거 반드시 import!
import NextAuth from "next-auth";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
