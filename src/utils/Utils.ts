import { AppDispatch } from "@redux/store";
import { signOut } from "@redux/slices/AuthSlice";

/**
 * 시간 형식 설정
 * @param time 시간
 * @returns mm:ss
 */
export const convertToMinutes = (time: number): string => {
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
export const convertDateI = (year: number, month: number, day: number, splitter: string): string => {
  /** 형식 변경된 달 */
  const paddedMonth = String(month).padStart(2, "0");
  /** 형식 변경된 일 */
  const paddedDay = String(day).padStart(2, "0");

  return `${year}${splitter}${paddedMonth}${splitter}${paddedDay}`;
};

/**
 * 날짜 형식 설정
 * @param date 날짜
 * @param splitter 날짜 사이 나눌 기호
 * @returns YYYY MM DD
 */
export const convertDateII = (date: Date, splitter: string): string => {
  /** 연도 */
  const year = date.getFullYear();
  /** 달 */
  const month = date.getMonth() + 1;
  /** 일 */
  const day = date.getDate();

  return convertDateI(year, month, day, splitter);
};

/**
 * 로그아웃
 * @param confirmDesc 띄울 확인 메세지
 * @param dispatch dispatch
 * @returns 로그아웃 여부
 */
export const processSignOut = (confirmDesc: string, dispatch: AppDispatch): boolean => {
  /** 확인 메세지 */
  const confirmSignOut: boolean = window.confirm(confirmDesc);

  // 사용자가 취소 누를 시
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
