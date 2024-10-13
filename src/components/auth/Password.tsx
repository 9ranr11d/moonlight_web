"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import CSS from "./Recovery.module.css";

import { ERR_MSG } from "@constants/msg";
import EmailVerification from "./EmailVerification";

import IconCheck from "@public/img/common/icon_check_primary.svg";

/** Password 자식 */
interface IPasswordProps {
  /** 뒤로가기 */
  back: () => void;
  /** Identification */
  identification?: string;
  /** 선 입력 E-mail */
  inputEmail?: string;
}

/** Password 찾기 */
export default function Password({ back, identification, inputEmail }: IPasswordProps) {
  const passwordInputRef = useRef<HTMLInputElement>(null); // 바꿀 비밀번호 Ref

  const [isAuth, setIsAuth] = useState<boolean>(identification ? true : false); // Identification 인증 여부
  const [isEmailMatching, setIsEmailMatching] = useState<boolean>(false); // 입력 받은 E-mail과 DB 속 해당 Identification의 E-mail 일치 여부
  const [isPasswordMatching, setIsPwMatching] = useState<boolean>(false); // 새로 만들 Password랑 Password 확인 일치 여부

  const [_identification, set_identification] = useState<string>(identification || ""); // 인증할 Identification
  const [userEmail, setUserEmail] = useState<string>(""); // 입력 받은 E-mail
  const [password, setPassword] = useState<string>(""); // 새로 만들 Password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // 새로 만들 Password 확인

  // 인증 코드가 일치 시 바꿀 비밀번호 텍스트 입력 필드로 포커스
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
    set_identification(e.target.value);
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
    const data: { identification: string } = { identification: _identification };

    fetch("/api/auth/check_id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.ok) return res.json();

        if (res.status === 404) alert("존재하지 않는 아이디입니다.");
        else alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        set_identification(data.identification);
        setUserEmail(data.email);
        setIsAuth(true);
      })
      .catch(err => console.error("/src/components/auth/Recovery > Password() > checkIdentification()에서 오류가 발생했습니다. :", err));
  };

  /** 비밀번호 변경 */
  const changePassword = (): void => {
    const data: { identification: string; password: string } = { identification: _identification, password };

    fetch("/api/auth/change_pw", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.ok) return res.json();

        if (res.status === 404) alert("존재하지 않는 아이디입니다.");
        else alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        console.log(data.msg);

        alert("비밀번호가 성공적으로 바뀌었습니다.");

        back();
      })
      .catch(err => console.error("/src/components/auth/Recovery > Password() > changePassword()에서 오류가 발생했습니다. :", err));
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
        <EmailVerification
          title="이메일로 본인 인증"
          verified={email => checkEmail(email)}
          isAutoFocus={true}
          isEmailCheckEnabled={true}
          {...(inputEmail && { inputEmail })}
        />
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
}
