import Cookies from "universal-cookie";

/** Cookie */
const cookies = new Cookies();

/**
 * Cookie 저장
 * @param name 이름
 * @param value 값
 * @param option 추가 설정
 */
export const setCookie = (name: string, value: string, option?: any): void =>
  cookies.set(name, value, { ...option });

/**
 * Cookie 가져오기
 * @param name 이름
 * @returns 쿠키 정보
 */
export const getCookie = (name: string): void => cookies.get(name);

/**
 *  Cookie 삭제
 * @param name 이름
 * @param option 추가 설정
 */
export const removeCookie = (name: string, option?: any): void =>
  cookies.remove(name, { ...option });
