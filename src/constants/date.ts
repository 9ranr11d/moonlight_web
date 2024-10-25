/** 오늘 날짜 */
const today = new Date();
/** 오늘 연도 */
const year = today.getFullYear();

/** 달의 일수 */
export const MONTH_DAYS: number[] = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** 달 이름 */
export const MONTH_NAMES: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

/** 요일 이름 */
export const DAY_OF_WEEK: string[] = ["일", "월", "화", "수", "목", "금", "토"];
