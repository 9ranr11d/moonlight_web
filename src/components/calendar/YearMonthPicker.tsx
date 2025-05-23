"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import { MONTH_NAMES, TODAY } from "@constants/date";

import styles from "./YearMonthPicker.module.css";

import IconTop from "@public/svgs/common/icon_expand.svg";
import IconBottom from "@public/svgs/common/icon_collapse.svg";

interface IYearMonthPicker {
  onSelect: (date: Date) => void;

  date?: Date;
}

type DisplayItem = number | { year: number; month: number };

const YEAR_RANGE = 16;
const ITEMS_PER_PAGE = 12;
const MIN_YEAR = 1900;

const createYearItems = (startYear: number, count: number): number[] => {
  return Array.from({ length: count }, (_, i) => startYear + i);
};

const createMonthItems = (year: number): DisplayItem[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    year,
    month: i + 1,
  }));
};

export default function YearMonthPicker({
  onSelect,
  date = new Date(),
}: IYearMonthPicker) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const yearMonthRef = useRef<HTMLDivElement>(null);

  const displayItemsRef = useRef<DisplayItem[]>([]);

  const [gridHeight, setGridHeight] = useState<number>(0);

  const [isAddPrevItem, setIsAddPrevItem] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date>(date || new Date());

  const [hoveredItem, setHoveredItem] = useState<DisplayItem | null>(null);
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);
  const [mode, setMode] = useState<"year" | "month">("year");

  const handleMonthClick = useCallback(
    (year: number, month: number) => {
      const newDate = new Date(year, month - 1, 1);
      setSelectedDate(newDate);
      onSelect(newDate);
    },
    [onSelect]
  );

  const handleYearClick = useCallback(
    (year: number) => {
      setSelectedDate(new Date(year, selectedDate.getMonth(), 1));
      setMode("month");
    },
    [selectedDate]
  );

  const handlePrevYear = useCallback(() => {
    const newDate = new Date(selectedDate);

    if (mode === "year") newDate.setFullYear(newDate.getFullYear() + 1);
    else newDate.setMonth(newDate.getMonth() + 1);

    setSelectedDate(newDate);
  }, [selectedDate, mode]);

  const handleNextYear = useCallback(() => {
    const newDate = new Date(selectedDate);

    if (mode === "year") newDate.setFullYear(newDate.getFullYear() - 1);
    else newDate.setMonth(newDate.getMonth() - 1);

    setSelectedDate(newDate);
  }, [selectedDate, mode]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !yearMonthRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    if (scrollTop === 0) {
      const firstItem = displayItemsRef.current[0];

      const newItems =
        mode === "year"
          ? createYearItems(
              (firstItem as number) - ITEMS_PER_PAGE,
              ITEMS_PER_PAGE
            )
          : createMonthItems((firstItem as { year: number }).year - 1);

      setDisplayItems(prev => [...newItems, ...prev]);

      setIsAddPrevItem(true);
    } else if (scrollTop >= scrollHeight - clientHeight - 1) {
      const lastItem =
        displayItemsRef.current[displayItemsRef.current.length - 1];

      const newItems =
        mode === "year"
          ? createYearItems((lastItem as number) + 1, ITEMS_PER_PAGE)
          : createMonthItems((lastItem as { year: number }).year + 1);

      setDisplayItems(prev => [...prev, ...newItems]);
    }
  }, [mode]);

  useEffect(() => {
    if (date) setSelectedDate(date);
  }, [date]);

  useEffect(() => {
    if (mode === "year") {
      const currentYear = selectedDate.getFullYear();
      const startYear = Math.max(MIN_YEAR, currentYear - YEAR_RANGE);

      setDisplayItems(createYearItems(startYear, YEAR_RANGE * 2));
    } else {
      const currentYear = selectedDate.getFullYear();

      setDisplayItems([
        ...createMonthItems(currentYear - 1),
        ...createMonthItems(currentYear),
        ...createMonthItems(currentYear + 1),
      ]);
    }
  }, [mode, selectedDate]);

  useEffect(() => {
    if (yearMonthRef.current) {
      setGridHeight(yearMonthRef.current.offsetHeight * 3);

      if (scrollRef.current && displayItems) {
        let itemIdx = -1;

        itemIdx = displayItems.findIndex(item =>
          mode === "year"
            ? (item as number) === selectedDate.getFullYear()
            : (item as { year: number; month: number }).year ===
                selectedDate.getFullYear() &&
              (item as { year: number; month: number }).month ===
                selectedDate.getMonth() + 1
        );

        const itemRow = Math.floor(itemIdx / 4);

        scrollRef.current.scrollTo({
          top: yearMonthRef.current.offsetHeight * itemRow,
          behavior: "smooth",
        });
      }
    }
  }, [displayItems]);

  useEffect(() => {
    const scrollElement = scrollRef.current;

    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);

      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    displayItemsRef.current = displayItems;
  }, [displayItems]);

  useEffect(() => {
    if (isAddPrevItem) {
      setIsAddPrevItem(false);

      scrollRef.current?.scrollTo({ top: gridHeight });
    }
  }, [isAddPrevItem, gridHeight]);

  const renderItem = (item: DisplayItem, index: number) => {
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
              setMode(prev => (prev === "year" ? "month" : "year"))
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
