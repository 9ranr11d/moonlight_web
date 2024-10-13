"use client";

import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setSchedules } from "@redux/slices/CalendarSlice";
import { RootState } from "@redux/store";

import CSS from "./ThisWeek.module.css";

import { ERR_MSG } from "@constants/msg";
import { dayOfWeek } from "@constants/date";

/** 현재 주의 일정 표시 */
export default function ThisWeek() {
  /** Dispatch */
  const dispatch = useDispatch();

  /** 캘린더 정보들 */
  const calendar = useSelector((state: RootState) => state.calendarReducer);

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authReducer);

  /** 오늘 날짜 */
  const today: Date = new Date();
  /** 현재 연도 */
  const currentYear: number = today.getFullYear();
  /** 현재 달 */
  const currentMonth: number = today.getMonth();
  /** 현재 일 */
  const currentDay: number = today.getDate();

  /** 현재 주의 일요일 날짜 */
  const thisSunday: Date = new Date(currentYear, currentMonth, currentDay - today.getDay());

  // 로그인 시 일정 정보 가져오기
  useEffect(() => {
    if (user.isAuth) getSchedules();
  }, [user]);

  /** 일정 정보 가져오기 */
  const getSchedules = (): void => {
    fetch(`/api/calendar/schedules_management/${currentYear}/${currentMonth}/${user._id}/${user.coupleCode}`)
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(schedules => dispatch(setSchedules(schedules)))
      .catch(err => console.error("/src/components/calendar/ThisWeek > ThisWeek() > getSchedules()에서 오류가 발생했습니다. :", err));
  };

  return (
    <div className={CSS.week}>
      <ul>
        {dayOfWeek.map((day, idx) => (
          <li key={idx}>
            <h6>{day}</h6>
          </li>
        ))}
      </ul>

      <ul className={CSS.day}>
        {Array.from({ length: 7 }, (_, idx) => {
          const thisDate: Date = new Date(thisSunday.getFullYear(), thisSunday.getMonth(), thisSunday.getDate() + idx);

          const schedules = calendar.schedules.filter(schedule => {
            const [startDate, endDate] = schedule.date;

            return thisDate >= new Date(startDate) && thisDate <= new Date(endDate);
          });

          return (
            <li key={idx}>
              <p>{thisDate.getDate()}</p>

              {schedules.length > 0 &&
                schedules.map((schedule, idx) => (
                  <p key={idx} className={CSS.schedule}>
                    <span className={CSS.categories}>
                      {schedule.categories.slice(0, 2).map((category, _idx) => (
                        <span key={`${idx}-${_idx}`} className={CSS.bulletPoint} style={{ background: category.color }}></span>
                      ))}
                      {schedule.categories.length > 2 && <span>...</span>}
                    </span>

                    <span className={CSS.title}>{schedule.title}</span>
                  </p>
                ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
