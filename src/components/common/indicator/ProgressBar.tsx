"use client";

import React from "react";

/** Progress Bar Interface */
interface IProgressBar {
  /** 현재 단계 */
  progress: number;
  /** 최대 단계 */
  maxValue: number;
  /** 높이 */
  height?: number;
  /** 색상 */
  color?: string;
  /** CSS */
  style?: React.CSSProperties;
}

/** Progress Bar */
export default function ProgressBar({
  progress,
  maxValue,
  height = 10,
  color = "var(--primary-color)",
  style,
}: IProgressBar) {
  const percentage = Math.min((progress / maxValue) * 100, 100);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        height: height,
        borderRadius: 5,
        overflow: "hidden",
        background: "var(--gray-200)",
        ...(style && style),
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          background: color,
          height: "100%",
          borderRadius: 5,
          transition: "width 0.3s ease-in-out",
        }}
      />
    </div>
  );
}
