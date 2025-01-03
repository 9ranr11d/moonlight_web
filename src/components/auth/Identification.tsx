"use client";

import React, { useState } from "react";

import { ERR_MSG } from "@constants/msg";

import EmailVerification from "./EmailVerification";

/** Identification 찾기 */
export default function Identification() {
  const [isVerified, setIsVerified] = useState<boolean>(false); // E-mail 인증 여부

  const [identification, setIdentification] = useState<string>(""); // 찾으려는 Identification

  /**
   * 입력받은 E-mail과 부합하는 Identification 찾기
   * @param email E-mail
   */
  const getUserIdentification = (email: string): void => {
    const data: { email: string } = { email };

    fetch("/api/auth/getUserIdByEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.ok) return res.json();

        if (res.status === 404) alert("존재하지 않는 아이디입니다.");
        else alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        setIdentification(data.identification);
        setIsVerified(true);
      })
      .catch(err => console.error("/src/components/auth/Recovery > Identification() > getUserIdentification()에서 오류가 발생했습니다. :", err));
  };

  return (
    <>
      {!isVerified ? (
        <EmailVerification title="이메일로 본인 인증" verified={email => getUserIdentification(email)} isAutoFocus={false} isEmailCheckEnabled={true} />
      ) : (
        <div>
          <h4>찾으시는 아이디는</h4>
          <h2>『 {identification} 』</h2>
          <h4>입니다.</h4>
        </div>
      )}
    </>
  );
}
