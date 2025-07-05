"use client";

import React, { useState } from "react";

import IconUser from "@public/svgs/auth/icon_user.svg";
import IconCoupeCode from "@public/svgs/auth/icon_couple_code.svg";
import Container from "@/components/common/Container";
import MenuList from "@/components/common/list/MenuList";
import { PROFILE_MENUS } from "@/constants";

export default function Page() {
  const [selectedMenu, setSelectedMenu] = useState<string>("profile");

  const profileMenusWithIcons = [
    {
      ...PROFILE_MENUS[0],
      icon: <IconUser width={18} height={18} />,
    },
    {
      ...PROFILE_MENUS[1],
      icon: <IconCoupeCode width={18} height={18} />,
    },
  ];

  const handleMenuClick = (path: string) => {
    setSelectedMenu(path);
  };

  const renderMenuContent = () => {
    switch (selectedMenu) {
      case "profile":
        return (
          <div>
            <h2>내 정보</h2>
            <p>사용자 정보를 관리할 수 있습니다.</p>
            {/* TODO: 사용자 정보 폼 또는 정보 표시 컴포넌트 추가 */}
          </div>
        );
      case "coupleCode":
        return (
          <div>
            <h2>연인 식별자</h2>
            <p>연인과 연결하기 위한 코드를 관리할 수 있습니다.</p>
            {/* TODO: 연인 코드 관리 컴포넌트 추가 */}
          </div>
        );
      default:
        return <div>메뉴를 선택해주세요.</div>;
    }
  };

  return (
    <Container style={{ padding: 0 }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          flex: 1,
        }}
      >
        <MenuList
          onMenuClick={handleMenuClick}
          activePath={selectedMenu}
          style={{
            width: "250px",
            flexShrink: 0,
          }}
        >
          {profileMenusWithIcons.map((menu, index) => (
            <MenuList.Item key={index} path={menu.path} value={menu} />
          ))}
        </MenuList>

        <MenuList.Container style={{ flex: 1 }}>
          {renderMenuContent()}
        </MenuList.Container>
      </div>
    </Container>
  );
}
