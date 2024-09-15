"use client";

import React from "react";

import Link from "next/link";

import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

import CSS from "./Home.module.css";

import ThisWeek from "@components/calendar/ThisWeek";

/** 메인 홈 */
export default function Home() {
  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authReducer);

  return (
    <main className={CSS.background}>
      <Link href={"/profile?menu=code"}>{user.coupleCode ? "커플 코드 수정" : "커플 코드 발급"}</Link>

      <Link href={"/calendar"}>
        <div className={CSS.thisWeek}>
          <ThisWeek />
        </div>
      </Link>
    </main>
  );
}
