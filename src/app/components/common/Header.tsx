"use client";

import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";

import CSS from "./header.module.css";

import { processSignOut } from "@utils/utils";

import IconLogoBlack from "@public/img/common/icon_logo_black.svg";
import IconLogoWhite from "@public/img/common/icon_logo_white.svg";

export default function Header() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authReducer);

  const [isUserPanelOpen, setIsUserPanelOpen] = useState<boolean>(false); // 사용자 Panel 열기 여부

  /** 사용자 Panel Toggle */
  const toggleUserPanel = (): void => {
    setIsUserPanelOpen((prev) => !prev);
  };

  const clickSignOut = () => {
    if (processSignOut("로그아웃 하시겠습니까?", dispatch)) setIsUserPanelOpen(false);
  };

  return (
    <header className={CSS.header}>
      <nav style={user.isAuth && user.accessLevel >= 1 ? undefined : { height: 0, padding: 0 }}>
        <div className={CSS.afterSignInBox} style={user.isAuth && user.accessLevel >= 1 ? { bottom: 0 } : { bottom: 50, opacity: 0 }}>
          <div className={CSS.logoBox}>
            <Link prefetch={true} href={"/"}>
              <Image src={IconLogoBlack} width={24} alt="Logo" />
            </Link>
          </div>

          <div className={CSS.menuBox}>
            <ul>
              <li>투 두 리스트</li>
              <li>버킷 리스트</li>
              <li>다이어리</li>
              <li>지도</li>
              <li>전국 일주</li>
              <li>
                <button type="button" onClick={toggleUserPanel}>
                  {user.nickname}
                </button>

                <div className={CSS.option} style={isUserPanelOpen ? undefined : { display: "none" }}>
                  <h6>{user.nickname}님</h6>

                  <ul>
                    <li>
                      <button type="button" onClick={(): void => console.log("hi")}>
                        정보
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={clickSignOut}>
                        로그아웃
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className={CSS.beforeSignInBox} style={user.isAuth && user.accessLevel >= 1 ? { top: -30, opacity: 0 } : { top: 30 }}>
          <Link prefetch={true} href={"/"}>
            <Image src={IconLogoWhite} width={66} priority alt="Logo" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
