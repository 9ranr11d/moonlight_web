import mongoose, { Document, Schema } from "mongoose";

/** 사용자 인터페이스 */
interface IUser extends Document {
  id: string;
  pw: string;
  nickname: string;
  accessLevel: number;
}

/**
 * 사용자 모델
 */
const UserSchema = new Schema({
  // Identification
  id: {
    type: String,
    required: true,
  },
  // Password
  pw: {
    type: String,
    required: true,
  },
  // 별명
  nickname: {
    type: String,
    required: true,
  },
  // 열람 권한: { 0: 심사중, 1: 방문자, 2: 연인, 3: 관리자}
  accessLevel: {
    type: Number,
    required: true,
    default: 1,
  },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema); // 정의된 'User'모델이 없으면 새로운 'User'모델 생성
