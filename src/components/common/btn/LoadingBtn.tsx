"use client";

import React from "react";

import dynamic from "next/dynamic";

import LottieLoading from "@public/json/loading_round_white.json";

const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

/** Loading 버튼 Interface */
interface ILoadingBtn {
  /** 클릭 시 */
  onClick?: () => void;

  /** 비활성화 여부 */
  disabled?: boolean;
  /** Loading 여부 */
  isLoading?: boolean;
  /** Lavel */
  label?: React.ReactNode;
  /** styles */
  style?: React.CSSProperties;
}

/** Loading 버튼 */
export default function LoadingBtn({
  onClick,
  disabled = false,
  isLoading,
  label,
  style,
}: ILoadingBtn) {
  return (
    <button
      type="button"
      onClick={isLoading ? undefined : onClick}
      disabled={disabled}
      style={{
        width: "100%",
        ...(style && style),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <LottiePlayer
          loop
          animationData={LottieLoading}
          play
          style={{ width: 16, height: 16 }}
        />
      ) : (
        label
      )}
    </button>
  );
}
