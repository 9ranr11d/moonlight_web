import { AppDispatch, RootState } from "@redux/store";

import { resetAuth, signOut, socialSignIn } from "@redux/slices/authSlice";
import {
  agreeToAllTerms,
  setLatestTerm,
  setTermAgreement,
  setTermsErr,
  setIsDuplicate,
  setIsPasswordValid,
  incrementSignUpStep,
  resetIdentification,
  decrementSignUpStep,
  resetSignUp,
  resetPassword,
  resetTerm,
  setEmailVerified,
  resetVerification,
  setVerificationErr,
  verify,
  setPhoneVerified,
  resetProfile,
  setProfile,
  setProfileSeq,
  setSignUpCompleted,
  setTermsSaved,
} from "@redux/slices/signUpSlice";

import {
  IDuplicate,
  IIUser,
  IPasswordState,
  IProfile,
  ITerm,
  IUserAgreedTerms,
} from "@interfaces/auth";

/** authSlice 초기화 */
export const resetAuthAction = () => async (dispatch: AppDispatch) => {
  dispatch(resetAuth());
};

/** signUpSlice 초기화 */
export const resetSignUpAction = () => async (dispatch: AppDispatch) => {
  dispatch(resetSignUp());
};
/**
 * 소셜 로그인 정보 저장
 * @param identification 소셜 Identification
 */
export const socialSignInAction =
  (identification: string) => async (dispatch: AppDispatch) => {
    try {
      console.log(`소셜 로그인 시도 : ${identification}`);

      /** 응답된 값 */
      const response = await fetch(
        `/api/auth/social-sign-in?id=${identification}`
      );
      /** 받아온 값 */
      const data = await response.json();

      // 오류 시
      if (!response.ok)
        throw new Error(data.msg || "소셜 로그인 실패했습니다.");

      console.log(data.msg);

      dispatch(socialSignIn(data.user));
    } catch (err) {
      console.error(
        "/src/actions/authAction > socialSignInAction()에서 오류가 발생했습니다:",
        err
      );
    }
  };

/** step 증가 */
export const incrementStepAction = () => async (dispatch: AppDispatch) => {
  dispatch(incrementSignUpStep());
};

/** step 감소 */
export const decrementStepAcion = () => async (dispatch: AppDispatch) => {
  dispatch(decrementSignUpStep());
};

/** 약관 정보 초기화 */
export const resetTermAction = () => async (dispatch: AppDispatch) => {
  dispatch(resetTerm());
};

/** 최신 약관 가져오기 */
export const getLatestTermsAction =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { isLoaded } = getState().signUpSlice.term; // 약관 로드 여부

    // 로드 됐을 시 다시 요청하지 않음
    if (!isLoaded) return;

    try {
      /** 응답된 값 */
      const response = await fetch("/api/auth/get-latest-terms");

      /** 받아온 값 */
      const data = await response.json();

      // 오류 시
      if (!response.ok) throw new Error(data.msg);

      dispatch(setLatestTerm(data.terms));
    } catch (err) {
      console.error(
        "/src/actions/authAction > getLatestTermsAction()에서 오류가 발생했습니다. :",
        err
      );

      dispatch(
        setTermsErr(err instanceof Error ? err.message : "약관 가져오기 실패")
      );
    }
  };

/**
 * 약관 동의/비동의
 * @param term 선택된 약관
 */
export const setTermAgreementAction =
  (term: ITerm) => async (dispatch: AppDispatch) => {
    dispatch(setTermAgreement(term));
  };

/** 약관 전체동의 */
export const agreeToAllTermsAction = () => async (dispatch: AppDispatch) => {
  dispatch(agreeToAllTerms());
};

/** 아이디 정보 초기화 */
export const resetIdentificationAction =
  () => async (dispatch: AppDispatch) => {
    dispatch(resetIdentification());
  };

/**
 * 아이디 중복 검사
 * @param formData 아이디
 */
