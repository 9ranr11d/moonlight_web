"use client";

import React, { useMemo } from "react";

import { useRouter } from "next/navigation";

// import dynamic from "next/dynamic";
import Lottie from "lottie-react";

import { useSelector } from "react-redux";

import { RootState } from "@/store";

import { TVerificationMethod } from "@/interfaces/auth";

import VerificationForm from "../verification/VerificationForm";

import LottieLoading from "@public/json/loading_round_black.json";

import DotAndBar from "@/components/common/indicators/DotAndBar";
import ErrorBlock from "@/components/common/ErrorBlock";

import VerificationMethodForm from "../verification/VerificationMethodForm";

import IconHome from "@public/svgs/common/icon_home.svg";

// const LottiePlayer = dynamic(() => import("lottie-react"), {
//   ssr: false,
// });

interface IIdentification {
  /** 선택 시 */
  onTabSelect: (idx: number) => void;
}

/** 아이디 찾기 */
export default function Identification({ onTabSelect }: IIdentification) {
  /** Router */
  const router = useRouter();

  const { isVerified } = useSelector((state: RootState) => state.verification); // 본인인증 여부
  const { step, modifiedId, verificationMethod } = useSelector(
    (state: RootState) => state.recovery
  ); // Step과 가려진 아이디

  /** Steps */
  const steps = useMemo(
    () => [
      <div key="verification-method" style={{ marginBottom: 10 }}>
        <VerificationMethodForm onTabSelect={onTabSelect} />
      </div>,
      <div key="verification-form" style={{ marginBottom: 10 }}>
        <VerificationForm
          type="findId"
          method={verificationMethod as TVerificationMethod}
        />
      </div>,
    ],
    [step, onTabSelect, verificationMethod]
  );

  return (
    <div>
      {!isVerified ? (
        (steps[step] ?? (
          <div style={{ marginBottom: 10 }}>
            <ErrorBlock />
          </div>
        ))
      ) : (
        <div>
          <p style={{ textAlign: "center" }}>본인 확인이 완료되었습니다.</p>

          <p style={{ textAlign: "center" }}>
            확인된 회원님의 아이디는 아래와 같습니다.
          </p>

          <div
            style={{
              background: "var(--gray-50)",
              padding: "20px 10px",
              borderRadius: 3,
              margin: "10px 0px 20px",
            }}
          >
            <h4 style={{ textAlign: "center", color: "var(--primary-color)" }}>
              {modifiedId || (
                <span style={{ display: "flex", justifyContent: "center" }}>
                  <Lottie
                    loop
                    animationData={LottieLoading}
                    style={{ width: 28, height: 28 }}
                  />
                </span>
              )}
            </h4>
          </div>

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
        </div>
      )}

      {step < steps.length && (
        <DotAndBar progress={step} maxValue={steps.length} />
      )}
    </div>
  );
}
