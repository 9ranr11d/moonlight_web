"use client";

import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import { AppDispatch } from "@redux/store";

import {
  resetPasswordAction,
  setIsPasswordValidAction,
} from "@actions/authAction";

import CSS from "@components/common/input/Input.module.css";

import { validatePassword } from "@utils/index";

import StatusInput from "@components/common/input/StatusInput";

/** 비밀번호 Input */
export default function PasswordInput() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const [password, setPassword] = useState<string>(""); // Password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // Password 재확인

  /** 비밀번호 유효성 */
  const isPasswordValid: boolean = validatePassword(password);
  /** 비밀번호 재확인 유효성 */
  const isConfirmPasswordValid: boolean =
    validatePassword(confirmPassword) && password === confirmPassword;

  /** Password Input */
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(resetPasswordAction());

    setPassword(e.target.value);
  };

  /** Password 확인 Input */
  const handleConfirmPw = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(resetPasswordAction());

    setConfirmPassword(e.target.value);
  };

  // 비밀번호 유효성 변경 시
  useEffect(() => {
    // 비밀번호, 비밀번호 재확인 일치 && 비밀번호가 유효할 시
    if (isConfirmPasswordValid)
      dispatch(
        setIsPasswordValidAction({
          password: password,
          isValid: isConfirmPasswordValid,
        })
      );
  }, [isConfirmPasswordValid]);

  return (
    <>
      <div className={CSS.wrapper}>
        <h6>비밀번호</h6>

        <StatusInput
          type="password"
          value={password}
          onChange={handlePassword}
          placeholder="대소문자, 숫자, 특수문자 중 2가지 이상 포함 (최소 8자)"
          showIcon={isPasswordValid}
          msg={
            password.length === 0 || isPasswordValid
              ? undefined
              : "잘못된 형식입니다."
          }
          isErr={!isPasswordValid}
        />
      </div>

      <div className={CSS.wrapper}>
        <h6>비밀번호 재확인</h6>

        <StatusInput
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPw}
          placeholder="비밀번호를 한번 더 입력해 주세요."
          showIcon={isConfirmPasswordValid}
          msg={
            confirmPassword.length === 0 || isConfirmPasswordValid
              ? undefined
              : "잘못된 형식입니다."
          }
          isErr={!isConfirmPasswordValid}
        />
      </div>
    </>
  );
}
