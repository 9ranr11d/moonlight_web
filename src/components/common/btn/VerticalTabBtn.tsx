"use client";

import React, { useEffect } from "react";

import CSS from "./TabBtn.module.css";

/** 세로 Tab 버튼 Interface */
interface IVerticalTabBtn {
  /** 선택한 순서 */
  onChange?: (idx: number) => void;

  /** 제목 배열 */
  labelArr: React.ReactNode[];
  /** 선택된 순서 */
  idx?: number;
}

/** 세로 Tab 버튼 */
export default function VerticalTabBtn({
  onChange,
  labelArr,
  idx = 0,
}: IVerticalTabBtn) {
  const [selectedIdx, setSelectedIdx] = React.useState<number>(0); // 선택한 순서

  /** 선택 시 */
  const selectIdx = (idx: number): void => {
    setSelectedIdx(idx);

    onChange?.(idx);
  };

  // 상위 컴포넌트에서 선택된 순서 변경 시
  useEffect(() => {
    // 선택된 순서로 변경
    if (idx !== undefined) setSelectedIdx(idx);
  }, [idx]);

  return (
    <div
      className={CSS.verticalTabBtnBox}
      style={{ display: "flex", flexDirection: "column", rowGap: 1 }}
    >
      {labelArr.map((label, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => selectIdx(idx)}
          disabled={idx === selectedIdx}
          style={
            idx === selectedIdx
              ? {
                  backgroundImage:
                    "linear-gradient(#fff, #fff), linear-gradient(120deg, var(--primary-color), #e0a3a7)",
                }
              : undefined
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
