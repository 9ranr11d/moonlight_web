import { WritableDraft } from "immer";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IIFavoriteLocation } from "@models/FavoriteLocation";

import { ILatLng } from "@interfaces/index";

import { DEFAULT_LAT, DEFAULT_LNG } from "@constants/index";

/** 주소 Interface */
export interface IAddress {
  /** 주소 명 */
  address_name: string;
  /** 주소 형식 */
  address_type: "REGION" | "ROAD" | "REGION_ADDR" | "ROAD_ADDR";
  /** 위도 */
  x: string;
  /** 경도 */
  y: string;
  /** 주소 정보 */
  address: kakao.maps.services.Address;
  /** 도로명 주소 정보 */
  road_address: kakao.maps.services.RoadAaddress;
}

/** 초기값 Interface  */
interface IMapState {
  /** 검색한 주소 목록 */
  searchedAddress: IAddress[];
  /** 검색한 장소 목록 */
  searchedPlaces: kakao.maps.services.PlacesSearchResult;
  /** 즐겨찾기 장소 목록 */
  favoriteLocations: WritableDraft<IIFavoriteLocation>[];
  /** 지도 중심 좌표 */
  mapCenter: ILatLng;
  /** 마지막 검색 좌표 */
  lastCenter: ILatLng;
  /** 선택된 장소 순서 */
  selectedLocationIdx: number;
}

/** 초기값 */
const initialState: IMapState = {
  searchedAddress: [],
  searchedPlaces: [],
  favoriteLocations: [],
  mapCenter: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
  lastCenter: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
  selectedLocationIdx: -1,
};

/** 지도 정보 */
export const Map = createSlice({
  name: "map",
  initialState,
  reducers: {
    /**
     * 주소 검색 결과 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setSearchedAddress: (state, action: PayloadAction<IAddress[]>) => {
      state.searchedAddress = action.payload;
      state.searchedPlaces = [];
      state.selectedLocationIdx = -1;
    },
    /**
     * 장소 검색 결과 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setSearchedPlaces: (
      state,
      action: PayloadAction<kakao.maps.services.PlacesSearchResult>
    ) => {
      state.searchedAddress = [];
      state.searchedPlaces = action.payload;
      state.selectedLocationIdx = -1;
    },
    /**
     * 즐겨찾기 목록 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setFavoriteLocations: (
      state,
      action: PayloadAction<{
        locations: WritableDraft<IIFavoriteLocation>[];
        resetSelection: boolean;
      }>
    ) => {
      state.favoriteLocations = action.payload.locations;

      if (action.payload.resetSelection) state.selectedLocationIdx = -1;
    },
    /**
     * 지도 중심 좌표 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setMapCenter: (state, action: PayloadAction<ILatLng>) => {
      state.mapCenter = action.payload;
    },
    /**
     * 마지막 검색 좌표 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setLastCenter: (state, action: PayloadAction<ILatLng>) => {
      state.lastCenter = action.payload;
    },
    /**
     * 검색 결과 목록 초기화
     * @param state 기존 정보
     */
    resetSearchPlaces: state => {
      state.searchedAddress = [];
      state.searchedPlaces = [];
      state.selectedLocationIdx = -1;
    },
    /**
     * 선택한 검색 결과 순서 저장
     * @param state 기존 정보
     * @param action 받아온 값
     */
    setSelectedLocationIdx: (state, action: PayloadAction<number>) => {
      state.selectedLocationIdx = action.payload;
    },
  },
});

export const {
  setSearchedAddress,
  setSearchedPlaces,
  setFavoriteLocations,
  setMapCenter,
  setLastCenter,
  resetSearchPlaces,
  setSelectedLocationIdx,
} = Map.actions;

export default Map.reducer;
