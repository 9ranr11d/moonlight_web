import mongoose, { Document, Schema } from "mongoose";

/** 사용자 인터페이스 */
interface IUser extends Document {
  /** Identification */
  id: string;
  /** Password */
  pw: string;
  /** 별명 */
  nickname: string;
  /** E-mail */
  email: string;
  /** 열람 권한: { 0: 심사중, 1: 방문자, 2: 연인, 3: 관리자} */
  accessLevel: number;
  /** Refresh Token */
  refreshToken: string;
}

/** 사용자 모델 */
const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
    minlength: 5,
  },
  pw: { type: String, required: true },
  nickname: { type: String, required: true },
  email: { type: String, required: true },
  accessLevel: {
    type: Number,
    required: true,
    default: 1,
  },
  refreshToken: { type: String },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema); // 정의된 'User'모델이 없으면 새로운 'User'모델 생성
