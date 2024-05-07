import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IIISchedule } from "@models/Schedule";
import { IIScheduleCategory } from "@models/ScheduleCategory";

interface ScheduleCategoriesState {
  schedules: IIISchedule[];
  categories: IIScheduleCategory[];
}

const initialState: ScheduleCategoriesState = {
  schedules: [],
  categories: [],
};

export const Calendar = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setSchedules: (state, action: PayloadAction<IIISchedule[]>): ScheduleCategoriesState => {
      return {
        ...state,
        schedules: action.payload,
      };
    },
    setScheduleCategories: (state, action: PayloadAction<IIScheduleCategory[]>): ScheduleCategoriesState => {
      return {
        ...state,
        categories: action.payload,
      };
    },
  },
});

export const { setSchedules, setScheduleCategories } = Calendar.actions;

export default Calendar.reducer;
