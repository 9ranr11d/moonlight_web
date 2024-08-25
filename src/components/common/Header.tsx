"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { refreshAccessToken } from "@redux/slices/AuthSlice";

import CSS from "./Header.module.css";

import { getUser } from "@utils/utils";

import ProfileModal from "./ProfileModal";

import IconLogoBlack from "@public/img/common/icon_logo_black.svg";
import IconLogoWhite from "@public/img/common/icon_logo_white.svg";
import IconHamburger from "@public/img/common/icon_hamburger_black.svg";
import IconClose from "@public/img/common/icon_greater_than_black.svg";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authReducer);

  const menus = ["투 두 리스트", "버킷 리스트", "다이어리", "지도", "전국 일주"];

  const [isUserPanelOpen, setIsUserPanelOpen] = useState<boolean>(false); // 사용자 Panel 열기 여부
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);

  // Access Token, Refresh Token으로 자동 로그인
  useEffect(() => {
    // 이미 로그인이 된 상태면 패스
    if (user.isAuth) return;

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

  useEffect(() => {
    setIsUserPanelOpen(false);
    setIsSideMenuOpen(false);
  }, [pathname]);

  /** 사용자 Panel Toggle */
  const toggleUserPanel = (): void => {
    setIsUserPanelOpen((prev) => !prev);
  };

  const toggleSideMenu = (): void => {
    setIsSideMenuOpen((prev) => !prev);
  };

  const closeUserPanel = (): void => {
    setIsUserPanelOpen(false);
  };

  /** Refresh Token 확인 */
  const getRefreshAccessToken = (): void => {
    fetch("/api/auth/refresh_access_token")
      .then((res) => {
        if (res.ok) return res.json();

        // 유효한 Refresh Access Token이 없을 시 시작화면으로 이동
        if (res.status === 400 || res.status === 404) router.push("/");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      // Refresh Token으로 Access Token 재발급 후, AuthSlice(Redux)에 저장
      .then((data) => dispatch(refreshAccessToken({ accessToken: data.accessToken })))
      .catch((err) => console.error("Error in /src/components/common/Header > Header() > getRefreshAccessToken() :", err));
  };

  return (
    <header className={CSS.header} style={user.isAuth ? { zIndex: 999 } : undefined}>
      <nav style={user.isAuth && user.accessLevel >= 1 ? undefined : { height: 0, padding: 0 }}>
        <div className={CSS.afterSignInBox} style={user.isAuth && user.accessLevel >= 1 ? { bottom: 0 } : { bottom: 50, opacity: 0 }}>
          <div className={CSS.logoBox}>
            <Link prefetch={true} href={"/"}>
              <Image src={IconLogoBlack} width={24} alt="Logo" />
            </Link>
          </div>

          <div className={CSS.menuBox}>
            <ul>
              {menus.map((menu, idx) => (
                <li key={idx}>
                  <button type="button" onClick={() => alert(menu)}>
                    {menu}
                  </button>
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

        <div className={CSS.beforeSignInBox} style={user.isAuth && user.accessLevel >= 1 ? { top: -30, opacity: 0 } : { top: 30 }}>
          <Link prefetch={true} href={"/"}>
            <Image src={IconLogoWhite} width={66} priority alt="Logo" />
          </Link>
        </div>
      </nav>

      {isSideMenuOpen && (
        <div className={CSS.background}>
          <button type="button" onClick={toggleSideMenu} />
        </div>
      )}

      <div className={CSS.sideMenu} style={{ right: isSideMenuOpen ? 0 : "-100%" }}>
        <div className={CSS.sideMenuHeader}>
          <button type="button" onClick={toggleSideMenu}>
            <Image src={IconClose} alt="X" width={24} />
          </button>

          <button type="button" onClick={() => alert("내 정보")}>
            <h6>{user.nickname}님</h6>
          </button>
        </div>

        <ul>
          {menus.map((menu, idx) => (
            <li key={idx}>
              <button type="button" onClick={() => alert(menu)}>
                <h6>{menu}</h6>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
