"use client";

import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { AuthState, signIn } from "@redux/slices/AuthSlice";

/** SignIn 자식 */
interface SignInProps {
  signUp: () => void;
}

/**
 * 로그인
 * @param signUp 회원가입으로 전환
 */
export default function SignIn({ signUp }: SignInProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [id, setId] = useState<string>(""); // Identification
  const [pw, setPw] = useState<string>(""); // PassWord

  /** 로그인 */
  const handleSignIn = (): void => {
    const data = { id, pw };

    fetch("/api/sign_in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res: Response): any => {
        if (res.ok) return res.json();
        else if (res.status === 404 || res.status === 401) alert("ID와 PW를 다시 확인해주세요.");
        else alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data: any) => Promise.reject(data.err));
      })
      .then((data: AuthState): any =>
        // 사용자 정보 AuthSlice(Redux)에 저장
        dispatch(
          signIn({
            isAuth: true,
            id: data.id,
            nickname: data.nickname,
            accessLevel: data.accessLevel,
            accessToken: data.accessToken,
          })
        )
      )
      .catch((err: Error): void => console.error("Handle Sign In :", err));
  };

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="Identification" />
            </td>
            <td rowSpan={2}>
              <button type="button" onClick={handleSignIn}>
                Sign In
              </button>
            </td>
          </tr>

          <tr>
            <td>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="PassWord" />
            </td>
          </tr>

          <tr>
            <td colSpan={2}>
              <button type="button" onClick={signUp}>
                회원가입
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
