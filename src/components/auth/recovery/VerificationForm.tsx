"use client";

import React, { useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import { incrementRecoveryStep } from "@redux/slices/recoverySlice";

import DirectionTabBtns from "@components/common/btn/DirectionTabBtns";
import ErrorBlock from "@components/common/ErrorBlock";

import EmailForm from "@components/auth/verification/EmailForm";
import PhoneNumberForm from "@components/auth/verification/PhoneNumberForm";

import IconGreaterThen from "@public/svgs/common/icon_greater_than.svg";

/** 아이디 찾기의 본인인증 방법 탭 Style */
const findIdTabBtnsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "15px 20px",
};

/** 본인인증 Form */
export default function VerificationForm() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const { step } = useSelector((state: RootState) => state.recoverySlice); // ID/PW 찾기 Step

  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(0); // 선택된 Tab

  /** 선택된 Tab 변경 */
  const handleTab = (idx: number): void => {
    setSelectedTabIdx(idx);

    dispatch(incrementRecoveryStep());
  };

  /** Input들 */
  const inputs = useMemo(
    () => [<EmailForm type="findId" />, <PhoneNumberForm type="findId" />],
    []
  );

  const steps = useMemo(
    () => [
      <DirectionTabBtns
        labelArr={[
          <div style={findIdTabBtnsStyle}>
            <h6>Email</h6>

            <span>
              <IconGreaterThen width={18} height={18} fill="black" />
            </span>
          </div>,
          <div style={findIdTabBtnsStyle}>
            <h6>휴대전화 번호</h6>

            <span>
              <IconGreaterThen width={18} height={18} fill="black" />
            </span>
          </div>,
        ]}
        direction="column"
        onChange={handleTab}
      />,
      <div>
        {inputs[selectedTabIdx] ?? (
          <div style={{ marginBottom: 10 }}>
            <ErrorBlock />
          </div>
        )}
      </div>,
    ],
    [step, inputs, selectedTabIdx]
  );

  return (
    <div>
      {steps[step] ?? (
        <div style={{ marginBottom: 10 }}>
          <ErrorBlock />
        </div>
      )}
    </div>
  );
}
