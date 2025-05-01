"use client";

import React, { useEffect, useState } from "react";

import { formatTime } from "@utils/index";

import StatusInput from "@components/common/input/StatusInput";

/** 인증 Input Interface */
interface IVerificationInput {
  /** 재전송 클릭 시 */
  onClickResendCode?: () => void;
  /** 코드 변경 시 */
  onChange?: (code: string) => void;
  /** 키 누를 시 */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  /** 남은 시간 */
  timeLeft?: number;
  /** Message */
  msg?: string | null;
}

/** 인증 Input */
export default function VerificationInput({
  onClickResendCode,
  onChange,
  onKeyDown,
  timeLeft = 300,
  msg,
}: IVerificationInput) {
  const [code, setCode] = useState<string>(""); // 인증 코드

  const [remainingTime, setRemainingTime] = useState<number>(timeLeft); // 남은 시간

  /** 인증 코드 Input 관리 */
  const handleCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCode(e.target.value);
  };

  const clickResendCode = () => {
    setRemainingTime(timeLeft);

    onClickResendCode?.();
  };

  // 남은 시간 변경 시
  useEffect(() => {
    // 1초씩 감소
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  // 입력된 코드 변경 시
  useEffect(() => {
    onChange?.(code);
  }, [code]);

  return (
    <div>
      <div style={{ display: "flex", columnGap: 5 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <StatusInput
            type="text"
            value={code}
            onChange={handleCode}
            onKeyDown={onKeyDown}
            placeholder="인증코드를 입력해주세요."
            disabled={timeLeft === 0}
            isErr={true}
            msg={timeLeft === 0 ? "인증 시간이 만료되었습니다." : msg}
          />

          <p
            style={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
              color: "var(--err-color)",
            }}
          >
            {formatTime(remainingTime)}
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={clickResendCode}
            style={{ whiteSpace: "nowrap" }}
          >
            재전송
          </button>
        </div>
      </div>
    </div>
  );
}
