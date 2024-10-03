"use client";

import React from "react";

import Lottie from "lottie-react";

import Modal from "@components/common/Modal";

import LottieLoading from "@public/json/loading_moon.json";

/** 로딩 페이지 */
export default function Loading() {
  return (
    <main>
      <Modal>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
          <Lottie animationData={LottieLoading} style={{ width: 100, height: 100 }} />
        </div>

        <h3>
          달이 차오르고 있습니다.
          <br />
          한숨 주무시고 오세요.
        </h3>
      </Modal>
    </main>
  );
}
