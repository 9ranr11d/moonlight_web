import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IDuplicate } from "@interfaces/auth";

/** 초기값 Interface */
interface IIdCheckState {
  isChecking: boolean;
  isDuplicate: boolean;
  msg: string | null;
}

/** 초기값 */
const initialState: IIdCheckState = {
  isChecking: false,
  isDuplicate: true,
  msg: null,
};

/** identification 중복 검사 관련 정보 */
export const IdCheck = createSlice({
  name: "idCheck",
  initialState,
  reducers: {
    /** 초기화 */
    resetIdCheck: state => {
      Object.assign(state, initialState);
    },
    /**
     * 중복 여부 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setIsDuplicate: (state, action: PayloadAction<IDuplicate>) => {
      state.isChecking = true;
      state.isDuplicate = action.payload.isDuplicate;
      state.msg = action.payload.msg;
    },
  },
});

export const { resetIdCheck, setIsDuplicate } = IdCheck.actions;

export default IdCheck.reducer;
