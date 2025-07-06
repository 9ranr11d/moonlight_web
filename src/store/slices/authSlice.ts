import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IUser, IVerificationInfo } from "@/interfaces/auth";

/** 초기값 Interface  */
interface IAuthState extends IUser {
  /** 로그인 여부 */
  isAuth: boolean;
  /** Access Token */
  accessToken: string;
  /** Message */
  msg: string | null;
  /** 오류 여부 */
  isErr: boolean;
}

/** 초기값 */
const initialState: IAuthState = {
  isAuth: false,
  identification: "",
  profileImgUrl: null,
  nickname: null,
  seq: 0,
  phoneNumber: null,
  email: null,
  platform: "web",
  accessLevel: 0,
  provider: "local",
  accountStatus: "active",
  birthdate: null,
  gender: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  accessToken: "",
  msg: null,
  isErr: false,
};

/** 사용자 인증 정보 */
export const Auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** 초기화 */
    resetAuth: state => {
      Object.assign(state, initialState);
    },
    /** 오류 처리 */
    setAuthErr: (state, action: PayloadAction<string>) => {
      state.msg = action.payload;
      state.isErr = true;
    },
    /** 로그인 */
    signIn: (state, action: PayloadAction<IAuthState>) => {
      Object.assign(state, action.payload); // 기존 상태에 action.payload 병합
      state.isAuth = true;
    },
    /** 소셜 로그인 */
    socialSignIn: (state, actions: PayloadAction<IUser>) => {
      Object.assign(state, actions.payload);
      state.isAuth = true;
    },
    /** 로그아웃 */
    signOut: state => {
      Object.assign(state, initialState); // 상태를 초기값으로 재설정
    },
    /** Refresh Token으로 재발행 된 Access Token 저장 */
    setRefreshAccessToken: (
      state,
      action: PayloadAction<{ accessToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
    },
    /** 본인인증 정보 저장 */
    setVerificationInfo: (state, action: PayloadAction<IVerificationInfo>) => {
      switch (action.payload.method) {
        case "phoneNumber":
          state.phoneNumber = action.payload.info;

          break;
        case "email":
        default:
          state.email = action.payload.info;

          break;
      }
    },
  },
});

export const {
  resetAuth,
  setAuthErr,
  signIn,
  socialSignIn,
  signOut,
  setRefreshAccessToken,
  setVerificationInfo,
} = Auth.actions;

export default Auth.reducer;
