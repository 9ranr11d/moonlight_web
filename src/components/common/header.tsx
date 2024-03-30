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

  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false); // 사용자 Panel 열기 여부

  /** 사용자 Panel Toggle */
  const handleUserPanel = (): void => {
    setIsUserPanelOpen(!isUserPanelOpen);
  };

  /** 로그아웃 */
  const handleSignOut = (): void => {
    const confirmSignOut = window.confirm("로그아웃 하시겠습니까?");

    if (confirmSignOut) {
      setIsUserPanelOpen(false);

      fetch("/api/auth/sign_out", { method: "POST" })
        .then((res) => {
          if (res.ok) return res.json();

          return res.json().then((data) => Promise.reject(data.msg));
        })
        .then((data) => {
          alert("로그아웃 됐습니다.");
          console.log(data.msg);

          dispatch(signOut());
        })
        .catch((err) => console.error("Handle Sign Out :", err));
    }
  };

  return (
    <header className={CSS.header}>
      <nav style={user.value.isAuth ? undefined : { height: 0, padding: 0 }}>
        <div className={CSS.afterSignInBox} style={user.value.isAuth ? { bottom: 0 } : { bottom: 50, opacity: 0 }}>
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
                  {user.value.nickname}
                </button>

                <div className={CSS.option} style={isUserPanelOpen ? undefined : { display: "none" }}>
                  <h6>{user.value.nickname}님</h6>

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

        <div className={CSS.beforeSignInBox} style={user.value.isAuth ? { top: -30, opacity: 0 } : { top: 30 }}>
          <Link href={"/"}>
            <h1>MOONLIGHT</h1>
          </Link>
        </div>
      </nav>
    </header>
  );
}
