/** 오늘 날짜 */
const today = new Date();
/** 오늘 연도 */
const year = today.getFullYear();

/** 사이드 메뉴의 월 목록 */
export const monthDays: number[] = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** 달 이름 */
export const monthNames: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

/** 요일 이름 */
export const dayOfWeek: string[] = ["일", "월", "화", "수", "목", "금", "토"];
