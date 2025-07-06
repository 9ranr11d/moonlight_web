import { WritableDraft } from "immer";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  IFavoriteLocationHistory,
  IIFavoriteLocationHistory,
} from "@/models/FavoriteLocationHistory";

/** 즐겨찾기 방문 일지 타입 */
type TypeFavoriteLocationHistory = WritableDraft<
  IFavoriteLocationHistory | IIFavoriteLocationHistory
>;

/** 작업 상태 타입 */
type OperationMode = "create" | "edit" | "none";

/** 현재 만들거나 수정 중인 즐겨찾기 정보 초기값 */
const initialActiveLocation: WritableDraft<IFavoriteLocationHistory> = {
  location: "",
  visitedAt: new Date().toISOString(),
  rating: 0,
  comment: "",
  isPrivate: false,
  createdBy: "",
};

/** 초기값 Interface */
interface IFavoriteLocationState {
  operationMode: OperationMode;
  activeLocation: TypeFavoriteLocationHistory;
}

/** 초기값 */
const initialState: IFavoriteLocationState = {
  operationMode: "none",
  activeLocation: initialActiveLocation,
};

/** 즐겨찾기 정보 */
export const FavoriteLocation = createSlice({
  name: "favoriteLocation",
  initialState,
  reducers: {
    /** 즐겨찾기 새로 만들기 */
    createActiveLocation: state => {
      state.operationMode = "create";
      state.activeLocation = initialActiveLocation;
    },
    /** 수정할 즐겨찾기 정보 저장 */
    setActiveLocation: (
      state,
      action: PayloadAction<TypeFavoriteLocationHistory>
    ) => {
      state.operationMode = "edit";
      state.activeLocation = action.payload;
    },
  },
});

export const { createActiveLocation, setActiveLocation } =
  FavoriteLocation.actions;

export default FavoriteLocation.reducer;
