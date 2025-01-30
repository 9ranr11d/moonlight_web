"use client";

import React, { useState } from "react";

import VisibleBtn from "@components/common/btn/VisibleBtn";

import IconCheck from "@public/svgs/common/icon_check.svg";

/** 현재 상태 표시 Input Interface */
interface IStatusInput {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  type: "text" | "password";
  value: string;
  placeholder: string;
  showIcon: boolean;
  msg?: string | null;
  isErr: boolean;
}

/** 현재 상태 표시 Input */
export default function StatusInput({
  onChange,
  type,
  value,
  placeholder,
  showIcon,
  msg,
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
            left: 10,
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
