import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/AuthSlice";
import calendarReducer from "./slices/CalendarSlice";
import backdropReducer from "./slices/Backdrop";

/** Redux Store */
export const store = configureStore({
  reducer: {
    /** 인증 정보 */
    authReducer,
    /** 캘린더 정보 */
    calendarReducer,
    /** Modal 배경화면 정보 */
    backdropReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
