import React from "react";

import Image from "next/image";

import CSS from "@pages/calendar/Calendar.module.css";

import IconPrevBlack from "@public/img/common/icon_less_than_black.svg";
import IconPrevGray from "@public/img/common/icon_less_than_gray.svg";
import IconNextBlack from "@public/img/common/icon_greater_than_black.svg";
import IconNextGray from "@public/img/common/icon_greater_than_gray.svg";

/** 미니 캘린더 자식 */
interface IMiniCalendarProps {
  /**
   * 달 변경
   * @param direction 변경 방향
   */
  changeMonth: (direction: "prev" | "next") => void;
  /**
   * 날짜 선택
   * @param day 선택한 날짜
   */
  selectDay: (day: Date) => void;

  /** '일정 시작 날짜 선택 캘린더'로 쓰이고 있는지 */
  isStart: boolean;
  /** 현재 날짜 */
  currentDate: Date;
  /** 일정 시작 날짜 */
  startDate: Date;
  /** 일정 종료 날짜 */
  endDate: Date;
  /** 달 이름들 */
  monthNames: string[];
  /** 요일 이름 */
  dayOfWeek: string[];
  /** 달별 날짜 수 */
  monthDays: number[];
}

/** 미니 캘린더 */
export default function MiniCalendar({
  changeMonth,
  selectDay,
  isStart,
  currentDate,
  startDate,
  endDate,
  monthNames,
  dayOfWeek,
  monthDays,
}: IMiniCalendarProps) {
  /** 현재 연도 */
  const currentYear: number = currentDate.getFullYear();
  /** 현재 달 */
  const currentMonth: number = currentDate.getMonth();
  /** 현재 일 */
  const currentDay: number = currentDate.getDate();

  /** 일정 시작 달 */
  const startMonth: number = startDate.getMonth();

  /** 일정 종료 연도 */
  const endYear: number = endDate.getFullYear();
  /** 일정 종료 달 */
  const endMonth: number = endDate.getMonth();

  /** 현재 달의 1일의 요일 */
  const firstDayOfMonth: number = new Date(endYear, endMonth, 1).getDay();
  /** 이전 달 날짜 수 */
  const prevMonthDays: number = endMonth - 1 < 0 ? monthDays[11] : monthDays[endMonth - 1];
  /** 이전 달 마지막 주와 현재 달의 날짜를 합친 수 */
  const monthDaysWithPrevLastWeek: number = monthDays[endMonth] + firstDayOfMonth;
  /** 현재 달 마지막 주에 남은 날짜 수 */
  const fillRemainingDays: number = monthDaysWithPrevLastWeek % 7;
  /** 이전 달, 현재 달, 다음 달 날짜 총합 */
  const totalDays: number = fillRemainingDays === 0 ? monthDaysWithPrevLastWeek : monthDaysWithPrevLastWeek + (7 - fillRemainingDays);

  return (
    <div className={CSS.miniCalendar}>
      <ul className={CSS.header}>
        <li>
          <button type="button" onClick={() => changeMonth("prev")} disabled={!isStart && !(startMonth > endMonth)}>
            <Image src={!isStart ? (startMonth > endMonth ? IconPrevBlack : IconPrevGray) : IconPrevBlack} height={15} alt="Prev" />
          </button>
        </li>

        <li>
          <h5>{monthNames[isStart ? startMonth : endMonth]}</h5>
        </li>

        <li>
          <button type="button" onClick={() => changeMonth("next")} disabled={isStart && !(startMonth < endMonth)}>
            <Image src={isStart ? (startMonth < endMonth ? IconNextBlack : IconNextGray) : IconNextBlack} height={15} alt="Next" />
          </button>
        </li>
      </ul>

      <div className={CSS.content}>
        <ul className={CSS.daysOfWeek}>
          {dayOfWeek.map((day, idx) => (
            <li key={idx}>
              <h6>{day}</h6>
            </li>
          ))}
        </ul>

        <ul className={CSS.days}>
          {Array.from({ length: totalDays }, (_, idx) => {
            /** 이전 달의 날짜인지 */
            const isPrevMonth: boolean = idx < firstDayOfMonth;
            /** 다음 달의 날짜인지 */
            const isNextMonth: boolean = idx + 1 > monthDaysWithPrevLastWeek;

            /** 표기할 날짜 */
            const day: number = isPrevMonth
              ? prevMonthDays - (firstDayOfMonth - (idx + 1))
              : isNextMonth
              ? idx + 1 - monthDaysWithPrevLastWeek
              : idx + 1 - firstDayOfMonth;

            /** 표기할 날짜의 달 */
            const _month: number = isPrevMonth ? endMonth - 1 : isNextMonth ? endMonth + 1 : endMonth;

            /** 표기할 전체 날짜 */
            const thisDate: Date = new Date(endYear, _month, day);

            /** 비활성화 할 날짜 */
            const isDisabledDate: boolean = isStart ? thisDate > endDate : thisDate < startDate;

            return (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => selectDay(thisDate)}
                  className={isDisabledDate ? `${CSS.content} ${CSS.disabled}` : CSS.content}
                  disabled={isDisabledDate}
                >
                  <span
                    className={
                      isDisabledDate
                        ? CSS.subDate
                        : isPrevMonth
                        ? CSS.subDate
                        : isNextMonth
                        ? CSS.subDate
                        : endYear === currentYear && endMonth === currentMonth && day === currentDay
                        ? CSS.today
                        : undefined
                    }
                  >
                    {day}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
