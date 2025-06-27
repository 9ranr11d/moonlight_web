"use client";

import React, { useState } from "react";

import Container from "@/components/common/Container";
import MenuList from "@/components/common/list/MenuList";

import { IMenus, PROFILE_MENUS } from "@/constants";

import IconProfile from "@public/svgs/auth/icon_profile.svg";
import IconCoupleCode from "@public/svgs/auth/icon_couple_code.svg";
import IconNoEntry from "@public/svgs/common/icon_no_entry.svg";

/** 사용자 정보 수정 */
export default function Profile() {
  const menus: IMenus[] = PROFILE_MENUS.map(menu => {
    let icon: React.ReactNode;

    switch (menu.path) {
      case "profile":
        icon = <IconProfile width={24} height={24} fill="#fff" />;
        break;
      case "coupleCode":
        icon = <IconCoupleCode width={24} height={24} fill="#fff" />;
        break;
      default:
        icon = <IconNoEntry width={24} height={24} fill="#fff" />;
    }

    return {
      ...menu,
      icon,
    };
  });

  const [activePath, setActivePath] = useState<string>("profile");

  const handleMenuClick = (path: string) => {
    setActivePath(path);
  };

  return (
    // <Container style={{ padding: 0, paddingRight: 20 }}>
    //   <Container.Section
    //     style={{ display: "grid", gridTemplateColumns: "170px 1fr", flex: 1 }}
    //   >
    //     <IconProfile width={24} height={24} fill="#000" />
    //     {/* <MenuList activePath={activePath} onMenuClick={handleMenuClick}>
    //       {menus.map((menu, idx) => (
    //         <MenuList.Item key={idx} path={menu.path} value={menu} />
    //       ))}
    //     </MenuList>

    //     <MenuList.Container>
    //       <div style={{ padding: "20px" }}>
    //         {activePath === "profile" && <div>내 정보 페이지</div>}
    //         {activePath === "coupleCode" && <div>연인 식별자 페이지</div>}
    //       </div>
    //     </MenuList.Container> */}
    //   </Container.Section>
    // </Container>
    <div style={{ paddingTop: 200 }}>
      <IconProfile width={24} height={24} fill="black" />
    </div>
  );
}
