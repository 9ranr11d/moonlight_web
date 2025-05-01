"use client";

import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";
import { resetIdentification } from "@redux/slices/signUpSlice";

import { checkDuplicateIdAction } from "@actions/authAction";

import { validateIdentification } from "@utils/index";

import CSS from "@components/common/input/Input.module.css";

import StatusInput from "@components/common/input/StatusInput";

/** 아이디 Input */
export default function IdentificationInput() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 회원가입 관련 정보 */
  const signUp = useSelector((state: RootState) => state.signUpSlice);

  const [identification, setIdentification] = useState<string>(""); // 아이디

  /** 아이디 Input */
  const handleIdentification = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    dispatch(resetIdentification());

    setIdentification(e.target.value);
  };

  /** 아이디 중복 확인 */
  const clickCheckDuplicate = (): void => {
    const data: { identification: string } = { identification };

    dispatch(checkDuplicateIdAction(data));
  };

  return (
    <div
      className={CSS.identification}
      style={{ display: "flex", columnGap: 10 }}
    >
      <StatusInput
        type="text"
        value={identification}
        onChange={handleIdentification}
        placeholder={"영문 소문자, 숫자, '_', '-'을 이용해서 만들어주세요."}
        showIcon={
          signUp.identification.isChecking && !signUp.identification.isDuplicate
        }
        msg={signUp.identification.msg}
        isErr={signUp.identification.isDuplicate}
      />

      <button
        type="button"
        onClick={clickCheckDuplicate}
        disabled={!validateIdentification(identification)}
      >
        중복 확인
      </button>
    </div>
  );
}
