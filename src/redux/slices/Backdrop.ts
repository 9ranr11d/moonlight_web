import { createSlice } from "@reduxjs/toolkit";

interface BackdropState {
  isVisible: boolean;
}

const initialState: BackdropState = {
  isVisible: false,
};

export const Backdrop = createSlice({
  name: "backdrop",
  initialState,
  reducers: {
    showBackdrop: state => {
      return {
        ...state,
        isVisible: true,
      };
    },
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
