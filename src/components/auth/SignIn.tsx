"use client";

import React, { useState } from "react";

import Image from "next/image";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { signIn } from "@redux/slices/AuthSlice";

import CSS from "./SignIn.module.css";

import { ERR_MSG } from "@constants/msg";

import IconEyeClose from "@public/img/common/icon_eye_close_gray.svg";
import IconEyeOpen from "@public/img/common/icon_eye_open_gray.svg";

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

  const [identification, setIdentification] = useState<string>(""); // Identification
  const [password, setPassword] = useState<string>(""); // Password

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // 비밀번호 표시 여부
  const [isPasswordVisibleHover, setIsPasswordVisibleHover] = useState<boolean>(false); // 비밀번호 표시 버튼 Hover 여부

  /** 로그인 */
  const processSignIn = (): void => {
    const data: { identification: string; password: string } = { identification, password };

    fetch("/api/auth/signIn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.ok) return res.json();

        if (res.status === 404 || res.status === 401) alert("ID와 PW를 다시 확인해주세요.");
        else alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        // 사용자 정보 AuthSlice(Redux)에 저장
        dispatch(signIn(data.user));
      })
      .catch(err => console.error("/src/components/auth/SignIn > SignIn() > processSignIn()에서 오류가 발생했습니다. :", err));
  };

  /** Identification Input */
  const handleIdentification = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIdentification(e.target.value);
  };

  /** Password Input */
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  /** Password에서 'Enter'를 누를 시 */
  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
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
   * 비밀번호 표시 아이콘 Hover 관리
   * @param isHover Hover 여부
   */
  const hoverPasswordVisibility = (isHover: boolean): void => {
    setIsPasswordVisibleHover(isHover);
  };

  return (
    <div className={CSS.signInBox}>
      <h3>로그인</h3>

      <div className={CSS.innerBox}>
        <ul>
          <li>
            <input type="text" value={identification} onChange={handleIdentification} placeholder="Identification" />
          </li>

          <li style={{ position: "relative" }}>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={handlePassword}
              onKeyDown={handlePasswordKeyDown}
              placeholder="Password"
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={CSS.passwordVisibleBtn}
              onMouseOver={() => hoverPasswordVisibility(true)}
              onMouseOut={() => hoverPasswordVisibility(false)}
            >
              <Image
                src={isPasswordVisible ? (isPasswordVisibleHover ? IconEyeClose : IconEyeOpen) : isPasswordVisibleHover ? IconEyeOpen : IconEyeClose}
                width={15}
                alt={isPasswordVisible ? "ㅁ" : "ㅡ"}
              />
            </button>
          </li>
        </ul>

        <button type="button" onClick={processSignIn}>
          <h5 style={{ fontFamily: "sf_pro_bold" }}>LOGIN</h5>
        </button>
      </div>

      <ul>
        <li>
          <button type="button" onClick={handleRecovery}>
            ID/PW 찾기
          </button>
        </li>
        <li>
          <button type="button" onClick={signUp}>
            회원가입
          </button>
        </li>
      </ul>
    </div>
  );
}
