"use client";

import React, { useEffect, useRef, useState } from "react";

import CSS from "./DropdownBtn.module.css";

import IconDownTriangle from "@public/svgs/common/icon_down_triangle.svg";

/** Dropdown 버튼 Interface */
interface IDropdownBtn {
  /** 순서 변경 시 */
  onChange?: (idx: number) => void;

  /** 선택된 순서 */
  idx?: number;
  /** 목록 */
  list: string[];
  /** CSS */
  style?: React.CSSProperties;
}

/** Dropdown 버튼 */
export default function DropdownBtn({
  onChange,
  idx = 0,
  list,
  style,
}: IDropdownBtn) {
  /** 여는 버튼 Ref */
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  const [selectedIdx, setSelectedIdx] = useState<number>(idx); // 선택된 순서
  const [toggleBtnHeight, setToggleBtnHeight] = useState<number>(0); // 여는 버튼 높이

  const [isListOpen, setIsListOpen] = useState<boolean>(false); // 목록 열기 여부

  /** 목록 열기 Toggle */
  const toggleDropdown = () => {
    setIsListOpen(prev => !prev);
  };

  /** 목록 중 클릭 시 */
  const clickItem = (idx: number) => {
    setSelectedIdx(idx);
    setIsListOpen(false);

    // 상위 컴포넌트로 선택한 순서 전달
    if (onChange) onChange(idx);
  };

  // 처음 렌더 시
  useEffect(() => {
    if (toggleBtnRef.current)
      setToggleBtnHeight(toggleBtnRef.current.clientHeight);
  }, []);

  return (
    <div
      className={CSS.wrapper}
      style={{ position: "relative", ...(style && style) }}
    >
      <button
        ref={toggleBtnRef}
        type="button"
        onClick={toggleDropdown}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: 5,
          whiteSpace: "nowrap",
          borderRadius: isListOpen ? "3px 3px 0 0" : 3,
          padding: 10,
        }}
      >
        {list[selectedIdx]}

        <IconDownTriangle width={9} height={9} fill={"black"} />
      </button>

      {isListOpen && (
        <ul
          className={CSS.listBox}
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 998,
            top: "100%",
          }}
        >
          {list.map((item, idx) => (
            <li key={idx}>
              <button
                type="button"
                onClick={() => clickItem(idx)}
                style={{
                  width: "100%",
                  height: `${toggleBtnHeight}px`,
                  textAlign: "left",
                  padding: 10,
                }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
