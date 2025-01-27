"use client";

import React from "react";

import dynamic from "next/dynamic";

import LottieLoading from "@public/json/loading_moon.json";

const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false, // 서버에서는 렌더링하지 않음
});

export default function LunarLoader() {
  return (
    <div>
      <div
        style={{
          height: 100,
          display: "flex",
          justifyContent: "center",
          marginBottom: 30,
        }}
      >
        <LottiePlayer
          loop
          animationData={LottieLoading}
          play
          style={{ width: 100, height: 100 }}
        />
      </div>

      <h6>
        달이 차오르고 있습니다.
        <br />
        잠시만 주무시고 오세요.
      </h6>
    </div>
  );
}
