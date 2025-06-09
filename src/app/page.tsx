"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useSelector } from "react-redux";

import { RootState } from "@/redux/store";

import LunarLoader from "@/components/common/LunarLoader";

import SignIn from "@/components/auth/SignIn";
import MissingContactForm from "@/components/auth/signUp/MissingContactForm";

/** 시작 Page */
export default function Home() {
  /** 라우터 */
  const router = useRouter();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authSlice);

  // 로그인 정보가 있을 시 '메인 홈'으로
  useEffect(() => {
    if (user.isAuth && (user.email || user.phoneNumber)) router.push("/home");
  }, [user.isAuth, user.email, user.phoneNumber, router]);

  return (
    <div className="authBox">
      {!user.isAuth ? (
        <SignIn />
      ) : !(user.email || user.phoneNumber) ? (
        <MissingContactForm />
      ) : (
        <LunarLoader
          style={{ marginBottom: 20 }}
          msg={
            <span>
              로그인 중입니다.
              <br />
              잠시만 기다려주세요
            </span>
          }
        />
      )}
    </div>
  );
}
