/** 공개 사용자 정보 Interface */
export interface IUser {
  /** Identification */
  identification: string;
  /** 프로필 이미지 url */
  profileImgUrl: string | null;
  /** 별명 */
  nickname: string | null | undefined;
  /** 휴대전화 번호 */
  phoneNumber: string | null;
  /** E-mail */
  email: string | null | undefined;
  /** 회원가입 방법 */
  platform: "web" | "android" | "ios";
  /**
   * 열람 권한
   *  0: 일반,
   *  9: 관리자
   */
  accessLevel: number;
  /** 로그인 제공자 */
  provider: "google" | "naver" | "kakao" | "local";
  /**
   * 계정 상태
   *  active: 활성화,
   *  dormant: active인 상태로 마지막 접속이 1년 지난 휴면 상태(dormant),
   *  deleted: 사용자가 계정 삭제를 요청 시(1달이 지난 후 데이터가 삭제됨)
   */
  accountStatus: "active" | "dormant" | "deleted";
  /** 생성일 */
  createdAt: string;
  /** 수정일 */
  updatedAt: string;
  /** 커플 코드 */
  coupleCode?: string;
}

/** 비공개 사용자 정보 Interface */
export interface IIUser extends IUser {
  /** Password */
  password: string;
  /** Refresh Token */
  refreshToken: string;
}

/** 약관 Interface */
export interface ITerm {
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

/** identification 중복 검사 관련 정보 Interface */
export interface IDuplicate {
  /** identification */
  identification: string;
  /** 중복 검사 여부 */
  isDuplicate: boolean;
  /** Message */
  msg: string | null;
}

/** password 관련 정보 Interface */
export interface IPasswordState {
  /** password */
  password: string;
  /** password 검증 여부 */
  isValid: boolean;
}

/** 본인 인증 여부 관련 Interface */
export interface IVerification {
  isVerified: boolean;
  msg: string | null;
  isErr: boolean;
}

/** E-mail 본인 인증 Interface  */
export interface IEmail extends IVerification {
  email: string | null;
  code: string | null;
}

/** 휴대전화 번호 본인 인증 Interface */
export interface IPhone extends IVerification {
  phoneNumber: string | null;
  code: string | null;
}

/** 본인 인증 관련 모든 정보 Interface */
export interface IVerificationState extends IEmail, IPhone {}
