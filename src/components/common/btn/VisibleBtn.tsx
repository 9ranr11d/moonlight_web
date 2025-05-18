"use client";

import React, { useState } from "react";

import styles from "./VisibleBtn.module.css";

import IconEyeClose from "@public/svgs/common/icon_eye_close.svg";
import IconEyeOpen from "@public/svgs/common/icon_eye_open.svg";

/** 가시 여부 버튼 Interface */
interface IVisibleBtn {
  /** 클릭 시 */
  onClick: () => void;

  /** 가시 여부 */
  isVisible: boolean;
  style?: React.CSSProperties;
}

/** 가시 여부 버튼 */
export default function VisibleBtn({ onClick, isVisible, style }: IVisibleBtn) {
  const [isVisibleHover, setIsVisibleHover] = useState<boolean>(false); // 가시 여부 버튼 Hover 여부

  /**
   * 가시 여부 아이콘 Hover 관리
   * @param isHover Hover 여부
   */
  const hoverVisibility = (isHover: boolean): void => {
    setIsVisibleHover(isHover);
  };

  return (
    <button
      type="button"
      className={styles.visibleBtn}
      style={style && style}
      onClick={onClick}
      onMouseOver={e => hoverVisibility(true)}
      onMouseOut={e => hoverVisibility(false)}
    >
      {isVisible ? (
        isVisibleHover ? (
          <IconEyeClose width={15} height={15} fill={"var(--gray-500)"} />
        ) : (
          <IconEyeOpen width={15} height={15} fill={"var(--gray-500)"} />
        )
      ) : isVisibleHover ? (
        <IconEyeOpen width={15} height={15} fill={"var(--gray-500)"} />
      ) : (
        <IconEyeClose width={15} height={15} fill={"var(--gray-500)"} />
      )}
    </button>
  );
}
