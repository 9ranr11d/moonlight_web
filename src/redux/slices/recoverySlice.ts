import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** IP/PW 찾기 관련 정보 Interface */
interface IRecoveryState {
  step: number;
  modifiedId: string | null;
}

/** 초기값 */
const initialState: IRecoveryState = {
  step: 0,
  modifiedId: null,
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
  },
});

export const {
  resetRecovery,
  incrementRecoveryStep,
  decrementRecoveryStep,
  setModifiedId,
} = recovery.actions;

export default recovery.reducer;
