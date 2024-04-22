"use client";

import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { signIn } from "@redux/slices/AuthSlice";

import CSS from "./SignIn.module.css";

/** SignIn 자식 */
interface SignInProps {
  /** 회원가입으로 전환 */
  signUp: () => void;
  /** ID/PW 찾기 전환 */
  recovery: () => void;
}

/** 로그인 */
export default function SignIn({ signUp, recovery }: SignInProps) {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const [id, setId] = useState<string>(""); // Identification
  const [pw, setPw] = useState<string>(""); // Password

  /** 로그인 */
  const handleSignIn = (): void => {
    const data: { id: string; pw: string } = { id, pw };

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
      .then((data) =>
        // 사용자 정보 AuthSlice(Redux)에 저장
        dispatch(
          signIn({
            _id: data._id,
            isAuth: true,
            id: data.id,
            nickname: data.nickname,
            email: data.email,
            accessLevel: data.accessLevel,
            accessToken: data.accessToken,
          })
        )
      )
      .catch((err) => console.error("Handle Sign In :", err));
  };

  /** Input Identification */
  const handleId = (e: any): void => {
    setId(e.target.value);
  };

  /** Input Password */
  const handlePw = (e: any): void => {
    setPw(e.target.value);
  };

  /** ID/PW 찾기로 전환 */
  const handleRecovery = (): void => {
    recovery();
  };

  return (
    <div className={CSS.signInBox}>
      <h3>로그인</h3>

      <div className={CSS.innerBox}>
        <ul>
          <li>
            <input type="text" value={id} onChange={handleId} placeholder="Identification" />
          </li>
          <li>
            <input type="password" value={pw} onChange={handlePw} placeholder="Password" />
          </li>
        </ul>

        <button type="button" onClick={handleSignIn}>
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
