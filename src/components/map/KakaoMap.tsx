"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Map } from "react-kakao-maps-sdk";

import CSS from "./Map.module.css";

import useKakaoLoader from "@hook/useKakaoLoader";
import useGeoloaction, { ICurrentLocation } from "@hook/useGeolocation";

import IconCurrentPosition from "@public/img/map/icon_current_position.svg";

export default function KakaoMap() {
  useKakaoLoader();

  const { currentLocation } = useGeoloaction();

  const mapRef = useRef<kakao.maps.Map>(null);

  const [center, setCenter] = useState<ICurrentLocation>(currentLocation);

  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setCenter(currentLocation);
  }, [currentLocation]);

  const handleSearchQuery = (e: any): void => {
    setSearchQuery(e.target.value);
  };

  const searchLocation = (): void => {};

  const moveToLocation = (lat: number, lng: number): void => {
    if (!mapRef.current) {
      alert("잠시후 다시 시도해주세요.");

      return;
    }

    mapRef.current?.panTo(new kakao.maps.LatLng(lat, lng));
  };

  return (
    <div style={{ width: "100%", height: "calc(100vh - 200px)", position: "relative" }}>
      <Map ref={mapRef} center={center} style={{ width: "100%", height: "100%" }} level={3}></Map>

      <div className={CSS.searchInput}>
        <input type="text" value={searchQuery} onChange={handleSearchQuery} placeholder="검색할 장소나 주소 입력" />

        <button type="button" onClick={searchLocation}>
          검색
        </button>
      </div>

      <button type="button" onClick={() => moveToLocation(currentLocation.lat, currentLocation.lng)} className={CSS.currentLocationBtn}>
        <Image src={IconCurrentPosition} width={30} height={30} alt="현 위치로" />
      </button>
    </div>
  );
}
