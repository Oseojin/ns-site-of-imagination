/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // ✅ Google 프로필 이미지
      "k.kakaocdn.net", // ✅ Kakao 프로필 이미지
      "cdn.discordapp.com", // ✅ Discord 프로필 이미지
    ],
  },
};

module.exports = nextConfig;
