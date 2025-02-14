"use client";

import React, { useEffect, useState } from "react";

import CSS from "./TabBtn.module.css";

/** Tab 버튼 Interface */
interface ITabBtn {
  /** 선택한 순서 */
  onChange?: (idx: number) => void;

  /** 제목 배열 */
  labelArr: string[];
  /** 선택된 순서 */
  idx?: number;
}

/** Tab 버튼 */
export default function TabBtn({ onChange, labelArr, idx = 0 }: ITabBtn) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0); // 선택한 순서

  /** 선택 시 */
  const selectIdx = (idx: number): void => {
    setSelectedIdx(idx);

    // 상위 컴포넌트로 선택한 순서 전달
    if (onChange) onChange(idx);
  };

  // 상위 컴포넌트에서 선택된 순서 변경 시
  useEffect(() => {
    // 선택된 순서로 변경
    if (idx !== undefined) setSelectedIdx(idx);
  }, [idx]);

  return (
    <div className={CSS.tabBtnBox}>
      {labelArr.map((label, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => selectIdx(idx)}
          disabled={idx === selectedIdx}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
