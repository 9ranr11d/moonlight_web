import { AppDispatch, RootState } from "@/store";

import {
  setAuthErr,
  setRefreshAccessToken,
  setVerificationInfo,
  signIn,
  signOut,
  socialSignIn,
} from "@/store/slices/authSlice";

import {
  setLatestTerm,
  setTermsErr,
  setIsIdDuplicate,
  setSignUpCompleted,
  setTermsSaved,
} from "@/store/slices/signUpSlice";

import {
  confirmVerificationAvailable,
  setEmailVerified,
  setPhoneVerified,
  setRegistered,
  setVerificationErr,
} from "@/store/slices/verificationSlice";

import {
  passwordChangeCompleted,
  passwordChangeFailed,
  setModifiedId,
} from "@/store/slices/recoverySlice";

import {
  IIUser,
  ISignInData,
  IUserAgreedTerms,
  IVerificationInfo,
  TVerificationType,
} from "@/interfaces/auth";

import { setCoupleCode } from "@/store/slices/coupleCodeSlice";

/**
 * 소셜 로그인 정보 저장
 * @param identification 소셜 아이디
 */
export const socialSignInAction =
  (identification: string) => async (dispatch: AppDispatch) => {
    try {
      /** 응답된 값 */
      const res = await fetch(`/api/auth/social-sign-in?id=${identification}`);
      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
      if (!res.ok) throw new Error(data?.msg || "서버 오류가 발생했습니다.");

      dispatch(socialSignIn(data.user));
      dispatch(setCoupleCode(data.user.coupleCode));
    } catch (err) {
      console.error("actions/authAction > socialSignInAction() :", err);
    }
  };

/** 최신 약관 가져오기 */
export const getLatestTermsAction =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { isLoaded } = getState().signUp.term; // 약관 로드 여부

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
      console.error("actions/authAction > getLatestTermsAction() :", err);
    }
  };

/**
 * 아이디 중복 검사
 * @param formData 아이디
 */
