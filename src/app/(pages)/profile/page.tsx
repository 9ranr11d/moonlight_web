"use client";

import React, { useState } from "react";

import { useSearchParams } from "next/navigation";

import CSS from "./Profile.module.css";

import CoupleCodeManager from "@components/auth/CoupleCodeManager";

export default function Profile() {
  const profileMenu = [
    {
      id: "code",
      title: "커플 코드 관리",
      content: <CoupleCodeManager />,
    },
  ];

  const searchParams = useSearchParams();
  const menu = searchParams.get("menu");

  const initMenuIdx = profileMenu.findIndex((_menu) => _menu.id === menu);

  const [selectedMenu, setSelectedMenu] = useState<number>(initMenuIdx !== -1 ? initMenuIdx : 0);

  const selectMenu = (menu: number): void => {
    setSelectedMenu(menu);
  };

  return (
    <main className={CSS.background}>
      <div className={CSS.sideMenu}>
        <ul>
          {profileMenu.map((menu, idx) => (
            <li key={idx}>
              <button type="button" onClick={() => selectMenu(idx)} className={selectedMenu === idx ? CSS.selected : undefined}>
                {menu.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={CSS.content}>{profileMenu[selectedMenu].content}</div>
    </main>
  );
}
