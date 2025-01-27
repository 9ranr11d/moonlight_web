"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import CSS from "./SignUp.module.css";

import { ERR_MSG } from "@constants/msg";

import IconBack from "@public/img/common/icon_less_than_black.svg";
import IconCheck from "@public/img/common/icon_check_primary.svg";
import IconTriangle from "@public/img/common/icon_down_triangle_black.svg";
import IdentificationInput from "./IdentificationInput";
import TitleHeader from "@components/common/TitleHeader";
import PasswordInput from "./PasswordInput";
import TermsViewer from "./TermsViewer";

/** SignUp 자식 */
interface ISignUpProps {
  /** 회원가입 완료 */
  completed: () => void;
  /** 뒤로가기 */
  back: () => void;
}

function AgreementStep() {
  return (
    <>
      <TermsViewer />
    </>
  );
}

function AccountStep() {
  return (
    <>
      <IdentificationInput />
      <PasswordInput />
    </>
  );
}

/** 회원가입 */
export default function SignUp({ completed, back }: ISignUpProps) {
  const emailList: string[] = ["직접입력", "gmail.com", "naver.com"]; // E-mail 자동완성 목록

  const [nickname, setNickName] = useState<string>(""); // 별명

  const [firstEmail, setFirstEmail] = useState<string>(""); // E-mail Identification 부분
  const [lastEmail, setLastEmail] = useState<string>(""); // E-mail Domain 부분

  const [lastEmailIdx, setLastEmailIdx] = useState<number>(0); // E-mail List에서 선택한 순번
  const [step, setStep] = useState<number>(0);

  const [isEmailListOpen, setIsEmailListOpen] = useState<boolean>(false); // E-mail 리스트 드롭다운 메뉴 열기 여부

  /** Identification, 별명, E-mail 입력 여부랑 Password랑 Password 확인 일치여부  */
  // const isEmpty: boolean =
  //   isDuplicateId ||
  //   !nickname ||
  //   !isPasswordMatching ||
  //   !firstEmail ||
  //   !lastEmail;

  /** 회원가입 */
  // const processSignUp = (): void => {
  //   // Password Password 재확인이 일치하지 않을 때
  //   if (password !== confirmPassword) {
  //     alert("비밀번호가 일치하지 않습니다.");
  //     return;
  //   }

  //   /** 회원가입에 필요한 사용자 정보 */
  //   const data: {
  //     identification: string;
  //     nickname: string;
  //     password: string;
  //     email: string;
  //   } = {
  //     identification,
  //     nickname,
  //     password,
  //     email: `${firstEmail}@${lastEmail}`,
  //   };

  //   fetch("/api/auth/signUp", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data),
  //   })
  //     .then(res => {
  //       if (res.ok) return res.json();

  //       alert(ERR_MSG);

  //       return res.json().then(data => Promise.reject(data.msg));
  //     })
  //     .then(data => {
  //       console.log(data.msg);

  //       completed();
  //     })
  //     .catch(err =>
  //       console.error(
  //         "/src/components/auth/SignUp > processSignUp()에서 오류가 발생했습니다. :",
  //         err
  //       )
  //     );
  // };

  /** 별명 Input */
  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNickName(e.target.value);
  };

  /** E-mail Identification 부분 Input */
  const handleFirstEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstEmail(e.target.value);
  };

  /** E-mail Domain 부분 Input */
  const handleLastEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLastEmail(e.target.value);
  };

  /** 뒤로가기 */
  const goBack = (): void => {
    back();
  };

  /** E-mail 자동완성 목록 Toggle */
  const toggleEmailList = (): void => {
    setIsEmailListOpen(prev => !prev);
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

  // E-mail 자동완성 선택 시 lastEmail에 자동입력
  useEffect(() => {
    if (lastEmailIdx !== 0) setLastEmail(emailList[lastEmailIdx]);
  }, [lastEmailIdx]);

  return (
    <div className={CSS.signUpBox} style={{ width: "60%" }}>
      <TitleHeader back={back} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: 10,
          marginBottom: 30,
        }}
      >
        <AgreementStep />
      </div>

      {/* <ul className={CSS.content}>
        <li>

        </li>

        <li>
          <ul>
            <li>
              <h6>별명</h6>
            </li>

            <li>
              <input type="text" value={nickname} onChange={handleNickname} placeholder="Nickname" />
            </li>
          </ul>
        </li>

        <li>
          <ul>
            <li>
              
            </li>

            <li>
              
            </li>
          </ul>
        </li>

        <li>
          <ul>
            <li>
              
            </li>

            <li>
              
            </li>
          </ul>
        </li>

        <li>
          <ul>
            <li>
              <h6>E-mail</h6>
            </li>
            <li className={CSS.emailLine}>
              <ul>
                <li>
                  <input type="text" value={firstEmail} onChange={handleFirstEmail} placeholder="Identification" />
                </li>

                <li>@</li>

                <li>
                  <ul>
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
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul> */}

      <div className={CSS.okBtnBox}>
        <button type="button">확인</button>
      </div>
    </div>
  );
}
