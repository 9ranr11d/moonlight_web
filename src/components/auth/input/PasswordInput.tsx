"use client";

import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import CSS from "@components/auth/signUp/SignUp.module.css";

import { AppDispatch } from "@redux/store";

import IconCheck from "@public/svgs/common/icon_check.svg";
import { setIsPasswordValidAction } from "@actions/authAction";

/** 비밀번호 Input */
export default function PasswordInput() {
  const dispatch = useDispatch<AppDispatch>();

  const [password, setPassword] = useState<string>(""); // Password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // Password 재확인

  const [isValid, setIsValid] = useState<boolean>(false); // 비밀번호 유효성 검사 결과

  /** 비밀번호 일치 여부 검사 함수 */
  const isPasswordsMatch = password === confirmPassword;

  /** Password Input */
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  /** Password 확인 Input */
  const handleConfirmPw = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
  };

  /** 비밀번호 유효성 검사 함수 */
  const validatePassword = (password: string): boolean => {
    const isSpecialCharIncluded = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLowercaseIncluded = /[a-z]/.test(password);
    const isUppercaseIncluded = /[A-Z]/.test(password);
    const isMinLengthValid = password.length >= 8;

    // 최소 8자 + (대문자, 소문자, 특수문자 중 2가지 이상 포함)
    return (
      isMinLengthValid &&
      [isSpecialCharIncluded, isLowercaseIncluded, isUppercaseIncluded].filter(
        Boolean
      ).length >= 2
    );
  };

  // 비밀번호 유효성 변경 시
  useEffect(() => {
    /** 비밀번호 유효성 */
    const _isVaild = validatePassword(password) && password === confirmPassword;

    setIsValid(_isVaild);

    if (isPasswordsMatch && _isVaild)
      dispatch(
        setIsPasswordValidAction({
          password: password,
          isValid: _isVaild,
        })
      );
  }, [isPasswordsMatch, password, confirmPassword]);

  return (
    <>
      <div className={CSS.wrapper}>
        <h6>비밀번호</h6>

        <input
          type="password"
          value={password}
          onChange={handlePassword}
          placeholder="대소문자, 숫자, 특수문자 중 2가지 이상 포함 (최소 8자)"
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

          {isValid && (
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
