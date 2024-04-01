/**
 * 시간 형식 설정
 * @param time 시간
 * @returns mm:ss
 */
export const convertToMinutes = (time: number): string => {
  const minute = Math.floor(time / 60);
  const second = time % 60;

  const paddedMinutes = String(minute).padStart(2, "0");
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
export const convertDate = (year: number, month: number, day: number, splitter: string): string => {
  const paddedMonth = String(month).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");

  return `${year}${splitter}${paddedMonth}${splitter}${paddedDay}`;
};
