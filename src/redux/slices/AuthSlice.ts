import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** 초기값 형태 */
type InitialState = {
  value: AuthState;
};

/** value값 형태 */
export type AuthState = {
  isAuth: boolean;
  id: string;
  nickname: string;
  accessLevel: number;
};

/** 초기값 */
const initialState = {
  value: {
    isAuth: false,
    id: "",
    nickname: "",
    accessLevel: 0,
  } as AuthState,
} as InitialState;

/** Redux Auth Slice */
export const Auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (State, action: PayloadAction<AuthState>) => {
      return {
        value: {
          isAuth: true,
          id: action.payload.id,
          nickname: action.payload.nickname,
          accessLevel: action.payload.accessLevel,
        },
      };
    },
    signOut: () => {
      return initialState;
    },
  },
});

export const { signIn, signOut } = Auth.actions; // reducers 함수

export default Auth.reducer;
