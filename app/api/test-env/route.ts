// app/api/test-env/route.ts
export async function GET() {
  console.log(process.env);
  return Response.json({
    NEXTAUTH_URL: process.env["NEXTAUTH_URL"],
    GOOGLE_CLIENT_ID: process.env["GOOGLE_CLIENT_ID"],
    KAKAO_CLIENT_ID: process.env["KAKAO_CLIENT_ID"],
    DISCORD_CLIENT_ID: process.env["DISCORD_CLIENT_ID"],
  });
}
