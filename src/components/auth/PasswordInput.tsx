"use client";

import React, { useEffect, useState } from "react";

import CSS from "./SignUp.module.css";

import IconCheck from "@public/svgs/common/icon_check.svg";

/** 비밀번호 Input */
export default function PasswordInput() {
  const [password, setPassword] = useState<string>(""); // Password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // Password 재확인

  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false); // 비밀번호 유효성 검사 결과

  /** Password Input */
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  /** Password 확인 Input */
  const handleConfirmPw = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
  };

  /** 비밀번호 유효성 검사 */
  const validatePassword = (): boolean => {
    // 특수문자, 소문자, 대문자 확인하는 정규식
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);

    // 두 가지 이상 조합 여부 확인
    const isValid =
      [hasSpecialChar, hasLowercase, hasUppercase].filter(Boolean).length >= 2;

    // 비밀번호와 확인 비밀번호 일치 여부 확인
    return isValid && password === confirmPassword;
  };

  // 비밀번호와 비밀번호 재확인 값 변화 시
  useEffect(() => {
    setIsPasswordValid(validatePassword());
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
        <h6>비밀번호 재확인</h6>

        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPw}
            placeholder="비밀번호를 한번 더 입력해 주세요."
          />

          {isPasswordValid && (
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
