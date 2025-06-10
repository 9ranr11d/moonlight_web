"use client";

import React from "react";

import IconExpand from "@public/svgs/common/icon_expand.svg";
import IconCollapse from "@public/svgs/common/icon_collapse.svg";

/** 더보기 버튼 Interface */
interface IExpandCollapseBtn {
  /** 클릭 시 */
  onClick: () => void;

  /** 현재 더보기 여부 */
  isExpanded: boolean;
  /** 색상 */
  fill?: string;
  /** 크기 */
  size: number;
  /** Style */
  style?: React.CSSProperties;
}

/** 더보기 버튼 */
export default function ExpandCollapseBtn({
  onClick,
  isExpanded,
  fill = "black",
  size,
  style,
}: IExpandCollapseBtn) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: size,
        height: size,
        padding: 0,
        background: "none",
        ...(style && { ...style }),
      }}
    >
      <span
        style={{ display: "inline-block", position: "relative", bottom: 0.5 }}
      >
        {isExpanded ? (
          <IconCollapse width={size} height={size} fill={fill} />
        ) : (
          <IconExpand width={size} height={size} fill={fill} />
        )}
      </span>
    </button>
  );
}
