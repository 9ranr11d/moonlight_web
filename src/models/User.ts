import mongoose, { Schema, Document } from "mongoose";

/** 공개 사용자 정보 인터페이스 */
export interface IUser {
  /** Identification */
  identification: string;
  /** 프로필 이미지 url */
  profileImgURL?: string;
  /** 별명 */
  nickname: string;
  // /** 휴대전화 번호 */
  // phoneNumber: string;
  /** E-mail */
  email: string;
  /** 회원가입 방법: { web: 웹, android: 안드로이드 앱, ios: 아이폰 앱 } */
  signUpMethod: "web" | "android" | "ios";
  /** 커플 코드 */
  coupleCode?: string;
  /** 열람 권한: { 0: 심사중, 1: 방문자, 2: 연인, 3: 관리자} */
  accessLevel: number;
  /** 회원가입 날짜 */
  regDate: Date | string;
}

/** 비공개 사용자 정보 인터페이스 */
export interface IIUser extends IUser, Document {
  /** Password */
  password: string;
  /** Refresh Token */
  refreshToken: string;
}

/** 사용자 모델 */
export const UserSchema: mongoose.Schema<IIUser> = new Schema<IIUser>({
  identification: {
    type: String,
    required: true,
    minlength: 5,
  },
  password: { type: String, required: true },
  profileImgURL: { type: String },
  nickname: { type: String, required: true },
  // phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  signUpMethod: {
    type: String,
    enum: ["web", "android", "ios"],
    required: true,
  },
  coupleCode: {
    type: String,
    default: null,
  },
  accessLevel: {
    type: Number,
    required: true,
    default: 1,
  },
  refreshToken: { type: String },
  regDate: { type: Date, default: Date.now },
});

// 정의된 'User'모델이 없으면 새로운 'User'모델 생성
export default mongoose.models.User || mongoose.model<IIUser>("User", UserSchema);
