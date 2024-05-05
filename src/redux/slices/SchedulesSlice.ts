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

export const Schedules = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    setSchedule: (state, action: PayloadAction<IIISchedule[]>): ScheduleCategoriesState => {
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

export const { setSchedule, setScheduleCategories } = Schedules.actions;

export default Schedules.reducer;
