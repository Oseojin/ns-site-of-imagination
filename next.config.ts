/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // ✅ Google 프로필 이미지
      "k.kakaocdn.net", // ✅ Kakao 프로필 이미지
      "cdn.discordapp.com", // ✅ Discord 프로필 이미지
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ns-sangsangter-images.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
