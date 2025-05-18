"use client";

import React, { useEffect } from "react";

import styles from "./TabBtn.module.css";

/** 세로 Tab 버튼 Interface */
interface IDirectionTabBtns {
  /** 선택한 순서 */
  onTabSelect?: (idx: number) => void;

  /** 제목 배열 */
  labelArr: React.ReactNode[];
  /** 선택된 순서 */
  idx?: number;
  /** 방향 */
  direction: "row" | "column";
  /** styles */
  style?: React.CSSProperties;
}

/** 세로 Tab 버튼 */
export default function DirectionTabBtns({
  onTabSelect,
  labelArr,
  idx = -1,
  direction = "column",
  style,
}: IDirectionTabBtns) {
  const [selectedIdx, setSelectedIdx] = React.useState<number>(0); // 선택한 순서

  /** 선택 시 */
  const selectIdx = (idx: number): void => {
    setSelectedIdx(idx);

    onTabSelect?.(idx);
  };

  // 상위 컴포넌트에서 선택된 순서 변경 시
  useEffect(() => {
    // 선택된 순서로 변경
    if (idx !== undefined) setSelectedIdx(idx);
  }, [idx]);

  return (
    <div
      className={styles.directionTabBtnsBox}
      style={{
        display: "flex",
        flexDirection: direction,
        rowGap: 1,
        columnGap: 5,
        ...(style && style),
      }}
    >
      {labelArr.map((label, idx) => (
        <React.Fragment key={idx}>
          <button
            type="button"
            onClick={() => selectIdx(idx)}
            disabled={idx === selectedIdx}
            style={{
              ...(direction === "row" && { borderRadius: 20 }),
              ...(idx === selectedIdx
                ? {
                    backgroundImage:
                      "linear-gradient(#fff, #fff), linear-gradient(120deg, var(--primary-color), #e0a3a7)",
                    color: "var(--font-color)",
                  }
                : direction === "row"
                ? {
                    backgroundImage:
                      "linear-gradient(#fff, #fff), linear-gradient(var(--gray-200))",
                    color: "var(--gray-400)",
                  }
                : undefined),
            }}
          >
            {label}
          </button>

          {direction === "column" && idx < labelArr.length - 1 && (
            <div
              style={{
                width: "100%",
                height: 1,
                background: "var(--gray-100)",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
