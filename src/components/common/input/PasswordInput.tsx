"use client";

import React, { useEffect, useState } from "react";

import { validatePassword } from "@utils/index";

import StatusInput from "@components/common/input/StatusInput";

/** 비밀번호 Input Interface */
interface IPasswordInput {
  /** 변경 시 */
  onChange?: (password: string) => void;

  /** Placeholder */
  placeholder?: string;
  /** 유효성 */
  isValid?: boolean;
}

/** 비밀번호 Input */
export default function PasswordInput({
  onChange,
  placeholder,
  isValid,
}: IPasswordInput) {
  const [password, setPassword] = useState<string>(""); // 비밀번호

  /** 비밀번호 유효성 */
  const isPasswordValid: boolean =
    isValid === undefined ? validatePassword(password) : isValid;

  /** 비밀번호 Input */
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  // 변경 시
  useEffect(() => {
    onChange?.(password);
  }, [password]);

  return (
    <StatusInput
      type="password"
      value={password}
      onChange={handlePassword}
      placeholder={
        placeholder ||
        "영문 대소문자, 숫자, 특수문자 중 2가지 이상 포함해서 만들어주세요."
      }
      showIcon={isPasswordValid}
      msg={
        password.length === 0 || isPasswordValid
          ? undefined
          : "잘못된 형식입니다."
      }
      isErr={!isPasswordValid}
    />
  );
}
