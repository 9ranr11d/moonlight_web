"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { refreshAccessToken, signIn } from "@redux/slices/AuthSlice";

import CSS from "./page.module.css";

import SignIn from "@components/auth/SignIn";
import SignUp from "@components/auth/SignUp";
import Main from "@components/main/Main";
import Recovery from "@components/auth/Recovery";

/** 시작 페이지 */
export default function Home() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authReducer);

  const [isSignUp, setIsSignUp] = useState<boolean>(false); // 회원가입 여부
  const [isRecovery, setIsRecovery] = useState<boolean>(false); // id/pw 찾기 여부

  // Access Token, Refresh Token으로 자동 로그인
  useEffect(() => {
    // 이미 로그인이 된 상태면 패스
    if (user.value.isAuth) return;

    // AccessToken이 있는지, 없는지
    if (user.value.accessToken.length !== 0) getUser(user.value.accessToken);
    else getRefreshAccessToken();
  }, [user.value]);

  // 50분마다 Access Token 자동 재발급
  useEffect(() => {
    const interval = setInterval(() => {
      getRefreshAccessToken();
    }, 50 * 60 * 1000);

    // 로그아웃 시 Access Token 자동 재발급 취소
    if (!user.value.isAuth) return clearInterval(interval);

    return () => clearInterval(interval);
  }, [user.value.accessToken]);

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

  /** Access Token 유효한지, 유효하면 일치하는 사용자정보가 있는지, 있으면 사용자 정보가 있으면 자동 로그인 */
  const getUser = (accessToken: string): void => {
    /** 보낼 Access Token */
    const data = { accessToken: accessToken };

    fetch("/api/auth/get_user_by_access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) =>
        // 사용자 정보 AuthSlice(Redux)에 저장
        dispatch(
          signIn({
            isAuth: true,
            id: data.id,
            nickname: data.nickname,
            email: data.email,
            accessLevel: data.accessLevel,
            accessToken: data.accessToken,
          })
        )
      )
      .catch((err) => console.error("Get User :", err));
  };

  /** Refresh Token 확인 */
  const getRefreshAccessToken = (): void => {
    fetch("/api/auth/refresh_access_token")
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      // Refresh Token으로 Access Token 재발급 후, AuthSlice(Redux)에 저장
      .then((data) => dispatch(refreshAccessToken({ accessToken: data.accessToken })))
      .catch((err) => console.error("Refresh Access Token :", err));
  };

  return (
    <main className={CSS.container}>
      {user.value.isAuth ? (
        <Main />
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
