"use client";

import React from "react";

import IconBack from "@public/svgs/common/icon_less_than.svg";

/** 제목 Header Interface */
interface ITitleHeader {
  /** 뒤로가기 클릭 시 */
  back?: () => void;

  /** 제목 */
  title?: string;
  /** CSS */
  style?: React.CSSProperties;
  /** 오른쪽 아이콘 */
  rightIcon?: React.ReactNode;
}

/** 제목 Header  */
export default function TitleHeader({
  back,
  title,
  style,
  rightIcon,
}: ITitleHeader) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "24px 1fr 24px",
        columnGap: 10,
        alignItems: "center",
        ...(style && style),
      }}
    >
      <button
        type="button"
        onClick={back}
        style={{
          background: "none",
          padding: 0,
        }}
      >
        <IconBack width={24} height={24} fill={"black"} />
      </button>

      <h3 style={{ flex: 1 }}>{title}</h3>

      {rightIcon && rightIcon}
    </div>
  );
}
