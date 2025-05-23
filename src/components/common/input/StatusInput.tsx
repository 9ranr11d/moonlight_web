"use client";

import React, { useState } from "react";

import VisibleBtn from "@components/common/btn/VisibleBtn";

import IconCheck from "@public/svgs/common/icon_check.svg";

/** 현재 상태 표시 Input Interface */
interface IStatusInput {
  /** 변경 시  */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 키 누를 시 */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  /** Type */
  type: "text" | "password";
  /** Value */
  value: string;
  /** Placeholder */
  placeholder: string;
  /** 상태 */
  msg?: string | null;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 유효성 */
  showIcon?: boolean;
  /** 오류 여부 */
  isErr?: boolean;
}

/** 현재 상태 표시 Input */
export default function StatusInput({
  onChange,
  onKeyDown,
  type,
  value,
  placeholder,
  msg,
  disabled = false,
  showIcon,
  isErr = false,
}: IStatusInput) {
  const [isVisible, setIsVisible] = useState<boolean>(false); // 내용 가시 여부

  /** 가시 여부 버튼 Toggle */
  const toggleVisibility = (): void => {
    setIsVisible(prev => !prev);
  };

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <input
        type={type === "password" && !isVisible ? "password" : "text"}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
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
