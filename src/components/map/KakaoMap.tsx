"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setSelectedIdx, setMapCenter, IAddress } from "@redux/slices/mapSlice";

import Lottie from "lottie-react";

import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";

import CSS from "./Map.module.css";

import { IFavoriteLocation } from "@models/FavoriteLocation";

import { ILatLng } from "@interfaces/index";

import useKakaoLoader from "@hooks/useKakaoLoader";
import useGeoloaction from "@hooks/useGeolocation";

import { ERR_MSG } from "@constants/msg";

import Modal from "@components/common/Modal";

import SearchInput from "./SearchInput";

import LottieLoading from "@public/json/loading_round_black.json";

import IconCurrentPosition from "@public/img/map/icon_current_position_black.svg";
import IconClose from "@public/img/common/icon_close_black.svg";
import IconHeart from "@public/img/common/icon_heart_primary.svg";
import IconHeartGray from "@public/img/common/icon_heart_gray.svg";
import IconMore from "@public/img/common/icon_more_black.svg";

/** KAKAO 지도 */
export default function KakaoMap() {
  useKakaoLoader();

  /** Dispatch */
  const dispatch = useDispatch();

  /** 지도 Reducer */
  const map = useSelector((state: RootState) => state.mapReducer);
  /** 사용자 Reducer */
  const user = useSelector((state: RootState) => state.authReducer);

  /** 검색 결과 Marker들 */
  const searchedMarkers: (IAddress | kakao.maps.services.PlacesSearchResultItem)[] = [...map.searchedAddress, ...map.searchedPlaces];

  const { currentLocation, isLocationLoading } = useGeoloaction(); // 현재 좌표

  /** 지도 Ref */
  const mapRef = useRef<kakao.maps.Map>(null);

  const [center, setCenter] = useState<ILatLng>(currentLocation); // 지도 중심 좌표

  const [favoriteLocations, setFavoriteLocations] = useState<IFavoriteLocation[]>([]); // 즐겨찾기 목록

  const [isCurrentOverlayVisible, setIsCurrentOverlayVisible] = useState<boolean>(true); // 현 위치 Overlay 가시 여부
  const [isSelectedOverlayVisible, setIsSelectedOverlayVisible] = useState<boolean>(true); // 선택한 검색 Marker Overlay 가시 여부

  /** 즐겨찾기 가져오기 */
  const getFavoriteLocations = (): void => {
    fetch("/api/map/favoriteLocationManagement")
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(locations => setFavoriteLocations(locations))
      .catch(err => console.error("/src/components/map/KakaoMap > KakaoMap() > getFavoriteLocations()애서 오류가 발생했습니다. :", err));
  };

  /**
   * 즐겨찾기 추가
   * @param locationInfo 장소 정보
   */
  const addFavoriteLocation = (locationInfo: IAddress | kakao.maps.services.PlacesSearchResultItem): void => {
    /** 즐겨찾기 추가에 필요한 정보 */
    const data: IFavoriteLocation = {
      ...("id" in locationInfo && { kakaoMapId: locationInfo.id }),
      ...("place_name" in locationInfo && { placeName: locationInfo.place_name }),
      addressName: locationInfo.address_name,
      x: parseFloat(locationInfo.x),
      y: parseFloat(locationInfo.y),
      createBy: user._id,
    };

    fetch("/api/map/favoriteLocationManagement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        console.log(data.msg);
      })
      .catch(err => console.error("/src/components/map/KakaoMap > KakaoMap()에서 오류가 발생했습니다. :", err));
  };

  /**
   * 지도 중심 이동 감지
   * @param map 지도
   */
  const onCenterChanged = (map: kakao.maps.Map) => {
    /** 위도, 경도 */
    const latLng = map.getCenter();
    /** 위도 */
    const lat = latLng.getLat();
    /** 경도 */
    const lng = latLng.getLng();

    console.log("지도의 중심 좌표가 변동 되었습니다.");
    console.log("위도 :", lat, ", 경도 :", lng);

    /** 지도 레벨 */
    const level = map.getLevel();

    console.log("현재 지도 레벨 :", level);

    dispatch(setMapCenter({ lat: lat, lng: lng }));
  };

  /**
   * 지정된 좌표로 이동
   * @param lat 위도
   * @param lng 경도
   */
  const moveToLocation = (lat: number, lng: number): void => {
    mapRef.current?.panTo(new kakao.maps.LatLng(lat, lng));
  };

  /** 현 위치 Overlay Toggle */
  const toggleCurrentOverlay = (): void => {
    setIsCurrentOverlayVisible(prev => !prev);
  };

  /** 선택한 검색 Marker Toggle */
  const toggleSelectedOverlay = (): void => {
    setIsSelectedOverlayVisible(prev => !prev);
  };

  /** '현 위치로' 클릭 시 */
  const clickCurrentLocation = (): void => {
    setIsCurrentOverlayVisible(true);

    moveToLocation(currentLocation.lat, currentLocation.lng);
  };

  /**
   * 검색 Marker 선택 시
   * @param idx
   */
  const selectedLocation = (idx: number): void => {
    setIsCurrentOverlayVisible(false); // 현 위치 Overlay 불가시화

    if (idx === map.selectedIdx) toggleSelectedOverlay(); // 선택한 Marker 재선택 시 Overlay 불가시화
    else setIsSelectedOverlayVisible(true); // 선택한 Marker Overlay 가시화

    dispatch(setSelectedIdx(idx));
  };

  // 처음 실행 시
  useEffect(() => {
    getFavoriteLocations();
  }, []);

  // 사용자의 현 위치를 지도 중심으로 반영
  useEffect(() => {
    setCenter(currentLocation);

    dispatch(setMapCenter({ lat: currentLocation.lat, lng: currentLocation.lng }));
  }, [currentLocation]);

  // 검색 Marker 선택 시 해당 좌표로 이동
  useEffect(() => {
    if (map.selectedIdx !== -1) {
      const { x, y } = searchedMarkers[map.selectedIdx];

      moveToLocation(Number(y), Number(x));
    }
  }, [map.selectedIdx]);

  return (
    <div style={{ width: "100%", height: "calc(100vh - 200px)", position: "relative" }}>
      <Map ref={mapRef} center={center} style={{ width: "100%", height: "100%" }} level={3} onCenterChanged={onCenterChanged}>
        {!isLocationLoading && (
          <>
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
              onClick={toggleCurrentOverlay}
            />

            {isCurrentOverlayVisible && (
              <CustomOverlayMap position={{ lat: currentLocation.lat, lng: currentLocation.lng }}>
                <div style={{ position: "relative", bottom: 70 }}>
                  <Modal style={{ width: "initial", padding: 10, paddingBottom: 5 }}>
                    <button
                      type="button"
                      style={{ background: "none", padding: 0, position: "absolute", top: 0, right: 3, width: 7, height: 7 }}
                      onClick={toggleCurrentOverlay}
                    >
                      <Image src={IconClose} width={7} height={7} alt="X" />
                    </button>

                    <h6>현 위치</h6>
                  </Modal>
                </div>
              </CustomOverlayMap>
            )}
          </>
        )}

        {searchedMarkers.length > 0 &&
          searchedMarkers.map((marker, idx) => (
            <MapMarker
              key={idx}
              position={{ lat: Number(marker.y), lng: Number(marker.x) }}
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
              onClick={() => selectedLocation(idx)}
            />
          ))}

        {searchedMarkers.length > 0 &&
          map.selectedIdx !== -1 &&
          isSelectedOverlayVisible &&
          (() => {
            const selectedLocationInfo: IAddress | kakao.maps.services.PlacesSearchResultItem = searchedMarkers[map.selectedIdx];

            return (
              <CustomOverlayMap position={{ lat: Number(selectedLocationInfo.y), lng: Number(selectedLocationInfo.x) }}>
                <div style={{ position: "relative", bottom: 70 }}>
                  <Modal
                    className={CSS.searchedOverlay}
                    style={{
                      width: "initial",
                      padding: 10,
                      paddingBottom: 5,
                      flexDirection: "row",
                      columnGap: 10,
                      alignItems: "center",
                    }}
                  >
                    <button type="button" style={{ position: "absolute", top: 0, right: 3 }} onClick={toggleSelectedOverlay}>
                      <Image src={IconClose} width={7} height={7} alt="X" />
                    </button>

                    <h6>{(selectedLocationInfo as kakao.maps.services.PlacesSearchResultItem).place_name || selectedLocationInfo.address_name}</h6>

                    <button type="button" onClick={() => addFavoriteLocation(selectedLocationInfo)}>
                      <Image src={IconHeartGray} width={12} height={12} alt="즐겨찾기" />
                    </button>

                    <button type="button">
                      <Image src={IconMore} width={12} height={12} alt="..." />
                    </button>
                  </Modal>
                </div>
              </CustomOverlayMap>
            );
          })()}
      </Map>

      {mapRef.current && !isLocationLoading ? (
        <>
          <SearchInput selectedResult={selectedLocation} />

          <button type="button" onClick={clickCurrentLocation} className={CSS.currentLocationBtn}>
            <Image src={IconCurrentPosition} width={30} height={30} alt="현 위치로" />
          </button>
        </>
      ) : (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1 }}>
          <Lottie animationData={LottieLoading} style={{ width: 100, height: 100 }} />
        </div>
      )}
    </div>
  );
}
