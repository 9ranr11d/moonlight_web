"use client";

import React, { useMemo } from "react";

import { TVerificationMethod, TVerificationType } from "@interfaces/auth";

import ErrorBlock from "@components/common/ErrorBlock";

import EmailForm from "@components/auth/verification/EmailForm";
import PhoneNumberForm from "@components/auth/verification/PhoneNumberForm";

/** 본인인증 Form Interface */
interface IVerificationForm {
  /** Style */
  style?: React.CSSProperties;
  /** Type */
  type?: TVerificationType;
  /** 아이디 */
  identification?: string;
  /** 선택된 방법 */
  method: TVerificationMethod;
}

/** 본인인증 Form */
export default function VerificationForm({
  style,
  type = "signUp",
  identification,
  method = "email",
}: IVerificationForm) {
  /** Input들 */
  const inputs = useMemo(() => {
    return {
      email: <EmailForm type={type} identification={identification} />,
      phoneNumber: <PhoneNumberForm type={type} />,
    };
  }, [type]);

  return (
    <div style={style}>
      {inputs[method] ?? (
        <div style={{ marginBottom: 10 }}>
          <ErrorBlock />
        </div>
      )}
    </div>
  );
}
