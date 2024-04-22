"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import CSS from "./SignUp.module.css";

import IconBack from "@public/img/common/icon_less_than_black.svg";
import IconCheck from "@public/img/common/icon_check_round_main.svg";
import IconTriangle from "@public/img/common/icon_down_triangle_black.svg";

/** SignUp 자식 */
interface SignUpProps {
  /** 회원가입 완료 */
  completed: () => void;
  /** 뒤로가기 */
  back: () => void;
}

/** 회원가입 */
export default function SignUp({ completed, back }: SignUpProps) {
  const emailList: string[] = ["직접입력", "gmail.com", "naver.com"]; // E-mail 자동완성 목록

  const [id, setId] = useState<string>(""); // Identification
  const [nickname, setNickName] = useState<string>(""); // 별명
  const [pw, setPw] = useState<string>(""); // Password
  const [confirmPw, setConfirmPw] = useState<string>(""); // Password 재확인
  const [firstEmail, setFirstEmail] = useState<string>(""); // E-mail Identification 부분
  const [lastEmail, setLastEmail] = useState<string>(""); // E-mail Domain 부분

  const [lastEmailIdx, setLastEmailIdx] = useState<number>(0); // E-mail List에서 선택한 순번

  const [isEmailListOpen, setIsEmailListOpen] = useState<boolean>(false); // E-mail 리스트 드롭다운 메뉴 열기 여부
  const [isDuplicateId, setIsDuplicateId] = useState<boolean>(true); // Id가 중복인지
  const [isPwMatching, setIsPwMatching] = useState<boolean>(false); // Pw와 ConfirmPw가 일치하는 지

  /** Identification, 별명, E-mail 입력 여부랑 Password랑 Password 확인 일치여부  */
  const isEmpty: boolean = isDuplicateId || nickname.length === 0 || !isPwMatching || firstEmail.length === 0 || lastEmail.length === 0;

  // E-mail 자동완성 선택 시 lastEmail에 자동입력
  useEffect(() => {
    if (lastEmailIdx !== 0) setLastEmail(emailList[lastEmailIdx]);
  }, [lastEmailIdx]);

  // Password랑 Password 확인 일치여부 확인
  useEffect(() => {
    if (pw.length > 0 && pw === confirmPw) setIsPwMatching(true);
    else setIsPwMatching(false);
  }, [pw, confirmPw]);

  /** 뒤로가기 */
  const handleBack = (): void => {
    back();
  };

  /** Input Identification */
  const handleId = (e: any): void => {
    setId(e.target.value);
    setIsDuplicateId(true);
  };

  /** Identification 중복 확인 */
  const handleDuplicate = (): void => {
    const data: { id: string } = { id };

    fetch("/api/auth/check_duplicate_id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok)
          return res.json().then((data) => {
            setIsDuplicateId(false);
            console.log(data.msg);
            alert("사용 가능한 아이디 입니다.");
          });
        else if (res.status == 409)
          return res.json().then((data) => {
            setIsDuplicateId(true);
            console.log(data.msg);
            alert("이미 사용 중인 아이디입니다.");
          });
        else return res.json().then((data) => Promise.reject(data.msg));
      })
      .catch((err) => console.error("Handle Duplicate :", err));
  };

  /** Input 별명 */
  const handleNickname = (e: any): void => {
    setNickName(e.target.value);
  };

  /** Input Password */
  const handlePw = (e: any): void => {
    setPw(e.target.value);
  };

  /** Input Password 확인 */
  const handleConfirmPw = (e: any): void => {
    setConfirmPw(e.target.value);
  };

  /** Input E-mail Identification부분 */
  const handleFirstEmail = (e: any): void => {
    setFirstEmail(e.target.value);
  };

  /** Input E-mail Domain 부분 */
  const handleLastEmail = (e: any): void => {
    setLastEmail(e.target.value);
  };

  /** E-mail 자동완성 목록 Toggle */
  const handleEmailList = (): void => {
    setIsEmailListOpen(!isEmailListOpen);
  };

  /**
   * E-mail 자동완성 목록 선택 시
   * @param idx 몇 번째 E-mail인지
   */
  const handleSelectEmail = (idx: number): void => {
    if (idx === 0) setLastEmail("");

    setLastEmailIdx(idx);
    setIsEmailListOpen(false);
  };

  /** 회원가입 */
  const handleSignUp = (): void => {
    // pw와 pw 재확인이 일치하지 않을 때
    if (pw !== confirmPw) return alert("비밀번호가 일치하지 않습니다.");

    /** 회원가입에 필요한 사용자 정보 */
    const data: { id: string; nickname: string; pw: string; email: string } = { id, nickname, pw, email: `${firstEmail}@${lastEmail}` };

    fetch("/api/auth/sign_up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) return completed();

        alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .catch((err) => console.error("Handle Sign Up :", err));
  };

  return (
    <div className={CSS.signUpBox}>
      <div className={CSS.header}>
        <button type="button" onClick={handleBack}>
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
              <input type="text" value={id} onChange={handleId} placeholder="Identification" />

              {!isDuplicateId && (
                <span>
                  <Image src={IconCheck} width={20} alt="√" />
                </span>
              )}
            </td>
            <td>
              <button type="button" onClick={handleDuplicate} disabled={id.length <= 5}>
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
              <input type="password" value={pw} onChange={handlePw} placeholder="Password" />
            </td>
          </tr>

          <tr>
            <th>
              비밀번호
              <br />
              재확인
            </th>
            <td colSpan={2}>
              <input type="password" value={confirmPw} onChange={handleConfirmPw} placeholder="Confirm Password" />

              {isPwMatching && (
                <span>
                  <Image src={IconCheck} width={20} alt="√" />
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
                  <button type="button" onClick={handleEmailList}>
                    {emailList[lastEmailIdx]}

                    <div className={CSS.img}>
                      <Image src={IconTriangle} width={9} alt="▼" />
                    </div>
                  </button>

                  {isEmailListOpen && (
                    <ul>
                      {emailList.map((email, idx) => (
                        <li key={idx}>
                          <button type="button" onClick={() => handleSelectEmail(idx)}>
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
        <button type="button" onClick={handleSignUp} disabled={isEmpty}>
          확인
        </button>
      </div>
    </div>
  );
}
