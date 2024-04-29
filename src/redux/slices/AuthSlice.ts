import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IUser } from "@models/User";

/** 초기값 형태  */
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

/** Redux Auth Slice */
export const Auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * 로그인
     * @param _ 현재 상태
     * @param action 받아온 값
     * @returns initialState 변경
     */
    signIn: (_, action: PayloadAction<IAuthState>): IAuthState => {
      return {
        _id: action.payload._id,
        isAuth: true,
        identification: action.payload.identification,
        nickname: action.payload.nickname,
        email: action.payload.email,
        accessLevel: action.payload.accessLevel,
        accessToken: action.payload.accessToken,
        regDate: action.payload.regDate,
      };
    },
    /** 로그아웃 */
    signOut: (): IAuthState => {
      return initialState;
    },
    /**
     * Refresh Token으로 재발행 된 Access Token 저장
     * @param State 현재 상태
     * @param action 받아온 값
     * @returns initialState 변경
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
