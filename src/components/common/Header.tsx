"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { refreshAccessToken } from "@redux/slices/AuthSlice";
import { hideBackdrop, showBackdrop } from "@redux/slices/BackdropSlice";

import CSS from "./Header.module.css";

import { MAIN_MENUS } from "@constants/menu";

import { getUser } from "@utils/index";

import ProfileModal from "../profile/ProfileModal";

import IconLogoSquare from "@public/img/common/icon_logo_square.svg";
import IconLogoHorizontal from "@public/img/common/icon_logo_horizontal.svg";
import IconHamburger from "@public/img/common/icon_hamburger_black.svg";
import IconClose from "@public/img/common/icon_greater_than_black.svg";
import Backdrop from "./Backdrop";

/** Header */
export default function Header() {
  /** Router */
  const router = useRouter();
  /** 현재 도메인 경로 */
  const pathname = usePathname();

  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authReducer);
  /** Backdrop */
  const backdrop = useSelector((state: RootState) => state.backdropReducer);

  const [isHidden, setIsHidden] = useState<boolean>(false); // 로그인 전 로고 불가시 여부
  const [isUserPanelOpen, setIsUserPanelOpen] = useState<boolean>(false); // 사용자 Panel 열기 여부
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false); // 사이드 메뉴 가시 여부

  /** Refresh Token 확인 */
  const getRefreshAccessToken = (): void => {
    fetch("/api/auth/refreshAccessToken")
      .then(res => {
        if (res.ok) return res.json();

        // 유효한 Refresh Access Token이 없을 시 시작화면으로 이동
        if (res.status === 400 || res.status === 404) router.push("/");

        return res.json().then(data => Promise.reject(data.msg));
      })
      // Refresh Token으로 Access Token 재발급 후, AuthSlice(Redux)에 저장
      .then(data => dispatch(refreshAccessToken({ accessToken: data.accessToken })))
      .catch(err => console.error("/src/components/common/Header > Header() > getRefreshAccessToken()에서 오류가 발생했습니다. :", err));
  };

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

  /** 로그인 전 로고 불가시 여부 */
  const hiddenBeforeLogo = (): void => {
    if (user.isAuth && user.accessLevel >= 1) {
      setIsHidden(true);
    }
  };

  /** 사용자 정보 창 닫기 */
  const closeUserPanel = (): void => {
    setIsUserPanelOpen(false);
  };

  // Access Token, Refresh Token으로 자동 로그인
  useEffect(() => {
    // 이미 로그인이 된 상태면 패스
    if (user.isAuth) return;
    else setIsHidden(false);

    // AccessToken이 있는지, 없는지
    if (user.accessToken.length !== 0) getUser(user.accessToken, dispatch);
    else getRefreshAccessToken();
  }, [user]);

  // 50분마다 Access Token 자동 재발급
  useEffect(() => {
    const interval = setInterval(() => {
      getRefreshAccessToken();
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
    <header style={user.isAuth ? { zIndex: 999 } : undefined}>
      <nav style={user.isAuth && user.accessLevel >= 1 ? undefined : { height: 0, padding: 0 }}>
        <div className={CSS.afterSignInBox} style={user.isAuth && user.accessLevel >= 1 ? { bottom: 0 } : { bottom: 50, opacity: 0 }}>
          <div className={CSS.logoBox}>
            <Link prefetch={true} href={"/"}>
              <Image src={IconLogoHorizontal} width={150} alt="Logo" />
            </Link>
          </div>

          <div className={CSS.menuBox}>
            <ul>
              {MAIN_MENUS.map((menu, idx) => (
                <li key={idx}>
                  <Link href={menu.path}>{menu.title}</Link>
                </li>
              ))}
              <li>
                <button type="button" onClick={toggleUserPanel}>
                  {user.nickname}
                </button>

                {isUserPanelOpen && <ProfileModal closeModal={closeUserPanel} />}
              </li>
            </ul>

            <button type="button" onClick={toggleSideMenu} className={CSS.mobile}>
              <Image src={IconHamburger} width={24} alt="=" />
            </button>
          </div>
        </div>

        <div
          className={CSS.beforeSignInBox}
          style={
            isHidden
              ? { display: "none" } // 애니메이션 후에 display: none 설정
              : user.isAuth && user.accessLevel >= 1
              ? { top: -30, opacity: 0 } // top과 opacity 애니메이션
              : { top: 30 }
          }
          onTransitionEnd={hiddenBeforeLogo}
        >
          <Link prefetch={true} href={"/"}>
            <Image src={IconLogoSquare} width={100} priority alt="Logo" />
          </Link>
        </div>
      </nav>

      <Backdrop />

      <div className={CSS.sideMenu} style={{ right: isSideMenuOpen ? 0 : "-100%" }}>
        <div className={CSS.sideMenuHeader}>
          <button type="button" onClick={toggleSideMenu}>
            <Image src={IconClose} alt="X" width={24} />
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
