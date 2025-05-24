"use client";

import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";
import { getCoupleCodeAction } from "@actions/coupleCodeAction";

/** 메인 홈 */
export default function Home() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authSlice);

  useEffect(() => {
    if (user.identification)
      dispatch(getCoupleCodeAction({ userId: user.identification }));
  }, [user.identification]);

  return <div style={{ background: "white" }}></div>;
}
