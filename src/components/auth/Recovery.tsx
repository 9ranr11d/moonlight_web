"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import { convertToMinutes } from "@utils/Util";

import CSS from "./Recovery.module.css";

import IconBack from "@public/img/common/icon_back_black.svg";
import IconCheck from "@public/img/common/icon_check_main.svg";

/** EmailSender 자식 */
interface EmailSenderProps {
  /** 인증 된 E-mail 반환 */
  verified: (email: string) => void;
}

/** Password 자식 */
interface PasswordProps {
  /** 뒤로가기 */
  back: () => void;
}

/** Recovery 자식 */
interface RecoveryProps {
  /** 뒤로가기 */
  back: () => void;
}

/** E-mail 인증 */
const EmailSender = ({ verified }: EmailSenderProps) => {
  /** 인증코드 입력 제한시간 최대값 */
  const maxDeadline = 600;

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

  /** DB에 등록 되어있는 E-mail인지 확인 */
  const verifyMatch = (): void => {
    const data = { email };

    fetch("/api/auth/verify_user_info_match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) return sendEmail();
        else return res.json().then((data) => Promise.reject(data.msg));
      })
      .catch((err) => console.error("Verify Match :", err));
  };

  /** 인증코드 전송 */
  const sendEmail = (): void => {
    const data = { email };

    fetch("/api/auth/email_verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        setVerificationCode(data.verificationCode);
        setIsEmailSent(true);
        setDeadline(maxDeadline);
      })
      .catch((err) => console.error("Send Email :", err));
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

const Identification = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const [id, setId] = useState<string>("");

  const getUserId = (email: string): void => {
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
        setId(data.id);
        setIsVerified(true);
      })
      .catch((err) => console.error("Identification :", err));
  };

  return (
    <>
      {!isVerified ? (
        <EmailSender verified={(email) => getUserId(email)} />
      ) : (
        <div>
          <h4>찾으시는 아이디는</h4>
          <h2>『 {id} 』</h2>
          <h4>입니다.</h4>
        </div>
      )}
    </>
  );
};

const Password = ({ back }: PasswordProps) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isEmailMatching, setIsEmailMatching] = useState<boolean>(false);
  const [isPwMatching, setIsPwMatching] = useState<boolean>(false);

  const [id, setId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [confirmPw, setConfirmPw] = useState<string>("");

  useEffect(() => {
    if (pw.length > 0 && pw === confirmPw) setIsPwMatching(true);
    else setIsPwMatching(false);
  }, [pw, confirmPw]);

  const checkEmail = (email: string): void => {
    if (email === userEmail) setIsEmailMatching(true);
    else alert("이메일이 일치하지 않습니다.");
  };

  const handlePw = (e: any): void => {
    setPw(e.target.value);
  };

  const handleConfirmPw = (e: any): void => {
    setConfirmPw(e.target.value);
  };

  const handleId = (e: any): void => {
    setId(e.target.value);
  };

  const checkId = (): void => {
    const data = { id };

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
        setId(data.id);
        setUserEmail(data.email);
        setIsAuth(true);
      })
      .catch((err) => console.error("Check Id :", err));
  };

  const changePw = (): void => {
    const data = { id, pw };

    fetch("/api/auth/change_pw", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => console.log(data.msg));
          return back();
        } else if (res.status === 404) alert("존재하지 않는 아이디입니다.");
        else alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .catch((err) => console.error("Check Pw :", err));
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
                  <input type="text" value={id} onChange={handleId} placeholder="Identification" />
                </td>
                <td>
                  <button type="button" onClick={checkId}>
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
                  <input type="password" value={pw} onChange={handlePw} placeholder="Password" />
                </td>
              </tr>

              <tr>
                <th>
                  비밀번호
                  <br />
                  재확인
                </th>
                <td>
                  <input type="password" value={confirmPw} onChange={handleConfirmPw} placeholder="Confirm Password" />

                  {isPwMatching && (
                    <span>
                      <Image src={IconCheck} width={20} alt="√" />
                    </span>
                  )}
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <button type="button" onClick={changePw} disabled={!isPwMatching}>
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

export default function Recovery({ back }: RecoveryProps) {
  const [isId, setIsId] = useState<boolean>(true);

  const handleBack = () => {
    back();
  };

  const handleId = () => {
    setIsId(true);
  };

  const handlePw = () => {
    setIsId(false);
  };

  return (
    <>
      <div className={CSS.recoveryBox}>
        <div className={CSS.headerBox}>
          <button type="button" onClick={handleBack}>
            <Image src={IconBack} width={24} height={24} alt="◀" />
          </button>

          <h3>ID 혹은 PW를 잊어버리셨나요?</h3>
        </div>

        <div className={CSS.tapBox}>
          <button type="button" onClick={handleId} disabled={isId}>
            Identification
          </button>

          <button type="button" onClick={handlePw} disabled={!isId}>
            Password
          </button>
        </div>

        <div className={CSS.content}>{isId ? <Identification /> : <Password back={handleBack} />}</div>
      </div>
    </>
  );
}
