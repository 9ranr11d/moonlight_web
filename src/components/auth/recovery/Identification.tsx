"use client";

import React from "react";

import dynamic from "next/dynamic";

import { useSelector } from "react-redux";

import { RootState } from "@redux/store";

import VerificationForm from "./VerificationForm";

import LottieLoading from "@public/json/loading_round_black.json";

import IconHome from "@public/svgs/common/icon_home.svg";

const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

interface IIdentification {
  /** 뒤로가기 */
  back: () => void;
}

/** 아이디 찾기 */
export default function Identification({ back }: IIdentification) {
  const { isVerified } = useSelector((state: RootState) => state.verification); // 본인인증 여부
  const { modifiedId } = useSelector((state: RootState) => state.recoverySlice); // Step과 가려진 아이디

  return (
    <>
      {!isVerified ? (
        <VerificationForm />
      ) : (
        <div>
          <p style={{ textAlign: "center" }}>본인 확인이 완료되었습니다.</p>

          <p style={{ textAlign: "center" }}>
            확인된 회원님의 아이디는 아래와 같습니다.
          </p>

          <div
            style={{
              background: "var(--gray-50)",
              padding: "20px 10px",
              borderRadius: 3,
              margin: "10px 0px 20px",
            }}
          >
            <h4 style={{ textAlign: "center", color: "var(--primary-color)" }}>
              {modifiedId || (
                <span style={{ display: "flex", justifyContent: "center" }}>
                  <LottiePlayer
                    loop
                    animationData={LottieLoading}
                    play
                    style={{ width: 28, height: 28 }}
                  />
                </span>
              )}
            </h4>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={back}
              style={{ display: "flex", columnGap: 5 }}
            >
              <IconHome width={15} height={15} fill="white" />

              <span>홈으로 돌아가기</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
