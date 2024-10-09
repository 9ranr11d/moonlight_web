import { createSlice } from "@reduxjs/toolkit";

/** Modal 배경화면 인터페이스 */
interface IBackdropState {
  isVisible: boolean;
}

/** Modal 배경화면 Reducer 초기값 */
const initialState: IBackdropState = {
  isVisible: false,
};

/** Modal 배경화면 */
export const Backdrop = createSlice({
  name: "backdrop",
  initialState,
  reducers: {
    /**
     * 배경화면 가시
     * @param state 기존 정보
     */
    showBackdrop: state => {
      return {
        ...state,
        isVisible: true,
      };
    },
    /**
     * 배경화면 불가시
     * @param state 기존 정보
     */
    hideBackdrop: state => {
      return {
        ...state,
        isVisible: false,
      };
    },
  },
});

export const { showBackdrop, hideBackdrop } = Backdrop.actions;

export default Backdrop.reducer;
