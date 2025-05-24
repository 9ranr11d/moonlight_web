"use client";

import React, { useState } from "react";

import { MONTH_NAMES, DAY_OF_WEEK, MONTH_DAYS, TODAY } from "@constants/date";

import styles from "./Calendar.module.css";

import Modal from "@components/common/Modal";

import YearMonthPicker from "@components/calendar/YearMonthPicker";

import IconLeft from "@public/svgs/common/icon_less_than.svg";
import IconRight from "@public/svgs/common/icon_greater_than.svg";

/** 달력 표기 방식 */
type CalendarType = "full" | "mini";
/** 달력 표기 형식 */
type CalendarMode = "yearMonth" | "day";

/** 달력 Interface */
interface ICalendar {
  type?: CalendarType;
}

/** 달력 Header Interface */
interface ICalendarHeader {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onModeChange: (mode: CalendarMode) => void;
}

/** 달력 Header */
const CalendarHeader: React.FC<ICalendarHeader> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onModeChange,
}) => (
  <div className={styles.header}>
    <button className={styles.monthControlBtn} onClick={onPrevMonth}>
      <IconLeft width={20} height={20} />
    </button>

    <button
      type="button"
      className={styles.yearMonthControlBtn}
      onClick={() => onModeChange("yearMonth")}
    >
      <h5>
        {currentDate.getFullYear()}년 {MONTH_NAMES[currentDate.getMonth()]}월
      </h5>
    </button>

    <button className={styles.monthControlBtn} onClick={onNextMonth}>
      <IconRight width={20} height={20} />
    </button>
  </div>
);

/** 요일 Header */
const WeekDayHeader: React.FC = () => (
  <div className={styles.weekDayBox}>
    {DAY_OF_WEEK.map((day: string, index: number) => (
      <div
        key={day}
        className={`${styles.weekDay} 
          ${index === 0 ? styles.sunday : ""} 
          ${index === 6 ? styles.saturday : ""}`}
      >
        {day}
      </div>
    ))}
  </div>
);

/** 달력 */
export default function Calendar({ type = "full" }: ICalendar) {
  const [mode, setMode] = useState<CalendarMode>("day");

  const [currentDate, setCurrentDate] = useState(TODAY); // 현재 날짜
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 선택된 날짜

  /** 현재 달의 일수 */
  const daysInMonth = MONTH_DAYS[currentDate.getMonth()];

  /** 현재 달의 첫 날의 요일 */
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  /** 이전 달로 이동 */
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  /** 다음 달로 이동 */
  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  /** 날짜 클릭 */
  const handleDateClick = (day: number) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
  };

  /** 오늘 날짜인지 확인 */
  const isToday = (day: number) => {
    return (
      TODAY.getDate() === day &&
      TODAY.getMonth() === currentDate.getMonth() &&
      TODAY.getFullYear() === currentDate.getFullYear()
    );
  };

  /** 달력 날짜 렌더링 */
  const renderCalendarDays = () => {
    /** 날짜 배열 */
    const daysArray = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(
        <div
          key={`empty-${i}`}
          className={`${styles.day} ${styles.empty}`}
        ></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      /** 선택된 날짜인지 */
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      /** 요일 */
      const dayOfWeek = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      ).getDay();

      /** 일요일인지 */
      const isSunday = dayOfWeek === 0;
      /** 토요일인지 */
      const isSaturday = dayOfWeek === 6;

      daysArray.push(
        <div
          key={day}
          className={`${styles.day} 
            ${isSelected ? styles.selected : ""} 
            ${isToday(day) ? styles.today : ""}
            ${isSunday ? styles.sunday : ""}
            ${isSaturday ? styles.saturday : ""}`}
          style={
            type === "mini"
              ? {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }
              : {}
          }
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return daysArray;
  };

  /** 연월 선택자 */
  const renderYearMonthPicker = () => (
    <YearMonthPicker
      onSelect={date => {
        setCurrentDate(date);
        setMode("day");
      }}
      onYearClick={() => setMode("day")}
      date={currentDate}
    />
  );

  // 달력 출력 형식이 'mini'일 시
  if (type === "mini") {
    return (
      <div className={styles.container}>
        {mode === "day" ? (
          <>
            <CalendarHeader
              currentDate={currentDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onModeChange={setMode}
            />
            <WeekDayHeader />
            <div className={styles.dayBox}>{renderCalendarDays()}</div>
          </>
        ) : (
          renderYearMonthPicker()
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onModeChange={setMode}
      />
      <WeekDayHeader />
      <div className={styles.dayBox}>{renderCalendarDays()}</div>

      {mode === "yearMonth" && (
        <Modal close={() => setMode("day")}>{renderYearMonthPicker()}</Modal>
      )}
    </div>
  );
}
