"use client";

import React, { useState } from "react";

import Link from "next/link";

import Image from "next/image";

import Lottie from "lottie-react";

import { useDispatch, useSelector } from "react-redux";

import { signIn as socialSignIn } from "next-auth/react";

import { AppDispatch, RootState } from "@/redux/store";

import { resetAuth } from "@/redux/slices/authSlice";

import { signInAction } from "@/actions/authAction";

import { ISignInData } from "@/interfaces/auth";

import styles from "./SignIn.module.css";

import VisibleBtn from "@/components/common/btns/VisibleBtn";
import CheckBoxBtn from "@/components/common/btns/CheckBoxBtn";

import IconClose from "@public/svgs/common/icon_x.svg";
import IconGoogle from "@public/imgs/auth/icon_google.png";
import IconNaver from "@public/imgs/auth/icon_naver.png";
import IconKakao from "@public/imgs/auth/icon_kakao.png";

import LottieLoading from "@public/json/loading_round_white.json";

/** 로그인 */
export default function SignIn() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authSlice);

  const [identification, setIdentification] = useState<string>(""); // 아이디
  const [password, setPassword] = useState<string>(""); // 비밀번호

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // 비밀번호 표시 여부
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false); // 로그인 상태 유지 여부
  const [isSignInLoading, setIsSignInLoading] = useState<boolean>(false); // 로그인 로딩 여부

  /** 로그인 */
  const processSignIn = (): void => {
    setIsSignInLoading(true);

    const data: ISignInData = {
      identification,
      password,
      isRememberMe,
    };

    dispatch(signInAction(data));
  };

  /** 아이디 Input */
  const handleIdentification = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setIdentification(e.target.value);
  };

  /** 비밀번호 Input */
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  /** 비밀번호에서 'Enter'를 누를 시 */
  const handlePasswordKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter") processSignIn();
  };

  /** 비밀번호 표시 Toggle */
  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible(prev => !prev);
  };

  /**
   * 소셜 로그인 클릭 시
   * @param provider 소셜 로그인 제공자
   */
  const clickSocialSignIn = (provider: "google" | "naver" | "kakao") => {
    socialSignIn(provider);
  };

  return (
    <div className={styles.signInBox}>
      <h3>로그인</h3>

      <div className={styles.innerBox}>
        <ul>
          <li>
            <input
              type="text"
              value={identification}
              onChange={handleIdentification}
              placeholder="아이디"
            />
          </li>

          <li style={{ position: "relative" }}>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={handlePassword}
              onKeyDown={handlePasswordKeyDown}
              placeholder="비밀번호"
            />

            <VisibleBtn
              onClick={togglePasswordVisibility}
              isVisible={isPasswordVisible}
              style={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
              }}
            />
          </li>
        </ul>

        <button type="button" onClick={processSignIn}>
          {!isSignInLoading ? (
            <h5 style={{ fontFamily: "sf_pro_bold" }}>LOGIN</h5>
          ) : (
            <span style={{ display: "flex", justifyContent: "center" }}>
              <Lottie
                loop
                animationData={LottieLoading}
                style={{ width: 28, height: 28 }}
              />
            </span>
          )}
        </button>
      </div>

      <div style={{ display: "flex", gap: 5 }}>
        <CheckBoxBtn
          onClick={() => setIsRememberMe(prev => !prev)}
          size={14}
          isChecked={isRememberMe}
          fill={isRememberMe ? "var(--gray-800)" : "var(--gray-200)"}
        />

        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            setIsRememberMe(prev => !prev);
          }}
        >
          로그인 상태 유지
        </a>
      </div>

      <div className={styles.subBox} style={{ position: "relative" }}>
        {user.isErr && (
          <div
            className={styles.errBox}
            style={{
              position: "absolute",
              width: "100%",
              background: "var(--err-background-color)",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <p style={{ color: "var(--err-color)" }}>{user.msg}</p>

            <button
              type="button"
              style={{
                padding: 0,
                background: "none",
                position: "absolute",
                right: 15,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              onClick={() => dispatch(resetAuth())}
            >
              <IconClose
                width={12}
                height={12}
                fill={"var(--err-color)"}
                style={{ display: "flex" }}
              />
            </button>
          </div>
        )}

        <ul>
          <li>
            <Link href="/recovery">ID / PW 찾기</Link>
          </li>

          <li style={{ color: "var(--gray-800)" }}>|</li>

          <li>
            <Link href="/sign-up">회원가입</Link>
          </li>
        </ul>
      </div>

      <div className={styles.socialSignInBox}>
        <div style={{ display: "flex", alignItems: "center", columnGap: 10 }}>
          <div style={{ height: 1, background: "var(--gray-500)", flex: 1 }} />

          <span style={{ color: "var(--gray-500)" }}>SNS LOGIN</span>

          <div style={{ height: 1, background: "var(--gray-500)", flex: 1 }} />
        </div>

        <div className={styles.btnBox}>
          <button
            type="button"
            onClick={() => clickSocialSignIn("google")}
            style={{ background: "white" }}
          >
            <Image src={IconGoogle} width={20} alt="구글" />
          </button>

          <button
            type="button"
            onClick={() => clickSocialSignIn("naver")}
            style={{ background: "var(--naver-color)" }}
          >
            <Image src={IconNaver} width={18} alt="네이버" />
          </button>

          <button
            type="button"
            onClick={() => clickSocialSignIn("kakao")}
            style={{ background: "var(--kakao-color)" }}
          >
            <Image src={IconKakao} width={20} alt="카카오" />
          </button>
        </div>
      </div>
    </div>
  );
}
