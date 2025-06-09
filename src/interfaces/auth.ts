/** 공개 사용자 정보 Interface */
export interface IUser {
  /** 아이디 */
  identification: string;
  /** 프로필 이미지 url */
  profileImgUrl?: string | null;
  /** 별명 */
  nickname: string | null | undefined;
  /** 별명 식별자 */
  seq?: number;
  /** 휴대전화 번호 */
  phoneNumber?: string | null;
  /** Email */
  email?: string | null | undefined;
  /** 회원가입 방법 */
  platform?: "web" | "android" | "ios";
  /**
   * 열람 권한
   *  0: 일반,
   *  9: 관리자
   */
  accessLevel?: number;
  /** 로그인 제공자 */
  provider?: "google" | "naver" | "kakao" | "local";
  /**
   * 계정 상태
   *  active: 활성화,
   *  dormant: active인 상태로 마지막 접속이 1년 지난 휴면 상태(dormant),
   *  deleted: 사용자가 계정 삭제를 요청 시(1달이 지난 후 데이터가 삭제됨)
   */
  accountStatus?: "active" | "dormant" | "deleted";
  /** 생년월일 */
  birthdate: string | null;
  /** 성별 */
  gender: "male" | "female" | null;
  /** 생성일 */
  createdAt?: string;
  /** 수정일 */
  updatedAt?: string;
}

/** 비공개 사용자 정보 포함 Interface */
export interface IIUser extends IUser {
  /** 비밀번호 */
  password: string;
  /** Refresh Token */
  refreshToken?: string;
}

/** 약관 Interface */
export interface ITerm {
  /** 식별자 */
  id: number;
  /** 약관명 */
  type: string;
  /** 약관 버전 */
  version: number;
  /** 필수 약관 여부 */
  isRequired: boolean;
  /** 약관 내용 */
  content: string;
  /** 생성일자 */
  createdAt: string;
  /** 수정일자 */
  updatedAt: string;
}

/** 아이디 중복 검사 관련 정보 Interface */
export interface IDuplicate {
  /** 아이디 */
  identification: string;
  /** 중복 검사 여부 */
  isDuplicate: boolean;
  /** Message */
  msg: string | null;
}

/** 비밀번호 관련 정보 Interface */
export interface IPasswordState {
  /** 비밀번호 */
  password: string;
  /** 비밀번호 검증 여부 */
  isValid: boolean;
}

/** 동의된 약관 Interface */
export interface IUserAgreedTerms {
  /** 동의한 사용자 아이디 */
  userId: string;
  /** 동의한 약관 Id들 */
  agreedTermIds: number[];
}

export type TVerificationType = "signUp" | "findId" | "findPw";

export type TVerificationMethod = "email" | "phoneNumber";

export interface IVerificationInfo {
  method: TVerificationMethod;
  identification?: string;
  info: string;
}

export interface ISignInData {
  identification: string;
  password: string;
  isRememberMe: boolean;
}
