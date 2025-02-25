import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IUser } from "@models/User";

/** 초기값 인터페이스  */
interface IAuthState extends IUser {
  /** MongoDB Identification */
  _id: string;
  /** Sign In 여부 */
  isAuth: boolean;
  /** Access Token */
  accessToken: string;
}

/** 초기값 */
const initialState: IAuthState = {
  _id: "",
  isAuth: false,
  identification: "",
  nickname: "",
  email: "",
  signUpMethod: "web",
  coupleCode: "",
  accessLevel: 0,
  accessToken: "",
  regDate: "",
};

/** 사용자 인증 정보 */
export const Auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * 로그인
     * @param state 기존 정보
     * @param action 받아온 값
     */
    signIn: (state, action: PayloadAction<IAuthState>) => {
      Object.assign(state, action.payload); // 기존 상태에 action.payload 병합
      state.isAuth = true;
    },
    /**
     * 로그아웃
     * @param state 기존 정보
     */
    signOut: state => {
      Object.assign(state, initialState); // 상태를 초기값으로 재설정
    },
    /**
     * Refresh Token으로 재발행 된 Access Token 저장
     * @param State 기존 정보
     * @param action 받아온 값
     */
    refreshAccessToken: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const { signIn, signOut, refreshAccessToken } = Auth.actions; // reducers 함수

export default Auth.reducer;
