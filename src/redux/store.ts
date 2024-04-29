import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/AuthSlice";
import scheduleCategoriesreducer from "./slices/ScheduleCategoriesSlice";

/** Redux Store */
export const store = configureStore({
  reducer: {
    /** 인증 정보 */
    authReducer,
    scheduleCategoriesreducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
