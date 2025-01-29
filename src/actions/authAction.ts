import { AppDispatch, RootState } from "@redux/store";

import {
  resetAuth,
  setIdentification,
  signOut,
  socialSignIn,
} from "@redux/slices/authSlice";
import {
  agreeToAllTerms,
  setLatestTerms,
  setTermAgreement,
  setTermsErr,
} from "@redux/slices/termsSlice";
import { resetIdCheck, setIsDuplicate } from "@redux/slices/idCheckSlice";

import { IDuplicate, ITerm } from "@interfaces/auth";

import { ERR_MSG } from "@constants/msg";

export const resetAuthAction = () => async (dispatch: AppDispatch) => {
  dispatch(resetAuth());
};
/**
 * 소셜 로그인 정보 저장
 * @param formData 소셜 로그인 정보
 */
export const socialSignInAction =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await fetch(`/api/auth/socialSignIn?id=${id}`);

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

/** 최신 약관 가져오기 */
export const getLatestTermsAction =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { isLoaded } = getState().termsReducer;

    if (!isLoaded) return;

    fetch("/api/auth/getLatestTerms")
      .then(res => {
        if (res.ok) return res.json();
        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => dispatch(setLatestTerms(data.terms)))
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

/**
 * identification 중복 검사
 * @param formData identification
 */
export const checkDuplicateAction =
  (formData: { identification: string }) => async (dispatch: AppDispatch) => {
    fetch("/api/auth/checkDuplicateId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (res.ok || res.status === 409) {
          const is409 = res.status === 409;

          dispatch(
            setIsDuplicateAction({
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

        dispatch(setIsDuplicateAction({ isDuplicate: true, msg: err }));
      });
  };

/** identification 중복 검사 관련 정보 초기화 */
export const resetIdCheckAction = () => async (dispatch: AppDispatch) => {
  dispatch(resetIdCheck());
};

/** identification 저장 */
export const setIdentificationAction =
  (identification: string) => async (dispatch: AppDispatch) => {
    console.log("setIdentificationAction :", identification);
    dispatch(setIdentification(identification));
  };

/**
 * identification 중복 여부 저장
 * @param isDuplicate 중복 여부
 */
export const setIsDuplicateAction =
  (formData: IDuplicate) => async (dispatch: AppDispatch) => {
    dispatch(setIsDuplicate(formData));
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

  fetch("/api/auth/signOut", { method: "POST" })
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
