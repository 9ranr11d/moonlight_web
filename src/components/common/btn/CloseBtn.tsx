import React, { useState } from "react";

import IconClose from "@public/svgs/common/icon_x.svg";

interface ICloseBtn {
  onClick: () => void;

  style?: React.CSSProperties;
  size?: number;
}

export default function CloseBtn({ onClick, style, size = 15 }: ICloseBtn) {
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
      <IconClose
        width={size}
        height={size}
        fill={isHover ? "var(--gray-900)" : "var(--gray-500)"}
      />
    </button>
  );
}
