"use client";

import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { isValidPhoneNumber } from "libphonenumber-js";

import { AppDispatch, RootState } from "@redux/store";

import { verifyPhoneNumberAction } from "@actions/authAction";

import PhoneNumberInput from "@components/common/input/PhoneNumberInput";
import LoadingBtn from "@components/common/btn/LoadingBtn";

export default function PhoneNumberForm() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 회원가입 정보 */
  const signUp = useSelector((state: RootState) => state.signUpSlice);

  const [phoneNumber, setPhoneNumber] = useState<string>(""); // 휴대전화 번호

  const [isSent, setIsSent] = useState<boolean>(false); // 전송 여부

  const handlePhoneNumber = (number: string) => {
    setPhoneNumber(number);
  };

  const clickSendCode = async () => {
    dispatch(verifyPhoneNumberAction({ phoneNumber }));
  };

  return (
    <>
      <PhoneNumberInput onChange={handlePhoneNumber} />

      <LoadingBtn
        onClick={clickSendCode}
        disabled={!isValidPhoneNumber(phoneNumber)}
        isLoading={isSent}
        lavel="인증 코드 전송"
        style={{ width: "100%" }}
      />
    </>
  );
}
