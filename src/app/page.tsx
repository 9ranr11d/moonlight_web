"use client";

import React, { useState } from "react";

import { useSelector } from "react-redux";

import { RootState } from "@redux/store";

import CSS from "./page.module.css";

import SignIn from "@components/auth/SignIn";
import SignUp from "@components/auth/SignUp";
import Main from "@components/main/Main";

/** 시작 페이지 */
export default function Home() {
  /** 사용자 정보 */
  const userInfo = useSelector((state: RootState) => state.authReducer);

  const [isSignUp, setIsSignUp] = useState<boolean>(false); // 회원가입 여부

  /** 회원가입 버튼 클릭 시 */
  const handleSignUp = (): void => {
    setIsSignUp(true);
  };

  /** 회원가입 완료 시 */
  const handleCompleted = (): void => {
    setIsSignUp(false);
  };

  return (
    <main className={CSS.container}>
      {userInfo.value.isAuth ? <Main /> : !isSignUp ? <SignIn signUp={handleSignUp} /> : <SignUp completed={handleCompleted} />}
    </main>
  );
}
