"use client";

import React, { useEffect, useState } from "react";

import CSS from "./SignUp.module.css";

import IconCheck from "@public/svgs/common/icon_check.svg";

/** 비밀번호 Input */
export default function PasswordInput() {
  const [password, setPassword] = useState<string>(""); // Password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // Password 재확인

  const [isPasswordMatching, setIsPwMatching] = useState<boolean>(false); // Password와 ConfirmPw가 일치하는 지

  /** Password Input */
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  /** Password 확인 Input */
  const handleConfirmPw = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
  };

  // Password랑 Password 확인 일치여부 확인
  useEffect(() => {
    if (password.length > 0 && password === confirmPassword)
      setIsPwMatching(true);
    else setIsPwMatching(false);
  }, [password, confirmPassword]);

  return (
    <>
      <div className={CSS.wrapper}>
        <h6>비밀번호</h6>

        <input
          type="password"
          value={password}
          onChange={handlePassword}
          placeholder="비밀번호를 입력해 주세요."
        />
      </div>

      <div className={CSS.wrapper}>
        <h6>재확인</h6>

        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPw}
            placeholder="비밀번호를 한번 더 입력해 주세요."
          />

          {isPasswordMatching && (
            <span
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <IconCheck width={20} height={20} fill="var(--primary-color)" />
            </span>
          )}
        </div>
      </div>
    </>
  );
}
