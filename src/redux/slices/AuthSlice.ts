import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** 초기값 형태 */
type InitialState = {
  value: AuthState;
};

/** value값 형태 */
export type AuthState = {
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
};

/** 초기값 */
const initialState = {
  value: {
    isAuth: false,
    id: "",
    nickname: "",
    email: "",
    accessLevel: 0,
    accessToken: "",
  } as AuthState,
} as InitialState;

/** Redux Auth Slice */
export const Auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** 로그인 */
    signIn: (_, action: PayloadAction<AuthState>): InitialState => {
      return {
        value: {
          isAuth: true,
          id: action.payload.id,
          nickname: action.payload.nickname,
          email: action.payload.email,
          accessLevel: action.payload.accessLevel,
          accessToken: action.payload.accessToken,
        },
      };
    },
    /** 로그아웃 */
    signOut: (): InitialState => {
      return initialState;
    },
    /** Refresh Token으로 재발행 된 Access Token 저장 */
    refreshAccessToken: (State: InitialState, action: PayloadAction<{ accessToken: string }>): InitialState => {
      return {
        value: {
          ...State.value,
          accessToken: action.payload.accessToken,
        },
      };
    },
  },
});

export const { signIn, signOut, refreshAccessToken } = Auth.actions; // reducers 함수

export default Auth.reducer;
