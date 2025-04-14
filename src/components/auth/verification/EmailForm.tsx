"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";
import { resetVerification, verify } from "@redux/slices/VerificationSlice";

import {
  checkDuplicateEmailAction,
  verityEmailAction,
} from "@actions/authAction";

import CSS from "@components/auth/signUp/SignUp.module.css";

import { validateEmail } from "@utils/index";

import EmailInput from "@components/common/input/EmailInput";
import VerificationInput from "@components/common/input/VerificationInput";
import LoadingBtn from "@components/common/btn/LoadingBtn";

/** 이메일 인증 Form */
export default function EmailForm() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 본인인증 정보 */
  const verification = useSelector((state: RootState) => state.verification);

  const [email, setEmail] = useState<string>(""); // 입력된 Email
  const [code, setCode] = useState<string>(""); // 입력된 인증 코드
  const [msg, setMsg] = useState<string>(""); // Input 알림 Message

  const [isSent, setIsSent] = useState<boolean>(false); // 전송 여부

  /** Email 유효성 */
  const isValidEmail = validateEmail(email);

  /** Email 기입 시 */
  const handleEmail = (email: string) => {
    setEmail(email);

    setIsSent(false);

    dispatch(resetVerification());
  };

  /** 인증 코드 입력 시 */
  const handleCode = (code: string) => {
    setCode(code);
  };

  /** 인증 코드 전송 버튼 클릭 시 */
  const clickSendCode = () => {
    dispatch(resetVerification());

    setIsSent(true);

    dispatch(checkDuplicateEmailAction({ email }));
  };

  /** 인증 코드 재전송 버튼 클릭 시 */
  const clickResendCode = () => {
    dispatch(resetVerification());

    clickSendCode();
  };

  /** 인증코드 확인 버튼 클릭 시 */
  const clickConfirmBtn = () => {
    if (code === verification.code) dispatch(verify());
    else setMsg("인증 코드를 다시 확인해주세요.");
  };

  // 본인인증 관련 오류 시
  useEffect(() => {
    if (verification.isErr) setIsSent(false);
  }, [verification.isErr]);

  // 중복 검사 통과 시
  useEffect(() => {
    if (!verification.isDuplicate) dispatch(verityEmailAction({ email }));
  }, [verification.isDuplicate]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <h6 className={CSS.label}>Email</h6>

        <EmailInput onChange={handleEmail} />

        {verification.isErr && (
          <p
            style={{
              position: "absolute",
              left: 5,
              paddingTop: 1,
              color: "var(--err-color)",
            }}
          >
            {verification.msg}
          </p>
        )}
      </div>

      {verification.email ? (
        <>
          <VerificationInput
            onResendClick={clickResendCode}
            onChange={handleCode}
            msg={msg}
          />

          <button
            type="button"
            onClick={clickConfirmBtn}
            style={{ marginTop: 20 }}
          >
            확인
          </button>
        </>
      ) : (
        <LoadingBtn
          onClick={clickSendCode}
          disabled={!isValidEmail}
          isLoading={isSent}
          label="인증 코드 전송"
          style={{ width: "100%", marginTop: 10 }}
        />
      )}
    </>
  );
}
