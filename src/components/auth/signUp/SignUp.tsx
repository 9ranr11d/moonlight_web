"use client";

import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import CSS from "./SignUp.module.css";

import TitleHeader from "@components/common/TitleHeader";
import TermsForm from "@components/auth/signUp/TermsForm";
import AccountForm from "@components/auth/signUp/AccountForm";
import { decrementStepAcion } from "@actions/authAction";

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

  const clickBack = () => {
    switch (step) {
      case 1:
        dispatch(decrementStepAcion());

        break;
      case 0:
      default:
        back();

        break;
    }
  };

  return (
    <div className={CSS.signUpBox} style={{ width: "100%" }}>
      <TitleHeader back={clickBack} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: 15,
          marginBottom: 30,
        }}
      >
        <Step />
      </div>
    </div>
  );
}
