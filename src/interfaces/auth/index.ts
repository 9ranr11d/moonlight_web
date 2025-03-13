export interface ISignUp {}

/** 공개 사용자 정보 Interface */
export interface IUser {
  /** 아이디 */
  identification: string;
  /** 프로필 이미지 url */
  profileImgUrl?: string | null;
  /** 별명 */
  nickname: string | null | undefined;
  /** 별명 식별자 */
  seq: number;
  /** 휴대전화 번호 */
  phoneNumber?: string | null;
  /** E-mail */
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
  /** 메세지 */
  msg: string | null;
}

/** 비밀번호 관련 정보 Interface */
export interface IPasswordState {
  /** 비밀번호 */
  password: string;
  /** 비밀번호 검증 여부 */
  isValid: boolean;
}

/** 본인 인증 여부 관련 Interface */
export interface IVerification {
  /** 인증 여부 */
  isVerified: boolean;
  /** 메세지 */
  msg: string | null;
  /** 오류 여부 */
  isErr: boolean;
}

/** E-mail 본인 인증 Interface  */
export interface IEmail extends IVerification {
  /** E-mail */
  email: string | null;
  /** 인증 코드 */
  code: string | null;
}

/** 휴대전화 번호 본인 인증 Interface */
export interface IPhone extends IVerification {
  /** 휴대전화 번호 */
  phoneNumber: string | null;
  /** 인증 코드 */
  code: string | null;
}

/** 본인 인증 관련 모든 정보 Interface */
export interface IVerificationState extends IEmail, IPhone {}

/** 프로필 정보 Interface */
export interface IProfile {
  /** 생년월일 */
  birthdate: string | null;
  /** 성별 */
  gender: "male" | "female" | null;
  /** 별명 */
  nickname: string | null;
}

/** 프로필 관련 정보 Interface */
export interface IProfileState extends IProfile {
  /** 별명 식별자 */
  seq: number | null;
}

/** 동의된 약관 Interface */
export interface IUserAgreedTerms {
  /** 동의한 사용자 아이디 */
  userId: string;
  /** 동의한 약관 Id들 */
  agreedTermIds: number[];
}
