export interface IMenus {
  title: string;
  path: string;
  icon?: React.ReactNode;
}

/** 메인 메뉴들 */
export const MAIN_MENUS: IMenus[] = [
  // { title: "투 두 리스트", path: "/" },
  // { title: "버킷 리스트", path: "/" },
  // { title: "다이어리", path: "/" },
  { title: "캘린더", path: "/calendar" },
  { title: "지도", path: "/map" },
  // { title: "전국 일주", path: "/" },
];

export const PROFILE_MENUS: IMenus[] = [
  { title: "내 정보", path: "profile" },
  { title: "연인 식별자", path: "coupleCode" },
];
