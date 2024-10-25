"use client";

import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";

import CSS from "./ProfileEdit.module.css";

import { ERR_MSG } from "@constants/msg";

import { copyClipBoard, getUser } from "@utils/index";

/** 커플 코드 관리 */
export default function CoupleCodeManager() {
  /** Dispatch */
  const dispatch = useDispatch();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authReducer);

  const [isCodeInputVisible, setIsCodeInputVisible] = useState<boolean>(false); // 커플 코드 텍스트 입력 필드 가시 유무

  const [coupleCode, setCoupleCode] = useState<string>(""); // 커플 커드 텍스트 입력 필드 내용

  /** 커플 코드 입력 */
  const handleCoupleCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCoupleCode(e.target.value);
  };

  /** 커플 코드 텍스트 입력 필드에서 키 누를 시 호출 */
  const handleCoupleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") registerCoupleCode();
  };

  /** 커플 코드 클립보드 복사 */
  const clickCoupleCode = (): void => {
    if (user.coupleCode) copyClipBoard(user.coupleCode);
  };

  /** 커플 코드 텍스트 입력 필드 가시 유무 Toggle */
  const toggleShowCodeInput = (): void => {
    setCoupleCode("");

    setIsCodeInputVisible(prev => !prev);
  };

  /** 커플 코드 유효성 검사 */
  const registerCoupleCode = (): void => {
    const data: { id: string; coupleCode: string } = { id: user._id, coupleCode };

    fetch("/api/auth/register_couple_code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        console.log(data.msg);

        alert("커플 코드가 등록되었습니다.");

        getUser(user.accessToken, dispatch);

        toggleShowCodeInput();
      })
      .catch(err => console.error("/src/components/auth/CoupleCodeManager > CoupleCodeManager() > registerCoupleCode()에서 오류가 발생했습니다. :", err));
  };

  /** 커플 코드 발급 */
  const issueCoupleCode = (): void => {
    // 발급 전 경고 문구
    if (user.coupleCode) {
      const confirmIssueCoupleCode: boolean = window.confirm("재발급 하시면 기존 '커플 코드'는 사라집니다. 그래도 진행하시겠습니까?");

      if (!confirmIssueCoupleCode) {
        alert("취소되었습니다.");
        return;
      }
    }

    const data: { _id: string; id: string } = { _id: user._id, id: user.identification };

    fetch("/api/auth/issue_couple_code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        console.log(data.msg);

        alert("커플 코드가 발급되었습니다.");

        getUser(user.accessToken, dispatch);
      })
      .catch(err => console.error("/src/components/auth/CoupleCodeManager > CoupleCodeManager() > issueCoupleCode()에서 오류가 발생했습니다. :", err));
  };

  /** 커플 코드 삭제 */
  const deleteCoupleCode = (): void => {
    const confirmDeleteCoupleCode: boolean = window.confirm("'커플 코드'를 삭제하시면 복구가 불가능합니다. 그래도 삭제 하시겠습니까?");

    if (!confirmDeleteCoupleCode) {
      alert("취소되었습니다.");
      return;
    }

    fetch(`/api/auth/issue_couple_code?id=${user._id}&coupleCode=${user.coupleCode}`, { method: "DELETE" })
      .then(res => {
        if (res.ok) return res.json();

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        console.log(data.msg);

        getUser(user.accessToken, dispatch);
      })
      .catch(err => console.error("/src/components/auth/CoupleCodeManager > CoupleCodeManager() > deleteCoupleCode()에서 오류가 발생했습니다. :", err));
  };

  return (
    <div className={CSS.container}>
      <h3 className={CSS.title}>커플 코드 관리</h3>

      <div className={CSS.desc}>
        {user.coupleCode ? (
          <>
            <h5>발급된 커플 코드가 있습니다.</h5>

            <p>
              &#8251; 발급 된 <span>&apos;커플 코드&apos;</span>를 연인에게 공유하세요.
            </p>

            <div style={{ marginTop: 20 }}>
              <h6>커플 코드 :</h6>

              <button type="button" className={CSS.code} onClick={clickCoupleCode}>
                <h3>{user.coupleCode}</h3>
              </button>
            </div>
          </>
        ) : (
          <>
            <h5>발급된 커플 코드가 없습니다.</h5>

            {isCodeInputVisible ? (
              <input
                type="text"
                value={coupleCode}
                onChange={handleCoupleCode}
                onKeyDown={handleCoupleCodeKeyDown}
                className={CSS.codeInput}
                placeholder="공유 받은 '커플 코드'를 입력해주세요."
              />
            ) : (
              <>
                <p>
                  &#8251; 공유 받은 <span>&apos;커플 코드&apos;</span>가 없을 시 아래 <span>&apos;커플 코드 발급&apos;</span> 버튼으로 커플 코드를 발급해주세요.
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;(동일한 <span>&apos;커플 코드&apos;</span>를 등록한 사용자끼리 정보를 공유할 수 있습니다.)
                </p>
              </>
            )}
          </>
        )}
      </div>

      <ul className={CSS.btnBox}>
        {isCodeInputVisible ? (
          <>
            <li>
              <button type="button" onClick={registerCoupleCode}>
                확인
              </button>
            </li>
            <li>
              <button type="button" onClick={toggleShowCodeInput}>
                취소
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button type="button" onClick={issueCoupleCode}>
                {user.coupleCode ? "커플 코드 재발급" : "커플 코드 발급"}
              </button>
            </li>

            {user.coupleCode ? (
              <li>
                <button type="button" onClick={deleteCoupleCode}>
                  커플 코드 삭제
                </button>
              </li>
            ) : (
              <li>
                <button type="button" onClick={toggleShowCodeInput}>
                  커플 코드 등록
                </button>
              </li>
            )}
          </>
        )}
      </ul>
    </div>
  );
}
