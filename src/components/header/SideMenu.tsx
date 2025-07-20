"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";

import { useSelector } from "react-redux";

import { RootState } from "@/store";

import { MAIN_MENUS } from "@/constants";

import useSignOut from "@/hooks/useSignOut";

import styles from "./SideMenu.module.css";

import NotificationBtn from "@/components/NotificationBtn";

import ImgProfile from "@public/imgs/auth/img_profile.png";

import IconDoubleGreaterThen from "@public/svgs/common/icon_double_greater_then.svg";
import IconProfile from "@public/svgs/auth/icon_profile.svg";
import IconLogout from "@public/svgs/auth/icon_logout.svg";
import IconCalendar from "@public/svgs/calendar/icon_calendar.svg";
import IconMap from "@public/svgs/map/icon_map.svg";

/** 측면 Menu  */
interface ISideMenu {
  /** 닫기 */
  onClose: () => void;

  /** 열림 */
  isOpen: boolean;
}

/** 측면 Menu */
export default function SideMenu({ isOpen, onClose }: ISideMenu) {
  const router = useRouter();

  const { nickname, profileImgUrl } = useSelector(
    (state: RootState) => state.auth
  ); // 사용자 별칭

  const signOut = useSignOut();

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const getMenuIcon = (path: string) => {
    switch (path) {
      case "/calendar":
        return <IconCalendar width={18} height={18} fill="var(--black-700a)" />;
      case "/map":
        return <IconMap width={18} height={18} fill="var(--black-700a)" />;
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.sideMenu} ${isOpen ? styles.open : ""}`}>
      <div className={styles.sideMenuHeader}>
        <div className={styles.profileSection}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 15,
              position: "relative",
              width: "100%",
              justifyContent: "space-between",
              padding: "0 10px",
            }}
          >
            <button type="button" className="iconBtn" onClick={onClose}>
              <IconDoubleGreaterThen
                width={15}
                height={15}
                fill="var(--black-700a)"
              />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Image
                src={profileImgUrl || ImgProfile}
                width={23}
                height={23}
                alt="프로필 이미지"
                className={styles.profileImage}
              />

              <p style={{ fontSize: 16 }}>{nickname}님</p>

              <NotificationBtn count={10} />
            </div>
          </div>

          <div className={styles.profileActions}>
            <button type="button" onClick={handleProfileClick}>
              <IconProfile width={15} height={15} fill="white" />

              <span>정보</span>
            </button>

            <button type="button" onClick={signOut}>
              <IconLogout width={15} height={15} fill="white" />

              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      <ul className={styles.menuList}>
        {MAIN_MENUS.map((menu, idx) => (
          <li key={idx} className={styles.menuItem}>
            {getMenuIcon(menu.path)}

            <Link href={menu.path}>
              <p>{menu.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
