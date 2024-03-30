import Cookies from "universal-cookie";

/** Cookie */
const cookies = new Cookies();

/** Cookie 저장 */
export const setCookie = (name: string, value: string, option?: any) => cookies.set(name, value, { ...option });

/** Cookie 가져오기 */
export const getCookie = (name: string) => cookies.get(name);

/** Cookie 삭제 */
export const removeCookie = (name: string, option?: any) => cookies.remove(name, { ...option });
