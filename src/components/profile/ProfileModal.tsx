"use client";

import React from "react";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { useSelector } from "react-redux";

import { RootState } from "@/store";

import useSignOut from "@/hooks/useSignOut";

import styles from "./ProfileModal.module.css";

import CloseBtn from "@/components/common/btns/CloseBtn";

import IconProfile from "@public/svgs/auth/icon_profile.svg";
import IconLogout from "@public/svgs/auth/icon_logout.svg";
import ProfileImage from "./ProfileImage";

/** 사용자 정보 수정 모달 Interface */
interface IProfileModal {
  /** 닫기 */
  closeModal: () => void;
}

/** 사용자 정보 수정 모달 */
export default function ProfileModal({ closeModal }: IProfileModal) {
  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const signOut = useSignOut();

  const handleProfileClick = () => {
    closeModal();
    router.push("/profile");
  };

  return (
    <div className={styles.modal}>
      <div style={{ position: "absolute", top: 5, right: 5 }}>
        <CloseBtn onClick={closeModal} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 10,
          paddingTop: 20,
        }}
      >
        <ProfileImage
          size={70}
          style={{ background: "var(--background-color)" }}
          profileImgUrl={user.profileImgUrl || undefined}
          nickname={user.nickname || undefined}
          identification={user.identification}
        />
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: 16,
          marginBottom: 10,
        }}
      >
        {user.nickname}님
      </p>

      <div className={styles.profileActions}>
        <button type="button" onClick={handleProfileClick}>
          <IconProfile width={15} height={15} fill="white" />

          <span>정보</span>
        </button>

        <button type="button" className={styles.logoutBtn} onClick={signOut}>
          <IconLogout width={15} height={15} fill="white" />

          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
}
