"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/store";

import { clearRecoveryMsg } from "@/store/slices/recoverySlice";

import { changePwAction } from "@/actions/authAction";

import styles from "./Recovery.module.css";

import { validatePassword } from "@/utils";

import PasswordInput from "@/components/common/inputs/PasswordInput";
import NextBtn from "@/components/common/btns/NextBtn";

/** 비밀번호 변경 Form Interface */
interface IChagePwForm {
  identification: string;
}

/** 제목 Style */
const labelStyle: React.CSSProperties = {
  textAlign: "left",
  marginBottom: 3,
};

/** 비밀번호 변경 Form */
export default function ChangePwForm({ identification }: IChagePwForm) {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const { msg } = useSelector((state: RootState) => state.recovery);

  const [password, setPassword] = useState<string>(""); // 비밀번호
  const [confirmPw, setConfirmPw] = useState<string>(""); // 비밀번호 확인

  /** 비밀번호 유효 여부 */
  const isValidateConfirmPassword: boolean =
    password.trim() !== "" &&
    validatePassword(confirmPw) &&
    password === confirmPw;

  /** 다음 버튼 클릭 시 */
  const clickNext = (): void => {
    dispatch(changePwAction({ identification, password }));
  };

  useEffect(() => {
    dispatch(clearRecoveryMsg());
  }, [password, confirmPw]);

  return (
    <div>
      <div style={{ marginBottom: 15 }}>
        <h6 style={labelStyle}>비밀번호</h6>

        <PasswordInput onChange={(pw: string) => setPassword(pw)} />
      </div>

      <div>
        <h6 style={labelStyle}>비밀번호 재확인</h6>

        <PasswordInput
          onChange={(confirmPw: string) => setConfirmPw(confirmPw)}
          placeholder="비밀번호를 한번 더 입력해 주세요."
          isValid={isValidateConfirmPassword}
        />
      </div>

      <div className="okBtnBox">
        {!msg ? (
          <NextBtn onClick={clickNext} disabled={!isValidateConfirmPassword} />
        ) : (
          <p
            style={{
              width: "100%",
              height: 36,
              color: "var(--err-color)",
            }}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