export const checkDuplicateIdAction =
  (formData: { identification: string }) => async (dispatch: AppDispatch) => {
    try {
      /** 응답된 값 */
      const res = await fetch("/api/auth/check-duplicate-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
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

      dispatch(
        setIsIdDuplicate({
          identification: formData.identification,
          isDuplicate: false,
          msg: "사용 가능한 아이디입니다.",
        })
      );
    } catch (err) {
      console.error("actions/authAction > checkDuplicateIdAction() :", err);
    }
  };

/**
 * Email 중복 여부 검사
 * @param formData Email, Type
 */
export const checkDuplicateEmailAction =
  (formData: {
    email: string;
    identification?: string;
    type: TVerificationType;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
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

      switch (formData.type) {
        case "findId":
        case "findPw":
          dispatch(setRegistered(data.isRegistered));

          break;
        case "signUp":
        default:
          dispatch(confirmVerificationAvailable());

          break;
      }
    } catch (err) {
      console.error("actions/authAction > checkDuplicateEmailAction() :", err);
    }
  };

/**
 * 휴대전화 번호 중복 여부 검사
 * @param formData 휴대전화 번호
 */
export const checkDuplicatePhoneNumberAction =
  (formData: {
    phoneNumber: string;
    identification?: string;
    type: TVerificationType;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
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

      switch (formData.type) {
        case "findId":
        case "findPw":
          dispatch(setRegistered(data.isRegistered));

          break;
        case "signUp":
        default:
          dispatch(confirmVerificationAvailable());

          break;
      }
    } catch (err) {
      console.error(
        "actions/authAction > checkDuplicatePhoneNumberAction() :",
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

      dispatch(setEmailVerified(data));
    } catch (err) {
      console.error("actions/authAction > verityEmailAction() :", err);
    }
  };

/**
 * 휴대전화 번호 인증 코드 전송
 * @param formData 휴대전화 번호
 */
export const verifyPhoneNumberAction =
  (formData: { phoneNumber: string }) => async (dispatch: AppDispatch) => {
    try {
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

      dispatch(setPhoneVerified(data));
    } catch (err) {
      console.error("actions/authAction > verifyPhoneNumberAction() :", err);
    }
  };

/**
 * 동의된 약관들 저장
 * @param formData 동의한 사용자, 동의된 약관 Id들
 */
export const saveUserTermsAction =
  (formData: IUserAgreedTerms) => async (dispatch: AppDispatch) => {
    try {
      /** 응답된 값 */
      const res = await fetch("/api/auth/save-user-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
      if (!res.ok) throw new Error(data?.msg || "서버 오류가 발생했습니다.");

      dispatch(setTermsSaved());
    } catch (err) {
      console.error("actions/authAction > saveUserTermsAction() :", err);
    }
  };

/**
 * 회원가입
 * @param formData 회원가입 정보
 */
export const signUpAction =
  (formData: IIUser) => async (dispatch: AppDispatch) => {
    try {
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

      dispatch(setSignUpCompleted());
    } catch (err) {
      console.error("actions/authAction > signUpAction() :", err);
    }
  };

export const signInAction =
  (formData: ISignInData) => async (dispatch: AppDispatch) => {
    try {
      /** 응답된 값 */
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
      if (!res.ok) {
        const msg: string =
          res.status === 404 || res.status === 401
            ? "아이디 또는 비밀번호를 확인해주세요."
            : data?.msg || "서버 오류가 발생했습니다.";

        dispatch(setAuthErr(msg));

        throw new Error(msg);
      }

      console.log("SIGNINACTION :", data.user);

      dispatch(signIn(data.user));
      dispatch(setCoupleCode(data.user.coupleCode));
    } catch (err) {
      console.error("actions/authAction > signInAction() :", err);
    }
  };

/** Refresh Token 확인 */
export const checkRefreshTokenAction = () => async (dispatch: AppDispatch) => {
  try {
    /** 응답된 값 */
    const res = await fetch("/api/auth/refresh-access-token");
    /** 받아온 값 */
    const data = await res.json();

    // 오류 시
    if (!res.ok) throw new Error(data?.msg || "서버 오류가 발생했습니다.");

    dispatch(setRefreshAccessToken(data));
  } catch (err) {
    console.error("actions/authAction > checkRefreshToken() :", err);
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

      dispatch(signIn(data.user));
      dispatch(setCoupleCode(data.user.coupleCode));
    } catch (err) {
      console.error("actions/authAction > getUserAction() :", err);
    }
  };

/** Email 기반으로 아이디 가져오기 */
export const getUserIdByEmailAction =
  (formData: { email: string }) => async (dispatch: AppDispatch) => {
    try {
      /** 응답된 값 */
      const res = await fetch("/api/auth/get-user-id-by-email", {
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

      dispatch(setModifiedId(data.identification));
    } catch (err) {
      console.error("action/authAction > getUserIdByEmailAction() :", err);
    }
  };

/** 휴대전화 번호를 기반으로 아이디 가져오기 */
export const getUserIdByPhoneNumberAction =
  (formData: { phoneNumber: string }) => async (dispatch: AppDispatch) => {
    try {
      /** 응답된 값 */
      const res = await fetch("/api/auth/get-user-id-by-phone-number", {
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

      dispatch(setModifiedId(data.identification));
    } catch (err) {
      console.error(
        "action/authAction > getUserIdByPhoneNumberAction() :",
        err
      );
    }
  };

/** 비밀번호 변경 */
export const changePwAction =
  (formData: { identification: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      /** 응답된 값 */
      const res = await fetch("/api/auth/change-pw", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
      if (!res.ok) {
        const msg: string = data?.msg || "서버 오류가 발생했습니다.";

        dispatch(passwordChangeFailed(msg));

        throw new Error(msg);
      }

      dispatch(passwordChangeCompleted());
    } catch (err) {
      console.error("action/authAction > changePwAction() :", err);
    }
  };

/** 본인인증 정보 저장 */
export const setVerificationInfoAction =
  (formData: IVerificationInfo) => async (dispatch: AppDispatch) => {
    try {
      /** 응답된 값 */
      const res = await fetch("/api/auth/save-verification-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      /** 받아온 값 */
      const data = await res.json();

      // 오류 시
      if (!res.ok) throw new Error(data?.msg || "서버 오류가 발생했습니다.");

      dispatch(setVerificationInfo(formData));
    } catch (err) {
      console.error("action/authAction > setVerificationInfoAction() :", err);
    }
  };

/**
 * local 로그아웃
 * @param dispatch dispatch
 * @returns 로그아웃 여부
 */
export const signOutAction = () => async (dispatch: AppDispatch) => {
  try {
    /** 응답된 값 */
    const res = await fetch("/api/auth/sign-out", { method: "POST" });

    /** 받아온 값 */
    const data = await res.json();

    // 오류 시
    if (!res.ok) throw new Error(data?.msg || "서버 오류가 발생했습니다.");

    dispatch(signOut());
  } catch (err) {
    console.error("actions/authAction > signOutAction() :", err);
  }
};
