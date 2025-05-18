"use client";

import React from "react";

import styles from "./DotAndBar.module.css";

/** ., - Indicator Interface */
interface IDotAndBar {
  /** 현재 단계 */
  progress: number;
  /** 최대 단계 */
  maxValue: number;
  /** 색상 */
  color?: string;
  /** 비활성화 색상 */
  disabledColor?: string;
  /** styles */
  style?: React.CSSProperties;
}

/** ., - Indicator */
export default function DotAndBar({
  progress,
  maxValue,
  color = "var(--primary-color)",
  disabledColor = "var(--gray-300)",
  style,
}: IDotAndBar) {
  return (
    <div
      className={styles.indicator}
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        columnGap: 10,
        ...(style && style),
      }}
    >
      {Array.from({ length: maxValue }, (_, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            width: progress === index ? 15 : 5,
            height: 5,
            background: progress === index ? color : disabledColor,
            borderRadius: 5,
          }}
        ></span>
      ))}
    </div>
  );
}
