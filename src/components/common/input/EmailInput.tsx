"use client";

import React, { useEffect, useState } from "react";

import CSS from "@components/common/input/Input.module.css";

import DropdownBtn from "@components/common/btn/DropdownBtn";

/** EmailInput Interface */
interface IEmailInput {
  /** E-mail 변경 시 */
  onChange?: (email: string) => void;
}

/** E-mail Input */
export default function EmailInput({ onChange }: IEmailInput) {
  /** E-mail 자동완성 목록 */
  const emailList: string[] = ["직접입력", "gmail.com", "naver.com"];

  const [firstEmail, setFirstEmail] = useState<string>(""); // E-mail Identification 부분
  const [lastEmail, setLastEmail] = useState<string>(""); // E-mail Domain 부분

  const [lastEmailIdx, setLastEmailIdx] = useState<number>(0); // E-mail List에서 선택한 순번

  /** 완성된 E-mail */
  const fullEmail: string = `${firstEmail}@${lastEmail}`;

  /** E-mail Identification 부분 Input */
  const handleFirstEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstEmail(e.target.value);
  };

  /** E-mail Domain 부분 Input */
  const handleLastEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLastEmail(e.target.value);
  };

  /**
   * E-mail 자동완성 목록 선택 시
   * @param idx 몇 번째 E-mail인지
   */
  const selectEmail = (idx: number): void => {
    setLastEmailIdx(idx);

    // 자동완성 여부
    if (idx === 0) setLastEmail("");
    else setLastEmail(emailList[idx]);
  };

  // E-mail 변경 시
  useEffect(() => {
    if (onChange) onChange(fullEmail);
  }, [fullEmail]);

  return (
    <div className={CSS.wrapper}>
      <h6>E-mail</h6>

      <div className={CSS.inputCover}>
        <div>
          <input
            type="text"
            value={firstEmail}
            onChange={handleFirstEmail}
            placeholder="아이디"
            style={{ flex: 1 }}
          />

          <div style={{ alignItems: "center", flex: 2 }}>
            <span>@</span>

            {lastEmailIdx === 0 && (
              <input
                type="text"
                value={lastEmail}
                onChange={handleLastEmail}
                placeholder="직접 입력"
                readOnly={lastEmailIdx !== 0}
              />
            )}

            {lastEmailIdx !== 0 && (
              <DropdownBtn
                list={emailList}
                onChange={selectEmail}
                idx={lastEmailIdx}
                style={{ flex: 1 }}
              />
            )}
          </div>

          {lastEmailIdx === 0 && (
            <DropdownBtn
              list={emailList}
              onChange={selectEmail}
              idx={lastEmailIdx}
              style={{ flex: 1 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
