import { IEmail, IPhone, IVerificationState } from "@interfaces/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IVerificationState = {
  isVerified: false,
  isDuplicate: true,
  msg: null,
  isErr: false,
  email: null,
  phoneNumber: null,
  code: null,
};

export const Verification = createSlice({
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
  verify,
} = Verification.actions;

export default Verification.reducer;
