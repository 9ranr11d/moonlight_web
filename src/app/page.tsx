"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

import CSS from "./page.module.css";

import SignIn from "@components/auth/SignIn";
import SignUp from "@components/auth/SignUp";
import Recovery from "@components/auth/Recovery";
import UnderReview from "@components/auth/UnderReview";

/** 시작 페이지 */
export default function Home() {
  /** 라우터 */
  const router = useRouter();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authReducer);

  // console.log(user);

  const [isSignUp, setIsSignUp] = useState<boolean>(false); // 회원가입 여부
  const [isRecovery, setIsRecovery] = useState<boolean>(false); // Identification/Password 찾기 여부

  useEffect(() => {
    if (user.isAuth && user.accessLevel > 0) router.push("/home");
  }, [user.isAuth]);

  /** 회원가입 버튼 클릭 시 */
  const handleSignUp = (): void => {
    setIsSignUp(true);
  };

  /** 회원가입 완료 시 */
  const handleCompleted = (): void => {
    setIsSignUp(false);
  };

  /** 회원가입 창에서 뒤로가기 버튼 */
  const handleSignUpBack = (): void => {
    setIsSignUp(false);
  };

  /** ID/PW 찾기 버튼 클릭 시 */
  const handleRecovery = (): void => {
    setIsRecovery(true);
  };

  /** ID/PW 찾기 창에서 뒤로가기 버튼 */
  const handleRecoveryBack = (): void => {
    setIsRecovery(false);
  };

  return (
    <main className={CSS.container}>
      {user.isAuth ? (
        user.accessLevel < 1 && (
          <div className={CSS.authBox}>
            <UnderReview />
          </div>
        )
      ) : (
        <div className={CSS.authBox}>
          {!isSignUp ? (
            !isRecovery ? (
              <SignIn signUp={handleSignUp} recovery={handleRecovery} />
            ) : (
              <Recovery back={handleRecoveryBack} />
            )
          ) : (
            <SignUp completed={handleCompleted} back={handleSignUpBack} />
          )}
        </div>
      )}
    </main>
  );
}
