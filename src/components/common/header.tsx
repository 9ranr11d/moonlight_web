"use client";

import React, { useState } from "react";

import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { signOut } from "@redux/slices/AuthSlice";

import CSS from "./header.module.css";

export default function Header() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authReducer);

  const [isUserPanelOpen, setIsUserPanelOpen] = useState<boolean>(false); // 사용자 Panel 열기 여부

  /** 사용자 Panel Toggle */
  const handleUserPanel = (): void => {
    setIsUserPanelOpen(!isUserPanelOpen);
  };

  /** 로그아웃 */
  const handleSignOut = (): void => {
    const confirmSignOut: boolean = window.confirm("로그아웃 하시겠습니까?");

    if (!confirmSignOut) return;

    setIsUserPanelOpen(false);

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
    <header className={CSS.header}>
      <nav style={user.isAuth && user.accessLevel >= 1 ? undefined : { height: 0, padding: 0 }}>
        <div className={CSS.afterSignInBox} style={user.isAuth && user.accessLevel >= 1 ? { bottom: 0 } : { bottom: 50, opacity: 0 }}>
          <div className={CSS.logoBox}>
            <Link href={"/"}>
              <h5>MOONLIGHT</h5>
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
                <button type="button" onClick={handleUserPanel}>
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
                      <button type="button" onClick={handleSignOut}>
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
          <Link href={"/"}>
            <h1>MOONLIGHT</h1>
          </Link>
        </div>
      </nav>
    </header>
  );
}
