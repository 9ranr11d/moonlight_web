"use client";

import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import { decrementStepAcion, resetTermAction } from "@actions/authAction";

import CSS from "./SignUp.module.css";

import TitleHeader from "@components/common/TitleHeader";
import TermsForm from "@components/auth/signUp/TermsForm";
import AccountForm from "@components/auth/signUp/AccountForm";

/** SignUp 자식 */
interface ISignUpProps {
  /** 회원가입 완료 */
  completed: () => void;
  /** 뒤로가기 */
  back: () => void;
}

/** 회원가입 */
export default function SignUp({ completed, back }: ISignUpProps) {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 회원가입 관련 정보 */
  const step = useSelector((state: RootState) => state.signUpSlice.step);

  /** 단계별 Component */
  const Step = (): React.JSX.Element => {
    switch (step) {
      case 1:
        return <AccountForm />;
      case 0:
      default:
        return <TermsForm />;
    }
  };

  /** 뒤로 가기 클릭 시 */
  const clickBack = (): void => {
    // 회원가입 첫 단계 시
    if (step === 0) {
      back();
      return;
    }

    // 그 왜
    switch (step) {
      case 1:
        dispatch(resetTermAction());

        break;
    }

    dispatch(decrementStepAcion());
  };

  return (
    <div className={CSS.signUpBox} style={{ width: "100%" }}>
      <TitleHeader back={clickBack} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: 15,
        }}
      >
        <Step />
      </div>
    </div>
  );
}
