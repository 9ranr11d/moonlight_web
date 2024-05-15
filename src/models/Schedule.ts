import mongoose, { Schema, Document } from "mongoose";

import { IIUser } from "./User";
import { IIScheduleCategory } from "./ScheduleCategory";

export interface ISchedule {
  user: Schema.Types.ObjectId | string | IIUser;
  title: string;
  content: string;
}

export interface IISchedule extends ISchedule {
  date: Date;
  categories: IIScheduleCategory[];
  isRepeating: boolean;
}

export interface IIISchedule extends IISchedule, Document {}

const ScheduleSchema: mongoose.Schema<IIISchedule> = new Schema<IIISchedule>({
  date: { type: Date, default: Date.now },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: "ScheduleCategory" }],
  isRepeating: { type: Boolean, default: false },
});

export default mongoose.models.Schedule || mongoose.model<IIISchedule>("Schedule", ScheduleSchema);