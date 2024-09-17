import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/AuthSlice";
import calendarReducer from "./slices/CalendarSlice";
import backdropReducer from "./slices/Backdrop";

/** Redux Store */
export const store = configureStore({
  reducer: {
    /** 인증 정보 */
    authReducer,
    calendarReducer,
    backdropReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
