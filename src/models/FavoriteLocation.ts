import mongoose, { Schema, Document } from "mongoose";

/** 지도 즐겨찾기 인터페이스 */
export interface IFavoriteLocation {
  /** 고유 번호 */
  kakaoMapId?: string;
  /** 장소 이름 */
  placeName?: string;
  /** 주소 */
  addressName: string;
  /** 경도 */
  x: number;
  /** 위도 */
  y: number;
  /** 등록한 사용자 */
  createBy: Schema.Types.ObjectId | string;
}

export interface IIFavoriteLocation extends IFavoriteLocation, Document {
  /** 등록 날짜 */
  regDate: Date | string;
}

/** 지도 즐겨찾기 모델 */
const FavoriteLocationSchema: mongoose.Schema<IIFavoriteLocation> = new Schema<IIFavoriteLocation>({
  id: { type: String },
  placeName: { type: String },
  addressName: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  regDate: { type: Date, default: Date.now },
});

// 정의된 'FavoriteLocation'모델이 없으면 새로운 'FavoriteLocation'모델 생성
export default mongoose.models.FavoriteLocation || mongoose.model<IIFavoriteLocation>("FavoriteLocation", FavoriteLocationSchema);
