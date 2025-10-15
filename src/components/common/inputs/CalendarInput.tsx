"use client";

import React from "react";

import InputBtn from "@/components/common/btns/InputBtn";

import IconCalendar from "@public/svgs/calendar/icon_calendar_II.svg";

interface ICalendarInput {
  children: React.ReactNode;
  onChange?: () => void;
  style?: React.CSSProperties;
}

export default function CalendarInput({
  children,
  onChange,
  style,
}: ICalendarInput) {
  return (
    <InputBtn onClick={onChange} style={style}>
      {children}
      <IconCalendar width={16} height={16} fill="black" />
    </InputBtn>
  );
}
