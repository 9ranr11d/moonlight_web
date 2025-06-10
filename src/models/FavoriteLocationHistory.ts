import mongoose, { Document, Schema } from "mongoose";

/** 1차 지도 즐겨찾기 방문 기록 Interface */
export interface IFavoriteLocationHistory {
  /** 장소 정보 */
  location: Schema.Types.ObjectId | string;
  /** 방문 일시 */
  visitedAt: Date | string;
  /** 평점 */
  rating: number;
  /** 평가 */
  comment?: string;
  /** 비밀 여부 */
  isPrivate: boolean;
  /** 등록한 사용자 */
  createdBy: Schema.Types.ObjectId | string;
  /** 생성일 */
  createdAt?: Date;
  /** 수정일 */
  updatedAt?: Date;
}
/** 2차 지도 즐겨찾기 방문 기록Interface */
export interface IIFavoriteLocationHistory
  extends IFavoriteLocationHistory,
    Document {}

/** 지도 즐겨찾기 방문 기록 모델 */
const FavoriteLocationHistorySchema: mongoose.Schema<IIFavoriteLocationHistory> =
  new Schema<IIFavoriteLocationHistory>(
    {
      location: {
        type: Schema.Types.ObjectId,
        ref: "FavoriteLocation",
        required: true,
      },
      visitedAt: { type: Date, default: Date.now },
      rating: { type: Number, min: 0, max: 5, required: true },
      comment: { type: String, maxlength: 500 },
      isPrivate: { type: Boolean, default: false },
      createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models.FavoriteLocationHistory ||
  mongoose.model<IIFavoriteLocationHistory>(
    "FavoriteLocationHistory",
    FavoriteLocationHistorySchema
  );
