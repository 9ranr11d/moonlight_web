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
     * @param _ 기존 정보
     * @param action 받아온 값
     */
    signIn: (_, action: PayloadAction<IAuthState>): IAuthState => {
      return {
        ...action.payload,
        isAuth: true,
      };
    },
    /** 로그아웃 */
    signOut: (): IAuthState => {
      return initialState;
    },
    /**
     * Refresh Token으로 재발행 된 Access Token 저장
     * @param State 기존 정보
     * @param action 받아온 값
     */
    refreshAccessToken: (State: IAuthState, action: PayloadAction<{ accessToken: string }>): IAuthState => {
      return {
        ...State,
        accessToken: action.payload.accessToken,
      };
    },
  },
});

export const { signIn, signOut, refreshAccessToken } = Auth.actions; // reducers 함수

export default Auth.reducer;
