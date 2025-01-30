"use client";

import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import CSS from "@components/auth/signUp/SignUp.module.css";

import { AppDispatch, RootState } from "@redux/store";

import {
  checkDuplicateAction,
  resetIdentificationAction,
} from "@actions/authAction";

import IconCheck from "@public/svgs/common/icon_check.svg";

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
  const checkDuplicate = (): void => {
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
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            value={identification}
            onChange={handleIdentification}
            placeholder="사용할 아이디를 입력해 주세요."
          />

          {signUp.identification.isChecking &&
            !signUp.identification.isDuplicate && (
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

          {signUp.identification.msg && (
            <p
              style={{
                position: "absolute",
                left: 10,
                paddingTop: 1,
                color: signUp.identification.isDuplicate
                  ? "var(--err-color)"
                  : "var(--font-color)",
              }}
            >
              {signUp.identification.msg}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={checkDuplicate}
          disabled={identification.length <= 5}
        >
          중복 확인
        </button>
      </div>
    </div>
  );
}
