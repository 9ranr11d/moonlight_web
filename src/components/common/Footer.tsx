"use client";

import React from "react";

import Link from "next/link";

import CSS from "./Footer.module.css";

import { mainTitle } from "@constants/index";
import { mainMenus } from "@constants/menu";

export default function Footer() {
  return (
    <footer>
      <h6 className={CSS.title}>{mainTitle}</h6>

      <nav>
        <ul className={CSS.menus}>
          {mainMenus.map((menu, idx) => (
            <li key={idx}>
              <Link href={menu.path}>{menu.title}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <p>© 2024 9ranr11d. All rights reserved.</p>
    </footer>
  );
}
