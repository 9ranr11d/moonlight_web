import { AppDispatch, RootState } from "@redux/store";

import {
  setAuthErr,
  setRefreshAccessToken,
  signIn,
  signOut,
  socialSignIn,
} from "@redux/slices/authSlice";

import {
  setLatestTerm,
  setTermsErr,
  setIsIdDuplicate,
  setSignUpCompleted,
  setTermsSaved,
} from "@redux/slices/signUpSlice";

import {
  confirmVerificationAvailable,
  setEmailVerified,
  setPhoneVerified,
  setVerificationErr,
} from "@redux/slices/VerificationSlice";

import { IIUser, IUserAgreedTerms } from "@interfaces/auth";

/**
 * 소셜 로그인 정보 저장
 * @param identification 소셜 아이디
 */
export const socialSignInAction =
  (identification: string) => async (dispatch: AppDispatch) => {
    try {
      console.log(`소셜 로그인 시도 : ${identification}`);

      /** 응답된 값 */
      const res = await fetch(`/api/auth/social-sign-in?id=${identification}`);
      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
      if (!res.ok) throw new Error(data?.msg || "서버 오류가 발생했습니다.");

      console.log(data.msg);

      dispatch(socialSignIn(data.user));
    } catch (err) {
      console.error("/src/actions/authAction > socialSignInAction() :", err);
    }
  };

/** 최신 약관 가져오기 */
export const getLatestTermsAction =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { isLoaded } = getState().signUpSlice.term; // 약관 로드 여부

    // 로드 됐을 시 다시 요청하지 않음
    if (!isLoaded) return;

    try {
      /** 응답된 값 */
      const res = await fetch("/api/auth/get-latest-terms");

      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
      if (!res.ok) {
        const msg: string = data?.msg || "서버 오류가 발생했습니다.";

        dispatch(setTermsErr(msg));

        throw new Error(msg);
      }

      dispatch(setLatestTerm(data.terms));
    } catch (err) {
      console.error("/src/actions/authAction > getLatestTermsAction() :", err);
    }
  };

/**
 * 아이디 중복 검사
 * @param formData 아이디
 */
