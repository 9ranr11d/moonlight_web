"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/redux/store";

import {
  decrementRecoveryStep,
  incrementRecoveryStep,
  resetRecovery,
  setVerificationMethod,
} from "@/redux/slices/recoverySlice";

import { resetVerification } from "@/redux/slices/verificationSlice";

import TitleHeader from "@/components/common/TitleHeader";

import ErrorBlock from "@/components/common/ErrorBlock";
import HorizontalTabBtns from "@/components/common/btns/HorizontalTabBtns";

import Identification from "@/components/auth/recovery/Identification";
import Password from "@/components/auth/recovery/Password";

import IconHome from "@public/svgs/common/icon_home.svg";

export default function Recovery() {
  /** Router */
  const router = useRouter();

  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const { isVerified } = useSelector(
    (state: RootState) => state.verificationSlice
  ); // 본인인증 여부

  const { step, isChanged } = useSelector(
    (state: RootState) => state.recoverySlice
  ); // ID/PW 찾기 Step

  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(0); // 선택된 Tab

  /** 뒤로가기 */
  const clickBack = () => {
    switch (step) {
      case 3:
        dispatch(decrementRecoveryStep());
        dispatch(decrementRecoveryStep());

        break;
      case 2:
        dispatch(resetVerification());
        dispatch(resetRecovery());

        break;
      case 1:
        dispatch(decrementRecoveryStep());

        break;
      case 0:
      default:
        break;
    }
  };

  /** 선택된 Tab 관리자 */
  const handleVerificationMethodTab = (idx: number): void => {
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

  /** 선택된 Tab 변경 */
  const handleRecoveryTypeTab = (idx: number): void => {
    dispatch(resetVerification());
    dispatch(resetRecovery());

    setSelectedTabIdx(idx);
  };

  /** Input들 */
  const inputs = useMemo(
    () => [
      <Identification
        key="identification"
        onTabSelect={handleVerificationMethodTab}
      />,
      <Password key="password" onTabSelect={handleVerificationMethodTab} />,
    ],
    [handleVerificationMethodTab]
  );

  useEffect(() => {
    dispatch(resetVerification());
    dispatch(resetRecovery());
  }, []);

  return (
    <div className="authBox">
      <div style={{ paddingBottom: 40 }}>
        <TitleHeader
          back={step > 0 ? clickBack : undefined}
          title="ID / PW 찾기"
          style={{ marginBottom: 20 }}
          rightIcon={
            !(isVerified || isChanged) && (
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

        <HorizontalTabBtns
          labelArr={["아이디", "비밀번호"]}
          idx={selectedTabIdx}
          onChange={handleRecoveryTypeTab}
        />

        <div style={{ marginTop: 20 }}>
          {inputs[selectedTabIdx] ?? (
            <div style={{ marginBottom: 10 }}>
              <ErrorBlock />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
