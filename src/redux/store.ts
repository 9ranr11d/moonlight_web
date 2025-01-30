import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slices/authSlice";
import signUpSlice from "./slices/signUpSlice";
import calendarSlice from "./slices/calendarSlice";
import backdropSlice from "./slices/backdropSlice";
import mapSlice from "./slices/mapSlice";
import favoriteLocationSlice from "./slices/favoriteLocationSlice";

/** Redux Store */
export const store = configureStore({
  reducer: {
    /** 인증 정보 */
    authSlice,
    /** 회원가입 정보 */
    signUpSlice,
    /** 캘린더 정보 */
    calendarSlice,
    /** Modal 배경화면 정보 */
    backdropSlice,
    /** 지도 정보 */
    mapSlice,
    /** 즐겨찾기 정보 */
    favoriteLocationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
