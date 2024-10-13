"use client";

import React, { useState } from "react";

import CSS from "./Map.module.css";

import useGeoloaction from "@hook/useGeolocation";

export default function SearchInput() {
  const { currentLocation } = useGeoloaction();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchQuery = (e: any): void => {
    setSearchQuery(e.target.value);
  };

  const searchLocation = (): void => {
    const places = new kakao.maps.services.Places();

    const options = {
      location: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      radius: 10000,
    };

    places.keywordSearch(
      searchQuery,
      (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          console.log("Search Result :", data);
        } else {
          console.error("검색 실패했습니다 :", status);
        }
      },
      options
    );
  };

  return (
    <div className={CSS.searchInput}>
      <input type="text" value={searchQuery} onChange={handleSearchQuery} placeholder="검색할 장소나 주소 입력" />

      <button type="button" onClick={searchLocation}>
        검색
      </button>
    </div>
  );
}
