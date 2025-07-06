import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** Email 본인 인증 Interface  */
interface IEmail {
  /** Email */
  email: string | null;
  /** 인증 코드 */
  code: string | null;
}

/** 휴대전화 번호 본인 인증 Interface */
interface IPhone {
  /** 휴대전화 번호 */
  phoneNumber: string | null;
  /** 인증 코드 */
  code: string | null;
}

/** 본인 인증 관련 모든 정보 Interface */
interface IVerificationState extends IEmail, IPhone {
  /** 인증 여부 */
  isVerified: boolean;
  /** 중복 여부 */
  isDuplicate: boolean;
  /** 등록 여부 */
  isRegistered: boolean;
  /** Message */
  msg: string | null;
  /** 오류 여부 */
  isErr: boolean;
}

const initialState: IVerificationState = {
  isVerified: false,
  isDuplicate: true,
  isRegistered: false,
  msg: null,
  isErr: false,
  email: null,
  phoneNumber: null,
  code: null,
};

export const verification = createSlice({
  name: "verification",
  initialState,
  reducers: {
    /** 본인 인증 정보 초기화 */
    resetVerification: state => {
      Object.assign(state, initialState);
    },
    /** Email 인증 코드 저장 */
    setEmailVerified: (state, action: PayloadAction<IEmail>) => {
      state.email = action.payload.email;
      state.code = action.payload.code;
    },
    /** 휴대전화 번호 인증 코드 저장 */
    setPhoneVerified: (state, action: PayloadAction<IPhone>) => {
      state.phoneNumber = action.payload.phoneNumber;
      state.code = action.payload.code;
    },
    /** 본인 인증 오류 정보 저장 */
    setVerificationErr: (state, action: PayloadAction<string>) => {
      state.isErr = true;
      state.msg = action.payload;
    },
    /** 본인인증 중복 검사 통과 */
    confirmVerificationAvailable: state => {
      state.isDuplicate = false;
    },
    /** 등록 상태 저장 */
    setRegistered: (state, action: PayloadAction<boolean>) => {
      state.isRegistered = action.payload;
    },
    /** 인증 성공 시 */
    verify: state => {
      state.isVerified = true;
    },
  },
});

export const {
  resetVerification,
  setEmailVerified,
  setPhoneVerified,
  setVerificationErr,
  confirmVerificationAvailable,
  setRegistered,
  verify,
} = verification.actions;

export default verification.reducer;
