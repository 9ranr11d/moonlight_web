"use client";

import React, { useState } from "react";

import { isValidPhoneNumber } from "libphonenumber-js";

import PhoneInput from "@components/common/input/PhoneInput";
import LoadingBtn from "@components/common/btn/LoadingBtn";

export default function PhoneForm() {
  const [phoneNumber, setPhoneNumber] = useState<string>(""); // 휴대전화 번호

  const [isSent, setIsSent] = useState<boolean>(false); // 전송 여부

  const handlePhoneNumber = (number: string) => {
    setPhoneNumber(number);
  };

  const clickSendCode = async () => {};

  return (
    <>
      <PhoneInput onChange={handlePhoneNumber} />

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
