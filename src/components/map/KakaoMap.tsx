"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import Lottie from "lottie-react";

import { Map } from "react-kakao-maps-sdk";

import CSS from "./Map.module.css";

import useKakaoLoader from "@hook/useKakaoLoader";
import useGeoloaction, { ICurrentLocation } from "@hook/useGeolocation";

import SearchInput from "./SearchInput";

import LottieLoading from "@public/json/loading_round_black.json";
import IconCurrentPosition from "@public/img/map/icon_current_position.svg";

export default function KakaoMap() {
  useKakaoLoader();

  const { currentLocation } = useGeoloaction();

  const mapRef = useRef<kakao.maps.Map>(null);

  const [center, setCenter] = useState<ICurrentLocation>(currentLocation);

  useEffect(() => {
    setCenter(currentLocation);
  }, [currentLocation]);

  const moveToLocation = (lat: number, lng: number): void => {
    mapRef.current?.panTo(new kakao.maps.LatLng(lat, lng));
  };

  return (
    <div style={{ width: "100%", height: "calc(100vh - 200px)", position: "relative" }}>
      <Map ref={mapRef} center={center} style={{ width: "100%", height: "100%" }} level={3}></Map>

      {mapRef.current ? (
        <>
          <SearchInput />

          <button type="button" onClick={() => moveToLocation(currentLocation.lat, currentLocation.lng)} className={CSS.currentLocationBtn}>
            <Image src={IconCurrentPosition} width={30} height={30} alt="현 위치로" />
          </button>
        </>
      ) : (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Lottie animationData={LottieLoading} style={{ width: 100, height: 100 }} />
        </div>
      )}
    </div>
  );
}
