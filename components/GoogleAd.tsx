// app/GoogleAd.tsx
"use client";

import { useEffect } from "react";

export default function GoogleAd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1291810764124876";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
  }, []);

  return <div id="google-ad" />;
}
