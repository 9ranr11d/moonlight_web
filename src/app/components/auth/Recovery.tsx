"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import { convertToMinutes } from "src/utils/utils";

import CSS from "./Recovery.module.css";

import IconBack from "@public/img/common/icon_less_than_black.svg";
import IconCheck from "@public/img/common/icon_check_round_main.svg";

/** EmailSender 자식 */
interface IEmailSenderProps {
  /** 인증 된 E-mail 반환 */
  verified: (email: string) => void;
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
const EmailSender = ({ verified }: IEmailSenderProps) => {
  /** 인증코드 입력 제한시간 최대값 */
  const maxDeadline: number = 600;

  const [email, setEmail] = useState<string>(""); // 입력된 E-mail
  const [verificationCode, setVerificationCode] = useState<string>(""); // 인증코드
  const [verificationInput, setVerificationInput] = useState<string>(""); // 입력 받은 인증코드

  const [isEmailSent, setIsEmailSent] = useState<boolean>(false); // 인증코드 발송 여부

  const [deadline, setDeadline] = useState<number>(0); // 인증코드 입력 제한시간

  // 인증코드 입력 제한시간 감소
  useEffect(() => {
    let timerId: any;

    deadline > 0 ? (timerId = setTimeout(() => setDeadline((prev) => prev - 1), 1000)) : clearTimeout(timerId);

    return () => {
      clearTimeout(timerId);
    };
  }, [deadline]);

  /** Input E-mail */
  const handleEmail = (e: any): void => {
    setIsEmailSent(false);
    setVerificationCode("");
    setVerificationInput("");
    setEmail(e.target.value);
  };

  /** Input 인증코드 */
  const handleVerificationInput = (e: any): void => {
    setVerificationInput(e.target.value);
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
    const data: { email: string } = { email };

    fetch("/api/auth/verify_user_info_match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        sendEmail();
      })
      .catch((err) => console.error("Verify Match :", err));
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

        alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        setVerificationCode(data.verificationCode);
        setIsEmailSent(true);
        setDeadline(maxDeadline);
      })
      .catch((err) => console.error("Send Email :", err));
  };

  return (
    <>
      <h5>본인확인 이메일로 인증</h5>

      <table>
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "70%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>

        <tbody>
          <tr>
            <th>이메일</th>
            <td>
              <input type="text" value={email} onChange={handleEmail} placeholder="E-mail" />
            </td>
            <td>
              <button type="button" onClick={verifyMatch}>
                {isEmailSent ? "재전송" : "전송"}
              </button>
            </td>
          </tr>

          {isEmailSent && (
            <tr>
              <th>인증코드</th>
              <td>
                <input type="text" value={verificationInput} onChange={handleVerificationInput} placeholder="Verification Code" />

                <span>{convertToMinutes(deadline)}</span>
              </td>
              <td>
                <button type="button" onClick={checkVerificationCode} disabled={deadline === 0}>
                  확인
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
        else if (res.status === 404) alert("존재하지 않는 아이디입니다.");
        else alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        setIdentification(data.identification);
        setIsVerified(true);
      })
      .catch((err) => console.error("Get User Identification :", err));
  };

  return (
    <>
      {!isVerified ? (
        <EmailSender verified={(email) => getUserIdentification(email)} />
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
  const [isAuth, setIsAuth] = useState<boolean>(false); // Identification 인증 여부
  const [isEmailMatching, setIsEmailMatching] = useState<boolean>(false); // 입력 받은 E-mail과 DB 속 해당 Identification의 E-mail 일치 여부
  const [isPasswordMatching, setIsPwMatching] = useState<boolean>(false); // 새로 만들 Password랑 Password 확인 일치 여부

  const [identification, setIdentification] = useState<string>(""); // 인증할 Identification
  const [userEmail, setUserEmail] = useState<string>(""); // 입력 받은 E-mail
  const [password, setPassword] = useState<string>(""); // 새로 만들 Password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // 새로 만들 Password 확인

  // Password랑 Password 확인 일치 여부 판단
  useEffect(() => {
    if (password.length > 0 && password === confirmPassword) setIsPwMatching(true);
    else setIsPwMatching(false);
  }, [password, confirmPassword]);

  /** Input Password */
  const handlePassword = (e: any): void => {
    setPassword(e.target.value);
  };

  /** Input Password 확인 */
  const handleConfirmPw = (e: any): void => {
    setConfirmPassword(e.target.value);
  };

  /** Input Identification */
  const handleIdentification = (e: any): void => {
    setIdentification(e.target.value);
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
        else if (res.status === 404) alert("존재하지 않는 아이디입니다.");
        else alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        setIdentification(data.identification);
        setUserEmail(data.email);
        setIsAuth(true);
      })
      .catch((err) => console.error("Check Identification :", err));
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
        else if (res.status === 404) alert("존재하지 않는 아이디입니다.");
        else alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        back();
      })
      .catch((err) => console.error("Chage Password :", err));
  };

  return (
    <>
      {!isAuth ? (
        <>
          <h5>비밀번호를 찾고자하는 아이디를 입력</h5>

          <table>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "70%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>

            <tbody>
              <tr>
                <th>아이디</th>
                <td>
                  <input type="text" value={identification} onChange={handleIdentification} placeholder="Identification" />
                </td>
                <td>
                  <button type="button" onClick={checkIdentification}>
                    확인
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ) : !isEmailMatching ? (
        <EmailSender verified={(email) => checkEmail(email)} />
      ) : (
        <>
          <h5>바꿀 비밀번호를 입력</h5>

          <table>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "90%" }} />
            </colgroup>

            <tbody>
              <tr>
                <th>비밀번호</th>
                <td>
                  <input type="password" value={password} onChange={handlePassword} placeholder="Password" />
                </td>
              </tr>

              <tr>
                <th>
                  비밀번호
                  <br />
                  재확인
                </th>
                <td>
                  <input type="password" value={confirmPassword} onChange={handleConfirmPw} placeholder="Confirm Password" />

                  {isPasswordMatching && (
                    <span>
                      <Image src={IconCheck} width={20} height={20} alt="√" />
                    </span>
                  )}
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <button type="button" onClick={changePassword} disabled={!isPasswordMatching}>
                    확인
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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

          <h3>ID 혹은 PW를 잊어버리셨나요?</h3>
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
