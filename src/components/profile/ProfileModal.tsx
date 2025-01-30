"use client";

import React from "react";

import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";

import { signOut as socialSignOut } from "next-auth/react";

import { RootState } from "@redux/store";

import { signOutAction } from "@actions/authAction";

import CSS from "./ProfileModal.module.css";

/** 사용자 정보 수정 모달 자식들 */
interface IProfileModal {
  /** 닫기 */
  closeModal: () => void;
}

/** 사용자 정보 수정 모달 */
export default function ProfileModal({ closeModal }: IProfileModal) {
  /** Dispatch */
  const dispatch = useDispatch();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authSlice);

  /** '로그아웃' 클릭 시 */
  const clickSignOut = () => {
    if (user.provider === "local") {
      const isSignedOut = signOutAction("로그아웃 하시겠습니까?", dispatch);

      if (isSignedOut) closeModal();
    } else {
      socialSignOut();
      closeModal();
    }
  };

  return (
    <div className={CSS.option}>
      <h6>{user.nickname}님</h6>

      <ul>
        <li>
          <Link href={"/profile"}>
            <button type="button">정보</button>
          </Link>
        </li>
        <li>
          <button type="button" onClick={clickSignOut}>
            로그아웃
          </button>
        </li>
      </ul>
    </div>
  );
}
