import mongoose, { Schema, Document } from "mongoose";

/** 1차 일정 카테고리 Interface */
export interface IScheduleCategory {
  /** 이름 */
  title: string;
  /** 색상 */
  color: string;
  /** 만든 이 */
  createdBy: Schema.Types.ObjectId | string;
}

/** 2차 일정 카테고리 Interface */
export interface IIScheduleCategory extends IScheduleCategory, Document {
  /** 만든 날짜 */
  regDate: Date | string;
}

/** 일정 카테고리 모델 */
export const ScheduleCategorySchema: mongoose.Schema<IIScheduleCategory> =
  new Schema<IIScheduleCategory>({
    title: { type: String, required: true },
    color: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    regDate: { type: Date, default: Date.now },
  });

// 정의된 'ScheduleCategory'모델이 없으면 새로운 'ScheduleCategory'모델 생성
export default mongoose.models.ScheduleCategory ||
  mongoose.model<IIScheduleCategory>(
    "ScheduleCategory",
    ScheduleCategorySchema
  );
