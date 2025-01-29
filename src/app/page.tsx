"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";

import { useSession } from "next-auth/react";

import CSS from "./page.module.css";

import { AppDispatch, RootState } from "@redux/store";

import { resetAuthAction, socialSignInAction } from "@actions/authAction";

import SignIn from "@components/auth/SignIn";
import SignUp from "@components/auth/SignUp";
import Recovery from "@components/auth/Recovery";

/** 시작 페이지 */
export default function Home() {
  /** 라우터 */
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authReducer);

  const { data: session } = useSession(); // nextauth의 로그인 정보

  const [isSignUp, setIsSignUp] = useState<boolean>(false); // 회원가입 여부
  const [isRecovery, setIsRecovery] = useState<boolean>(false); // Identification/Password 찾기 여부

  /** 회원가입 버튼 클릭 시 */
  const handleSignUp = (): void => {
    // dispatch(resetAuthAction());
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

  // 소셜 로그인 정보가 있을 시
  useEffect(() => {
    if (session?.user && session.user.id)
      dispatch(socialSignInAction(session.user.id));
  }, [session]);

  // 로그인 정보가 있을 시 '메인 홈'으로
  useEffect(() => {
    // if (user.isAuth) router.push("/home");
  }, [user.isAuth, router]);

  return (
    <main className={CSS.container}>
      {!user.isAuth && (
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
