import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer";

import { IIISchedule } from "@models/Schedule";
import { IIScheduleCategory } from "@models/ScheduleCategory";

/** 초가값 인터페이스 */
interface IScheduleCategoriesState {
  /** 일정 */
  schedules: WritableDraft<IIISchedule>[];
  /** 일정 카테고리 */
  categories: WritableDraft<IIScheduleCategory>[];
}

/** 초기값 */
const initialState: IScheduleCategoriesState = {
  schedules: [],
  categories: [],
};

/** 캘린더 */
export const Calendar = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    /**
     * 일정 갱신
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setSchedules: (state, action: PayloadAction<WritableDraft<IIISchedule>[]>) => {
      state.schedules = action.payload;
    },
    /**
     * 일정 카테고리 갱신
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setScheduleCategories: (state, action: PayloadAction<WritableDraft<IIScheduleCategory>[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { setSchedules, setScheduleCategories } = Calendar.actions;

export default Calendar.reducer;
