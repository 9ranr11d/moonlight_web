"use client";

import React from "react";

import { useRouter } from "next/navigation";

import CSS from "./Main.module.css";

import ThisWeek from "@components/calendar/ThisWeek";

export default function Main() {
  const router = useRouter();

  const goCalendar = (): void => {
    router.push("/calendar");
  };

  return (
    <main>
      <button type="button" onClick={goCalendar} className={`${CSS.thisWeek} ${CSS.noBackground}`}>
        <ThisWeek />
      </button>
    </main>
  );
}
