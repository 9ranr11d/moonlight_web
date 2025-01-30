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
  const user = useSelector((state: RootState) => state.authSlice);

  return (
    <main className={CSS.background}>
      <div className={CSS.coupleCode}>
        <div className={CSS.content}>
          <h3>{user.nickname}님</h3>

          <h3>
            {user.coupleCode
              ? "커플 코드로 연인과 일정을 공유하세요."
              : "커플 코드를 발급받고 연인과 공유하세요."}
          </h3>

          <Link href={"/profile?menu=code"}>
            <button type="button">
              {user.coupleCode ? "커플 코드 관리" : "커플 코드 발급"}
            </button>
          </Link>
        </div>
      </div>

      <Link href={"/calendar"}>
        <div className={CSS.thisWeek}>
          <ThisWeek />
        </div>
      </Link>
    </main>
  );
}
