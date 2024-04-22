import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** 초기값 형태  */
export interface AuthState {
  /** MongoDB Identification */
  _id: string;
  /** Sign In 여부 */
  isAuth: boolean;
  /** Identification */
  id: string;
  /** 별명 */
  nickname: string;
  /** E-mail */
  email: string;
  /** 열람 권한 */
  accessLevel: number;
  /** Access Token */
  accessToken: string;
}

/** 초기값 */
const initialState: AuthState = {
  _id: "",
  isAuth: false,
  id: "",
  nickname: "",
  email: "",
  accessLevel: 0,
  accessToken: "",
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
    signIn: (_, action: PayloadAction<AuthState>): AuthState => {
      return {
        _id: action.payload._id,
        isAuth: true,
        id: action.payload.id,
        nickname: action.payload.nickname,
        email: action.payload.email,
        accessLevel: action.payload.accessLevel,
        accessToken: action.payload.accessToken,
      };
    },
    /** 로그아웃 */
    signOut: (): AuthState => {
      return initialState;
    },
    /**
     * Refresh Token으로 재발행 된 Access Token 저장
     * @param State 현재 상태
     * @param action 받아온 값
     * @returns initialState 변경
     */
    refreshAccessToken: (State: AuthState, action: PayloadAction<{ accessToken: string }>): AuthState => {
      return {
        ...State,
        accessToken: action.payload.accessToken,
      };
    },
  },
});

export const { signIn, signOut, refreshAccessToken } = Auth.actions; // reducers 함수

export default Auth.reducer;
