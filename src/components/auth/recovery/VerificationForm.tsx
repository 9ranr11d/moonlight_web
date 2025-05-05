"use client";

import React, { useMemo } from "react";

import { useSelector } from "react-redux";

import { RootState } from "@redux/store";

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
}

/** 본인인증 Form */
export default function VerificationForm({
  style,
  type = "signUp",
  identification,
}: IVerificationForm) {
  const { verificationMethod } = useSelector(
    (state: RootState) => state.recoverySlice
  );

  /** Input들 */
  const inputs = useMemo(() => {
    return {
      email: <EmailForm type={type} identification={identification} />,
      phoneNumber: <PhoneNumberForm type={type} />,
    };
  }, [type]);

  return (
    <div style={style}>
      {inputs[verificationMethod as TVerificationMethod] ?? (
        <div style={{ marginBottom: 10 }}>
          <ErrorBlock />
        </div>
      )}
    </div>
  );
}
