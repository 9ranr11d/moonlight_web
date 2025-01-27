"use client";

import React from "react";

import IconUncheckBox from "@public/svgs/common/icon_uncheck_box.svg";
import IconCheckBox from "@public/svgs/common/icon_check_box.svg";

/** 체크박스 인터페이스 */
interface ICheckBox {
  /** 클릭 시 */
  onClick: () => void;

  /** 색상 */
  fill?: string;
  /** 크기 */
  size: number;
  /** 체크 여부 */
  isChecked: boolean;
}

/** 체크박스 */
export default function CheckBox({
  onClick,
  fill = "black",
  size,
  isChecked,
}: ICheckBox) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: size,
        height: size,
        padding: 0,
        background: "none",
      }}
    >
      <span
        style={{ display: "inline-block", position: "relative", bottom: 0.5 }}
      >
        {isChecked ? (
          <IconCheckBox width={size} height={size} fill={fill} />
        ) : (
          <IconUncheckBox width={size} height={size} fill={fill} />
        )}
      </span>
    </button>
  );
}
