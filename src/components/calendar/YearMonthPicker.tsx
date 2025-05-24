"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import { MONTH_NAMES } from "@constants/date";

import styles from "./YearMonthPicker.module.css";

import IconTop from "@public/svgs/common/icon_expand.svg";
import IconBottom from "@public/svgs/common/icon_collapse.svg";
import IconClose from "@public/svgs/common/icon_x.svg";

/** 연도, 달 선택 Interface */
interface IYearMonthPicker {
  /** 선택한 년도, 달 */
  onSelect: (date: Date) => void;
  /** 연도 표기 형식일 때 제목 클릭 시 */
  onYearClick?: () => void;

  /** 선택된 년도, 달 */
  date?: Date;
}

/** 표시할 아이템 */
type DisplayItem = number | { year: number; month: number };

/** 표시할 년도 범위 */
const YEAR_RANGE = 16;

/** 페이지당 표시할 아이템 수 */
const ITEMS_PER_PAGE = 12;

/** 최소 년도 */
const MIN_YEAR = 1900;

/** 연도 아이템 생성 */
const createYearItems = (startYear: number, count: number): number[] => {
  return Array.from({ length: count }, (_, i) => startYear + i);
};

/** 달 아이템 생성 */
const createMonthItems = (year: number): DisplayItem[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    year,
    month: i + 1,
  }));
};

