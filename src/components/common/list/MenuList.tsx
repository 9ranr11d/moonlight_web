import React, { createContext, useContext, ReactNode } from "react";

import styles from "./MenuList.module.css";
import { IMenus } from "@/constants";

/** Menu 목록 Context Interface */
interface IMenuListContext {
  /** Menu 클릭 시 */
  onMenuClick?: (path: string) => void;

  /** 선택된 경로 */
  activePath?: string;
}

/** Menu 목록 Context */
const MenuListContext = createContext<IMenuListContext>({});

/** Menu 목록 Interface */
interface IMenuList {
  /** Menu 클릭 시 */
  onMenuClick?: (path: string) => void;

  children: ReactNode;
  /** 선택된 경로 */
  activePath?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Menu Interface */
interface IMenuItem {
  /** 경로 */
  path: string;
  /** 내용 */
  value: IMenus;
  className?: string;
  style?: React.CSSProperties;
}

/** Menu 내용 Container */
interface IMenuListContainer {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Menu 목록 */
const MenuList = ({
  children,
  activePath,
  onMenuClick,
  className = "",
  style = {},
}: IMenuList) => {
  return (
    <MenuListContext.Provider value={{ activePath, onMenuClick }}>
      <ul className={`${styles.menuList} ${className}`} style={style}>
        {children}
      </ul>
    </MenuListContext.Provider>
  );
};

/** Menu */
const MenuItem = ({ path, value, className = "", style = {} }: IMenuItem) => {
  const { activePath, onMenuClick } = useContext(MenuListContext);

  /** 선택 여부 */
  const isActive = activePath === path;

  /** Menu 클릭 시 */
  const handleClick = () => {
    onMenuClick?.(path);
  };

  return (
    <li
      className={`${styles.menuItem} ${className}`}
      style={style}
      onClick={handleClick}
      data-active={isActive}
      data-path={path}
    >
      {value.icon}
    </li>
  );
};

/** Menu 내용 Container */
const MenuListContainer = ({
  children,
  className = "",
  style = {},
}: IMenuListContainer) => {
  return (
    <div className={`${styles.menuContainer} ${className}`} style={style}>
      {children}
    </div>
  );
};

MenuList.Item = MenuItem;
MenuList.Container = MenuListContainer;

export default MenuList;
