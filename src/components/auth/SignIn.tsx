"use client";

import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { signIn } from "@redux/slices/AuthSlice";

import CSS from "./SignIn.module.css";

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

  /** Input Identification */
  const handleIdentification = (e: any): void => {
    setIdentification(e.target.value);
  };

  /** Input Password */
  const handlePassword = (e: any): void => {
    setPassword(e.target.value);
  };

  /** ID/PW 찾기로 전환 */
  const handleRecovery = (): void => {
    recovery();
  };

  /** 로그인 */
  const processSignIn = (): void => {
    const data: { identification: string; password: string } = { identification, password };

    fetch("/api/auth/sign_in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) return res.json();
        else if (res.status === 404 || res.status === 401) alert("ID와 PW를 다시 확인해주세요.");
        else alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        // 사용자 정보 AuthSlice(Redux)에 저장
        dispatch(
          signIn({
            _id: data.user._id,
            isAuth: true,
            identification: data.user.identification,
            nickname: data.user.nickname,
            email: data.user.email,
            accessLevel: data.user.accessLevel,
            accessToken: data.accessToken,
            regDate: data.user.regDate,
          })
        );
      })
      .catch((err) => console.error("Process Sign In :", err));
  };

  return (
    <div className={CSS.signInBox}>
      <h3>로그인</h3>

      <div className={CSS.innerBox}>
        <ul>
          <li>
            <input type="text" value={identification} onChange={handleIdentification} placeholder="Identification" />
          </li>
          <li>
            <input type="password" value={password} onChange={handlePassword} placeholder="Password" />
          </li>
        </ul>

        <button type="button" onClick={processSignIn}>
          <h5>로그인</h5>
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
