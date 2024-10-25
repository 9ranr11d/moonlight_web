import React from "react";

import Link from "next/link";

import CSS from "./Footer.module.css";

import { MAIN_TITLE } from "@constants/index";
import { MAIN_MENUS } from "@constants/menu";

/** Footer */
export default function Footer() {
  return (
    <footer>
      <h6 className={CSS.title}>{MAIN_TITLE}</h6>

      <nav>
        <ul className={CSS.menus}>
          {MAIN_MENUS.map((menu, idx) => (
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
