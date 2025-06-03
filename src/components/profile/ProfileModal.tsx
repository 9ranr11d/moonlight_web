"use client";

import React from "react";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";

import { signOut as socialSignOut } from "next-auth/react";

import { AppDispatch, RootState } from "@redux/store";

import { signOutAction } from "@actions/authAction";

import styles from "./ProfileModal.module.css";

import ImgProfile from "@public/imgs/auth/img_profile.png";
import CloseBtn from "@components/common/btn/CloseBtn";

/** 사용자 정보 수정 모달 Interface */
interface IProfileModal {
  /** 닫기 */
  closeModal: () => void;
}

/** 사용자 정보 수정 모달 */
export default function ProfileModal({ closeModal }: IProfileModal) {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authSlice);

  /** '로그아웃' 클릭 시 */
  const clickSignOut = () => {
    if (!window.confirm("로그아웃 하시겠습니까?")) return;

    if (user.provider === "local") dispatch(signOutAction());
    else socialSignOut();

    closeModal();
  };

  return (
    <div className={styles.modal}>
      <div style={{ position: "absolute", top: 5, right: 5 }}>
        <CloseBtn onClick={closeModal} />
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 5 }}
      >
        <Image
          src={user.profileImgUrl || ImgProfile}
          width={70}
          height={70}
          alt="프로필 이미지"
        />
      </div>

      <p style={{ textAlign: "center", fontSize: 16, marginBottom: 10 }}>
        {user.nickname}님
      </p>

      <ul>
        <li>
          <button type="button" className="noOutlineBtn">
            정보
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`noOutlineBtn ${styles.logoutBtn}`}
            onClick={clickSignOut}
          >
            로그아웃
          </button>
        </li>
      </ul>
    </div>
  );
}
