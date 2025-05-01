"use client";

import React, { useEffect, useState } from "react";

/** Radio 버튼 Interface */
interface IRadioBtn {
  /** 순서 변경 시 */
  onChange?: (idx: number) => void;

  /** 선택된 순서 */
  idx?: number;
  /** 목록 */
  list: React.ReactNode[];
  /** CSS */
  style?: React.CSSProperties;
  /** 선택된 항목 Font */
  font?: "pretendard" | "sf";
}

/** Radio 버튼 */
export default function RadioBtns({
  onChange,
  idx = 0,
  list,
  style,
}: IRadioBtn) {
  const [selectedIdx, setSelectedIdx] = useState<number>(idx); // 선택된 순서

  /** 선택된 순서 변경 시 */
  const selectIdx = (idx: number): void => {
    setSelectedIdx(idx);

    // 상위 컴포넌트로 선택한 순서 전달
    onChange?.(idx);
  };

  // 선택 순서 변경 시
  useEffect(() => {
    setSelectedIdx(idx);
  }, [idx]);

  return (
    <div style={{ display: "flex", columnGap: 10, ...(style && style) }}>
      {list.map((item, _idx) => (
        <button
          key={_idx}
          onClick={() => selectIdx(_idx)}
          style={{
            position: "relative",
            flex: 1,
            border:
              _idx === selectedIdx
                ? "2px solid transparent"
                : "1px solid var(--gray-300)",
            borderRadius: 20,
            backgroundImage:
              "linear-gradient(#fff, #fff), linear-gradient(120deg, var(--primary-color), #e0a3a7)",
            backgroundOrigin: "border-box",
            backgroundClip: "content-box, border-box",
            padding: 0,
            color:
              _idx === selectedIdx ? "var(--primary-color)" : "var(--gray-300)",
          }}
        >
          <div style={{ margin: 10 }}>{item}</div>
        </button>
      ))}
    </div>
  );
}
