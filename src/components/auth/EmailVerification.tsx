"use client";

import React, { useEffect, useRef, useState } from "react";

import Lottie from "lottie-react";

import CSS from "./Recovery.module.css";

import { ERR_MSG } from "@constants/msg";
import { convertToMinutes } from "@utils/index";

import LottieLoading from "@public/json/loading_round_white.json";

/** EmailVerification 자식 */
interface IEmailVerificationProps {
  /** 제목 */
  title: string;
  /** Identification 자동 포커스 할 지 */
  isAutoFocus: boolean;
  /** 입력한 E-mail을 DB에 있는 지 체크할 지 */
  isEmailCheckEnabled: boolean;
  /** 선 입력 E-mail */
  inputEmail?: string;

  /** 인증 된 E-mail 반환 */
  verified: (email: string) => void;
}

/** E-mail 인증 */
export default function EmailVerification({ title, isAutoFocus, isEmailCheckEnabled, inputEmail, verified }: IEmailVerificationProps) {
  /** 인증 코드 입력 제한시간 최대값 */
  const maxDeadline: number = 600;

  /** E-mail 아이디 부분 Input Ref */
  const emailInputRef = useRef<HTMLInputElement>(null);
  /** 인증 코드 입력 Input Ref */
  const verificationCodeInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState<string>(inputEmail || ""); // 입력된 E-mail
  const [verificationCode, setVerificationCode] = useState<string>(""); // 인증 코드
  const [verificationInput, setVerificationInput] = useState<string>(""); // 입력 받은 인증 코드

  const [isEmailSent, setIsEmailSent] = useState<boolean>(false); // 인증 코드 발송 여부
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false); // 유효한 E-mail인지 판단하고, 유효할 시 인증 코드 발송을 했는지

  const [deadline, setDeadline] = useState<number>(0); // 인증 코드 입력 제한시간

  // '아이디' 텍스트 입력 필드로 포커스
  useEffect(() => {
    if (isAutoFocus && emailInputRef.current) emailInputRef.current.focus();
  }, [isAutoFocus]);

  // 인증 코드 입력 제한시간 감소
  useEffect(() => {
    let timerId: any;

    deadline > 0 ? (timerId = setTimeout(() => setDeadline(prev => prev - 1), 1000)) : clearTimeout(timerId);

    return () => {
      clearTimeout(timerId);
    };
  }, [deadline]);

  // 인증 E-mail 전송 시 인증 코드 텍스트 입력 필드로 포커스
  useEffect(() => {
    if (isEmailSent && verificationCodeInputRef.current) verificationCodeInputRef.current.focus();
  }, [isEmailSent]);

  useEffect(() => {
    if (inputEmail) verifyMatch();
  }, [inputEmail]);

  /** E-mail Input */
  const handleEmail = (e: any): void => {
    setIsEmailSent(false);
    setVerificationCode("");
    setVerificationInput("");
    setEmail(e.target.value);
  };

  /** Email에서 'Enter'를 누를 시 */
  const handleEmailKeyDown = (e: any): void => {
    if (e.key === "Enter") verifyMatch();
  };

  /** 인증 코드 Input */
  const handleVerificationInput = (e: any): void => {
    setVerificationInput(e.target.value);
  };

  /** 인증 코드 Input에서 'Enter'를 누를 시 */
  const handleVerificationInputKeyDown = (e: any): void => {
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

  /** DB에 등록 되어있는 E-mail인지 확인 */
  const verifyMatch = (): void => {
    setIsEmailSent(false);
    setIsVerifyingEmail(true);

    if (isEmailCheckEnabled) {
      const data: { email: string } = { email };

      fetch("/api/auth/verify_user_info_match", {
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
        .catch(err => console.error("/src/components/auth/Recovery > EmailSender() > verifyMatch()에서 오류가 발생했습니다. :", err));
    } else sendEmail();
  };

  /** 인증 코드 전송 */
  const sendEmail = (): void => {
    const data: { email: string } = { email };

    fetch("/api/auth/email_verification", {
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
      .catch(err => console.error("/src/components/auth/Recovery > EmailSender() > sendEmail()에서 오류가 발생했습니다. :", err));
  };

  return (
    <>
      <h5>{title}</h5>

      <ul className={CSS.email}>
        <li>
          <ul>
            <li>
              <h6>이메일</h6>
            </li>

            <li>
              <input
                type="text"
                value={email}
                onChange={handleEmail}
                ref={emailInputRef}
                onKeyDown={handleEmailKeyDown}
                placeholder="E-mail"
                disabled={!!inputEmail}
              />
            </li>

            <li style={{ display: "flex", justifyContent: "center" }}>
              <button type="button" onClick={verifyMatch} style={{ position: "relative" }}>
                {isVerifyingEmail ? (
                  <>
                    <Lottie
                      animationData={LottieLoading}
                      style={{ width: 24, height: 24, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                    />
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

                <span>{convertToMinutes(deadline)}</span>
              </li>

              <li>
                <button type="button" onClick={checkVerificationCode} disabled={deadline === 0}>
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
