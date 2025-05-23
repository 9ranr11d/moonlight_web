import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IDuplicate, IPasswordState, ITerm } from "@interfaces/auth";

/** 초기값 Interface */
interface ITermState {
  latestTerms: ITerm[];
  agreedTerms: ITerm[];
  msg: string | null;
  isLoaded: boolean;
  isErr: boolean;
  isSaved: boolean;
}

/** identification 초기값 Interface */
interface IIdState extends IDuplicate {
  isChecking: boolean;
}

/** 초기값 Interface */
interface ISignUpState {
  msg: string | null;
  step: number;
  isCompleted: boolean;
  isErr: boolean;
  term: ITermState;
  identification: IIdState;
  password: IPasswordState;
}

/** 초기값 */
const initialState: ISignUpState = {
  msg: null,
  step: 0,
  isCompleted: false,
  isErr: false,
  term: {
    latestTerms: [],
    agreedTerms: [],
    msg: null,
    isLoaded: true,
    isErr: false,
    isSaved: false,
  },
  identification: {
    identification: "",
    isChecking: false,
    isDuplicate: true,
    msg: null,
  },
  password: {
    password: "",
    isValid: false,
  },
};

/** 회원가입 관련 정보 */
export const SignUp = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    /** 초기화 */
    resetSignUp: state => {
      Object.assign(state, initialState);
    },
    /** Step 증가 */
    incrementSignUpStep: state => {
      state.step += 1;
    },
    /** Step 감소 */
    decrementSignUpStep: state => {
      if (state.step > 0) {
        state.step -= 1;
      }
    },
    /** 약관 정보 초기화 */
    resetTerm: state => {
      Object.assign(state.term, initialState.term);
    },
    /** 약관 정보 저장 */
    setLatestTerm: (state, action: PayloadAction<ITerm[]>) => {
      state.term.latestTerms = action.payload;
      state.term.agreedTerms = [];
      state.term.msg = null;
      state.term.isErr = false;
      state.term.isLoaded = false;
    },
    /** 오류 정보 저장 */
    setTermsErr: (state, action: PayloadAction<string>) => {
      state.term.latestTerms = [];
      state.term.agreedTerms = [];
      state.term.msg = action.payload;
      state.term.isErr = true;
      state.term.isLoaded = false;
    },
    /** 약관 동의 여부 */
    setTermAgreement: (state, action: PayloadAction<ITerm>) => {
      const idx = state.term.agreedTerms.findIndex(
        agreedTerm => agreedTerm.type === action.payload.type
      );

      if (idx === -1) state.term.agreedTerms.push(action.payload);
      else state.term.agreedTerms.splice(idx, 1);
    },
    /** 약관 전체동의 */
    agreeToAllTerms: state => {
      state.term.agreedTerms = state.term.latestTerms;
    },
    /** identification 정보 초기화 */
    resetIdentification: state => {
      Object.assign(state.identification, initialState.identification);
    },
    /** 중복 여부 저장 */
    setIsIdDuplicate: (state, action: PayloadAction<IDuplicate>) => {
      state.identification.identification = action.payload.identification;
      state.identification.isChecking = true;
      state.identification.isDuplicate = action.payload.isDuplicate;
      state.identification.msg = action.payload.msg;
    },
    /** password 정보 초기화 */
    resetPassword: state => {
      Object.assign(state.password, initialState.password);
    },
    /** 비밀번호 유효성 관련 정보 저장 */
    setIsPasswordValid: (state, action: PayloadAction<IPasswordState>) => {
      state.password.password = action.payload.password;
      state.password.isValid = action.payload.isValid;
    },
    /** 회원가입 완료 */
    setSignUpCompleted: state => {
      state.isCompleted = true;
    },
    /** 회원가입 시 오류 저장 */
    setSignUpErr: (state, action: PayloadAction<string>) => {
      state.msg = action.payload;
      state.isErr = true;
    },
    /** 동의한 약관 저장 완료 */
    setTermsSaved: state => {
      state.term.isSaved = true;
    },
  },
});

export const {
  resetSignUp,
  incrementSignUpStep,
  decrementSignUpStep,
  resetTerm,
  setLatestTerm,
  setTermsErr,
  setTermAgreement,
  agreeToAllTerms,
  resetIdentification,
  setIsIdDuplicate,
  resetPassword,
  setIsPasswordValid,
  setSignUpCompleted,
  setSignUpErr,
  setTermsSaved,
} = SignUp.actions;

export default SignUp.reducer;
