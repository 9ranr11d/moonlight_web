import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import termsReducer from "./slices/termsSlice";
import idCheckReducer from "./slices/idCheckSlice";
import calendarReducer from "./slices/calendarSlice";
import backdropReducer from "./slices/backdropSlice";
import mapReducer from "./slices/mapSlice";
import favoriteLocationReducer from "./slices/favoriteLocationSlice";

/** Redux Store */
export const store = configureStore({
  reducer: {
    /** 인증 정보 */
    authReducer,
    /** 약관 정보 */
    termsReducer,
    /** identification 중복 검사 정보 */
    idCheckReducer,
    /** 캘린더 정보 */
    calendarReducer,
    /** Modal 배경화면 정보 */
    backdropReducer,
    /** 지도 정보 */
    mapReducer,
    /** 즐겨찾기 정보 */
    favoriteLocationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
