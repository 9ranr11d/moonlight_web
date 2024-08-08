import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setSchedules } from "@redux/slices/CalendarSlice";
import { RootState } from "@redux/store";

import CSS from "./ThisWeek.module.css";

import { dayOfWeek, errMsg } from "@utils/utils";

export default function ThisWeek() {
  const dispatch = useDispatch();

  const calendar = useSelector((state: RootState) => state.calendarReducer);

  const today: Date = new Date();
  const currentYear: number = today.getFullYear();
  const currentMonth: number = today.getMonth();
  const currentDay: number = today.getDate();

  const thisSunday: Date = new Date(currentYear, currentMonth, currentDay - today.getDay());

  useEffect(() => {
    getSchedules();
  }, []);

  const getSchedules = (): void => {
    fetch(`/api/calendar/schedules_management/${currentYear}/${currentMonth}`)
      .then((res) => {
        if (res.ok) return res.json();

        alert(errMsg);

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((schedules) => dispatch(setSchedules(schedules)))
      .catch((err) => console.error("Error in /src/components/calendar/ThisWeek > ThisWeek() > getSchedules() :", err));
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

          const schedules = calendar.schedules.filter((schedule) => {
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
