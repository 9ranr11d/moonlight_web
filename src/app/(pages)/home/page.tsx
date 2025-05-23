"use client";

import React from "react";

import { useSelector } from "react-redux";

import { RootState } from "@redux/store";

/** 메인 홈 */
export default function Home() {
  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authSlice);

  return <div></div>;
}
