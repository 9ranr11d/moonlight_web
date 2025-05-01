"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { isValidPhoneNumber } from "libphonenumber-js";

import { AppDispatch, RootState } from "@redux/store";

import { resetVerification, verify } from "@redux/slices/verificationSlice";

import { incrementRecoveryStep } from "@redux/slices/recoverySlice";

import {
  checkDuplicatePhoneNumberAction,
  getUserIdByPhoneNumberAction,
  verifyPhoneNumberAction,
} from "@actions/authAction";

import CSS from "@components/auth/signUp/SignUp.module.css";

import { TVerificationType } from "@interfaces/auth";

import PhoneNumberInput from "@components/common/input/PhoneNumberInput";
import VerificationInput from "@components/common/input/VerificationInput";
import LoadingBtn from "@components/common/btn/LoadingBtn";

/** 휴대전화 번호 인증 Form Interface */
interface IPhoneNumberForm {
  /** 휴대전화 번호 사용처 */
  type?: TVerificationType;
}

/** 휴대전화 번호 인증 Form */
export default function PhoneNumberForm({ type = "signUp" }: IPhoneNumberForm) {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 본인인증 정보 */
  const verification = useSelector((state: RootState) => state.verification);

  const [phoneNumber, setPhoneNumber] = useState<string>(""); // 휴대전화 번호
  const [code, setCode] = useState<string>(""); // 입력된 인증 코드
  const [msg, setMsg] = useState<string>(""); // Input 알림 Message

  const [isSent, setIsSent] = useState<boolean>(false); // 전송 여부

  /** 휴대전화 번호 기입 시 */
  const handlePhoneNumber = (number: string) => {
    setPhoneNumber(number);
  };

  /** 휴대전화 번호 Input에서 키 클릭 시 */
  const handlePhoneNumberKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter" && !isSent) clickSendCode();
  };

  /** 인증 코드 입력 시 */
  const handleCode = (code: string) => {
    setCode(code);
  };

  /** 인증 코드 전송 버튼 클릭 시 */
  const clickSendCode = async () => {
    dispatch(resetVerification());

    setIsSent(true);

    dispatch(checkDuplicatePhoneNumberAction({ phoneNumber, type }));
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

    if (type === "findId") {
      dispatch(getUserIdByPhoneNumberAction({ phoneNumber }));
      dispatch(incrementRecoveryStep());
    }

    dispatch(verify());

    setMsg("인증이 완료되었습니다.");
  };

  // 본인인증 관련 오류 시
  useEffect(() => {
    if (verification.isErr) setIsSent(false);
  }, [verification.isErr]);

  // 중복 검사 통과 시
  useEffect(() => {
    if (!verification.isDuplicate || verification.isRegistered)
      dispatch(verifyPhoneNumberAction({ phoneNumber }));
  }, [verification.isDuplicate, verification.isRegistered]);

  return (
    <div>
      <div style={{ position: "relative", marginBottom: 20 }}>
        <h6 className={CSS.label}>휴대전화 번호</h6>

        <PhoneNumberInput
          onChange={handlePhoneNumber}
          onKeyDown={handlePhoneNumberKeyDown}
        />

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

      {isSent ? (
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
            style={{ marginTop: 20 }}
          >
            확인
          </button>
        </>
      ) : (
        <LoadingBtn
          onClick={clickSendCode}
          disabled={!isValidPhoneNumber(phoneNumber)}
          isLoading={isSent}
          label="인증 코드 전송"
          style={{ width: "100%", marginTop: 10 }}
        />
      )}
    </div>
  );
}
