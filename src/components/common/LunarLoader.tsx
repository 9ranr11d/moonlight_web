"use client";

import React from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

import LottieLoading from "@public/json/loading_moon.json";

interface ILunarLoader {
  /** styles */
  style?: React.CSSProperties;
  /** 로딩 Message */
  msg?: React.ReactNode;
}

export default function LunarLoader({ style, msg }: ILunarLoader) {
  return (
    <div style={style}>
      <div
        style={{
          height: 100,
          display: "flex",
          justifyContent: "center",
          marginBottom: 30,
        }}
      >
        <Lottie
          loop
          animationData={LottieLoading}
          style={{ width: 100, height: 100 }}
        />
      </div>

      <h6>
        {msg || (
          <>
            달이 차오르고 있습니다.
            <br />
            잠시만 주무시고 오세요.
          </>
        )}
      </h6>
    </div>
  );
}
