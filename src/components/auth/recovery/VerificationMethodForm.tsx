"use client";

import React from "react";

import { useDispatch } from "react-redux";

import { AppDispatch } from "@redux/store";

import {
  incrementRecoveryStep,
  setVerificationMethod,
} from "@redux/slices/recoverySlice";

import DirectionTabBtns from "@components/common/btn/DirectionTabBtns";

import IconGreaterThen from "@public/svgs/common/icon_greater_than.svg";

/** 아이디 찾기의 본인인증 방법 탭 Style */
const findIdTabBtnsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "15px 20px",
};

/** 본인인증 방법 선택 Form */
export default function VerificationMethodForm() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 선택된 Tab 관리자 */
  const handleTab = (idx: number): void => {
    switch (idx) {
      case 1:
        dispatch(setVerificationMethod("phoneNumber"));

        break;
      case 0:
      default:
        dispatch(setVerificationMethod("email"));

        break;
    }

    dispatch(incrementRecoveryStep());
  };

  return (
    <div>
      <h6
        style={{
          textAlign: "left",
          marginBottom: 1,
          borderBottom: "1px solid var(--gray-100)",
          paddingBottom: 15,
        }}
      >
        본인인증 방법을 선택해주세요.
      </h6>

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
      />
    </div>
  );
}
