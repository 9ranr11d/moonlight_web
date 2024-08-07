"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import Lottie from "lottie-react";

import { convertToMinutes, errMsg } from "@utils/utils";

import CSS from "./Recovery.module.css";

import LottieLoading from "@public/json/loading_1.json";

import IconBack from "@public/img/common/icon_less_than_black.svg";
import IconCheck from "@public/img/common/icon_check_primary.svg";

/** EmailSender 자식 */
interface IEmailSenderProps {
  /** 인증 된 E-mail 반환 */
  verified: (email: string) => void;
  /** Identification 자동 포커스 할 지 */
  isAutoFocus: boolean;
}

/** Password 자식 */
interface IPasswordProps {
  /** 뒤로가기 */
  back: () => void;
}

/** Recovery 자식 */
interface IRecoveryProps {
  /** 뒤로가기 */
  back: () => void;
}

/** E-mail 인증 */
const EmailSender = ({ verified, isAutoFocus }: IEmailSenderProps) => {
  /** 인증코드 입력 제한시간 최대값 */
  const maxDeadline: number = 600;

  /** E-mail 아이디 부분 Input Ref */
  const identificationInputRef = useRef<HTMLInputElement>(null);
  /** 인증코드 입력 Input Ref */
  const verificationCodeInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState<string>(""); // 입력된 E-mail
  const [verificationCode, setVerificationCode] = useState<string>(""); // 인증코드
  const [verificationInput, setVerificationInput] = useState<string>(""); // 입력 받은 인증코드

  const [isEmailSent, setIsEmailSent] = useState<boolean>(false); // 인증코드 발송 여부
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false); // 유효한 E-mail인지 판단하고, 유효할 시 인증코드 발송을 했는지

  const [deadline, setDeadline] = useState<number>(0); // 인증코드 입력 제한시간

  useEffect(() => {
    if (isAutoFocus && identificationInputRef.current) identificationInputRef.current.focus();
  }, [isAutoFocus]);

  // 인증코드 입력 제한시간 감소
  useEffect(() => {
    let timerId: any;

    deadline > 0 ? (timerId = setTimeout(() => setDeadline((prev) => prev - 1), 1000)) : clearTimeout(timerId);

    return () => {
      clearTimeout(timerId);
    };
  }, [deadline]);

  useEffect(() => {
    if (isEmailSent && verificationCodeInputRef.current) verificationCodeInputRef.current.focus();
  }, [isEmailSent]);

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

  /** 인증코드 Input */
  const handleVerificationInput = (e: any): void => {
    setVerificationInput(e.target.value);
  };

  /** 인증코드 Input에서 'Enter'를 누를 시 */
  const handleVerificationInputKeyDown = (e: any): void => {
    if (e.key === "Enter") checkVerificationCode();
  };

  /** 인증코드가 유효한지 확인 */
  const checkVerificationCode = (): void => {
    if (verificationInput === verificationCode) {
      if (deadline > 0) {
        alert("인증되었습니다.");

        verified(email);
      } else alert("제한 시간이 초과되었습니다.");
    } else alert("인증코드가 잘못되었습니다.");
  };

  /** DB에 등록 되어있는 E-mail인지 확인 */
  const verifyMatch = (): void => {
    setIsEmailSent(false);
    setIsVerifyingEmail(true);

    const data: { email: string } = { email };

    fetch("/api/auth/verify_user_info_match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) return res.json();

        if (res.status === 404) {
          alert("유효한 이메일이 아닙니다.");

          setIsVerifyingEmail(false);
        }

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        sendEmail();
      })
      .catch((err) => console.error("Error in /src/components/auth/Recovery > EmailSender() > verifyMatch() :", err));
  };

  /** 인증코드 전송 */
  const sendEmail = (): void => {
    const data: { email: string } = { email };

    fetch("/api/auth/email_verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) return res.json();

        alert(errMsg);

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        setVerificationCode(data.verificationCode);
        setIsVerifyingEmail(false);
        setIsEmailSent(true);
        setDeadline(maxDeadline);
      })
      .catch((err) => console.error("Error in /src/components/auth/Recovery > EmailSender() > sendEmail() :", err));
  };

  return (
    <>
      <h5>본인확인 이메일로 인증</h5>

      <ul>
        <li>
          <ul>
            <li>
              <h6>이메일</h6>
            </li>

            <li>
              <input type="text" value={email} onChange={handleEmail} ref={identificationInputRef} onKeyDown={handleEmailKeyDown} placeholder="E-mail" />
            </li>

            <li>
              {isVerifyingEmail ? (
                <div className={CSS.loadingBox}>
                  <Lottie animationData={LottieLoading} style={{ width: 24 }} />
                </div>
              ) : (
                <button type="button" onClick={verifyMatch}>
                  {isEmailSent ? "재전송" : "전송"}
                </button>
              )}
            </li>
          </ul>
        </li>

        {isEmailSent && (
          <li>
            <ul>
              <li>
                <h6>인증코드</h6>
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
};

/** Identification 찾기 */
const Identification = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false); // E-mail 인증 여부

  const [identification, setIdentification] = useState<string>(""); // 찾으려는 Identification

  /**
   * 입력받은 E-mail과 부합하는 Identification 찾기
   * @param email E-mail
   */
  const getUserIdentification = (email: string): void => {
    const data = { email };

    fetch("/api/auth/get_user_id_by_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) return res.json();

        if (res.status === 404) alert("존재하지 않는 아이디입니다.");
        else alert(errMsg);

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        setIdentification(data.identification);
        setIsVerified(true);
      })
      .catch((err) => console.error("Error in /src/components/auth/Recovery > Identification() > getUserIdentification() :", err));
  };

  return (
    <>
      {!isVerified ? (
        <EmailSender verified={(email) => getUserIdentification(email)} isAutoFocus={false} />
      ) : (
        <div>
          <h4>찾으시는 아이디는</h4>
          <h2>『 {identification} 』</h2>
          <h4>입니다.</h4>
        </div>
      )}
    </>
  );
};

