import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ITerm } from "@interfaces/auth";

/** 초기값 Interface */
interface ITermsState {
  latestTerms: ITerm[];
  agreedTerms: ITerm[];
  msg: string | null;
  isLoaded: boolean;
  isErr: boolean;
}

/** 초기값 */
const initialState: ITermsState = {
  latestTerms: [],
  agreedTerms: [],
  msg: null,
  isLoaded: true,
  isErr: false,
};

/** 약관 정보 */
export const terms = createSlice({
  name: "terms",
  initialState,
  reducers: {
    /**
     * 약관 정보 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setLatestTerms: (state, action: PayloadAction<ITerm[]>) => {
      state.latestTerms = action.payload;
      state.agreedTerms = [];
      state.msg = null;
      state.isErr = false;
      state.isLoaded = false;
    },
    /**
     * 오류 정보 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setTermsErr: (state, action: PayloadAction<string>) => {
      state.latestTerms = [];
      state.agreedTerms = [];
      state.msg = action.payload;
      state.isErr = true;
      state.isLoaded = false;
    },
    setTermAgreement: (state, action: PayloadAction<ITerm>) => {
      const idx = state.agreedTerms.findIndex(
        agreedTerm => agreedTerm.type === action.payload.type
      );

      if (idx === -1) state.agreedTerms.push(action.payload);
      else state.agreedTerms.splice(idx, 1);
    },
    /** 약관 전체동의 */
    agreeToAllTerms: state => {
      state.agreedTerms = state.latestTerms;
    },
    /** 약관 정보 초기화 */
    resetTerms: state => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setLatestTerms,
  setTermsErr,
  setTermAgreement,
  agreeToAllTerms,
  resetTerms,
} = terms.actions;

export default terms.reducer;
