import { AppDispatch, RootState } from "@redux/store";

import { resetAuth, signOut, socialSignIn } from "@redux/slices/authSlice";
import {
  agreeToAllTerms,
  setLatestTerm,
  setTermAgreement,
  setTermsErr,
  setIsDuplicate,
  setIsPasswordValid,
  incrementStep,
  resetIdentification,
  decrementStep,
  resetSignUp,
  resetPassword,
  resetTerm,
  setEmailVerified,
  resetVerification,
  setVerificationErr,
  verify,
  setPhoneVerified,
} from "@redux/slices/signUpSlice";

import { IDuplicate, IPasswordState, ITerm } from "@interfaces/auth";

import { ERR_MSG } from "@constants/msg";

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
 * @param id 소셜 identification
 */
export const socialSignInAction =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await fetch(`/api/auth/social-sign-in?id=${id}`);

      if (!response.ok) {
        const errData = await response.json();

        alert(ERR_MSG);

        throw new Error(errData.msg || "소셜 로그인 실패");
      }

      const data = await response.json();

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
  dispatch(incrementStep());
};

/** step 감소 */
export const decrementStepAcion = () => async (dispatch: AppDispatch) => {
  dispatch(decrementStep());
};

/** 약관 정보 초기화 */
export const resetTermAction = () => async (dispatch: AppDispatch) => {
  dispatch(resetTerm());
};

/** 최신 약관 가져오기 */
export const getLatestTermsAction =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { isLoaded } = getState().signUpSlice.term;

    if (!isLoaded) return;

    fetch("/api/auth/get-latest-terms")
      .then(res => {
        if (res.ok) return res.json();
        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => dispatch(setLatestTerm(data.terms)))
      .catch(err => {
        console.error(
          "/src/actions/authAction > getLatestTermsAction()에서 오류가 발생했습니다. :",
          err
        );
        dispatch(setTermsErr(err));
      });
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

/** identification 정보 초기화 */
export const resetIdentificationAction =
  () => async (dispatch: AppDispatch) => {
    dispatch(resetIdentification());
  };

/**
 * identification 중복 검사
 * @param formData identification
 */
export const checkDuplicateAction =
  (formData: { identification: string }) => async (dispatch: AppDispatch) => {
    fetch("/api/auth/check-duplicate-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (res.ok || res.status === 409) {
          const is409 = res.status === 409;

          dispatch(
            setIsDuplicateAction({
              identification: is409 ? "" : formData.identification,
              isDuplicate: is409,
              msg: is409
                ? "이미 사용 중인 아이디입니다."
                : "사용 가능한 아이디 입니다.",
            })
          );

          return res.json();
        }

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => console.log(data.msg))
      .catch(err => {
        console.error(
          "/src/actions/authAction > checkDuplicateAction()에서 오류가 발생했습니다. :",
          err
        );

        dispatch(
          setIsDuplicateAction({
            identification: "",
            isDuplicate: true,
            msg: err,
          })
        );
      });
  };

/**
 * identification 중복 여부 저장
 * @param formData 중복관련 정보
 */
export const setIsDuplicateAction =
  (formData: IDuplicate) => async (dispatch: AppDispatch) => {
    dispatch(setIsDuplicate(formData));
  };

/** password 정보 초기화 */
export const resetPasswordAction = () => async (dispatch: AppDispatch) => {
  dispatch(resetPassword());
};

/**
 * password 유효성 관련 정보 저장
 * @param formData password 관련 정보
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
 * @param formData E-maile
 */
export const verityEmailAction =
  (formData: { email: string }) => async (dispatch: AppDispatch) => {
    fetch("/api/auth/email-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => dispatch(setEmailVerified(data)))
      .catch(err => {
        dispatch(
          setVerificationErr(
            "서버 오류입니다. 다시 시도해주세요.가 발생했습니다."
          )
        );

        console.error(
          "/src/actions/authAction > verityEmailAction()에서 오류가 발생했습니다. :",
          err
        );
      });
  };

/**
 * 전화번호 인증 코드 전송
 * @param formData 전화번호
 */
export const verifyPhoneNumberAction =
  (formData: { phoneNumber: string }) => async (dispatch: AppDispatch) => {
    fetch("/api/auth/phone-number-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => dispatch(setPhoneVerified(data)))
      .catch(err => {
        dispatch(
          setVerificationErr(
            "서버 오류입니다. 다시 시도해주세요.가 발생했습니다."
          )
        );

        console.error(
          "/src/actions/authAction > verifyPhoneNumberAction()에서 오류가 발생했습니다. :",
          err
        );
      });
  };

/** 본인 인증 완료 정보 저장 */
export const verifyAction = () => (dispatch: AppDispatch) => {
  dispatch(verify());
};

/**
 * local 로그아웃
 * @param confirmDesc 띄울 확인 메세지
 * @param dispatch dispatch
 * @returns 로그아웃 여부
 */
export const signOutAction = (
  confirmDesc: string,
  dispatch: AppDispatch
): boolean => {
  /** 확인 메세지 */
  const confirmSignOut: boolean = window.confirm(confirmDesc);

  // 사용자가 취소 누를 시
  if (!confirmSignOut) return false;

  fetch("/api/auth/sign-out", { method: "POST" })
    .then(res => {
      if (res.ok) return res.json();

      alert(ERR_MSG);

      return res.json().then(data => Promise.reject(data.msg));
    })
    .then(data => {
      console.log(data.msg);

      alert("로그아웃 됐습니다.");

      dispatch(signOut());
    })
    .catch(err =>
      console.error(
        "/src/actions/authAction > signOutAction()에서 오류가 발생했습니다. :",
        err
      )
    );

  return true;
};
