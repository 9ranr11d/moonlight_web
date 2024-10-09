import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IMapState {
  places: kakao.maps.services.Places[];
}

const initialState: IMapState = {
  places: [],
};

export const Map = createSlice({
  name: "map",
  initialState,
  reducers: {
    setPlaces: (state, action: PayloadAction<kakao.maps.services.Places[]>): IMapState => {
      return {
        ...state,
        places: action.payload,
      };
    },
  },
});

export const { setPlaces } = Map.actions;

export default Map.reducer;
