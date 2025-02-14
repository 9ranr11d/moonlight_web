"use client";

import React from "react";

import CSS from "./NextBtn.module.css";

import IconGreaterThan from "@public/svgs/common/icon_greater_than.svg";

/** 다음 버튼 Interface */
interface INextBtn {
  /** 클릭 시 */
  onClick?: () => void;

  /** 비활성화 여부 */
  disabled?: boolean;
  /** 버튼 문자열 */
  label?: string;
  /** 내용 */
  children?: React.ReactNode;
}

/** 다음 버튼 */
export default function NextBtn({
  onClick,
  disabled = false,
  label = "다음",
  children,
}: INextBtn) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={CSS.nextBtn}
    >
      {children ? children : label}

      <div
        style={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconGreaterThan width={12} height={12} fill={"white"} />
      </div>
    </button>
  );
}
