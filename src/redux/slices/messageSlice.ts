import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** 결과 Type */
export type TMessageResult = "ok" | "cancel" | null;

/** Message Interface */
export interface IMessage {
  /** 제목 */
  title: string | null;
  /** Message */
  msg: string | null;
  /** Message Type */
  type: "ok" | "ok-cancel";
}

/** Message 초기값 Interface */
interface IMessageState extends IMessage {
  /** Message 표시 여부 */
  isVisible: boolean;
  /** Message 결과 */
  result: TMessageResult;
}

/** Message 초기값 */
const initialState: IMessageState = {
  title: null,
  isVisible: false,
  msg: null,
  type: "ok-cancel",
  result: null,
};

/** Message Slice */
export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    /** Message 초기화 */
    resetMessage: state => {
      Object.assign(state, initialState);
    },
    /** Message 설정 */
    setMessage: (state, action: PayloadAction<IMessage>) => {
      state.isVisible = true;
      state.title = action.payload.title;
      state.msg = action.payload.msg;
      state.type = action.payload.type;
    },
    /** Message 결과 설정 */
    setResult: (state, action: PayloadAction<TMessageResult>) => {
      console.log("action.payload :", action.payload);
      state.result = action.payload;
      state.isVisible = false;
      state.msg = null;
    },
  },
});

export const { resetMessage, setMessage, setResult } = messageSlice.actions;

export default messageSlice.reducer;
