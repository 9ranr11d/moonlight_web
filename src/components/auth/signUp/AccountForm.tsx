"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";
import {
  incrementSignUpStep,
  resetPassword,
  setIsPasswordValid,
} from "@redux/slices/signUpSlice";

import CSS from "@components/auth/signUp/SignUp.module.css";

import { validatePassword } from "@utils/index";

import IdentificationInput from "@components/common/input/IdentificationInput";
import PasswordInput from "@components/common/input/PasswordInput";
import NextBtn from "@components/common/btn/NextBtn";

/** 아이디, 비밀번호 Form */
export default function AccountForm() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 회원가입 관련 정보 */
  const signUp = useSelector((state: RootState) => state.signUpSlice);

  const [password, setPassword] = useState<string>(""); // 비밀번호
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // 비밀번호 재확인

  const [isConfirmActive, setIsConfirmActive] = useState<boolean>(false); // 다음 버튼 활성화 여부

  const isValidateConfirmPassword: boolean =
    validatePassword(confirmPassword) && password === confirmPassword;

  /** 비밀번호 입력 시 */
  const handlePassword = (password: string): void => {
    dispatch(resetPassword());

    setPassword(password);
  };

  /** 비밀번호 재확인 입력 시 */
  const handleConfirmPassword = (password: string): void => {
    dispatch(resetPassword());

    setConfirmPassword(password);
  };

  /** 다음 버튼 클릭 시 */
  const clickConfirmBtn = (): void => {
    dispatch(incrementSignUpStep());
  };

  // 아이디, 비밀번호 인증 정보 변경 시
  useEffect(() => {
    setIsConfirmActive(
      !signUp.identification.isDuplicate && signUp.password.isValid
    );
  }, [signUp.identification.isDuplicate, signUp.password.isValid]);

  useEffect(() => {
    if (isValidateConfirmPassword)
      dispatch(setIsPasswordValid({ password, isValid: true }));
  }, [isValidateConfirmPassword]);

  return (
    <>
      <div>
        <h6 className={CSS.label}>아이디</h6>

        <IdentificationInput />
      </div>

      <div>
        <h6 className={CSS.label}>비밀번호</h6>

        <PasswordInput onChange={handlePassword} />
      </div>

      <div>
        <h6 className={CSS.label}>비밀번호 재확인</h6>

        <PasswordInput
          onChange={handleConfirmPassword}
          placeholder="비밀번호를 한번 더 입력해 주세요."
          isValid={isValidateConfirmPassword}
        />
      </div>

      <div className={CSS.okBtnBox}>
        <NextBtn onClick={clickConfirmBtn} disabled={!isConfirmActive} />
      </div>
    </>
  );
}
