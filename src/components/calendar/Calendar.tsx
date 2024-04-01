"use client";

import React, { useState } from "react";

export default function Calendar() {
  const today = new Date();

  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [day, setDay] = useState<number>(today.getDate());

  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [isMonthOpen, seteIsMonthOpen] = useState<boolean>(false);
  const [isDayOpen, setIsDayOpen] = useState<boolean>(false);

  const handleYear = () => {};

  return (
    <div>
      <h3>
        <button type="button" onClick={handleYear}>
          {}
        </button>
      </h3>
    </div>
  );
}