export const checkDuplicateIdAction =
  (formData: { identification: string }) => async (dispatch: AppDispatch) => {
    try {
      console.log(`중복 검사 : ${formData.identification}`);

      /** 응답된 값 */
      const res = await fetch("/api/auth/check-duplicate-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      // 오류 시 예외 발생
      if (!res.ok) {
        const msg: string = data?.msg || "서버 오류가 발생했습니다.";

        dispatch(
          setIsIdDuplicate({
            identification: "",
            isDuplicate: true,
            msg: msg,
          })
        );

        throw new Error(msg);
      }

      console.log(data.msg);

      dispatch(
        setIsIdDuplicate({
          identification: formData.identification,
          isDuplicate: false,
          msg: "사용 가능한 아이디입니다.",
        })
      );
    } catch (err) {
      console.error(
        "/src/actions/authAction > checkDuplicateIdAction() :",
        err
      );
    }
  };

/**
 * Email 중복 여부 검사
 * @param formData Email
 */
export const checkDuplicateEmailAction =
  (formData: { email: string }) => async (dispatch: AppDispatch) => {
    try {
      console.log(`Email 중복 검사 시도 : ${formData.email}`);

      /** 응답된 값 */
      const res = await fetch("/api/auth/check-duplicate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
      if (!res.ok) {
        const msg: string = data?.msg || "서버 오류가 발생했습니다.";

        dispatch(setVerificationErr(msg));

        throw new Error(msg);
      }

      console.log();

      dispatch(confirmVerificationAvailable());
    } catch (err) {
      console.error(
        "/src/actions/authAction > checkDuplicateEmailAction() :",
        err
      );
    }
  };

/**
 * 휴대전화 번호 중복 여부 검사
 * @param formData 휴대전화 번호
 */
export const checkDuplicatePhoneNumberAction =
  (formData: { phoneNumber: string }) => async (dispatch: AppDispatch) => {
    try {
      console.log(`휴대전화 번호 중복 검사 시도 : ${formData.phoneNumber}`);

      /** 응답된 값 */
      const res = await fetch("/api/auth/check-duplicate-phone-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
      if (!res.ok) {
        const msg: string = data?.msg || "서버 오류가 발생했습니다.";

        dispatch(setVerificationErr(msg));

        throw new Error(msg);
      }

      console.log(data.msg);

      dispatch(confirmVerificationAvailable());
    } catch (err) {
      console.error(
        "/src/actions/authAction > checkDuplicatePhoneNumberAction() :",
        err
      );
    }
  };

/**
 * Email 인증 코드 전송
 * @param formData Email
 */
export const verityEmailAction =
  (formData: { email: string }) => async (dispatch: AppDispatch) => {
    try {
      console.log(`Email 인증 시도 : ${formData.email}`);

      /** 응답된 값 */
      const res = await fetch("/api/auth/email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
      if (!res.ok) {
        const msg: string = data?.msg || "서버 오류가 발생했습니다.";

        dispatch(setVerificationErr(msg));

        throw new Error(msg);
      }

      console.log(data.msg);

      dispatch(setEmailVerified(data));
    } catch (err) {
      console.error("/src/actions/authAction > verityEmailAction() :", err);
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
      const res = await fetch("/api/auth/phone-number-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
      if (!res.ok) {
        const msg: string = data?.msg || "서버 오류가 발생했습니다.";

        dispatch(setVerificationErr(msg));

        throw new Error(msg);
      }

      console.log(data.msg);

      dispatch(setPhoneVerified(data));
    } catch (err) {
      console.error(
        "/src/actions/authAction > verifyPhoneNumberAction() :",
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
      const res = await fetch("/api/auth/save-user-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      if (!res.ok) throw new Error(data?.msg || "서버 오류가 발생했습니다.");

      console.log(data.msg);

      dispatch(setTermsSaved());
    } catch (err) {
      console.error("/src/actions/authAction > saveUserTermsAction() :", err);
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
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
      if (!res.ok) throw new Error(data?.msg || "서버 오류가 발생했습니다.");

      console.log(data.msg);

      dispatch(setSignUpCompleted());
    } catch (err) {
      console.error("/src/actions/authAction > signUpAction() :", err);
    }
  };

export const signInAction =
  (formData: { identification: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      console.log(`로그인 시도 : ${formData.identification}`);

      /** 응답된 값 */
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      if (!res.ok) {
        const msg: string =
          res.status === 404 || res.status === 401
            ? "아이디 또는 비밀번호를 확인해주세요."
            : data?.msg || "서버 오류가 발생했습니다.";

        dispatch(setAuthErr(msg));

        throw new Error(msg);
      }

      dispatch(signIn(data.user));
    } catch (err) {
      console.error("/src/actions/authAction > signInAction() :", err);
    }
  };

/** Refresh Token 확인 */
export const checkRefreshTokenAction = () => async (dispatch: AppDispatch) => {
  try {
    console.log("Refresh Token 확인");

    /** 응답된 값 */
    const res = await fetch("/api/auth/refresh-access-token");
    /** 받아온 값 */
    const data = await res.json();

    // 오류 시
    if (!res.ok) throw new Error(data?.msg || "서버 오류가 발생했습니다.");

    dispatch(setRefreshAccessToken(data));
  } catch (err) {
    console.error("/src/actions/authAction > checkRefreshToken() :", err);
  }
};

/** 사용자 정보 가져오기 */
export const getUserByAccessTokenAction =
  (formData: { accessToken: string }) => async (dispatch: AppDispatch) => {
    try {
      /** 응답된 값 */
      const res = await fetch("/api/auth/get-user-by-access-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // 오류 시
      if (!res.ok) throw new Error(data?.msg || "서버 오류가 발생했습니다.");

      console.log("getUserByAccessTokenAction :", data);
      dispatch(signIn(data.user));
    } catch (err) {
      console.error("/src/actions/authAction > getUserAction() :", err);
    }
  };

/**
 * local 로그아웃
 * @param confirmDesc 띄울 확인 Message
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
    const res = await fetch("/api/auth/sign-out", { method: "POST" });

    /** 받아온 값 */
    const data = await res.json();

    // 오류 시
    if (!res.ok) throw new Error(data?.msg || "서버 오류가 발생했습니다.");

    console.log("로그아웃 성공:", data.msg);

    alert("로그아웃 되었습니다.");

    dispatch(signOut());

    return true;
  } catch (err) {
    console.error("/src/actions/authAction > signOutAction() :", err);

    return false;
  }
};
