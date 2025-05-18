"use client";

import React, { useEffect, useMemo } from "react";

import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import {
  decrementSignUpStep,
  resetIdentification,
  resetPassword,
  resetSignUp,
  resetTerm,
} from "@redux/slices/signUpSlice";

import { resetVerification } from "@redux/slices/verificationSlice";

import TitleHeader from "@components/common/TitleHeader";
import ErrorBlock from "@components/common/ErrorBlock";
import DotAndBar from "@components/common/indicator/DotAndBar";

import TermsForm from "@components/auth/signUp/TermsForm";
import AccountForm from "@components/auth/signUp/AccountForm";
import VerificationForm from "@components/auth/signUp/VerificationForm";
import ProfileForm from "@components/auth/signUp/ProfileForm";

import IconHome from "@public/svgs/common/icon_home.svg";
import IconCheck from "@public/svgs/common/icon_check.svg";

export default function SignUp() {
  /** Router */
  const router = useRouter();

  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const { step, isCompleted, isErr, msg } = useSelector(
    (state: RootState) => state.signUpSlice
  ); // 회원가입 Step, 완료 여부, 오류 여부, 오류 메시지

  /** 뒤로 가기 클릭 시 */
  const clickBack = (): void => {
    // 단계별 뒤로가기 클릭 시
    switch (step) {
      case 1:
        dispatch(resetTerm());

        break;
      case 2:
        dispatch(resetIdentification());
        dispatch(resetPassword());

        break;
      case 3:
        dispatch(resetVerification());

        break;
    }

    dispatch(decrementSignUpStep());
  };

  /** Step별 컴포넌트 */
  const steps = useMemo(
    () => [
      <TermsForm />,
      <AccountForm />,
      <VerificationForm />,
      <ProfileForm />,
    ],
    []
  );

  useEffect(() => {
    dispatch(resetSignUp());
    dispatch(resetVerification());
  }, []);

  return (
    <div className="authBox">
      <div>
        <TitleHeader
          back={step > 0 && step < steps.length - 1 ? clickBack : undefined}
          title="회원가입"
          style={{ marginBottom: 20 }}
          rightIcon={
            !isCompleted && (
              <button
                type="button"
                onClick={() => router.push("/")}
                style={{ padding: 0, background: "none" }}
              >
                <IconHome width={24} height={24} fill={"black"} />
              </button>
            )
          }
        />

        {!isCompleted ? (
          !isErr ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 15,
                }}
              >
                {steps[step] ?? (
                  <div style={{ marginBottom: 10 }}>
                    <ErrorBlock />
                  </div>
                )}
              </div>

              {step < steps.length && (
                <div className="signUpIndicator">
                  <DotAndBar progress={step} maxValue={steps.length} />
                </div>
              )}
            </>
          ) : (
            <ErrorBlock content={<h6>{msg}</h6>} />
          )
        ) : (
          <>
            <div style={{ marginBottom: 10 }}>
              <span
                style={{
                  width: 50,
                  height: 50,
                  display: "inline-block",
                  borderRadius: 40,
                  padding: 10,
                  background: "var(--primary-color)",
                }}
              >
                <IconCheck width={30} height={30} fill="white" />
              </span>
            </div>

            <h5 style={{ marginBottom: 10 }}>회원가입 완료되었습니다.</h5>

            <p style={{ marginBottom: 25 }}>
              MOONLIGHT의 회원이 되신 것을 환영합니다.
              <br />
              아래 버튼으로 메인 홈에서 로그인 해주세요.
            </p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => router.push("/")}
                style={{ display: "flex", columnGap: 5 }}
              >
                <IconHome width={15} height={15} fill="white" />

                <span>홈으로 돌아가기</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