/** Password 찾기 */
const Password = ({ back }: IPasswordProps) => {
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [isAuth, setIsAuth] = useState<boolean>(false); // Identification 인증 여부
  const [isEmailMatching, setIsEmailMatching] = useState<boolean>(false); // 입력 받은 E-mail과 DB 속 해당 Identification의 E-mail 일치 여부
  const [isPasswordMatching, setIsPwMatching] = useState<boolean>(false); // 새로 만들 Password랑 Password 확인 일치 여부

  const [identification, setIdentification] = useState<string>(""); // 인증할 Identification
  const [userEmail, setUserEmail] = useState<string>(""); // 입력 받은 E-mail
  const [password, setPassword] = useState<string>(""); // 새로 만들 Password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // 새로 만들 Password 확인

  useEffect(() => {
    if (isEmailMatching && passwordInputRef.current) passwordInputRef.current.focus();
  }, [isEmailMatching]);

  // Password랑 Password 확인 일치 여부 판단
  useEffect(() => {
    if (password.length > 0 && password === confirmPassword) setIsPwMatching(true);
    else setIsPwMatching(false);
  }, [password, confirmPassword]);

  /** Identification Input */
  const handleIdentification = (e: any): void => {
    setIdentification(e.target.value);
  };

  /** Identification Input에서 'Enter'를 누를 시 */
  const handleIdentificationKeyDown = (e: any): void => {
    if (e.key === "Enter") checkIdentification();
  };

  /** Password Input */
  const handlePassword = (e: any): void => {
    setPassword(e.target.value);
  };

  /** Password 확인 Input */
  const handleConfirmPw = (e: any): void => {
    setConfirmPassword(e.target.value);
  };

  /** Password 확인 Input에서 'Enter'를 누를 시 */
  const handleConfirmPwKeyDown = (e: any): void => {
    if (e.key === "Enter") changePassword();
  };

  /**
   * 입력 받은 E-mail과 DB 속 해당 Identification의 E-mail 일치 여부 판단
   * @param email E-mail
   */
  const checkEmail = (email: string): void => {
    if (email === userEmail) setIsEmailMatching(true);
    else alert("이메일이 일치하지 않습니다.");
  };

  /** Identification 인증 */
  const checkIdentification = (): void => {
    const data = { identification };

    fetch("/api/auth/check_id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) return res.json();

        if (res.status === 404) alert("존재하지 않는 아이디입니다.");
        else alert(errMsg);

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        setIdentification(data.identification);
        setUserEmail(data.email);
        setIsAuth(true);
      })
      .catch((err) => console.error("Error in /src/components/auth/Recovery > Password() > checkIdentification() :", err));
  };

  /** 비밀번호 변경 */
  const changePassword = (): void => {
    const data = { identification, password };

    fetch("/api/auth/change_pw", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) return res.json();

        if (res.status === 404) alert("존재하지 않는 아이디입니다.");
        else alert(errMsg);

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        alert("비밀번호가 성공적으로 바뀌었습니다.");

        back();
      })
      .catch((err) => console.error("Error in /src/components/auth/Recovery > Password() > changePassword() :", err));
  };

  return (
    <>
      {!isAuth ? (
        <>
          <h5 className={CSS.nonMobile}>비밀번호를 찾고자하는 아이디를 입력해주세요.</h5>
          <h5 className={CSS.mobile}>
            비밀전호를 찾고자하는
            <br />
            아이디를 입력해주세요.
          </h5>

          <ul>
            <li>
              <ul>
                <li>
                  <h6>아이디</h6>
                </li>

                <li>
                  <input
                    type="text"
                    value={identification}
                    onChange={handleIdentification}
                    onKeyDown={handleIdentificationKeyDown}
                    placeholder="Identification"
                  />
                </li>

                <li>
                  <button type="button" onClick={checkIdentification}>
                    확인
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </>
      ) : !isEmailMatching ? (
        <EmailSender verified={(email) => checkEmail(email)} isAutoFocus={true} />
      ) : (
        <>
          <h5>바꿀 비밀번호를 입력</h5>

          <ul>
            <li>
              <ul>
                <li>
                  <h6>비밀번호</h6>
                </li>

                <li>
                  <input type="password" value={password} onChange={handlePassword} ref={passwordInputRef} placeholder="Password" />
                </li>
              </ul>
            </li>

            <li>
              <ul>
                <li>
                  <h6>비밀번호 재확인</h6>
                </li>

                <li>
                  <input type="password" value={confirmPassword} onChange={handleConfirmPw} onKeyDown={handleConfirmPwKeyDown} placeholder="Confirm Password" />

                  {isPasswordMatching && (
                    <span>
                      <Image src={IconCheck} width={20} height={20} alt="√" />
                    </span>
                  )}
                </li>
              </ul>
            </li>

            <li>
              <button type="button" onClick={changePassword} disabled={!isPasswordMatching}>
                확인
              </button>
            </li>
          </ul>
        </>
      )}
    </>
  );
};

/** ID/PW 찾기 */
export default function Recovery({ back }: IRecoveryProps) {
  const [isIdRecovery, setIsIdRecovery] = useState<boolean>(true); // Identification 찾기 인지 여부

  /** 뒤로가기 */
  const goBack = () => {
    back();
  };

  /** Identification 찾기 클릭 */
  const identificationRecovery = () => {
    setIsIdRecovery(true);
  };

  /** Password 찾기 클릭 */
  const passwordRecovery = () => {
    setIsIdRecovery(false);
  };

  return (
    <>
      <div className={CSS.recoveryBox}>
        <div className={CSS.header}>
          <button type="button" onClick={goBack}>
            <Image src={IconBack} width={24} height={24} alt="◀" />
          </button>

          <h3>ID / PW 찾기</h3>
        </div>

        <div className={CSS.tapBox}>
          <button type="button" onClick={identificationRecovery} disabled={isIdRecovery}>
            Identification
          </button>

          <button type="button" onClick={passwordRecovery} disabled={!isIdRecovery}>
            Password
          </button>
        </div>

        <div className={CSS.content}>{isIdRecovery ? <Identification /> : <Password back={goBack} />}</div>
      </div>
    </>
  );
}
