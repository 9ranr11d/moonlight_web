"use client";

import React, { useState } from "react";

import Image from "next/image";

import { useDispatch } from "react-redux";

import { signIn as socialSignIn } from "next-auth/react";

import { AppDispatch } from "@redux/store";
import { signIn } from "@redux/slices/authSlice";

import CSS from "./SignIn.module.css";

import { ERR_MSG } from "@constants/msg";

import IconGoogle from "@public/imgs/auth/icon_google.png";
import IconNaver from "@public/imgs/auth/icon_naver.png";
import IconKakao from "@public/imgs/auth/icon_kakao.png";
import VisibleBtn from "@components/common/btn/VisibleBtn";

/** SignIn 자식 */
interface ISignInProps {
  /** 회원가입으로 전환 */
  signUp: () => void;
  /** ID/PW 찾기 전환 */
  recovery: () => void;
}

/** 로그인 */
export default function SignIn({ signUp, recovery }: ISignInProps) {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const [identification, setIdentification] = useState<string>(""); // 아이디
  const [password, setPassword] = useState<string>(""); // 비밀번호

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // 비밀번호 표시 여부

  /** 로그인 */
  const processSignIn = (): void => {
    const data: { identification: string; password: string } = {
      identification,
      password,
    };

    fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.ok) return res.json();

        if (res.status === 404 || res.status === 401)
          alert("ID와 PW를 다시 확인해주세요.");
        else alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        // 사용자 정보 AuthSlice(Redux)에 저장
        dispatch(signIn(data.user));
      })
      .catch(err =>
        console.error(
          "/src/components/auth/SignIn > SignIn() > processSignIn()에서 오류가 발생했습니다. :",
          err
        )
      );
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

  /** Password에서 'Enter'를 누를 시 */
  const handlePasswordKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter") processSignIn();
  };

  /** ID/PW 찾기로 전환 */
  const handleRecovery = (): void => {
    recovery();
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
    <div className={CSS.signInBox}>
      <h3>로그인</h3>

      <div className={CSS.innerBox}>
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
          <h5 style={{ fontFamily: "sf_pro_bold" }}>LOGIN</h5>
        </button>
      </div>

      <div className={CSS.subBox}>
        <ul>
          <li>
            <a href="#" onClick={handleRecovery}>
              ID / PW 찾기
            </a>
          </li>

          <li style={{ color: "var(--gray-800)" }}>|</li>

          <li>
            <a href="#" onClick={signUp}>
              회원가입
            </a>
          </li>
        </ul>
      </div>

      <div className={CSS.socialSignInBox}>
        <div style={{ display: "flex", alignItems: "center", columnGap: 10 }}>
          <div style={{ height: 1, background: "var(--gray-500)", flex: 1 }} />

          <span style={{ color: "var(--gray-500)" }}>SNS LOGIN</span>

          <div style={{ height: 1, background: "var(--gray-500)", flex: 1 }} />
        </div>

        <div className={CSS.btnBox}>
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
