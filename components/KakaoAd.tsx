// app/KakaoAd.tsx
"use client";

import { useEffect } from "react";

export default function KaKaoAd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <ins
        className="kakao_ad_area"
        style={{ display: "none" }}
        data-ad-unit="DAN-W7E1vl8z7BsMO4cC"
        data-ad-width="160"
        data-ad-height="600"
      ></ins>
    </div>
  );
}
