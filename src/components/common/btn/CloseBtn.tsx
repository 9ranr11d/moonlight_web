import React, { useState } from "react";

import IconClose from "@public/svgs/common/icon_x.svg";

interface ICloseBtn {
  onClick: () => void;

  fill?: string;
  hoverFill?: string;
  style?: React.CSSProperties;
  size?: number;
}

export default function CloseBtn({
  onClick,
  fill = "var(--gray-500)",
  hoverFill = "var(--gray-900)",
  style,
  size = 15,
}: ICloseBtn) {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className="noOutlineBtn"
      style={{ ...style, display: "flex" }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <IconClose width={size} height={size} fill={isHover ? hoverFill : fill} />
    </button>
  );
}
