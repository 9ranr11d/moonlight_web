"use client";

import React, { useEffect, useState } from "react";

import CSS from "./SignUp.module.css";

import IconDownTriangle from "@public/svgs/common/icon_down_triangle.svg";

export default function EmailInput() {
  /** E-mail 자동완성 목록 */
  const emailList: string[] = ["직접입력", "gmail.com", "naver.com"];

  const [firstEmail, setFirstEmail] = useState<string>(""); // E-mail Identification 부분
  const [lastEmail, setLastEmail] = useState<string>(""); // E-mail Domain 부분

  const [lastEmailIdx, setLastEmailIdx] = useState<number>(0); // E-mail List에서 선택한 순번

  const [isEmailListOpen, setIsEmailListOpen] = useState<boolean>(false); // E-mail 리스트 드롭다운 메뉴 열기 여부

  /** E-mail Identification 부분 Input */
  const handleFirstEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstEmail(e.target.value);
  };

  /** E-mail Domain 부분 Input */
  const handleLastEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLastEmail(e.target.value);
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
    <div className={CSS.wrapper}>
      <h6>E-mail</h6>

      <div>
        <input
          type="text"
          value={firstEmail}
          onChange={handleFirstEmail}
          placeholder="Identification"
        />
        <input
          type="text"
          value={lastEmail}
          onChange={handleLastEmail}
          placeholder="직접 입력"
          readOnly={lastEmailIdx !== 0}
        />

        <div>
          <button type="button" onClick={toggleEmailList}>
            {emailList[lastEmailIdx]}

            <div className={CSS.img}>
              <IconDownTriangle width={9} height={9} fill={"black"} />
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
        </div>
      </div>
    </div>
  );
}
