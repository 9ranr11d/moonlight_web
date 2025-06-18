export * from "./date";
export * from "./msg";
export * from "./menu";
export * from "./map";

/** 메인 제목 */
export const MAIN_TITLE = "MOONLIGHT";

/** 도메인 */
export const MAIN_DOMAIN = "http://localhost:3000/";

/** 금칙어 목록 */
export const FORBIDDEN_WORDS = ["admin", "root", "system", "test"];

/** 보안 등급별 접근 권한 */
export const ACCESS_LEVEL = {
  ADMIN: 9,
  USER: 0,
};
