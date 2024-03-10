"use client";

import React from "react";

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

  /** 로그아웃 */
  const handleSignOut = (): void => {
    fetch("/api/sign_out", { method: "POST" })
      .then((res: Response): any => {
        if (res.ok) return res.json();

        return res.json().then((data: any) => Promise.reject(data.msg));
      })
      .then((data: any) => {
        alert("로그아웃 됐습니다.");
        console.log(data.msg);

        dispatch(signOut());
      })
      .catch((err: Error): void => console.error("Handle Sign Out :", err));
  };

  return (
    <header className={CSS.header}>
      <nav>
        <div className={CSS.logoBox}>
          <Link href={"/"}>
            <h5>MOONLIGHT</h5>
          </Link>
        </div>

        {user.value.isAuth && (
          <>
            <div className={CSS.menuBox}>
              <ul>
                <li>투 두 리스트</li>
                <li>버킷 리스트</li>
                <li>다이어리</li>
                <li>지도</li>
                <li>전국 일주</li>
              </ul>
            </div>

            <div>
              <button type="button" onClick={() => console.log("hi")}>
                {user.value.nickname}
              </button>

              <div>
                <button type="button" onClick={handleSignOut}>
                  로그아웃
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
