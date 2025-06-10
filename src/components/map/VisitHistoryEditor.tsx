"use client";

import React, { useState } from "react";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { formatDateII } from "@/utils";

import IconUpTriangle from "@public/img/common/icon_up_triangle_black.svg";
import IconDownTriangle from "@public/img/common/icon_down_triangle_black.svg";
import MiniCalendarView from "@/components/calendar/MiniCalendarView";
import StarRating from "@/components/common/StarRating";

/** 속성 입력 필드 제목 Interface */
interface ILabels {
  visitedAt: string;
  rating: string;
  comment: string;
  isPrviate: string;
}

/** 속성 값 타입 */
type TypeInputValue = string | number | boolean;

/** 방문 일지 작성/수정 */
export default function VisitHistoryEditor() {
  /** 오늘 날짜 */
  const today: Date = new Date();

  /** 속성 입력 필드 제목들 */
  const labels: ILabels = {
    visitedAt: "방문 날짜",
    rating: "평점",
    comment: "평가",
    isPrviate: "나만 보기",
  };

  /** Dispatch */
  const dispatch = useDispatch();

  /** 즐겨찾기 정보 Reducer */
  const favoriteLocation = useSelector(
    (state: RootState) => state.favoriteLocationSlice
  );

  const [isStartCalendarOpen, setIsStartCalendarOpen] =
    useState<boolean>(false); // 방문 시작 날짜 캘린더 가시 여부
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState<boolean>(false); // 방문 종료 날짜 캘린더 가시 여부

  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(today);

  /** 시작 날짜 캘린더 가시 여부 결정 */
  const toggleStartCalendarOpen = (): void => {
    if (!isStartCalendarOpen) setIsEndCalendarOpen(false);

    setIsStartCalendarOpen(prev => !prev);
  };

  /** 종료 날짜 캘린터 가시 여부 결정 */
  const toggleEndCalendarOpen = (): void => {
    if (!isEndCalendarOpen) setIsStartCalendarOpen(false);

    setIsEndCalendarOpen(prev => !prev);
  };

  const changeMonth = (date: Date, direction: "prev" | "next"): Date => {
    /** 변경될 연도 */
    let year = date.getFullYear();
    /** 변결될 달 */
    let month = date.getMonth();

    switch (direction) {
      // 이전 달로 변경
      case "prev":
        // 기존 달이 1월이 아닐 시
        if (month > 0) month--;
        // 기존 달이 1월일 시
        else {
          year--;
          month = 11;
        }

        break;
      // 다음 달로 변경
      case "next":
        // 기존 달이 12월이 아닐 시
        if (month < 11) month++;
        // 기존 달이 12월일 시
        else {
          year++;
          month = 0;
        }

        break;
    }

    // 변경 될 날짜
    const newDate = new Date(year, month, 1);

    return newDate;
  };

  /**
   * 캘린더 모달 여는 버튼 렌더
   * @param date 날짜 초기값
   * @param setDate 날짜 설정
   * @param isOpen 가시 여부
   * @param toggleIsOpen 가시 여부 결정
   * @returns 버튼
   */
  const renderCalendarBtn = (
    date: Date,
    setDate: (date: Date) => void,
    isOpen: boolean,
    toggleIsOpen: () => void,
    isStart: boolean
  ): React.JSX.Element => (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={toggleIsOpen}
        style={{
          background: "white",
          alignItems: "center",
          border: "1px solid var(--gray-300)",
          padding: 4,
        }}
      >
        <span
          style={{ color: "var(--font-color)", fontSize: 13, marginRight: 5 }}
        >
          {formatDateII(date, "-")}
        </span>

        {/* <Image src={isOpen ? IconUpTriangle : IconDownTriangle} width={9} alt={isOpen ? "▲" : "▼"} /> */}
      </button>

      {isOpen && (
        <MiniCalendarView
          changeMonth={direction => changeMonth(date, direction)}
          selectDay={day => setDate(day)}
          isStart={isStart}
          currentDate={date}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  );

  /** 렌더할 Input 컴포넌트 */
  const inputRenderers: Record<
    string,
    (value: TypeInputValue) => React.JSX.Element | null
  > = {
    visitedAt: value => (
      <div style={{ display: "flex", columnGap: 5, alignItems: "center" }}>
        {renderCalendarBtn(
          startDate,
          date => setStartDate(date),
          isStartCalendarOpen,
          toggleStartCalendarOpen,
          true
        )}
        -
        {renderCalendarBtn(
          endDate,
          date => setEndDate(date),
          isEndCalendarOpen,
          toggleEndCalendarOpen,
          false
        )}
      </div>
    ),
    rating: value => <StarRating />,
  };

  /**
   * 속성 필드 렌더링
   * @param key key 값
   * @param value 속성 값
   * @returns Input
   */
  const renderInputs = (
    key: string,
    value: TypeInputValue
  ): React.JSX.Element | null => {
    const renderer = inputRenderers[key];

    return renderer ? renderer(value) : null;
  };

  return (
    <div>
      {/* <ul>
        {Object.entries(favoriteLocation.activeLocation).map(
          ([key, value], idx) => {
            const isKeyInLabels: boolean = key in labels;

            if (!isKeyInLabels) return null;

            return (
              <li key={idx}>
                <ul
                  style={{
                    display: "flex",
                    columnGap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <li>{`${labels[key as keyof ILabels]} :`}</li>
                  <li>{renderInputs(key, value)}</li>
                </ul>
              </li>
            );
          }
        )}
      </ul> */}
    </div>
  );
}
