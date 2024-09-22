"use client";

import React, { useState } from "react";

import { useSearchParams } from "next/navigation";

import CSS from "./Profile.module.css";

import CoupleCodeManager from "@components/profile/CoupleCodeManager";
import ProfileEdit from "@components/profile/ProfileEdit";

/** 사용자 정보 수정 */
export default function Profile() {
  const findPageNum = (code: string | null): number => {
    if (!code) return 0;

    const idx = profileMenus.findIndex((_menu) => _menu.id === code);

    return idx !== -1 ? idx : 0;
  };

  /** 사용자 정보 수정 메뉴들 */
  const profileMenus = [
    {
      id: "edit",
      title: "사용자 정보 수정",
      content: <ProfileEdit changePage={(code) => changePage(code)} />,
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
  const initMenuIdx = findPageNum(menu);

  const [selectedMenu, setSelectedMenu] = useState<number>(initMenuIdx); // 선택된 메뉴

  /**
   * 메뉴 선택
   * @param idx 선택된 메뉴 순서
   */
  const selectMenu = (idx: number): void => {
    setSelectedMenu(idx);
  };

  const changePage = (code: string): void => {
    setSelectedMenu(findPageNum(code));
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
