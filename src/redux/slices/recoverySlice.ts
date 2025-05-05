import { TVerificationMethod } from "@interfaces/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** IP/PW 찾기 관련 정보 Interface */
interface IRecoveryState {
  modifiedId: string | null;
  msg: string | null;
  step: number;
  isChanged: boolean;
  verificationMethod: TVerificationMethod | null;
}

/** 초기값 */
const initialState: IRecoveryState = {
  modifiedId: null,
  msg: null,
  step: 0,
  isChanged: false,
  verificationMethod: null,
};

/** ID/PW 찾기 관련 정보 */
export const recovery = createSlice({
  name: "recovery",
  initialState,
  reducers: {
    /** ID/PW 찾기 정보 초기화 */
    resetRecovery: state => {
      Object.assign(state, initialState);
    },
    /** 본인인증 방법 선택 */
    setVerificationMethod: (
      state,
      action: PayloadAction<TVerificationMethod>
    ) => {
      state.verificationMethod = action.payload;
    },
    /** Step 증가 */
    incrementRecoveryStep: state => {
      state.step += 1;
    },
    /** Step 감소 */
    decrementRecoveryStep: state => {
      state.step -= 1;
    },
    /** 가려진 아이디 저장 */
    setModifiedId: (state, action: PayloadAction<string>) => {
      state.modifiedId = action.payload;
    },
    /** 비밀번호 변경 완료 시 */
    passwordChangeCompleted: state => {
      state.isChanged = true;
    },
    /** 비밀번호 변경 실패 시 */
    passwordChangeFailed: (state, action: PayloadAction<string>) => {
      state.isChanged = false;
      state.msg = action.payload;
    },
    /** 메세지 초기화 */
    clearRecoveryMsg: state => {
      state.msg = null;
    },
  },
});

export const {
  resetRecovery,
  setVerificationMethod,
  incrementRecoveryStep,
  decrementRecoveryStep,
  setModifiedId,
  passwordChangeCompleted,
  passwordChangeFailed,
  clearRecoveryMsg,
} = recovery.actions;

export default recovery.reducer;
