import { FORBIDDEN_WORDS } from "@/constants";

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
