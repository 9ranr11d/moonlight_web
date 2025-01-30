"use client";

import React, { useEffect, useState } from "react";

import CSS from "./VisibleBtn.module.css";

import IconEyeClose from "@public/svgs/common/icon_eye_close.svg";
import IconEyeOpen from "@public/svgs/common/icon_eye_open.svg";

/** 가시 여부 버튼 Interface */
interface IVisibleBtn {
  /** 현재 가시 여부 */
  onVisible?: (isVisible: boolean) => void;
}

/** 가시 여부 버튼 */
export default function VisibleBtn({ onVisible }: IVisibleBtn) {
  const [isVisible, setIsVisible] = useState<boolean>(false); // 가시 여부
  const [isVisibleHover, setIsVisibleHover] = useState<boolean>(false); // 가시 여부 버튼 Hover 여부

  /**
   * 가시 여부 아이콘 Hover 관리
   * @param isHover Hover 여부
   */
  const hoverVisibility = (isHover: boolean): void => {
    setIsVisibleHover(isHover);
  };

  /** 가시 여부 Toggle */
  const toggleVisibility = (): void => {
    setIsVisible(prev => !prev);
  };

  useEffect(() => {
    if (onVisible) onVisible(isVisible);
  }, [isVisible]);

  return (
    <button
      type="button"
      className={CSS.visibleBtn}
      onClick={toggleVisibility}
      onMouseOver={() => hoverVisibility(true)}
      onMouseOut={() => hoverVisibility(false)}
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
