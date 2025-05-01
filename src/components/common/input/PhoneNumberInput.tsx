"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import CSS from "@components/common/input/Input.module.css";

import DropdownBtn from "@components/common/btn/DropdownBtn";

import FlagKor from "@public/imgs/country_flag/korea.png";
import FlagUsa from "@public/imgs/country_flag/usa.png";

/** 휴대전화 번호 Input Interface */
interface IPhoneInput {
  /** 휴대전화 번호 변경 시 */
  onChange?: (number: string) => void;
  /** 키 클릭 시 */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/** 나라 국가, 나라 전화 코드 Interface */
interface IConuntryCallingCode {
  flag: React.ReactNode;
  code: string;
}

/** 휴대전화 번호 Input */
export default function PhoneNumberInput({ onChange, onKeyDown }: IPhoneInput) {
  /** 나라 코드 Style */
  const countryCallingCodeStyle = { display: "flex", alignItems: "center" };
  /** 나라 국기 Style */
  const flagStyle = { boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)" };

  /** 나라 코드 목록 */
  const countryCallingCodes: IConuntryCallingCode[] = [
    {
      code: "+82",
      flag: <Image src={FlagKor} width={20} style={flagStyle} alt="kor" />,
    },
    {
      code: "+1",
      flag: <Image src={FlagUsa} width={20} style={flagStyle} alt="usa" />,
    },
  ];

  const [number, setNumber] = useState<string>(""); // 휴대전화 번호

  const [conuntryCallingCodeIdx, setCountryCodeIdx] = useState<number>(0); // 선택한 나라 코드 순서

  /** 나라 코드 선택 시 */
  const handleCountryCode = (idx: number): void => {
    setCountryCodeIdx(idx);
  };

  /** 휴대전화 번호 변경 시 */
  const handleNumber = (e: React.ChangeEvent<HTMLInputElement>): void => {
    /** 입력된 값 */
    let value = e.target.value;

    // 첫 시작이 0일 경우 제거
    if (value.startsWith("0")) value = value.slice(1);

    // 숫자만 남기기
    value = value.replace(/\D/g, "");

    setNumber(value);
  };

  // 휴대전화 번호 변경 시
  useEffect(() => {
    onChange?.(`${countryCallingCodes[conuntryCallingCodeIdx].code}${number}`);
  }, [conuntryCallingCodeIdx, number]);

  return (
    <>
      <div className={CSS.inputCover} style={{ position: "relative" }}>
        <input
          type="number"
          value={number}
          onChange={handleNumber}
          onKeyDown={onKeyDown}
          placeholder="-을 빼고 입력해주세요."
          style={{ paddingLeft: 100 }}
        />

        <DropdownBtn
          list={countryCallingCodes.map(({ flag, code }) => (
            <div style={countryCallingCodeStyle}>
              {flag}
              {code}
            </div>
          ))}
          onChange={handleCountryCode}
          style={{ position: "absolute", top: 0, width: 90 }}
        />
      </div>
    </>
  );
}
