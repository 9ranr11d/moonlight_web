import { createSlice } from "@reduxjs/toolkit";

/** Modal 배경화면 Interface */
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
    /** 배경화면 가시 */
    showBackdrop: state => {
      state.isVisible = true;
    },
    /** 배경화면 불가시 */
    hideBackdrop: state => {
      state.isVisible = false;
    },
  },
});

export const { showBackdrop, hideBackdrop } = Backdrop.actions;

export default Backdrop.reducer;
