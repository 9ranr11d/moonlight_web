"use client";

import React, { useState } from "react";

import { useSearchParams } from "next/navigation";

import CSS from "./Profile.module.css";

import CoupleCodeManager from "@components/profile/CoupleCodeManager";
import ProfileEdit from "@components/profile/ProfileEdit";

/** 사용자 정보 수정 */
export default function Profile() {
  /** 사용자 정보 수정 메뉴들 */
  const profileMenus = [
    {
      id: "edit",
      title: "사용자 정보 수정",
      content: <ProfileEdit />,
    },
    {
      id: "code",
      title: "커플 코드 관리",
      content: <CoupleCodeManager />,
    },
  ];

  /** 도메인 쿼리 변수들 */
  const searchParams = useSearchParams();
  /** 처음 선택된 메뉴 */
  const menu = searchParams.get("menu");
  /** 처음 선택된 메뉴 순서 */
  const initMenuIdx = profileMenus.findIndex((_menu) => _menu.id === menu);

  const [selectedMenu, setSelectedMenu] = useState<number>(initMenuIdx !== -1 ? initMenuIdx : 0); // 선택된 메뉴

  /**
   * 메뉴 선택
   * @param menu 선택된 메뉴 순서
   */
  const selectMenu = (menu: number): void => {
    setSelectedMenu(menu);
  };

  return (
    <main className={CSS.background}>
      <div className={CSS.sideMenu}>
        <ul>
          {profileMenus.map((menu, idx) => (
            <li key={idx}>
              <button type="button" onClick={() => selectMenu(idx)} className={selectedMenu === idx ? CSS.selected : undefined}>
                {menu.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={CSS.content}>{profileMenus[selectedMenu].content}</div>
    </main>
  );
}
