"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import { resetVerification, verify } from "@redux/slices/verificationSlice";
import { incrementRecoveryStep } from "@redux/slices/recoverySlice";

import {
  checkDuplicateEmailAction,
  getUserIdByEmailAction,
  verityEmailAction,
} from "@actions/authAction";

import styles from "@components/auth/signUp/SignUp.module.css";

import { TVerificationType } from "@interfaces/auth";

import { validateEmail } from "@utils/index";

import EmailInput from "@components/common/input/EmailInput";
import VerificationInput from "@components/common/input/VerificationInput";
import LoadingBtn from "@components/common/btn/LoadingBtn";

/** 이메일 인증 Form Interface */
interface IEmailForm {
  /** 사용처 */
  type?: TVerificationType;
  /** 아이디 */
  identification?: string;
}

/** 이메일 인증 Form */
export default function EmailForm({
  type = "signUp",
  identification,
}: IEmailForm) {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 본인인증 정보 */
  const verification = useSelector(
    (state: RootState) => state.verificationSlice
  );

  const [email, setEmail] = useState<string>(""); // 입력된 Email
  const [code, setCode] = useState<string>(""); // 입력된 인증 코드
  const [msg, setMsg] = useState<string>(""); // Input 알림 Message

  const [isSent, setIsSent] = useState<boolean>(false); // 전송 여부

  /** Email 유효성 */
  const isValidEmail = validateEmail(email);

  /** Email 기입 시 */
  const handleEmail = (email: string) => {
    setEmail(email.trim());
    setMsg("");

    setIsSent(false);

    dispatch(resetVerification());
  };

  /** Email Input에서 키 클릭 시 */
  const handleEmailKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter" && !isSent) clickSendCode();
  };

  /** 인증 코드 입력 시 */
  const handleCode = (code: string) => {
    setCode(code.trim());
  };

  /** 인증 코드 전송 버튼 클릭 시 */
  const clickSendCode = () => {
    dispatch(resetVerification());

    setIsSent(true);

    dispatch(
      checkDuplicateEmailAction({
        email,
        ...(identification && { identification }),
        type,
      })
    );
  };

  /** 인증 코드 재전송 버튼 클릭 시 */
  const clickResendCode = () => {
    dispatch(resetVerification());

    clickSendCode();
  };

  /** 인증코드 확인 버튼 클릭 시 */
  const clickConfirmBtn = () => {
    const isCodeEmpty = !code || code.trim() === "";
    const isCodeMismatch = code !== verification.code;

    if (isCodeEmpty || isCodeMismatch) {
      setMsg("인증 코드를 다시 확인해주세요.");

      return;
    }

    switch (type) {
      case "findId":
        dispatch(getUserIdByEmailAction({ email }));
      case "findPw":
        dispatch(incrementRecoveryStep());
      default:
        dispatch(verify());

        setMsg("인증이 완료되었습니다.");

        break;
    }
  };

  // 본인인증 관련 오류 시
  useEffect(() => {
    if (verification.isErr) setIsSent(false);
  }, [verification.isErr]);

  // 중복 검사 통과 시
  useEffect(() => {
    if (!verification.isDuplicate || verification.isRegistered)
      dispatch(verityEmailAction({ email }));
  }, [verification.isDuplicate, verification.isRegistered]);

  return (
    <div>
      <div style={{ position: "relative", marginBottom: 20 }}>
        <h6 className={styles.label}>Email</h6>

        <EmailInput onChange={handleEmail} onKeyDown={handleEmailKeyDown} />

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

      {(type === "signUp" ? verification.email : isSent) ? (
        <>
          <VerificationInput
            onClickResendCode={clickResendCode}
            onChange={handleCode}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") clickConfirmBtn();
            }}
            msg={msg}
          />

          <button
            type="button"
            onClick={clickConfirmBtn}
            style={{ width: "100%", marginTop: 20 }}
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
    </div>
  );
}
