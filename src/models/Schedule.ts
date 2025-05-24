import mongoose, { Schema, Document } from "mongoose";

import { IIScheduleCategory } from "./ScheduleCategory";
import { IIUser } from "@interfaces/auth";

/** 1차 일정 Interface */
export interface ISchedule {
  /** 사용자 정보 */
  user: Schema.Types.ObjectId | string | IIUser;
  /** 일정 제목 */
  title: string;
  /** 일정 내용 */
  content: string;
}

/** 2차 일정 Interface */
export interface IISchedule extends ISchedule {
  /** 일정 날짜 ['시작 날짜', '종료 날짜'] */
  date: Date[];
  /** '사직 날짜'와 '종료 날짜'가 동일한 지 */
  isSingleDate: boolean;
  /** 카테고리들 */
  categories: IIScheduleCategory[];
  /** 반복 여부 */
  isRepeating: boolean;
}

/** MongoDB용 일정 Interface */
export interface IIISchedule extends IISchedule, Document {}

/** 일정 모델 */
const ScheduleSchema: mongoose.Schema<IIISchedule> = new Schema<IIISchedule>({
  date: { type: [{ type: Date }], default: () => [new Date(), new Date()] },
  isSingleDate: { type: Boolean, default: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: "ScheduleCategory" }],
  content: { type: String, required: true },
  isRepeating: { type: Boolean, default: false },
});

// 정의된 'Schedule'모델이 없으면 새로운 'Schedule'모델 생성
export default mongoose.models.Schedule ||
  mongoose.model<IIISchedule>("Schedule", ScheduleSchema);
