"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import { hideBackdrop, showBackdrop } from "@redux/slices/backdropSlice";

import {
  checkRefreshTokenAction,
  getUserByAccessTokenAction,
  socialSignInAction,
} from "@actions/authAction";

import styles from "./Header.module.css";

import { MAIN_MENUS } from "@constants/menu";

import ProfileModal from "@components/profile/ProfileModal";

import Backdrop from "@components/common/Backdrop";

import IconLogoSquare from "@public/svgs/common/icon_logo_square.svg";
import IconLogoHorizontal from "@public/svgs/common/icon_logo_horizontal.svg";
import IconThreeBar from "@public/svgs/common/icon_three_bar.svg";
import IconClose from "@public/svgs/common/icon_greater_than.svg";

/** Header */
export default function Header() {
  /** Router */
  const router = useRouter();
  /** 현재 도메인 경로 */
  const pathname = usePathname();

  const { data: session } = useSession();

  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authSlice);
  /** Backdrop */
  const backdrop = useSelector((state: RootState) => state.backdropSlice);

  const [isHidden, setIsHidden] = useState<boolean>(false); // 로그인 전 로고 불가시 여부
  const [isUserPanelOpen, setIsUserPanelOpen] = useState<boolean>(false); // 사용자 Panel 열기 여부
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false); // 사이드 메뉴 가시 여부

  /** Auth 여부 */
  const isAuth = user.isAuth && (user.email || user.phoneNumber);

  /** 사용자 Panel Toggle */
  const toggleUserPanel = (): void => {
    setIsUserPanelOpen(prev => !prev);
  };

  /** 사이드 메뉴 Toogle */
  const toggleSideMenu = (): void => {
    if (isSideMenuOpen) dispatch(hideBackdrop());
    else dispatch(showBackdrop());

    setIsSideMenuOpen(prev => !prev);
  };

  /** 로그인 전 로고 가시 여부 */
  const hiddenBeforeLogo = (): void => {
    if (isAuth) setIsHidden(true);
  };

  /** 사용자 정보 창 닫기 */
  const closeUserPanel = (): void => {
    setIsUserPanelOpen(false);
  };

  // 소셜 로그인 정보가 있을 시
  useEffect(() => {
    if (session?.user && session.user.id)
      dispatch(socialSignInAction(session.user.id));
  }, [session]);

  // Access Token, Refresh Token으로 자동 로그인
  useEffect(() => {
    // 이미 로그인이 된 상태면 패스
    if (isAuth) return;
    // 로그인 상태가 아닐 시
    else router.push("/");

    setIsHidden(false);

    // AccessToken이 있는지, 없는지
    if (user.accessToken.length !== 0)
      dispatch(getUserByAccessTokenAction({ accessToken: user.accessToken }));
    else dispatch(checkRefreshTokenAction());
  }, [user.accessToken, user.isAuth, user.email, user.phoneNumber]);

  // 50분마다 Access Token 자동 재발급
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkRefreshTokenAction());
    }, 50 * 60 * 1000);

    // 로그아웃 시 Access Token 자동 재발급 취소
    if (!user.isAuth) return clearInterval(interval);

    return () => clearInterval(interval);
  }, [user.accessToken]);

  // 도메인 경로 변경 시 메뉴 불가시로 설정
  useEffect(() => {
    setIsUserPanelOpen(false);
    setIsSideMenuOpen(false);

    dispatch(hideBackdrop());
  }, [pathname]);

  // Backdrop이랑 SideMenu 동조화
  useEffect(() => {
    if (!backdrop.isVisible) setIsSideMenuOpen(false);
  }, [backdrop.isVisible]);

  return (
    <header style={isAuth ? { zIndex: 999 } : undefined}>
      <nav style={isAuth ? undefined : { height: 0, padding: 0 }}>
        <div
          className={styles.afterSignInBox}
          style={isAuth ? { bottom: 0 } : { bottom: 50, opacity: 0 }}
        >
          <div className={styles.logoBox}>
            <Link prefetch={true} href={"/"}>
              <IconLogoHorizontal width={150} height={34} />
            </Link>
          </div>

          <div className={styles.menuBox}>
            <ul>
              {MAIN_MENUS.map((menu, idx) => (
                <li key={idx}>
                  <Link href={menu.path}>{menu.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={toggleUserPanel}
              className="noOutlineBtn"
            >
              {user.nickname}
            </button>

            {isUserPanelOpen && <ProfileModal closeModal={closeUserPanel} />}

            <button
              type="button"
              onClick={toggleSideMenu}
              className={styles.mobile}
            >
              <IconThreeBar width={24} height={24} fill={"var(--gray-500)"} />
            </button>
          </div>
        </div>

        <div
          className={styles.beforeSignInBox}
          style={
            isHidden
              ? { display: "none" } // 애니메이션 후에 display: none 설정
              : isAuth
              ? { top: -30, opacity: 0 } // top과 opacity 애니메이션
              : { top: 30 }
          }
          onTransitionEnd={hiddenBeforeLogo}
        >
          <Link prefetch={true} href={"/"}>
            <IconLogoSquare width={100} height={100} />
          </Link>
        </div>
      </nav>

      <Backdrop />

      <div
        className={styles.sideMenu}
        style={{ right: isSideMenuOpen ? 0 : "-100%" }}
      >
        <div className={styles.sideMenuHeader}>
          <button type="button" onClick={toggleSideMenu}>
            <IconClose
              alt="X"
              width={24}
              height={24}
              fill={"var(--gray-500)"}
            />
          </button>

          <Link href={"/profile"}>
            <button type="button">
              <h6>{user.nickname}님</h6>
            </button>
          </Link>
        </div>

        <ul>
          {MAIN_MENUS.map((menu, idx) => (
            <li key={idx}>
              <Link href={menu.path}>{menu.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
