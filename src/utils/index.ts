import { AppDispatch } from "@redux/store";
import { signIn } from "@redux/slices/authSlice";

import { ILatLng } from "@interfaces/index";

import { FORBIDDEN_WORDS } from "@constants/index";
import { ERR_MSG } from "@constants/msg";

/**
 * 아이디 검증 함수
 * @param id 입력된 아이디
 * @returns 검증 결과 (true: 사용 가능, false: 사용 불가능)
 */
export const validateIdentification = (id: string): boolean => {
  // 아이디 길이 (5~20자)
  if (id.length < 5 || id.length > 20) return false;

  // 영문 소문자, 숫자, `_`, `-` 만 허용
  const idRegex = /^[a-z][a-z0-9_-]*$/;

  if (!idRegex.test(id)) return false;

  // 연속된 숫자 제한 (예: 1111, 123456 등)
  if (/\d{4,}/.test(id)) return false;

  // 금칙어 목록 배제
  if (FORBIDDEN_WORDS.some(word => id.toLowerCase().includes(word)))
    return false;

  return true;
};

/**
 * 비밀번호 유효성 검사 함수
 * @param password 검사할 비밀번호
 * @returns 충족 여부 (true: 사용 가능, false: 사용 불가능)
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
 * Email 유효성 검사 함수
 * @param email Email
 * @returns 유효성 여부 (true: 사용 가능, false: 사용 불가능)
 */
export const validateEmail = (email: string): boolean => {
  /** Email 유효성 정규식 */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

/**
 * 닉네임 검증 함수
 * @param nickname 입력된 닉네임
 * @returns 검증 결과 (true: 사용 가능, false: 사용 불가능)
 */
export const validateNickname = (nickname: string): boolean => {
  // 닉네임 길이 (3~20자)
  if (nickname.length < 3 || nickname.length > 20) return false;

  // 영문, 한글, 숫자, `_`, `.` 허용 (특수문자는 제한)
  const nicknameRegex = /^[a-zA-Z0-9가-힣_.]+$/;
  if (!nicknameRegex.test(nickname)) return false;

  // 연속된 숫자 제한 (예: 1111, 123456 등)
  if (/\d{4,}/.test(nickname)) return false;

  // 금칙어 목록 배제
  if (FORBIDDEN_WORDS.some(word => nickname.toLowerCase().includes(word)))
    return false;

  return true;
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

/** 숫자 범위 생성 함수 */
export const generateRange = (length: number, start = 1, suffix = "") =>
  Array.from({ length }, (_, i) => `${start + i}${suffix}`);

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
        console.error("/src/utils/index > copyClipBoard() :", err);

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
