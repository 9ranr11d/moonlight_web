/** 공개 사용자 정보 인터페이스 */
export interface IUser {
  /** Identification */
  identification: string;
  /** 프로필 이미지 url */
  profileImgURL?: string;
  /** 별명 */
  nickname: string;
  /** 휴대전화 번호 */
  phoneNumber: string;
  /** E-mail */
  email: string;
  /** 회원가입 방법: { web: 웹, android: 안드로이드 앱, ios: 아이폰 앱 } */
  signUpMethod: "web" | "android" | "ios";
  /** 커플 코드 */
  coupleCode?: string;
  /** 열람 권한: { 0: 심사중, 1: 방문자, 2: 연인, 3: 관리자} */
  accessLevel: number;
  /** 생성일 */
  createdAt?: Date;
  /** 수정일 */
  updatedAt?: Date;
}

/** 비공개 사용자 정보 인터페이스 */
export interface IIUser extends IUser {
  /** Password */
  password: string;
  /** Refresh Token */
  refreshToken: string;
}

/** 지도 좌표 인터페이스 */
export interface ILatLng {
  /** 위도 */
  lat: number;
  /** 경도 */
  lng: number;
}
