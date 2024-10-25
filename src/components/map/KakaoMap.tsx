"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setActiveMarkerIdx, setMapCenter } from "@redux/slices/mapSlice";

import Lottie from "lottie-react";

import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";

import CSS from "./Map.module.css";

import useKakaoLoader from "@hooks/useKakaoLoader";
import useGeoloaction from "@hooks/useGeolocation";

import { ILatLng } from "@interfaces/index";

import SearchInput from "./SearchInput";

import LottieLoading from "@public/json/loading_round_black.json";

import IconCurrentPosition from "@public/img/map/icon_current_position_black.svg";

export default function KakaoMap() {
  useKakaoLoader();

  const dispatch = useDispatch();

  const mapReducer = useSelector((state: RootState) => state.mapReducer);

  const { currentLocation } = useGeoloaction();

  const mapRef = useRef<kakao.maps.Map>(null);

  const [center, setCenter] = useState<ILatLng>(currentLocation);

  const onCenterChanged = (map: kakao.maps.Map) => {
    const latLng = map.getCenter();
    const lat = latLng.getLat();
    const lng = latLng.getLng();

    console.log("지도의 중심 좌표가 변동 되었습니다.");
    console.log("위도 :", lat, ", 경도 :", lng);

    dispatch(setMapCenter({ lat: lat, lng: lng }));
  };

  const moveToLocation = (lat: number, lng: number): void => {
    mapRef.current?.panTo(new kakao.maps.LatLng(lat, lng));
  };

  const clickMarker = (idx: number, lat: number, lng: number): void => {
    moveToLocation(lat, lng);

    dispatch(setActiveMarkerIdx(idx));
  };

  useEffect(() => {
    setCenter(currentLocation);

    dispatch(setMapCenter({ lat: currentLocation.lat, lng: currentLocation.lng }));
  }, [currentLocation]);

  return (
    <div style={{ width: "100%", height: "calc(100vh - 200px)", position: "relative" }}>
      <Map ref={mapRef} center={center} style={{ width: "100%", height: "100%" }} level={3} onCenterChanged={onCenterChanged}>
        <MapMarker
          position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
          image={{
            src: "/img/map/icon_current_marker_primary.png",
            size: { width: 48, height: 48 },
            options: {
              offset: {
                x: 24,
                y: 45,
              },
            },
          }}
        />

        {/* <CustomOverlayMap position={{ lat: currentLocation.lat, lng: currentLocation.lng }} yAnchor={1}>
          <div style={{ position: "relative", bottom: 42 }}>
            <h6>현 위치</h6>
          </div>
        </CustomOverlayMap> */}

        {mapReducer.searchedPlaces.length > 0 &&
          mapReducer.searchedPlaces.map((place, idx) => (
            <MapMarker
              key={idx}
              position={{ lat: Number(place.y), lng: Number(place.x) }}
              image={{
                src: "/img/map/icon_finder_marker_default.png",
                size: { width: 48, height: 48 },
                options: {
                  offset: {
                    x: 24,
                    y: 45,
                  },
                },
              }}
              clickable={true}
              onClick={() => clickMarker(idx, Number(place.y), Number(place.x))}
            />
          ))}
      </Map>

      {mapRef.current ? (
        <>
          <SearchInput moveToLocation={moveToLocation} />

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