export const checkDuplicateAction =
  (formData: { identification: string }) => async (dispatch: AppDispatch) => {
    try {
      console.log(`중복 검사 : ${formData.identification}`);

      /** 응답된 값 */
      const response = await fetch("/api/auth/check-duplicate-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await response.json();

      // 409 (Conflict) 상태는 중복된 경우, 오류가 아니므로 catch로 전달
      if (response.status === 409)
        throw { status: 409, message: "이미 사용 중인 아이디입니다." };

      // 오류 시 예외 발생
      if (!response.ok) throw new Error(data.msg || "중복 검사 실패");

      console.log(data.msg);

      dispatch(
        setIsDuplicateAction({
          identification: formData.identification,
          isDuplicate: false,
          msg: "사용 가능한 아이디입니다.",
        })
      );
    } catch (err) {
      console.error(
        "/src/actions/authAction > checkDuplicateAction()에서 오류가 발생했습니다. :",
        err
      );

      let msg = "서버 오류입니다. 다시 시도해주세요.";

      if (typeof err === "object" && err !== null && "status" in err) {
        // 409 에러 처리
        if ((err as { status: number }).status === 409)
          msg = "이미 사용 중인 아이디입니다.";
      } else if (err instanceof Error) msg = err.message;

      dispatch(
        setIsDuplicateAction({
          identification: "",
          isDuplicate: true,
          msg: msg,
        })
      );
    }
  };

/**
 * 아이디 중복 여부 저장
 * @param formData 중복관련 정보
 */
export const setIsDuplicateAction =
  (formData: IDuplicate) => async (dispatch: AppDispatch) => {
    dispatch(setIsDuplicate(formData));
  };

/** 비밀번호 정보 초기화 */
export const resetPasswordAction = () => async (dispatch: AppDispatch) => {
  dispatch(resetPassword());
};

/**
 * 비밀번호 유효성 관련 정보 저장
 * @param formData 비밀번호 관련 정보
 */
export const setIsPasswordValidAction =
  (formData: IPasswordState) => async (dispatch: AppDispatch) => {
    dispatch(setIsPasswordValid(formData));
  };

/** 본인 인증 정보 초기화 */
export const resetVerificationAction = () => async (dispatch: AppDispatch) => {
  dispatch(resetVerification());
};

/**
 * E-mail 인증 코드 전송
 * @param formData E-mail
 */
export const verityEmailAction =
  (formData: { email: string }) => async (dispatch: AppDispatch) => {
    try {
      console.log(`E-mail 인증 시도 : ${formData.email}`);

      /** 응답된 값 */
      const response = await fetch("/api/auth/email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await response.json();

      // 오류 시
      if (!response.ok) throw new Error(data.msg);

      console.log(data.msg);

      dispatch(setEmailVerified(data));
    } catch (err) {
      console.error(
        "/src/actions/authAction > verityEmailAction()에서 오류가 발생했습니다. :",
        err
      );

      dispatch(setVerificationErr("서버 오류입니다. 다시 시도해주세요."));
    }
  };

/**
 * 휴대전화 번호 인증 코드 전송
 * @param formData 휴대전화 번호
 */
export const verifyPhoneNumberAction =
  (formData: { phoneNumber: string }) => async (dispatch: AppDispatch) => {
    try {
      console.log(`휴대전화 인증 시도 : ${formData.phoneNumber}`);

      /** 응답된 값 */
      const response = await fetch("/api/auth/phone-number-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await response.json();

      // 오류 시
      if (!response.ok) throw new Error(data.msg);

      console.log(data.msg);

      dispatch(setPhoneVerified(data));
    } catch (err) {
      console.error(
        "/src/actions/authAction > verifyPhoneNumberAction()에서 오류가 발생했습니다. :",
        err
      );

      dispatch(setVerificationErr("서버 오류입니다. 다시 시도해주세요."));
    }
  };

/** 본인 인증 완료 정보 저장 */
export const verifyAction = () => (dispatch: AppDispatch) => {
  dispatch(verify());
};

/** 프로필 정보 초기화 */
export const resetProfileAction = () => async (dispatch: AppDispatch) => {
  dispatch(resetProfile());
};

/**
 * 프로필 정보 저장
 * @param formData 프로필 정보
 */
export const setProfileAction =
  (formData: IProfile) => async (dispatch: AppDispatch) => {
    dispatch(setProfile(formData));
  };

/**
 * 프로필 별명 중복 검사
 * @param formData 별명
 */
export const setProfileSeqAction =
  (formData: { nickname: string }) => async (dispatch: AppDispatch) => {
    try {
      console.log(`별명 중복 검사 시도 : ${formData.nickname}`);

      /** 응답된 값 */
      const response = await fetch("/api/auth/get-next-nickname-seq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await response.json();

      // 오류 시
      if (!response.ok) throw new Error(data.msg);

      console.log(`최종 별명 : ${formData.nickname}#${data.seq}`);

      dispatch(setProfileSeq(data.seq));
    } catch (err) {
      console.error(
        "/src/actions/authAction > setProfileSeqAction()에서 오류가 발생했습니다. :",
        err
      );
    }
  };

/**
 * 동의된 약관들 저장
 * @param formData 동의한 사용자, 동의된 약관 Id들
 */
export const saveUserTermsAction =
  (formData: IUserAgreedTerms) => async (dispatch: AppDispatch) => {
    try {
      console.log("시도한 사용자명 : ", formData.userId);
      console.log("동의 시도한 약관 Id들 : ", formData.agreedTermIds);

      /** 응답된 값 */
      const response = await fetch("/api/auth/save-user-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await response.json();

      if (!response.ok) throw new Error(data.msg);

      console.log(data.msg);

      dispatch(setTermsSaved());
    } catch (error) {
      console.error(
        "/src/actions/authAction > saveUserTermsAction()에서 오류가 발생했습니다. :",
        error
      );
    }
  };

/**
 * 회원가입
 * @param formData 회원가입 정보
 */
export const signUpAction =
  (formData: IIUser) => async (dispatch: AppDispatch) => {
    try {
      console.log(`회원가입 시도 : ${formData}`);

      /** 응답된 값 */
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await response.json();

      // 오류 시
      if (!response.ok) throw new Error(data.msg);

      console.log(data.msg);

      dispatch(setSignUpCompleted());
    } catch (err) {
      console.error(
        "/src/actions/authAction > signUpAction()에서 오류가 발생했습니다. :",
        err
      );
    }
  };

/**
 * local 로그아웃
 * @param confirmDesc 띄울 확인 메세지
 * @param dispatch dispatch
 * @returns 로그아웃 여부
 */
export const signOutAction = async (
  confirmDesc: string,
  dispatch: AppDispatch
): Promise<boolean> => {
  // 사용자가 취소 누를 시
  if (!window.confirm(confirmDesc)) return false;

  try {
    /** 응답된 값 */
    const response = await fetch("/api/auth/sign-out", { method: "POST" });

    /** 받아온 값 */
    const data = await response.json();

    // 오류 시
    if (!response.ok) throw new Error(data.msg);

    console.log("로그아웃 성공:", data.msg);

    alert("로그아웃 되었습니다.");

    dispatch(signOut());

    return true;
  } catch (err) {
    console.error(
      "/src/actions/authAction > signOutAction()에서 오류가 발생했습니다. :",
      err
    );

    return false;
  }
};
