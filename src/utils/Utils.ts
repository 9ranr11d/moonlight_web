import { AppDispatch } from "@redux/store";
import { signOut } from "@redux/slices/AuthSlice";

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

export const convertDateII = (date: Date, splitter: string): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return convertDateI(year, month, day, splitter);
};

/**
 * 날짜 형식 설정
 * @param year 년
 * @param month 월
 * @param day 일
 * @param splitter 구분 문자
 * @returns YYYY MM DD
 */
export const convertDateI = (year: number, month: number, day: number, splitter: string): string => {
  const paddedMonth = String(month).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");

  return `${year}${splitter}${paddedMonth}${splitter}${paddedDay}`;
};

export const processSignOut = (confirmDesc: string, dispatch: AppDispatch): boolean => {
  const confirmSignOut: boolean = window.confirm(confirmDesc);

  if (!confirmSignOut) return false;

  fetch("/api/auth/sign_out", { method: "POST" })
    .then((res) => {
      if (res.ok) return res.json();

      alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

      return res.json().then((data) => Promise.reject(data.msg));
    })
    .then((data) => {
      console.log(data.msg);

      alert("로그아웃 됐습니다.");

      dispatch(signOut());
    })
    .catch((err) => console.error("Process Sign Out :", err));

  return true;
};
