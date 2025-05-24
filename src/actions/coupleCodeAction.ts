import { AppDispatch } from "@redux/store";

export const getCoupleCodeAction =
  (formData: { userId: string }) => async (dispatch: AppDispatch) => {
    try {
      const res = await fetch(
        `/api/couple-code/${formData.userId}/couple-code-management`
      );
      const data = await res.json();

      console.log(data);
    } catch (err) {
      console.error("actions/coupleCodeAction > getCoupleCodeAction() :", err);
    }
  };
