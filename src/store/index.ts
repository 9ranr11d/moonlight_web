import { configureStore } from "@reduxjs/toolkit";

import backdrop from "./slices/backdropSlice";
import message from "./slices/messageSlice";
import signUp from "./slices/signUpSlice";
import verification from "./slices/verificationSlice";
import auth from "./slices/authSlice";
import recovery from "./slices/recoverySlice";
import coupleCode from "./slices/coupleCodeSlice";
import calendar from "./slices/calendarSlice";
import map from "./slices/mapSlice";
import favoriteLocation from "./slices/favoriteLocationSlice";

/** Redux Store */
export const store = configureStore({
  reducer: {
    /** Modal 배경화면 정보 */
    backdrop,
    /** 회원가입 정보 */
    signUp,
    /** 메시지 정보 */
    message,
    /** 본인인증 정보 */
    verification,
    /** 인증 정보 */
    auth,
    /** ID/PW 찾기 정보 */
    recovery,
    /** 연인 식별자 정보 */
    coupleCode,
    /** 캘린더 정보 */
    calendar,
    /** 지도 정보 */
    map,
    /** 즐겨찾기 정보 */
    favoriteLocation,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
