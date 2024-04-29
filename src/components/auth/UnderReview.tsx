"use client";

import React from "react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { signOut } from "@redux/slices/AuthSlice";

import CSS from "./UnderReview.module.css";

export default function UnderReview() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const handleSignOut = (): void => {
    const confirmSignOut: boolean = window.confirm("다른 아이디로 로그인하시겠습니까?");

    if (!confirmSignOut) return;

    fetch("/api/auth/sign_out", { method: "POST" })
      .then((res) => {
        if (res.ok) return res.json();

        alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        alert("로그아웃 됐습니다.");

        dispatch(signOut());
      })
      .catch((err) => console.error("Handle Sign Out :", err));
  };

  return (
    <>
      <div className={CSS.underReviewBox}>
        <h3>심사 중인 아이디입니다.</h3>

        <button type="button" onClick={handleSignOut}>
          다른 아이디로 로그인
        </button>
      </div>
    </>
  );
}
