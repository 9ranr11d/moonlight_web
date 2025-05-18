"use client";

import React, { useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import CSS from "./Recovery.module.css";

import { AppDispatch, RootState } from "@redux/store";

import { resetVerification } from "@redux/slices/verificationSlice";

import {
  decrementRecoveryStep,
  incrementRecoveryStep,
  resetRecovery,
  setVerificationMethod,
} from "@redux/slices/recoverySlice";

import TitleHeader from "@components/common/TitleHeader";
import HorizontalTabBtns from "@components/common/btn/HorizontalTabBtns";
import ErrorBlock from "@components/common/ErrorBlock";

import Identification from "./Identification";
import Password from "./Password";

import IconHome from "@public/svgs/common/icon_home.svg";

/** ID/PW 찾기 Interface */
interface IRecovery {
  /** 뒤로가기 */
  back: () => void;
}

/** ID/PW 찾기 */
export default function Recovery({ back }: IRecovery) {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const { isVerified } = useSelector(
    (state: RootState) => state.verificationSlice
  ); // 본인인증 여부

  const { step, isChanged } = useSelector(
    (state: RootState) => state.recoverySlice
  ); // ID/PW 찾기 Step

  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(0); // 선택된 Tab

  /** 선택된 Tab 변경 */
  const handleRecoveryTypeTab = (idx: number): void => {
    dispatch(resetVerification());
    dispatch(resetRecovery());

    setSelectedTabIdx(idx);
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
        back();

        break;
    }
  };

  /** Input들 */
  const inputs = useMemo(
    () => [
      <Identification back={back} onTabSelect={handleVerificationMethodTab} />,
      <Password back={back} onTabSelect={handleVerificationMethodTab} />,
    ],
    []
  );

  return (
    <>
      <div className={CSS.recoveryBox} style={{ paddingBottom: 40 }}>
        <TitleHeader
          back={clickBack}
          title="ID / PW 찾기"
          style={{ marginBottom: 20 }}
          rightIcon={
            !(isVerified || isChanged) && (
              <button
                type="button"
                onClick={back}
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
    </>
  );
}
