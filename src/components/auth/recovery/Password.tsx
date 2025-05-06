"use client";

import React, { useMemo, useState } from "react";

import { useSelector } from "react-redux";

import { RootState } from "@redux/store";

import { TVerificationMethod } from "@interfaces/auth";

import CSS from "./Recovery.module.css";

import ErrorBlock from "@components/common/ErrorBlock";
import DotAndBar from "@components/common/indicator/DotAndBar";

import IdCheckForm from "./IdCheckForm";
import VerificationMethodForm from "../verification/VerificationMethodForm";
import VerificationForm from "../verification/VerificationForm";
import ChangePwForm from "./ChangePwForm";

import IconLock from "@public/svgs/common/icon_lock.svg";
import IconHome from "@public/svgs/common/icon_home.svg";

/** 비밀번호 찾기 Interface */
interface IPassword {
  /** 뒤로가기 */
  back: () => void;
  /** 선택 시 */
  onTabSelect: (idx: number) => void;
}

/** 비밀번호 찾기 */
export default function Password({ back, onTabSelect }: IPassword) {
  const { step, isChanged, verificationMethod } = useSelector(
    (state: RootState) => state.recoverySlice
  ); // ID/PW 찾기 관련 정보

  const [identification, setIdentification] = useState<string>(""); // 인증할 아이디

  /** Step별 컴포넌트 */
  const steps = useMemo(
    () => [
      <IdCheckForm saveId={(id: string) => setIdentification(id)} />,
      <div style={{ marginBottom: 10 }}>
        <VerificationMethodForm onTabSelect={onTabSelect} />
      </div>,
      <VerificationForm
        style={{ marginBottom: 10 }}
        type="findPw"
        identification={identification}
        method={verificationMethod as TVerificationMethod}
      />,
      <ChangePwForm identification={identification} />,
    ],
    [step]
  );

  return (
    <div>
      {!isChanged ? (
        <>
          {steps[step] ?? (
            <div style={{ marginBottom: 10 }}>
              <ErrorBlock />
            </div>
          )}

          {step < steps.length && (
            <div className={CSS.indicator}>
              <DotAndBar progress={step} maxValue={steps.length} />
            </div>
          )}
        </>
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
              <IconLock width={30} height={30} fill="white" />
            </span>
          </div>

          <h5 style={{ marginBottom: 10 }}>비밀번호 변경이 완료되었습니다.</h5>

          <p style={{ marginBottom: 25 }}>
            MOONLIGHT의 회원이 되신 것을 환영합니다.
            <br />
            아래 버튼으로 메인 홈에서 로그인 해주세요.
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={back}
              style={{ display: "flex", columnGap: 5 }}
            >
              <IconHome width={15} height={15} fill="white" />

              <span>홈으로 돌아가기</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
