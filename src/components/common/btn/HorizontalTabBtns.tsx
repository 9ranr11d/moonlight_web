"use client";

import React, { useEffect, useState } from "react";

import styles from "./TabBtn.module.css";

/** 가로 Tab 버튼 Interface */
interface IHorizontalTabBtn {
  /** 선택한 순서 */
  onChange?: (idx: number) => void;

  /** 제목 배열 */
  labelArr: React.ReactNode[];
  /** 선택된 순서 */
  idx?: number;
}

/** 가로 Tab 버튼 */
export default function HorizontalTabBtns({
  onChange,
  labelArr,
  idx = 0,
}: IHorizontalTabBtn) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0); // 선택한 순서

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
    <div className={styles.horizontalTabBtnsBox}>
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
