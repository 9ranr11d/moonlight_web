import React from "react";

import CSS from "./ThisWeek.module.css";

import { dayOfWeek } from "@utils/utils";

export default function ThisWeek() {
  const today: Date = new Date();
  const currentYear: number = today.getFullYear();
  const currentMonth: number = today.getMonth();
  const currentDay: number = today.getDate();

  const thisSunday: Date = new Date(currentYear, currentMonth, currentDay - today.getDay());

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
          return <li key={idx}>{thisDate.getDate()}</li>;
        })}
      </ul>
    </div>
  );
}