/** 연도, 달 선택 컴포넌트 */
export default function YearMonthPicker({
  onSelect,
  onYearClick,
  date = new Date(),
}: IYearMonthPicker) {
  /** 스크롤 요소 Ref */
  const scrollRef = useRef<HTMLDivElement>(null);

  /** 연도, 달 요소 Ref */
  const yearMonthRef = useRef<HTMLDivElement>(null);

  /** 표시할 Item Ref */
  const displayItemsRef = useRef<DisplayItem[]>([]);

  const [gridHeight, setGridHeight] = useState<number>(0); // Grid 높이

  const [isAddPrevItem, setIsAddPrevItem] = useState<boolean>(false); // 이전 Item 추가 여부

  const [selectedDate, setSelectedDate] = useState<Date>(date || new Date()); // 선택된 날짜

  const [hoveredItem, setHoveredItem] = useState<DisplayItem | null>(null); // Hover 날짜
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]); // 표시할 Item
  const [mode, setMode] = useState<"year" | "month">("year"); // 표기 형식

  /** 달 선택자 */
  const handleMonthClick = useCallback(
    (year: number, month: number) => {
      const newDate = new Date(year, month - 1, 1);
      setSelectedDate(newDate);
      onSelect(newDate);
    },
    [onSelect]
  );

  /** 연도 선택자 */
  const handleYearClick = useCallback(
    (year: number) => {
      setSelectedDate(new Date(year, selectedDate.getMonth(), 1));
      setMode("month");
    },
    [selectedDate]
  );

  /** 이전 년도 선택자 */
  const handlePrevYear = useCallback(() => {
    const newDate = new Date(selectedDate);

    if (mode === "year") newDate.setFullYear(newDate.getFullYear() + 1);
    else newDate.setMonth(newDate.getMonth() + 1);

    setSelectedDate(newDate);
  }, [selectedDate, mode]);

  /** 다음 년도 선택자 */
  const handleNextYear = useCallback(() => {
    const newDate = new Date(selectedDate);

    if (mode === "year") newDate.setFullYear(newDate.getFullYear() - 1);
    else newDate.setMonth(newDate.getMonth() - 1);

    setSelectedDate(newDate);
  }, [selectedDate, mode]);

  /** Scroll 관리자 */
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !yearMonthRef.current) return;

    // Scroll 요소의 현재 Scroll 위치, Scroll 영역 전체 높이, 보이는 영역 높이
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    // Scroll 최상단 도달 시
    if (scrollTop === 0) {
      /** 첫 번째 Item */
      const firstItem = displayItemsRef.current[0];

      /** 추가될 Item */
      const newItems =
        mode === "year"
          ? createYearItems(
              (firstItem as number) - ITEMS_PER_PAGE,
              ITEMS_PER_PAGE
            )
          : createMonthItems((firstItem as { year: number }).year - 1);

      setDisplayItems(prev => [...newItems, ...prev]);

      setIsAddPrevItem(true);
    }
    // Scroll 최하단 도달 시
    else if (scrollTop >= scrollHeight - clientHeight - 1) {
      /** 마지막 Item */
      const lastItem =
        displayItemsRef.current[displayItemsRef.current.length - 1];

      /** 추가될 Item */
      const newItems =
        mode === "year"
          ? createYearItems((lastItem as number) + 1, ITEMS_PER_PAGE)
          : createMonthItems((lastItem as { year: number }).year + 1);

      setDisplayItems(prev => [...prev, ...newItems]);
    }
  }, [mode]);

  /** 선택된 날짜 변경 시 */
  useEffect(() => {
    if (date) setSelectedDate(date);
  }, [date]);

  /** 표시할 Item 형식이나 선택된 날짜 변경 시 */
  useEffect(() => {
    if (mode === "year") {
      /** 선택된 년도 */
      const selectedYear = selectedDate.getFullYear();
      /** 시작 년도 */
      const startYear = Math.max(MIN_YEAR, selectedYear - YEAR_RANGE);

      setDisplayItems(createYearItems(startYear, YEAR_RANGE * 2));
    } else {
      /** 선택된 년도 */
      const selectedYear = selectedDate.getFullYear();

      setDisplayItems([
        ...createMonthItems(selectedYear - 1),
        ...createMonthItems(selectedYear),
        ...createMonthItems(selectedYear + 1),
      ]);
    }
  }, [mode, selectedDate]);

  // 표시할 Item 변경 시
  useEffect(() => {
    if (yearMonthRef.current) {
      setGridHeight(yearMonthRef.current.offsetHeight * 3);

      if (scrollRef.current && displayItems) {
        /** 선택된 Item 인덱스 변수(기본 값: -1) */
        let itemIdx = -1;

        itemIdx = displayItems.findIndex(item =>
          mode === "year"
            ? (item as number) === selectedDate.getFullYear()
            : (item as { year: number; month: number }).year ===
                selectedDate.getFullYear() &&
              (item as { year: number; month: number }).month ===
                selectedDate.getMonth() + 1
        );

        // 선택된 Item 인덱스가 없으면 종료
        if (itemIdx === -1) return;

        /** 선택된 Item 행 */
        const itemRow = Math.floor(itemIdx / 4);

        scrollRef.current.scrollTo({
          top: yearMonthRef.current.offsetHeight * itemRow,
          behavior: "smooth",
        });
      }
    }
  }, [displayItems]);

  // Scroll 시
  useEffect(() => {
    const scrollElement = scrollRef.current;

    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);

      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // 표시할 Item 변경 시
  useEffect(() => {
    displayItemsRef.current = displayItems;
  }, [displayItems]);

  // 이전 Item 추가해야할 때
  useEffect(() => {
    if (isAddPrevItem) {
      setIsAddPrevItem(false);

      scrollRef.current?.scrollTo({ top: gridHeight });
    }
  }, [isAddPrevItem, gridHeight]);

  /** Item 렌더링 */
  const renderItem = (item: DisplayItem, index: number) => {
    /** 선택된 Item 여부 */
    const isSelected =
      mode === "year"
        ? selectedDate.getFullYear() === item
        : typeof item !== "number" &&
          selectedDate.getFullYear() === item.year &&
          selectedDate.getMonth() + 1 === item.month;

    return (
      <div
        ref={index === 0 ? yearMonthRef : null}
        key={typeof item === "number" ? item : `${item.year}-${item.month}`}
        className={`${styles.yearMonth} ${isSelected ? styles.selected : ""}`}
        onClick={() =>
          mode === "year"
            ? handleYearClick(item as number)
            : handleMonthClick(
                (item as { year: number; month: number }).year,
                (item as { year: number; month: number }).month
              )
        }
        onMouseEnter={() => setHoveredItem(item)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <h6>
          {mode === "year"
            ? `${item}년`
            : `${(item as { year: number; month: number }).month}월`}
        </h6>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div />

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className={styles.controlBtn} onClick={handleNextYear}>
            <IconBottom width={20} height={20} />
          </button>

          <button
            type="button"
            className={styles.yearMonthControlBtn}
            onClick={() =>
              mode === "year"
                ? onYearClick?.()
                : setMode(prev => (prev === "year" ? "month" : "year"))
            }
          >
            <h5>
              {mode === "month" && hoveredItem
                ? `${(hoveredItem as { year: number; month: number }).year}년 ${
                    (hoveredItem as { year: number; month: number }).month
                  }월`
                : `${selectedDate.getFullYear()}년 ${
                    MONTH_NAMES[selectedDate.getMonth()]
                  }월`}
            </h5>
          </button>

          <button className={styles.controlBtn} onClick={handlePrevYear}>
            <IconTop width={20} height={20} />
          </button>
        </div>

        <div />
      </div>

      <div
        ref={scrollRef}
        className={styles.grid}
        style={{ height: gridHeight }}
      >
        {displayItems.map(renderItem)}
      </div>
    </div>
  );
}
