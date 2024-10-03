"use client";

import EmailVerification from "@components/auth/EmailVerification";
import React, { useState } from "react";

interface IEmailUpdateFormProps {
  verifyEmailSuccess: (email: string) => void;
}

export default function EmailUpdateForm({ verifyEmailSuccess }: IEmailUpdateFormProps) {
  const [step, setStep] = useState<number>(0);

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
            verified={email => proceedWithVerifiedEmail(email)}
            isAutoFocus={true}
            isEmailCheckEnabled={true}
          />
        );
    }
  };

  const proceedWithVerifiedEmail = (email: string): void => {
    setStep(1);
  };

  return <>{renderForm()}</>;
}
