"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";
import { incrementSignUpStep } from "@redux/slices/signUpSlice";

import styles from "@components/auth/signUp/SignUp.module.css";

import HorizontalTabBtns from "@components/common/btn/HorizontalTabBtns";
import ErrorBlock from "@components/common/ErrorBlock";
import NextBtn from "@components/common/btn/NextBtn";

import EmailForm from "@components/auth/verification/EmailForm";
import PhoneNumberForm from "@components/auth/verification/PhoneNumberForm";

import IconCheck from "@public/svgs/common/icon_check.svg";

/** 본인 인증 Form */
export default function VerificationForm() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 본인인증 정보 */
  const verification = useSelector(
    (state: RootState) => state.verificationSlice
  );

  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(0); // 선택된 Tab
  const [timeLeft, setTimeLeft] = useState<number>(5); // 본인 인증 완료 시 다음 단계 자동 넘기 제한 시간

  /** Input들 */
  const inputs = useMemo(
    () => [<EmailForm key="email" />, <PhoneNumberForm key="phone" />],
    []
  );

  /** 선택된 Tab 변경 */
  const handleTab = (idx: number): void => {
    setSelectedTabIdx(idx);
  };

  /** 다음 버튼 클릭 시 */
  const clickConfirmBtn = () => {
    dispatch(incrementSignUpStep());
  };

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

  // 남은 시간 변경 시
  useEffect(() => {
    // 본인 인증 완료 시
    if (verification.isVerified) {
      // 1초씩 감소
      if (timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
      } else dispatch(incrementSignUpStep());
    }
  }, [timeLeft, verification.isVerified, dispatch]);

  return (
    <>
      {!verification.isVerified ? (
        <div style={{ marginBottom: 20 }}>
          <HorizontalTabBtns
            labelArr={["Email", "휴대전화"]}
            idx={selectedTabIdx}
            onChange={handleTab}
          />

          {inputs[selectedTabIdx] ?? (
            <div style={{ marginBottom: 10 }}>
              <ErrorBlock />
            </div>
          )}
        </div>
      ) : (
        <>
          <div>
            <IconCheck width={50} height={50} fill={"var(--primary-color)"} />

            <h6 style={{ marginTop: 10 }}>
              본인 인증이 완료되었습니다.
              <br />
              &apos;다음&apos;버튼을 눌러 다음 단계를 진행해주세요.
            </h6>
          </div>

          <div className={styles.spacing} />

          <div className="okBtnBox">
            <NextBtn
              onClick={clickConfirmBtn}
              disabled={!verification.isVerified}
              style={{ paddingLeft: 40 }}
            >
              <span className={styles.timeLeft}>{timeLeft}</span>

              <span>다음</span>
            </NextBtn>
          </div>
        </>
      )}
    </>
  );
}
