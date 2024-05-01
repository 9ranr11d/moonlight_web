"use client";

import React from "react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";

import CSS from "./UnderReview.module.css";

import { processSignOut } from "@utils/Utils";

export default function UnderReview() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const clickSignOut = () => {
    processSignOut("다른 아이디로 로그인하시겠습니까?", dispatch);
  };

  return (
    <>
      <div className={CSS.underReviewBox}>
        <h3>심사 중인 아이디입니다.</h3>

        <button type="button" onClick={clickSignOut}>
          다른 아이디로 로그인
        </button>
      </div>
    </>
  );
}
