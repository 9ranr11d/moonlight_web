"use client";

import React, { useEffect, useRef, useState } from "react";

// import Lottie from "react-lottie-player";

import CSS from "./recovery/Recovery.module.css";

import { ERR_MSG } from "@constants/msg";
import { formatTime } from "@utils/index";

import LottieLoading from "@public/json/loading_round_white.json";

/** EmailVerification 자식 */
interface IEmailVerificationProps {
  /** 제목 */
  title: string;
  /** 아이디 자동 포커스 할 지 */
  isAutoFocus: boolean;
  /** 입력한 Email을 DB에 있는 지 체크할 지 */
  isEmailCheckEnabled: boolean;
  /** 선 입력 Email */
  inputEmail?: string;

  /** 인증 된 Email 반환 */
  verified: (email: string) => void;
}

/** Email 인증 */
export default function EmailVerification({
  title,
  isAutoFocus,
  isEmailCheckEnabled,
  inputEmail,
  verified,
}: IEmailVerificationProps) {
  /** 인증 코드 입력 제한시간 최대값 */
  const maxDeadline: number = 600;

  /** Email 아이디 부분 Input Ref */
  const emailInputRef = useRef<HTMLInputElement>(null);
  /** 인증 코드 입력 Input Ref */
  const verificationCodeInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState<string>(inputEmail || ""); // 입력된 Email
  const [verificationCode, setVerificationCode] = useState<string>(""); // 인증 코드
  const [verificationInput, setVerificationInput] = useState<string>(""); // 입력 받은 인증 코드

  const [isEmailSent, setIsEmailSent] = useState<boolean>(false); // 인증 코드 발송 여부
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false); // 유효한 Email인지 판단하고, 유효할 시 인증 코드 발송을 했는지

  const [deadline, setDeadline] = useState<number>(0); // 인증 코드 입력 제한시간

  /** DB에 등록 되어있는 Email인지 확인 */
  const verifyMatch = (): void => {
    setIsEmailSent(false);
    setIsVerifyingEmail(true);

    if (isEmailCheckEnabled) {
      const data: { email: string } = { email };

      fetch("/api/auth/verify-user-info-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(res => {
          if (res.ok) return res.json();

          if (res.status === 404) {
            alert("유효한 이메일이 아닙니다.");

            setIsVerifyingEmail(false);
          }

          return res.json().then(data => Promise.reject(data.msg));
        })
        .then(data => {
          console.log(data.msg);

          sendEmail();
        })
        .catch(err =>
          console.error(
            "/src/components/auth/Recovery > EmailSender() > verifyMatch() :",
            err
          )
        );
    } else sendEmail();
  };

  /** 인증 코드 전송 */
  const sendEmail = (): void => {
    const data: { email: string } = { email };

    fetch("/api/auth/email-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        setVerificationCode(data.verificationCode);
        setIsVerifyingEmail(false);
        setIsEmailSent(true);
        setDeadline(maxDeadline);
      })
      .catch(err =>
        console.error(
          "/src/components/auth/Recovery > EmailSender() > sendEmail() :",
          err
        )
      );
  };

  /** Email Input */
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIsEmailSent(false);
    setVerificationCode("");
    setVerificationInput("");
    setEmail(e.target.value);
  };

  /** Email에서 'Enter'를 누를 시 */
  const handleEmailKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter") verifyMatch();
  };

  /** 인증 코드 Input */
  const handleVerificationInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setVerificationInput(e.target.value);
  };

  /** 인증 코드 Input에서 'Enter'를 누를 시 */
  const handleVerificationInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter") checkVerificationCode();
  };

  /** 인증 코드가 유효한지 확인 */
  const checkVerificationCode = (): void => {
    if (verificationInput === verificationCode) {
      if (deadline > 0) {
        alert("인증되었습니다.");

        verified(email);
      } else alert("제한 시간이 초과되었습니다.");
    } else alert("인증 코드가 잘못되었습니다.");
  };

  // '아이디' 텍스트 입력 필드로 포커스
  useEffect(() => {
    if (isAutoFocus && emailInputRef.current) emailInputRef.current.focus();
  }, [isAutoFocus]);

  // 인증 코드 입력 제한시간 감소
  useEffect(() => {
    let timerId: any;

    deadline > 0
      ? (timerId = setTimeout(() => setDeadline(prev => prev - 1), 1000))
      : clearTimeout(timerId);

    return () => {
      clearTimeout(timerId);
    };
  }, [deadline]);

  // 인증 Email 전송 시 인증 코드 텍스트 입력 필드로 포커스
  useEffect(() => {
    if (isEmailSent && verificationCodeInputRef.current)
      verificationCodeInputRef.current.focus();
  }, [isEmailSent]);

  useEffect(() => {
    if (inputEmail) verifyMatch();
  }, [inputEmail]);

  return (
    <>
      <h5>{title}</h5>

      <ul className={CSS.email}>
        <li>
          <ul>
            <li>
              <h6>Email</h6>
            </li>

            <li>
              <input
                type="text"
                value={email}
                onChange={handleEmail}
                ref={emailInputRef}
                onKeyDown={handleEmailKeyDown}
                placeholder="Email"
                disabled={!!inputEmail}
              />
            </li>

            <li style={{ display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                onClick={verifyMatch}
                style={{ position: "relative" }}
              >
                {isVerifyingEmail ? (
                  <>
                    {/* <Lottie
                      animationData={LottieLoading}
                      style={{ width: 24, height: 24, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                    /> */}
                    &nbsp;
                  </>
                ) : (
                  <p>{isEmailSent ? "재전송" : "전송"}</p>
                )}
              </button>
            </li>
          </ul>
        </li>

        {isEmailSent && (
          <li>
            <ul>
              <li>
                <h6>인증 코드</h6>
              </li>

              <li>
                <input
                  type="text"
                  value={verificationInput}
                  onChange={handleVerificationInput}
                  ref={verificationCodeInputRef}
                  onKeyDown={handleVerificationInputKeyDown}
                  placeholder="Verification Code"
                />

                <span>{formatTime(deadline)}</span>
              </li>

              <li>
                <button
                  type="button"
                  onClick={checkVerificationCode}
                  disabled={deadline === 0}
                >
                  확인
                </button>
              </li>
            </ul>
          </li>
        )}
      </ul>
    </>
  );
}
