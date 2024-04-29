import mongoose, { Schema, Document } from "mongoose";

export interface IScheduleCategory {
  title: string;
  color: string;
  createdBy: Schema.Types.ObjectId | string;
}

export interface IIScheduleCategory extends IScheduleCategory, Document {
  regDate: Date | string;
}

const ScheduleCategorySchema: mongoose.Schema<IIScheduleCategory> = new Schema<IIScheduleCategory>({
  title: { type: String, required: true },
  color: { type: String, required: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  regDate: { type: Date, default: Date.now },
});

export default mongoose.models.ScheduleCategory || mongoose.model<IIScheduleCategory>("ScheduleCategory", ScheduleCategorySchema);
