"use client";

import React, { useState } from "react";

/** SignUp 자식 */
interface SignUpProps {
  completed: () => void;
  back: () => void;
}

/**
 * 회원가입
 * @param completed 회원가입 완료
 */
export default function SignUp({ completed, back }: SignUpProps) {
  const [id, setId] = useState<string>(""); // Identification
  const [nickname, setNickName] = useState<string>(""); // 별명
  const [pw, setPw] = useState<string>(""); // Password
  const [confirmPw, setConfirmPw] = useState<string>(""); // Password 재확인

  /** 회원가입 */
  const handleSignUp = (): void => {
    // pw와 pw 재확인이 일치하지 않을 때
    if (pw !== confirmPw) return alert("비밀번호가 일치하지 않습니다.");

    /** 회원가입에 필요한 사용자 정보 */
    const data = { id, nickname, pw };

    fetch("/api/sign_up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res: Response): any => {
        if (res.ok) return completed();

        alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data: any) => Promise.reject(data.msg));
      })
      .catch((err: Error): void => console.error("Handle Sign Up :", err));
  };

  return (
    <div>
      <table>
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "70%" }} />
        </colgroup>

        <tbody>
          <tr>
            <th>아이디</th>
            <td>
              <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="Identification" />
            </td>
          </tr>

          <tr>
            <th>별명</th>
            <td>
              <input type="text" value={nickname} onChange={(e) => setNickName(e.target.value)} placeholder="Nickname" />
            </td>
          </tr>

          <tr>
            <th>비밀번호</th>
            <td>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" />
            </td>
          </tr>

          <tr>
            <th>비밀번호 재확인</th>
            <td>
              <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Confirm Password" />
            </td>
          </tr>

          <tr>
            <td>
              <button type="button" onClick={handleSignUp}>
                확인
              </button>
            </td>

            <td>
              <button type="button" onClick={() => back()}>
                뒤로가기
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
