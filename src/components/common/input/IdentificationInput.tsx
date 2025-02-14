"use client";

import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import {
  checkDuplicateAction,
  resetIdentificationAction,
} from "@actions/authAction";

import CSS from "@components/common/input/Input.module.css";

import StatusInput from "@components/common/input/StatusInput";

/** identification 중복 검사 Input */
export default function IdentificationInput() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 회원가입 관련 정보 */
  const signUp = useSelector((state: RootState) => state.signUpSlice);

  const [identification, setIdentification] = useState<string>(""); // Identification

  /** Identification Input */
  const handleIdentification = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    dispatch(resetIdentificationAction());

    setIdentification(e.target.value);
  };

  /** Identification 중복 확인 */
  const clickCheckDuplicate = (): void => {
    const data: { identification: string } = { identification };

    dispatch(checkDuplicateAction(data));
  };

  return (
    <div className={CSS.wrapper}>
      <h6>아이디</h6>

      <div
        className={CSS.identification}
        style={{ display: "flex", columnGap: 10 }}
      >
        <StatusInput
          type="text"
          value={identification}
          onChange={handleIdentification}
          placeholder="사용할 아이디를 입력해 주세요."
          showIcon={
            signUp.identification.isChecking &&
            !signUp.identification.isDuplicate
          }
          msg={signUp.identification.msg}
          isErr={signUp.identification.isDuplicate}
        />

        <button
          type="button"
          onClick={clickCheckDuplicate}
          disabled={identification.length <= 5}
        >
          중복 확인
        </button>
      </div>
    </div>
  );
}
