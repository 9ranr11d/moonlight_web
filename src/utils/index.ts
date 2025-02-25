import { AppDispatch } from "@redux/store";
import { signIn } from "@redux/slices/authSlice";

import { ILatLng } from "@interfaces/index";

import { ERR_MSG } from "@constants/msg";

/**
 * 비밀번호 유효성 검사 함수
 * @param password 검사할 비밀번호
 * @returns 충족 여부
 */
export const validatePassword = (password: string): boolean => {
  /** 특수 문자 포함 여부 */
  const isSpecialCharIncluded = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  /** 소문자 포함 여부 */
  const isLowercaseIncluded = /[a-z]/.test(password);
  /** 대문자 포함 여부 */
  const isUppercaseIncluded = /[A-Z]/.test(password);
  /** 최소 길이 충족 여부 */
  const isMinLengthValid = password.length >= 8;

  // 최소 8자 + (대문자, 소문자, 특수문자 중 2가지 이상 포함)
  return (
    isMinLengthValid &&
    [isSpecialCharIncluded, isLowercaseIncluded, isUppercaseIncluded].filter(
      Boolean
    ).length >= 2
  );
};

/**
 * E-mail 유효성 검사 함수
 * @param email E-mail
 * @returns 유효성 여부
 */
export const validateEmail = (email: string): boolean => {
  /** E-mail 유효성 정규식 */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

/**
 * 지정된 길이의 랜덤 문자열 생성
 * @param length 문자열 길이
 * @returns 랜덤 문자열
 */
export const generateRandomCode = (length: number): string => {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
};

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
  splitter: string
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
export const formatDateII = (date: Date, splitter: string): string => {
  /** 연도 */
  const year = date.getFullYear();
  /** 달 */
  const month = date.getMonth() + 1;
  /** 일 */
  const day = date.getDate();

  return formatDateI(year, month, day, splitter);
};

/**
 * Access Token 유효한지, 유효하면 일치하는 사용자정보가 있는지, 있으면 사용자 정보가 있으면 자동 로그인
 * @param accessToken Access Token
 * @param dispatch Dispatch
 */
export const getUser = (accessToken: string, dispatch: AppDispatch): void => {
  // Access Token이 없을 시
  if (!accessToken) {
    console.error("Access Token을 찾지 못했습니다.");

    return;
  }

  /** 보낼 Access Token */
  const data: { accessToken: string } = { accessToken };

  fetch("/api/auth/get-user-by-access-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (res.ok) return res.json();

      alert(ERR_MSG);

      return res.json().then(data => Promise.reject(data.msg));
    })
    .then(data =>
      // 사용자 정보 AuthSlice(Redux)에 저장
      dispatch(
        signIn({
          ...data,
          isAuth: true,
        })
      )
    )
    .catch(err =>
      console.error(
        "/src/utils/index > getUser()에서 오류가 발생했습니다. :",
        err
      )
    );
};

/**
 * 클립보드로 복사
 * @param text 복사할 문자열
 */
export const copyClipBoard = (text: string): void => {
  if (text.length > 0) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("클립보드에 복사되었습니다.");
      })
      .catch(err => {
        console.error(
          "/src/utils/index > copyClipBoard()에서 오류가 발생했습니다. :",
          err
        );

        alert(ERR_MSG);
      });
  }
};

// 하버사인 공식을 사용해 두 좌표 간의 거리 계산 함수
export const calculateDistance = (coord1: ILatLng, coord2: ILatLng): number => {
  const R: number = 6371e3; // 지구 반지름 (미터)
  const φ1: number = (coord1.lat * Math.PI) / 180;
  const φ2: number = (coord2.lat * Math.PI) / 180;
  const Δφ: number = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ: number = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a: number =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 거리 (미터)
};
