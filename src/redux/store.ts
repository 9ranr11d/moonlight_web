import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/AuthSlice";
import schedulesReducer from "./slices/SchedulesSlice";

/** Redux Store */
export const store = configureStore({
  reducer: {
    /** 인증 정보 */
    authReducer,
    schedulesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
