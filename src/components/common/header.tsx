"use client";

import React from "react";

import Link from "next/link";

import CSS from "./header.module.css";

export default function Header() {
  return (
    <header className={CSS.header}>
      <nav>
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
          </ul>
        </div>
      </nav>
    </header>
  );
}
