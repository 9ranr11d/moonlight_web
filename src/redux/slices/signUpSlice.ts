import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  IDuplicate,
  IEmail,
  IPasswordState,
  IPhone,
  IProfile,
  IProfileState,
  ITerm,
  IVerificationState,
} from "@interfaces/auth";
import { stat } from "fs";

/** 초기값 Interface */
interface ITermState {
  latestTerms: ITerm[];
  agreedTerms: ITerm[];
  msg: string | null;
  isLoaded: boolean;
  isErr: boolean;
}

/** identification 초기값 Interface */
interface IIdState extends IDuplicate {
  isChecking: boolean;
}

/** 초기값 Interface */
interface ISignUpState {
  step: number;
  term: ITermState;
  identification: IIdState;
  password: IPasswordState;
  verification: IVerificationState;
  profile: IProfileState;
}

/** 초기값 */
const initialState: ISignUpState = {
  step: 3,
  term: {
    latestTerms: [],
    agreedTerms: [],
    msg: null,
    isLoaded: true,
    isErr: false,
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
  verification: {
    isVerified: false,
    msg: null,
    isErr: false,
    email: null,
    phoneNumber: null,
    code: null,
  },
  profile: {
    birthdate: null,
    gender: null,
    nickname: null,
    seq: null,
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
    /** step 증가 */
    incrementStep: state => {
      state.step += 1;
    },
    /** step 감소 */
    decrementStep: state => {
      if (state.step > 0) {
        state.step -= 1;
      }
    },
    /** 약관 정보 초기화 */
    resetTerm: state => {
      Object.assign(state.term, initialState.term);
    },
    /**
     * 약관 정보 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setLatestTerm: (state, action: PayloadAction<ITerm[]>) => {
      state.term.latestTerms = action.payload;
      state.term.agreedTerms = [];
      state.term.msg = null;
      state.term.isErr = false;
      state.term.isLoaded = false;
    },
    /**
     * 오류 정보 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
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
    /**
     * 중복 여부 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setIsDuplicate: (state, action: PayloadAction<IDuplicate>) => {
      state.identification.identification = action.payload.identification;
      state.identification.isChecking = true;
      state.identification.isDuplicate = action.payload.isDuplicate;
      state.identification.msg = action.payload.msg;
    },
    /** password 정보 초기화 */
    resetPassword: state => {
      Object.assign(state.password, initialState.password);
    },
    /**
     * 비밀번호 유효성 관련 정보 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setIsPasswordValid: (state, action: PayloadAction<IPasswordState>) => {
      state.password.password = action.payload.password;
      state.password.isValid = action.payload.isValid;
    },
    /** 본인 인증 정보 초기화 */
    resetVerification: state => {
      Object.assign(state.verification, initialState.verification);
    },
    /** E-mail 인증 코드 저장 */
    setEmailVerified: (state, action: PayloadAction<IEmail>) => {
      state.verification.email = action.payload.email;
      state.verification.code = action.payload.code;
    },
    /** 휴대전화 번호 인증 코드 저장 */
    setPhoneVerified: (state, action: PayloadAction<IPhone>) => {
      state.verification.phoneNumber = action.payload.phoneNumber;
      state.verification.code = action.payload.code;
    },
    /** 본인 인증 오류 정보 저장 */
    setVerificationErr: (state, action: PayloadAction<string>) => {
      state.verification.isErr = true;
      state.verification.msg = action.payload;
    },
    /** 인증 성공 시 */
    verify: state => {
      state.verification.isVerified = true;
    },
    /** 프로필 정보 초기화 */
    resetProfile: state => {
      Object.assign(state.profile, initialState.profile);
    },
    /** 프로필 정보 저장 */
    setProfile: (state, action: PayloadAction<IProfile>) => {
      state.profile.birthdate = action.payload.birthdate;
      state.profile.gender = action.payload.gender;
      state.profile.nickname = action.payload.nickname;
    },
    /** 별명 순서 저장 */
    setProfileSeq: (state, action: PayloadAction<number>) => {
      state.profile.seq = action.payload;
    },
  },
});

export const {
  resetSignUp,
  incrementStep,
  decrementStep,
  resetTerm,
  setLatestTerm,
  setTermsErr,
  setTermAgreement,
  agreeToAllTerms,
  resetIdentification,
  setIsDuplicate,
  resetPassword,
  setIsPasswordValid,
  resetVerification,
  setEmailVerified,
  setPhoneVerified,
  setVerificationErr,
  verify,
  resetProfile,
  setProfile,
  setProfileSeq,
} = SignUp.actions;

export default SignUp.reducer;
