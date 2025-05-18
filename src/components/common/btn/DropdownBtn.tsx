"use client";

import React, { useEffect, useRef, useState } from "react";

import styles from "./DropdownBtn.module.css";

import IconDownTriangle from "@public/svgs/common/icon_down_triangle.svg";

/** Dropdown 버튼 Interface */
interface IDropdownBtn {
  /** 목록 열람 여부 */
  onOpen?: (isOpen: boolean) => void;
  /** 순서 변경 시 */
  onChange?: (idx: number) => void;
  /** 스크롤 종단 여부 */
  onScrollEnd?: (isBottom: boolean) => void;

  /** 선택된 순서 */
  idx?: number;
  /** 목록 */
  list: React.ReactNode[];
  /** styles */
  style?: React.CSSProperties;
}

/** Dropdown 버튼 */
export default function DropdownBtn({
  onOpen,
  onChange,
  onScrollEnd,
  idx = 0,
  list,
  style,
}: IDropdownBtn) {
  /** 여는 버튼 Ref */
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  const listRef = useRef<HTMLUListElement | null>(null);

  const [selectedIdx, setSelectedIdx] = useState<number>(idx); // 선택된 순서
  const [toggleBtnHeight, setToggleBtnHeight] = useState<number>(0); // 여는 버튼 높이

  const [isListOpen, setIsListOpen] = useState<boolean>(false); // 목록 열기 여부

  /** 목록 열기 Toggle */
  const toggleDropdown = (): void => {
    setIsListOpen(prev => !prev);
  };

  /** 목록 중 클릭 시 */
  const clickItem = (idx: number): void => {
    setSelectedIdx(idx);
    setIsListOpen(false);

    // 상위 컴포넌트로 선택한 순서 전달
    onChange?.(idx);
  };

  // 처음 렌더 시
  useEffect(() => {
    if (toggleBtnRef.current)
      setToggleBtnHeight(toggleBtnRef.current.clientHeight);
  }, []);

  // 선택 순서 변경 시
  useEffect(() => {
    setSelectedIdx(idx);
  }, [idx]);

  // 목록 열림 여부 변경 시
  useEffect(() => {
    if (onOpen) onOpen(isListOpen);

    // 스크롤 핸들러
    const handleScroll = (): void => {
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        const isBottom = scrollTop + clientHeight >= scrollHeight - 1; // 부드러운 체크

        if (onScrollEnd) onScrollEnd(isBottom);
      }
    };

    if (listRef.current)
      listRef.current.addEventListener("scroll", handleScroll);

    return () => {
      if (listRef.current)
        listRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [isListOpen]);

  return (
    <div
      className={styles.wrapper}
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
          ref={listRef}
          className={styles.list}
          style={{
            position: "absolute",
            width: "100%",
            maxHeight: 150,
            zIndex: 998,
            top: "100%",
            overflow: "auto",
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
