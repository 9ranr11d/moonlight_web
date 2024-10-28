"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setSelectedIdx, setMapCenter, IAddress } from "@redux/slices/mapSlice";

import Lottie from "lottie-react";

import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";

import CSS from "./Map.module.css";

import { ILatLng } from "@interfaces/index";

import useKakaoLoader from "@hooks/useKakaoLoader";
import useGeoloaction from "@hooks/useGeolocation";

import Modal from "@components/common/Modal";

import SearchInput from "./SearchInput";

import LottieLoading from "@public/json/loading_round_black.json";

import IconCurrentPosition from "@public/img/map/icon_current_position_black.svg";
import IconClose from "@public/img/common/icon_close_black.svg";

/** KAKAO 지도 */
export default function KakaoMap() {
  useKakaoLoader();

  /** Dispatch */
  const dispatch = useDispatch();

  /** 지도 Reducer */
  const mapReducer = useSelector((state: RootState) => state.mapReducer);

  /** 검색 결과 Marker들 */
  const serachedMarkers: (IAddress | kakao.maps.services.PlacesSearchResultItem)[] = [...mapReducer.searchedAddress, ...mapReducer.searchedPlaces];

  /** 현재 좌표 */
  const { currentLocation, locationLoading } = useGeoloaction();

  /** 지도 Ref */
  const mapRef = useRef<kakao.maps.Map>(null);

  /** 지도 중심 좌표 */
  const [center, setCenter] = useState<ILatLng>(currentLocation);

  const [isCurrentOverlayVisible, setIsCurrentOverlayVisible] = useState<boolean>(true); // 현 위치 Overlay 가시 여부
  const [isSelectedOverlayVisible, setIsSelectedOverlayVisible] = useState<boolean>(true); // 선택한 검색 Marker Overlay 가시 여부

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
  const selectedResult = (idx: number): void => {
    setIsCurrentOverlayVisible(false); // 현 위치 Overlay 불가시화

    if (idx === mapReducer.selectedIdx) toggleSelectedOverlay(); // 선택한 Marker 재선택 시 Overlay 불가시화
    else setIsSelectedOverlayVisible(true); // 선택한 Marker Overlay 가시화

    dispatch(setSelectedIdx(idx));
  };

  // 사용자의 현 위치를 지도 중심으로 반영
  useEffect(() => {
    setCenter(currentLocation);

    dispatch(setMapCenter({ lat: currentLocation.lat, lng: currentLocation.lng }));
  }, [currentLocation]);

  // 검색 Marker 선택 시 해당 좌표로 이동
  useEffect(() => {
    if (mapReducer.selectedIdx !== -1) {
      const { x, y } = serachedMarkers[mapReducer.selectedIdx];

      moveToLocation(Number(y), Number(x));
    }
  }, [mapReducer.selectedIdx]);

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

        {serachedMarkers.length > 0 &&
          serachedMarkers.map((marker, idx) => (
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
              onClick={() => selectedResult(idx)}
            />
          ))}

        {serachedMarkers.length > 0 &&
          mapReducer.selectedIdx !== -1 &&
          isSelectedOverlayVisible &&
          (() => {
            const selectedResultInfo = serachedMarkers[mapReducer.selectedIdx];

            return (
              <CustomOverlayMap position={{ lat: Number(selectedResultInfo.y), lng: Number(selectedResultInfo.x) }}>
                <div style={{ position: "relative", bottom: 70 }}>
                  <Modal style={{ width: "initial", padding: 10, paddingBottom: 5 }}>
                    <button
                      type="button"
                      style={{ background: "none", padding: 0, position: "absolute", top: 0, right: 3, width: 7, height: 7 }}
                      onClick={toggleSelectedOverlay}
                    >
                      <Image src={IconClose} width={7} height={7} alt="X" />
                    </button>

                    <h6>{<h6>{(selectedResultInfo as kakao.maps.services.PlacesSearchResultItem).place_name || selectedResultInfo.address_name}</h6>}</h6>
                  </Modal>
                </div>
              </CustomOverlayMap>
            );
          })()}
      </Map>

      {mapRef.current && !locationLoading ? (
        <>
          <SearchInput selectedResult={selectedResult} />

          <button type="button" onClick={clickCurrentLocation} className={CSS.currentLocationBtn}>
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
