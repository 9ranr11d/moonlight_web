"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useSelector } from "react-redux";

import { RootState } from "@redux/store";

import CSS from "@components/auth/signUp/SignUp.module.css";

import { ERR_MSG } from "@constants/msg";

import TabBtn from "@components/common/btn/TabBtn";
import ErrorBlock from "@components/common/ErrorBlock";
import NextBtn from "@components/common/btn/NextBtn";

import EmailForm from "@components/auth/signUp/EmailForm";
import PhoneNumberForm from "@components/auth/signUp/PhoneNumberForm";

/** 본인 인증 Form */
export default function VerificationForm() {
  /** 회원가입 정보 */
  const signUp = useSelector((state: RootState) => state.signUpSlice);

  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(0); // 선택된 Tab

  /** 선택된 Tab 변경 */
  const handleTab = (idx: number): void => {
    setSelectedTabIdx(idx);
  };

  /** 다음 버튼 클릭 시 */
  const clickConfirmBtn = () => {};

  /** Input들 */
  const inputs = useMemo(() => [<EmailForm />, <PhoneNumberForm />], []);

  // 렌더링 시
  useEffect(() => {
    /** Window 크기 변경 시 */
    const handleResize = () => {
      // 모바일 화면일 경우
      if (window.innerWidth <= 767) setSelectedTabIdx(1);
      // 데스크탑 화면일 경우
      else setSelectedTabIdx(0);
    };

    handleResize();

    // Window 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 이벤트 리스너 제거
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {!signUp.verification.isVerified && (
        <TabBtn
          labelArr={["E-mail", "휴대전화"]}
          idx={selectedTabIdx}
          onChange={handleTab}
        />
      )}

      {inputs[selectedTabIdx] ?? (
        <div style={{ marginBottom: 10 }}>
          <ErrorBlock
            content={<h6 style={{ whiteSpace: "pre-line" }}>{ERR_MSG}</h6>}
          />
        </div>
      )}

      <div className={CSS.spacing} />

      {signUp.verification.isVerified && (
        <div className={CSS.okBtnBox}>
          <NextBtn
            onClick={clickConfirmBtn}
            disabled={!signUp.verification.isVerified}
          />
        </div>
      )}
    </>
  );
}
