// app/api/test-env/route.ts
export async function GET() {
  console.log(process.env);
  return Response.json({
    NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env["NEXT_PUBLIC_GOOGLE_CLIENT_ID"],
    KAKAO_CLIENT_ID: process.env["NEXT_PUBLIC_KAKAO_CLIENT_ID"],
    DISCORD_CLIENT_ID: process.env["NEXT_PUBLIC_DISCORD_CLIENT_ID"],
  });
}
