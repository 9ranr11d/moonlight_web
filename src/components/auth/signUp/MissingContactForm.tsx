"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/redux/store";

import { TVerificationMethod } from "@/interfaces/auth";

import ErrorBlock from "@/components/common/ErrorBlock";
import DotAndBar from "@/components/common/indicator/DotAndBar";

import VerificationMethodForm from "@/components/auth/verification/VerificationMethodForm";
import VerificationForm from "@/components/auth/verification/VerificationForm";

import IconHome from "@public/svgs/common/icon_home.svg";
import TitleHeader from "@/components/common/TitleHeader";

import LunarLoader from "@/components/common/LunarLoader";
import { setVerificationInfoAction } from "@/actions/authAction";

/** 본인인증이 안되었을 시 본인인증 Form */
export default function MissingContactForm() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.authSlice);
  /** 본인인증 정보 */
  const verification = useSelector(
    (state: RootState) => state.verificationSlice
  );

  const [method, setMethod] = useState<TVerificationMethod>("email"); // 방법

  const [step, setStep] = useState<number>(0); // Step

  /** 방법 선택자 */
  const handleTab = (idx: number) => {
    switch (idx) {
      case 1:
        setMethod("phoneNumber");

        break;
      case 0:
      default:
        setMethod("email");

        break;
    }

    setStep(prev => ++prev);
  };

  /** 뒤로가기 클릭 시 */
  const clickBack = (): void => {
    switch (step) {
      case 0:
      default:
        setStep(prev => --prev);
    }
  };

  /** Steps */
  const steps = useMemo(
    () => [
      <div key="verification-method" style={{ marginBottom: 10 }}>
        <VerificationMethodForm onTabSelect={handleTab} />

        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          <button type="button" style={{ display: "flex", columnGap: 5 }}>
            <IconHome width={15} height={15} fill="white" />

            <span>로그아웃</span>
          </button>
        </div>
      </div>,
      <div key="verification-form" style={{ marginBottom: 20 }}>
        <VerificationForm type="signUp" method={method} />
      </div>,
    ],
    [step, method]
  );

  // 인증 여부 변경 시
  useEffect(() => {
    // 인증 완료 시
    if (verification.isVerified) {
      switch (method) {
        case "phoneNumber":
          dispatch(
            setVerificationInfoAction({
              method,
              identification: auth.identification,
              info: verification.phoneNumber!,
            })
          );

          break;
        case "email":
        default:
          dispatch(
            setVerificationInfoAction({
              method,
              identification: auth.identification,
              info: verification.email!,
            })
          );

          break;
      }
    }
  }, [verification.isVerified]);

  return (
    <div>
      <TitleHeader
        title="본인인증"
        back={clickBack}
        style={{ marginBottom: 20 }}
      />

      {!verification.isVerified ? (
        <>
          {steps[step] ?? (
            <div style={{ marginBottom: 10 }}>
              <ErrorBlock />
            </div>
          )}

          {step < steps.length && (
            <DotAndBar progress={step} maxValue={steps.length} />
          )}
        </>
      ) : (
        <LunarLoader
          style={{ marginBottom: 20 }}
          msg={
            <span>
              본인인증이 완료되었습니다.
              <br />
              잠시만 기다려주세요
            </span>
          }
        />
      )}
    </div>
  );
}
