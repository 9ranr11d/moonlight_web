"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import CSS from "./SignUp.module.css";

import { AppDispatch, RootState } from "@redux/store";

import {
  checkDuplicateAction,
  resetIdCheckAction,
  setIdentificationAction,
} from "@actions/authAction";

import IconCheck from "@public/svgs/common/icon_check.svg";

/** identification 중복 검사 Input */
export default function IdentificationInput() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** identification 중복 검사 관련 정보 */
  const idCheck = useSelector((state: RootState) => state.idCheckReducer);

  const [identification, setIdentification] = useState<string>(""); // Identification

  /** Identification Input */
  const handleIdentification = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    dispatch(resetIdCheckAction());
    dispatch(setIdentificationAction(""));

    setIdentification(e.target.value);
  };

  /** Identification 중복 확인 */
  const checkDuplicate = (): void => {
    const data: { identification: string } = { identification };

    dispatch(checkDuplicateAction(data));
  };

  // 중복 검사 여부에 따라
  useEffect(() => {
    if (idCheck.isChecking) dispatch(setIdentificationAction(identification));
  }, [idCheck.isChecking]);

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

          {idCheck.isChecking && !idCheck.isDuplicate && (
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

          {idCheck.msg && (
            <p
              style={{
                position: "absolute",
                left: 10,
                paddingTop: 1,
                color: idCheck.isDuplicate
                  ? "var(--err-color)"
                  : "var(--font-color)",
              }}
            >
              {idCheck.msg}
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
