"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import {
  resetVerificationAction,
  verifyAction,
  verityEmailAction,
} from "@actions/authAction";

import { validateEmail } from "@utils/index";

import EmailInput from "@components/common/input/EmailInput";
import VerificationInput from "@components/common/input/VerificationInput";
import LoadingBtn from "@components/common/btn/LoadingBtn";

import IconCheck from "@public/svgs/common/icon_check.svg";

/** 이메일 인증 Form */
export default function EmailForm() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 회원가입 정보 */
  const signUp = useSelector((state: RootState) => state.signUpSlice);

  const [email, setEmail] = useState<string>(""); // 입력된 E-mail
  const [code, setCode] = useState<string>(""); // 입력된 인증 코드

  const [isSent, setIsSent] = useState<boolean>(false); // 전송 여부

  /** E-mail 유효성 */
  const isValidEmail = validateEmail(email);

  /** Email 기입 시 */
  const handleEmail = (email: string) => {
    setEmail(email);

    setIsSent(false);

    dispatch(resetVerificationAction());
  };

  /** 인증 코드 입력 시 */
  const handleCode = (code: string) => {
    setCode(code);
  };

  /** 인증 코드 전송 버튼 클릭 시 */
  const clickSendCode = () => {
    setIsSent(true);

    dispatch(verityEmailAction({ email }));
  };

  /** 인증 코드 재전송 버튼 클릭 시 */
  const clickResendCode = () => {
    dispatch(resetVerificationAction());

    clickSendCode();
  };

  /** 인증코드 확인 버튼 클릭 시 */
  const clickConfirmBtn = () => {
    if (code === signUp.verification.code) dispatch(verifyAction());
    else alert("인증 코드를 다시 확인해주세요.");
  };

  console.log(signUp.verification);

  // 본인인증 관련 오류 시
  useEffect(() => {
    if (signUp.verification.isErr) setIsSent(false);
  }, [signUp.verification.isErr]);

  return (
    <>
      {!signUp.verification.isVerified ? (
        <>
          <EmailInput onChange={handleEmail} />

          {signUp.verification.email ? (
            <>
              <VerificationInput
                onResendClick={clickResendCode}
                onChange={handleCode}
              />

              <button type="button" onClick={clickConfirmBtn}>
                확인
              </button>
            </>
          ) : (
            <LoadingBtn
              onClick={clickSendCode}
              disabled={!isValidEmail}
              isLoading={isSent}
              lavel="인증 코드 전송"
              style={{ width: "100%" }}
            />
          )}
        </>
      ) : (
        <div>
          <IconCheck width={50} height={50} fill={"var(--primary-color)"} />

          <h6 style={{ marginTop: 10 }}>
            본인 인증이 완료되었습니다.
            <br />
            '다음'버튼을 눌러 다음 단계를 진행해주세요.
          </h6>
        </div>
      )}
    </>
  );
}
