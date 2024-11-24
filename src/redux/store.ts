import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/AuthSlice";
import calendarReducer from "./slices/CalendarSlice";
import backdropReducer from "./slices/BackdropSlice";
import mapReducer from "./slices/mapSlice";
import favoriteLocationReducer from "./slices/FavoriteLocationSlice";

/** Redux Store */
export const store = configureStore({
  reducer: {
    /** 인증 정보 */
    authReducer,
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
