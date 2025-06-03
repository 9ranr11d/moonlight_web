import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICoupleCodeState {
  coupleCode: string;
  isErr: boolean;
  msg: string | null;
}

const initialState: ICoupleCodeState = {
  coupleCode: "",
  isErr: false,
  msg: null,
};

const coupleCode = createSlice({
  name: "coupleCode",
  initialState,
  reducers: {
    resetCoupleCode: state => {
      Object.assign(state, initialState);
    },
    setCoupleCode: (state, action: PayloadAction<string>) => {
      state.coupleCode = action.payload;
    },
    setErr: (state, action: PayloadAction<string>) => {
      state.msg = action.payload;
      state.isErr = true;
    },
  },
});

export const { resetCoupleCode, setCoupleCode, setErr } = coupleCode.actions;

export default coupleCode.reducer;
