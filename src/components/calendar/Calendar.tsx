"use client";

import React, { useState } from "react";

import { MONTH_NAMES, DAY_OF_WEEK, MONTH_DAYS, TODAY } from "@constants/date";

import styles from "./Calendar.module.css";

import YearMonthPicker from "@components/calendar/YearMonthPicker";

import IconLeft from "@public/svgs/common/icon_less_than.svg";
import IconRight from "@public/svgs/common/icon_greater_than.svg";

/** 캘린더 */
export default function Calendar() {
  const [mode, setMode] = useState<"yearMonth" | "day">("day");

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
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      const dayOfWeek = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      ).getDay();
      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;

      daysArray.push(
        <div
          key={day}
          className={`${styles.day} 
            ${isSelected ? styles.selected : ""} 
            ${isToday(day) ? styles.today : ""}
            ${isSunday ? styles.sunday : ""}
            ${isSaturday ? styles.saturday : ""}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return daysArray;
  };

  return (
    <div className={styles.container}>
      {mode === "day" ? (
        <>
          <div className={styles.header}>
            <button
              className={styles.monthControlBtn}
              onClick={handlePrevMonth}
            >
              <IconLeft width={20} height={20} />
            </button>

            <button
              type="button"
              className={styles.yearMonthControlBtn}
              onClick={() => setMode("yearMonth")}
            >
              <h5>
                {currentDate.getFullYear()}년{" "}
                {MONTH_NAMES[currentDate.getMonth()]}월
              </h5>
            </button>

            <button
              className={styles.monthControlBtn}
              onClick={handleNextMonth}
            >
              <IconRight width={20} height={20} />
            </button>
          </div>

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

          <div className={styles.dayBox}>{renderCalendarDays()}</div>
        </>
      ) : (
        <YearMonthPicker
          onSelect={date => {
            setCurrentDate(date);
            setMode("day");
          }}
          date={currentDate}
        />
      )}
    </div>
  );
}
