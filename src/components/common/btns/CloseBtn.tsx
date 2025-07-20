import React from "react";

import IconClose from "@public/svgs/common/icon_x.svg";

interface ICloseBtn {
  onClick?: () => void;

  fill?: string;
  style?: React.CSSProperties;
  size?: number;
}

export default function CloseBtn({
  onClick,
  fill,
  style,
  size = 14,
}: ICloseBtn) {
  console.log("closebtn", fill);
  return (
    <button
      type="button"
      onClick={onClick}
      className="iconBtn"
      style={{ ...style, display: "flex" }}
    >
      <IconClose width={size} height={size} style={{ fill: fill }} />
    </button>
  );
}
