import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IIISchedule } from "@models/Schedule";
import { IIScheduleCategory } from "@models/ScheduleCategory";

interface ICalendarSchedule extends IIISchedule {
  _id: string;
}

interface ICalendarCategory extends IIScheduleCategory {
  _id: string;
}

interface ScheduleCategoriesState {
  schedules: ICalendarSchedule[];
  categories: ICalendarCategory[];
}

const initialState: ScheduleCategoriesState = {
  schedules: [],
  categories: [],
};

export const Calendar = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setSchedules: (state, action: PayloadAction<ICalendarSchedule[]>): ScheduleCategoriesState => {
      return {
        ...state,
        schedules: action.payload,
      };
    },
    setScheduleCategories: (state, action: PayloadAction<ICalendarCategory[]>): ScheduleCategoriesState => {
      return {
        ...state,
        categories: action.payload,
      };
    },
  },
});

export const { setSchedules, setScheduleCategories } = Calendar.actions;

export default Calendar.reducer;
