"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import CSS from "./SignUp.module.css";

import IconBack from "@public/img/common/icon_less_than_black.svg";
import IconCheck from "@public/img/common/icon_check_round_primary.svg";
import IconTriangle from "@public/img/common/icon_down_triangle_black.svg";

/** SignUp 자식 */
interface ISignUpProps {
  /** 회원가입 완료 */
  completed: () => void;
  /** 뒤로가기 */
  back: () => void;
}

/** 회원가입 */
export default function SignUp({ completed, back }: ISignUpProps) {
  const emailList: string[] = ["직접입력", "gmail.com", "naver.com"]; // E-mail 자동완성 목록

  const [identification, setIdentification] = useState<string>(""); // Identification
  const [nickname, setNickName] = useState<string>(""); // 별명
  const [password, setPassword] = useState<string>(""); // Password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // Password 재확인
  const [firstEmail, setFirstEmail] = useState<string>(""); // E-mail Identification 부분
  const [lastEmail, setLastEmail] = useState<string>(""); // E-mail Domain 부분

  const [lastEmailIdx, setLastEmailIdx] = useState<number>(0); // E-mail List에서 선택한 순번

  const [isEmailListOpen, setIsEmailListOpen] = useState<boolean>(false); // E-mail 리스트 드롭다운 메뉴 열기 여부
  const [isDuplicateId, setIsDuplicateId] = useState<boolean>(true); // Id가 중복인지
  const [isPasswordMatching, setIsPwMatching] = useState<boolean>(false); // Password와 ConfirmPw가 일치하는 지

  /** Identification, 별명, E-mail 입력 여부랑 Password랑 Password 확인 일치여부  */
  const isEmpty: boolean = isDuplicateId || !nickname || !isPasswordMatching || !firstEmail || !lastEmail;

  // E-mail 자동완성 선택 시 lastEmail에 자동입력
  useEffect(() => {
    if (lastEmailIdx !== 0) setLastEmail(emailList[lastEmailIdx]);
  }, [lastEmailIdx]);

  // Password랑 Password 확인 일치여부 확인
  useEffect(() => {
    if (password.length > 0 && password === confirmPassword) setIsPwMatching(true);
    else setIsPwMatching(false);
  }, [password, confirmPassword]);

  /** Input Identification */
  const handleIdentification = (e: any): void => {
    setIdentification(e.target.value);
    setIsDuplicateId(true);
  };

  /** Input 별명 */
  const handleNickname = (e: any): void => {
    setNickName(e.target.value);
  };

  /** Input Password */
  const handlePassword = (e: any): void => {
    setPassword(e.target.value);
  };

  /** Input Password 확인 */
  const handleConfirmPw = (e: any): void => {
    setConfirmPassword(e.target.value);
  };

  /** Input E-mail Identification부분 */
  const handleFirstEmail = (e: any): void => {
    setFirstEmail(e.target.value);
  };

  /** Input E-mail Domain 부분 */
  const handleLastEmail = (e: any): void => {
    setLastEmail(e.target.value);
  };

  /** 뒤로가기 */
  const goBack = (): void => {
    back();
  };

  /** E-mail 자동완성 목록 Toggle */
  const toggleEmailList = (): void => {
    setIsEmailListOpen((prev) => !prev);
  };

  /**
   * E-mail 자동완성 목록 선택 시
   * @param idx 몇 번째 E-mail인지
   */
  const selectEmail = (idx: number): void => {
    if (idx === 0) setLastEmail("");

    setLastEmailIdx(idx);
    setIsEmailListOpen(false);
  };

  /** Identification 중복 확인 */
  const checkDuplicate = (): void => {
    const data: { identification: string } = { identification };

    fetch("/api/auth/check_duplicate_id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok || res.status === 409) {
          const is409 = res.status === 409;
          setIsDuplicateId(is409);

          alert(is409 ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디 입니다.");

          return res.json();
        }

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => console.log(data.msg))
      .catch((err) => console.error("Check Duplicate :", err));
  };

  /** 회원가입 */
  const processSignUp = (): void => {
    // Password Password 재확인이 일치하지 않을 때
    if (password !== confirmPassword) return alert("비밀번호가 일치하지 않습니다.");

    /** 회원가입에 필요한 사용자 정보 */
    const data: { identification: string; nickname: string; password: string; email: string } = {
      identification,
      nickname,
      password,
      email: `${firstEmail}@${lastEmail}`,
    };

    fetch("/api/auth/sign_up", {
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
        console.log(data.msg);

        completed();
      })
      .catch((err) => console.error("Process Sign Up :", err));
  };

  return (
    <div className={CSS.signUpBox}>
      <div className={CSS.header}>
        <button type="button" onClick={goBack}>
          <Image src={IconBack} width={24} height={24} alt="◀" />
        </button>

        <h3>회원가입</h3>
      </div>

      <table>
        <colgroup>
          <col style={{ width: "15%" }} />
          <col style={{ width: "65%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>

        <tbody>
          <tr>
            <th>아이디</th>
            <td>
              <input type="text" value={identification} onChange={handleIdentification} placeholder="Identification" />

              {!isDuplicateId && (
                <span>
                  <Image src={IconCheck} width={20} height={20} alt="√" />
                </span>
              )}
            </td>
            <td>
              <button type="button" onClick={checkDuplicate} disabled={identification.length <= 5}>
                중복검사
              </button>
            </td>
          </tr>

          <tr>
            <th>별명</th>
            <td colSpan={2}>
              <input type="text" value={nickname} onChange={handleNickname} placeholder="Nickname" />
            </td>
          </tr>

          <tr>
            <th>비밀번호</th>
            <td colSpan={2}>
              <input type="password" value={password} onChange={handlePassword} placeholder="Password" />
            </td>
          </tr>

          <tr>
            <th>
              비밀번호
              <br />
              재확인
            </th>
            <td colSpan={2}>
              <input type="password" value={confirmPassword} onChange={handleConfirmPw} placeholder="Confirm Password" />

              {isPasswordMatching && (
                <span>
                  <Image src={IconCheck} width={20} height={20} alt="√" />
                </span>
              )}
            </td>
          </tr>

          <tr>
            <th>E-mail</th>
            <td colSpan={2} className={CSS.emailLine}>
              <ul>
                <li>
                  <input type="text" value={firstEmail} onChange={handleFirstEmail} placeholder="Identification" />
                </li>
                <li>@</li>
                <li>
                  <input type="text" value={lastEmail} onChange={handleLastEmail} placeholder="직접 입력" readOnly={lastEmailIdx !== 0} />
                </li>
                <li>
                  <button type="button" onClick={toggleEmailList}>
                    {emailList[lastEmailIdx]}

                    <div className={CSS.img}>
                      <Image src={IconTriangle} width={9} alt="▼" />
                    </div>
                  </button>

                  {isEmailListOpen && (
                    <ul>
                      {emailList.map((email, idx) => (
                        <li key={idx}>
                          <button type="button" onClick={() => selectEmail(idx)}>
                            {email}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      <div className={CSS.okBtnBox}>
        <button type="button" onClick={processSignUp} disabled={isEmpty}>
          확인
        </button>
      </div>
    </div>
  );
}
