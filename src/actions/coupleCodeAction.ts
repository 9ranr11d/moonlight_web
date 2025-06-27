import { AppDispatch } from "@/redux/store";

import { setCoupleCode, setErr } from "@/redux/slices/coupleCodeSlice";

export const issueCoupleCodeAction =
  (formData: { userId: string }) => async (dispatch: AppDispatch) => {
    try {
      const res = await fetch(
        `/api/couple-code/${formData.userId}/couple-code-management`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok) {
        const msg: string = data?.msg || "서버 오류가 발생했습니다.";

        dispatch(setErr(msg));

        throw new Error(msg);
      }

      dispatch(setCoupleCode(data.coupleCode));
    } catch (err) {
      console.error(
        "actions/coupleCodeAction > issueCoupleCodeAction() :",
        err
      );
    }
  };
