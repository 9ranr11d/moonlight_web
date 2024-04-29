import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IIScheduleCategory } from "@models/ScheduleCategory";

export interface IIIScheduleCategory extends IIScheduleCategory {
  _id: string;
}

interface ScheduleCategoriesState {
  values: IIIScheduleCategory[];
}

const initialState: ScheduleCategoriesState = {
  values: [],
};

export const ScheduleCategories = createSlice({
  name: "scheduleCategories",
  initialState,
  reducers: {
    setScheduleCategories: (_, action: PayloadAction<IIIScheduleCategory[]>): ScheduleCategoriesState => {
      return {
        values: action.payload,
      };
    },
  },
});

export const { setScheduleCategories } = ScheduleCategories.actions;

export default ScheduleCategories.reducer;
