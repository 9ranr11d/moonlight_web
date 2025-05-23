"use client";

import React, { useEffect, useState } from "react";

import DropdownBtn from "@components/common/btn/DropdownBtn";

import { CURRENT_YEAR } from "@constants/date";

import { formatDateI, generateRange, getMonthDays } from "@utils/index";

interface IDropdownDateBtn {
  /** 선택된 날짜 */
  onChange?: (date: string) => void;
}

/** 드롭다운 날짜 선택 버튼 */
export default function DropdownDateBtn({ onChange }: IDropdownDateBtn) {
  /** 초기 연도 길이 */
  const INITIAL_YEAR_COUNT = 50;

  const [selectedYearIdx, setSelectedYearIdx] = useState<number>(0); // 선택된 연도 순서
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(0); // 선택된 월 순서
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0); // 선택된 일 순서
  const [visibleYearCount, setVisibleYearCount] =
    useState<number>(INITIAL_YEAR_COUNT); // 연도 길이

  const [isYearListOpen, setIsYearListOpen] = useState<boolean>(false); // 연도 목록 열람 여부

  /** 달별 총 날짜 */
  const MONTH_DAYS: number[] = getMonthDays(CURRENT_YEAR - selectedYearIdx);

  /**
   * 연도 목록 스크롤 종단 시
   * @param isBottom 종단 여부
   */
  const loadMoreYears = (isBottom: boolean): void => {
    // 종단 시
    if (isBottom) setVisibleYearCount(prev => prev + 10);
  };

  // 연도 목록 열람 여부 변경 시
  useEffect(() => {
    if (isYearListOpen) setVisibleYearCount(INITIAL_YEAR_COUNT);
  }, [isYearListOpen]);

  // 날짜 변경 시
  useEffect(() => {
    // 선택한 날짜 상위 컴포넌트로 전달

    onChange?.(
      formatDateI(
        CURRENT_YEAR - selectedYearIdx,
        selectedMonthIdx + 1,
        selectedDayIdx + 1,
        "-"
      )
    );
  }, [selectedYearIdx, selectedMonthIdx, selectedDayIdx]);

  // 연도나 월 변경 시
  useEffect(() => {
    // 일 초기화
    setSelectedDayIdx(0);
  }, [selectedYearIdx, selectedMonthIdx]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1.5fr 1.5fr",
        columnGap: 10,
      }}
    >
      <DropdownBtn
        idx={selectedYearIdx}
        list={Array.from(
          { length: visibleYearCount },
          (_, i) => CURRENT_YEAR - i
        ).map(y => y + "년")}
        onOpen={setIsYearListOpen}
        onChange={setSelectedYearIdx}
        onScrollEnd={loadMoreYears}
      />

      <DropdownBtn
        idx={selectedMonthIdx}
        list={generateRange(12, 1, "월")}
        onChange={setSelectedMonthIdx}
      />

      <DropdownBtn
        idx={selectedDayIdx}
        list={generateRange(MONTH_DAYS[selectedMonthIdx], 1, "일")}
        onChange={setSelectedDayIdx}
      />
    </div>
  );
}
