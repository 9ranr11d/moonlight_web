"use client";

import React, { useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

import EmailVerification from "@components/auth/EmailVerification";

/** E-mail 수정 Form 자식들 */
interface IEmailUpdateFormProps {
  /**
   * E-mail 인증 성공 시
   * @param email 인증 성공한 E-mail
   */
  verifyEmailSuccess: (email: string) => void;
}

/** E-mail 수정 Form */
export default function EmailUpdateForm({
  verifyEmailSuccess,
}: IEmailUpdateFormProps) {
  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authSlice);

  const [step, setStep] = useState<number>(0); // 단계

  /** 이메일 인증 완료 */
  const proceedWithVerifiedEmail = (): void => {
    setStep(1);
  };

  /** 단계 별 렌더할 Component */
  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <EmailVerification
            key="step1"
            title="새로운 이메일을 입력해주세요."
            verified={email => verifyEmailSuccess(email)}
            isAutoFocus={true}
            isEmailCheckEnabled={false}
          />
        );
      case 0:
      default:
        return (
          <EmailVerification
            key="step0"
            title="이메일로 본인 인증"
            verified={proceedWithVerifiedEmail}
            isAutoFocus={true}
            isEmailCheckEnabled={true}
            inputEmail={user.email}
          />
        );
    }
  };

  return <>{renderForm()}</>;
}
