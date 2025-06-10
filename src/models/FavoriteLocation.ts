import mongoose, { Schema, Document } from "mongoose";

/** 지도 즐겨찾기 Interface */
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
  createdBy: Schema.Types.ObjectId | string;
  /** 생성일 */
  createdAt?: Date;
  /** 수정일 */
  updatedAt?: Date;
}

export interface IIFavoriteLocation extends IFavoriteLocation, Document {}

/** 지도 즐겨찾기 모델 */
const FavoriteLocationSchema: mongoose.Schema<IIFavoriteLocation> =
  new Schema<IIFavoriteLocation>(
    {
      kakaoMapId: { type: String },
      placeName: { type: String },
      addressName: { type: String, required: true },
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
      timestamps: true,
    }
  );

// 정의된 'FavoriteLocation'모델이 없으면 새로운 'FavoriteLocation'모델 생성
export default mongoose.models.FavoriteLocation ||
  mongoose.model<IIFavoriteLocation>(
    "FavoriteLocation",
    FavoriteLocationSchema
  );
