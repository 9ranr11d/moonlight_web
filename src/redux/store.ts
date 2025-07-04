import { configureStore } from "@reduxjs/toolkit";

import backdropSlice from "./slices/backdropSlice";
import messageSlice from "./slices/messageSlice";
import signUpSlice from "./slices/signUpSlice";
import verificationSlice from "./slices/verificationSlice";
import authSlice from "./slices/authSlice";
import recoverySlice from "./slices/recoverySlice";
import coupleCodeSlice from "./slices/coupleCodeSlice";
import calendarSlice from "./slices/calendarSlice";
import mapSlice from "./slices/mapSlice";
import favoriteLocationSlice from "./slices/favoriteLocationSlice";

/** Redux Store */
export const store = configureStore({
  reducer: {
    /** Modal 배경화면 정보 */
    backdropSlice,
    /** 회원가입 정보 */
    signUpSlice,
    /** 메시지 정보 */
    messageSlice,
    /** 본인인증 정보 */
    verificationSlice,
    /** 인증 정보 */
    authSlice,
    /** ID/PW 찾기 정보 */
    recoverySlice,
    /** 연인 식별자 정보 */
    coupleCodeSlice,
    /** 캘린더 정보 */
    calendarSlice,
    /** 지도 정보 */
    mapSlice,
    /** 즐겨찾기 정보 */
    favoriteLocationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
