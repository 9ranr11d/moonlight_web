"use client";

import React, { useState } from "react";

import VisibleBtn from "@components/common/btn/VisibleBtn";

import IconCheck from "@public/svgs/common/icon_check.svg";

/** 현재 상태 표시 Input Interface */
interface IStatusInput {
  /** 변경 시  */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /** type */
  type: "text" | "password";
  /** value */
  value: string;
  /** placeholder */
  placeholder: string;
  /** 상태 */
  msg?: string | null;
  /** 비활성화 여부 */
  disabled: boolean;
  /** 유효성 */
  showIcon?: boolean;
  /** 오류 여부 */
  isErr: boolean;
}

/** 현재 상태 표시 Input */
export default function StatusInput({
  onChange,
  type,
  value,
  placeholder,
  msg,
  disabled,
  showIcon,
  isErr,
}: IStatusInput) {
  const [isVisible, setIsVisible] = useState<boolean>(false); // 내용 가시 여부

  /** 가시 여부 버튼 Toggle */
  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <input
        type={type === "password" && !isVisible ? "password" : "text"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          paddingRight: showIcon || type === "password" ? 30 : 10,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          columnGap: 10,
        }}
      >
        {showIcon && (
          <IconCheck width={15} height={15} fill="var(--primary-color)" />
        )}

        {type === "password" && (
          <VisibleBtn onClick={toggleVisibility} isVisible={isVisible} />
        )}
      </div>

      {msg && (
        <p
          style={{
            position: "absolute",
            left: 5,
            paddingTop: 1,
            color: isErr ? "var(--err-color)" : "var(--font-color)",
          }}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
