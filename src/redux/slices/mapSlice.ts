import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { ILatLng } from "@interfaces/index";

import { DEFAULT_LAT, DEFAULT_LNG } from "@constants/index";

interface IMapState {
  searchedPlaces: kakao.maps.services.PlacesSearchResult;
  mapCenter: ILatLng;
  activeMarkerIdx: number;
}

const initialState: IMapState = {
  searchedPlaces: [],
  mapCenter: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
  activeMarkerIdx: -1,
};

export const Map = createSlice({
  name: "map",
  initialState,
  reducers: {
    setSearchedPlaces: (state, action: PayloadAction<kakao.maps.services.PlacesSearchResult>): IMapState => {
      return {
        ...state,
        searchedPlaces: action.payload,
      };
    },
    setMapCenter: (state, action: PayloadAction<ILatLng>): IMapState => {
      return {
        ...state,
        mapCenter: action.payload,
      };
    },
    resetSearchPlaces: state => {
      return {
        ...state,
        searchedPlaces: [],
      };
    },
    setActiveMarkerIdx: (state, action: PayloadAction<number>): IMapState => {
      return {
        ...state,
        activeMarkerIdx: action.payload,
      };
    },
  },
});

export const { setSearchedPlaces, setMapCenter, resetSearchPlaces, setActiveMarkerIdx } = Map.actions;

export default Map.reducer;
