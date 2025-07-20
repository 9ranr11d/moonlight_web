"use client";

import React from "react";

import IconUncheckBox from "@public/svgs/common/icon_uncheck_box.svg";
import IconCheckBox from "@public/svgs/common/icon_check_box.svg";
import IconCheck from "@public/svgs/common/icon_check.svg";

/** 체크박스 Interface */
interface ICheckBoxBtn {
  /** 클릭 시 */
  onClick: () => void;

  /** 색상 */
  fill?: string;
  /** 크기 */
  size: number;
  /** 체크 여부 */
  isChecked: boolean;
}

/** 체크박스 버튼 */
export default function CheckBoxBtn({
  onClick,
  fill = "var(--gray-800)",
  size,
  isChecked,
}: ICheckBoxBtn) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="iconBtn"
      style={{
        width: size,
        height: size,
      }}
    >
      <span
        style={{
          width: size,
          height: size,
          display: "inline-block",
          position: "relative",
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            background: isChecked ? "none" : "var(--gray-200)",
            borderRadius: "20%",
            border: isChecked ? `2px solid ${fill}` : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isChecked && (
            <IconCheck
              width={size - 4}
              height={size - 4}
              style={{ fill: fill }}
            />
          )}
        </div>
      </span>
    </button>
  );
}
