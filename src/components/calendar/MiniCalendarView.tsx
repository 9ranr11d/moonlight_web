"use client";

import React from "react";

import Image from "next/image";

import CSS from "./CalendarView.module.css";

import { dayOfWeek, monthDays, monthNames } from "@constants/date";

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

  /** 현재 날짜 */
  currentDate: Date;
  /** 일정 시작 날짜 */
  startDate: Date;
  /** 일정 종료 날짜 */
  endDate: Date;
  /** '일정 시작 날짜 선택 캘린더'로 쓰이고 있는지 */
  isStart: boolean;
}

/** 미니 캘린더 */
export default function MiniCalendarView({ changeMonth, selectDay, isStart, currentDate, startDate, endDate }: IMiniCalendarProps) {
  /** 현재 연도 */
  const currentYear: number = currentDate.getFullYear();
  /** 현재 달 */
  const currentMonth: number = currentDate.getMonth();
  /** 현재 일 */
  const currentDay: number = currentDate.getDate();

  /** 일정 시작 연도 */
  const startYear: number = startDate.getFullYear();
  /** 일정 시작 달 */
  const startMonth: number = startDate.getMonth();

  /** 일정 종료 연도 */
  const endYear: number = endDate.getFullYear();
  /** 일정 종료 달 */
  const endMonth: number = endDate.getMonth();

  /** 미니 캘린더 메인 연도 */
  const miniYear: number = isStart ? startYear : endYear;
  /** 미니 캘린더 메인 달 */
  const miniMonth: number = isStart ? startMonth : endMonth;

  /** 현재 달의 1일의 요일 */
  const firstDayOfMonth: number = new Date(miniYear, miniMonth, 1).getDay();
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
          <button type="button" onClick={() => changeMonth("prev")} disabled={!isStart && endDate <= startDate}>
            <Image src={!isStart ? (endDate <= startDate ? IconPrevGray : IconPrevBlack) : IconPrevBlack} height={15} alt="Prev" />
          </button>
        </li>

        <li>
          <h5>{monthNames[isStart ? startMonth : endMonth]}</h5>
        </li>

        <li>
          <button type="button" onClick={() => changeMonth("next")} disabled={isStart && startDate >= endDate}>
            <Image src={isStart ? (startDate >= endDate ? IconNextGray : IconNextBlack) : IconNextBlack} height={15} alt="Next" />
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
            const _month: number = isPrevMonth ? miniMonth - 1 : isNextMonth ? miniMonth + 1 : miniMonth;

            /** 표기할 날짜 */
            const thisDate: Date = new Date(miniYear, _month, day);

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
                        : miniYear === currentYear && miniMonth === currentMonth && day === currentDay
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
