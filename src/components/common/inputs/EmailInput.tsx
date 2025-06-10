"use client";

import React, { useEffect, useState } from "react";

import styles from "@/components/common/inputs/Input.module.css";

import DropdownBtn from "@/components/common/btns/DropdownBtn";

/** EmailInput Interface */
interface IEmailInput {
  /** Email 변경 시 */
  onChange?: (email: string) => void;
  /** 키 클릭 시 */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/** Email Input */
export default function EmailInput({ onChange, onKeyDown }: IEmailInput) {
  /** Email 자동완성 목록 */
  const emailList: string[] = ["직접입력", "gmail.com", "naver.com"];

  const [firstEmail, setFirstEmail] = useState<string>(""); // Email 아이디 부분
  const [lastEmail, setLastEmail] = useState<string>(""); // Email Domain 부분

  const [lastEmailIdx, setLastEmailIdx] = useState<number>(0); // Email List에서 선택한 순번

  /** 완성된 Email */
  const fullEmail: string = `${firstEmail}@${lastEmail}`;

  /** Email 아이디 부분 Input */
  const handleFirstEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstEmail(e.target.value.trim());
  };

  /** Email Domain 부분 Input */
  const handleLastEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLastEmail(e.target.value.trim());
  };

  /**
   * Email 자동완성 목록 선택 시
   * @param idx 몇 번째 Email인지
   */
  const selectEmail = (idx: number): void => {
    setLastEmailIdx(idx);

    // 자동완성 여부
    if (idx === 0) setLastEmail("");
    else setLastEmail(emailList[idx]);
  };

  // Email 변경 시
  useEffect(() => {
    onChange?.(fullEmail);
  }, [fullEmail]);

  return (
    <>
      <div className={styles.inputCover}>
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
                onKeyDown={onKeyDown}
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
    </>
  );
}
