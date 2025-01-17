import { AppDispatch } from "@redux/store";
import { socialSignIn } from "@redux/slices/AuthSlice";

import { ERR_MSG } from "@constants/msg";

/**
 * 소셜 로그인 정보 저장
 * @param formData 소셜 로그인 정보
 */
export const socialSignInAction = (id: string) => (dispatch: AppDispatch) => {
  try {
    fetch(`/api/auth/socialSignIn?id=${id}`)
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => dispatch(socialSignIn(data.user)));
  } catch (err) {
    console.error(
      "/src/actons/authActions > setSocialUser()에서 오류가 발생했습니다. :",
      err
    );
  }
};
