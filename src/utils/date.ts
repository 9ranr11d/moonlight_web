/**
 * 시간 형식 설정
 * @param time 시간
 * @returns mm:ss
 */
export const formatTime = (time: number): string => {
  /** 분 */
  const minute = Math.floor(time / 60);
  /** 초 */
  const second = time % 60;

  /** 형식 변경된 분 */
  const paddedMinutes = String(minute).padStart(2, "0");
  /** 형식 변경된 초 */
  const paddedSecond = String(second).padStart(2, "0");

  return `${paddedMinutes}:${paddedSecond}`;
};

/**
 * 날짜 형식 설정
 * @param year 년
 * @param month 월
 * @param day 일
 * @param splitter 구분 문자
 * @returns YYYY MM DD
 */
export const formatDateI = (
  year: number,
  month: number,
  day: number,
  splitter: string = "."
): string => {
  /** 형식 변경된 달 */
  const paddedMonth = String(month).padStart(2, "0");
  /** 형식 변경된 일 */
  const paddedDay = String(day).padStart(2, "0");

  return `${year}${splitter}${paddedMonth}${splitter}${paddedDay}`;
};

/**
 * 날짜 형식 설정
 * @param date 날짜
 * @param splitter 구분 문자
 * @returns YYYY MM DD
 */
export const formatDateII = (date: Date, splitter?: string): string => {
  /** 연도 */
  const year = date.getFullYear();
  /** 달 */
  const month = date.getMonth() + 1;
  /** 일 */
  const day = date.getDate();

  return formatDateI(year, month, day, splitter);
};

/** 윤년 여부를 판단하는 함수 */
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/** 해당 연도의 월별 일수를 반환하는 함수 */
export const getMonthDays = (year: number): number[] => [
  31,
  isLeapYear(year) ? 29 : 28,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31,
];
