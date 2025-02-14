"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import { incrementStepAction } from "@actions/authAction";

import CSS from "@components/auth/signUp/SignUp.module.css";

import IdentificationInput from "@components/common/input/IdentificationInput";
import PasswordInput from "@components/common/input/PasswordInput";
import NextBtn from "@components/common/btn/NextBtn";

/** identification, password Form */
export default function AccountForm() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 회원가입 관련 정보 */
  const signUp = useSelector((state: RootState) => state.signUpSlice);

  const [isConfirmActive, setIsConfirmActive] = useState<boolean>(false); // 다음 버튼 활성화 여부

  /** 다음 버튼 클릭 시 */
  const clickConfirmBtn = (): void => {
    dispatch(incrementStepAction());
  };

  // identification, password 인증 정보 변경 시
  useEffect(() => {
    setIsConfirmActive(
      !signUp.identification.isDuplicate && signUp.password.isValid
    );
  }, [signUp.identification.isDuplicate, signUp.password.isValid]);

  return (
    <>
      <IdentificationInput />
      <PasswordInput />

      <div className={CSS.okBtnBox}>
        <NextBtn onClick={clickConfirmBtn} disabled={!isConfirmActive} />
      </div>
    </>
  );
}
