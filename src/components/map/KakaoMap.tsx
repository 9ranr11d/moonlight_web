"use client";

import React, { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSelectedLocationIdx,
  setMapCenter,
  IAddress,
  setFavoriteLocations,
  setLastCenter,
} from "@/redux/slices/mapSlice";
import { showBackdrop } from "@/redux/slices/backdropSlice";

// import Lottie from "react-lottie-player";

import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";

import styles from "./Map.module.css";

import {
  IFavoriteLocation,
  IIFavoriteLocation,
} from "@/models/FavoriteLocation";

import { ILatLng } from "@/interfaces";

import useKakaoLoader from "@/hooks/useKakaoLoader";
import useGeoloaction from "@/hooks/useGeolocation";

import { ERR_MSG } from "@/constants";
import { RESEARCH_DISTANCE } from "@/constants";

import { calculateDistance } from "@/utils";

import { Modal } from "@/components/common/Modal";

import SearchInput from "./SearchInput";
import EventModal from "./EventModal";

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
  const map = useSelector((state: RootState) => state.mapSlice);
  /** 사용자 Reducer */
  const user = useSelector((state: RootState) => state.authSlice);
  /** Background Reducer */
  const backdrop = useSelector((state: RootState) => state.backdropSlice);

  /** 검색 결과 Marker들 */
  const searchedMarkers: (
    | IAddress
    | kakao.maps.services.PlacesSearchResultItem
  )[] = [...map.searchedAddress, ...map.searchedPlaces];

  const { currentLocation, isLocationLoading } = useGeoloaction(); // 현재 좌표

  /** 지도 Ref */
  const mapRef = useRef<kakao.maps.Map>(null);

  const [center, setCenter] = useState<ILatLng>(currentLocation); // 지도 중심 좌표

  const [selectedFavoriteLocation, setSelectedFavoriteLocation] =
    useState<IIFavoriteLocation | null>(null);

  const [isCurrentOverlayVisible, setIsCurrentOverlayVisible] =
    useState<boolean>(true); // 현 위치 Overlay 가시 여부
  const [isSelectedOverlayVisible, setIsSelectedOverlayVisible] =
    useState<boolean>(true); // 선택한 검색 Marker Overlay 가시 여부
  const [isReSearchVisible, setIsReSearchVisible] = useState<boolean>(false); // '이 지역에서 재검색' 버튼 가시 유무
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] =
    useState<boolean>(false); // 즐겨찾기 자세한 정보 모달 가시 여부

  /**
   * 지도 중심 이동 감지
   * @param map 지도
   */
  const onCenterChanged = (map: kakao.maps.Map): void => {
    /** 위도, 경도 */
    const latLng: kakao.maps.LatLng = map.getCenter();
    /** 위도 */
    const lat: number = latLng.getLat();
    /** 경도 */
    const lng: number = latLng.getLng();

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

  /**
   * 즐겨찾기 가져오기
   * @param resetSelection 선택된 장소의 초기화 여부
   */
  const getFavoriteLocations = (resetSelection: boolean = false): void => {
    fetch("/api/map/favorite-location-management")
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(locations =>
        dispatch(setFavoriteLocations({ locations, resetSelection }))
      )
      .catch(err =>
        console.error(
          "/src/components/map/KakaoMap > KakaoMap() > getFavoriteLocations()애서 오류가 발생했습니다. :",
          err
        )
      );
  };

  /**
   * 즐겨찾기 추가
   * @param locationInfo 장소 정보
   */
  const addFavoriteLocation = (
    locationInfo: IAddress | kakao.maps.services.PlacesSearchResultItem
  ): void => {
    // /** 즐겨찾기 추가에 필요한 정보 */
    // const data: IFavoriteLocation = {
    //   ...("id" in locationInfo && { kakaoMapId: locationInfo.id }),
    //   ...("place_name" in locationInfo && {
    //     placeName: locationInfo.place_name,
    //   }),
    //   addressName: locationInfo.address_name,
    //   x: parseFloat(locationInfo.x),
    //   y: parseFloat(locationInfo.y),
    //   createdBy: user._id,
    // };
    // fetch("/api/map/favorite-location-management", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // })
    //   .then(res => {
    //     if (res.ok) return res.json();
    //     alert(ERR_MSG);
    //     return res.json().then(data => Promise.reject(data.msg));
    //   })
    //   .then(data => {
    //     console.log(data.msg);
    //     getFavoriteLocations();
    //   })
    //   .catch(err =>
    //     console.error(
    //       "/src/components/map/KakaoMap > KakaoMap() :",
    //       err
    //     )
    //   );
  };

  /**
   * 즐겨찾기 삭제
   * @param locationInfo 장소 정보
   */
  const removeFavoriteLocation = (
    locationInfo:
      | IAddress
      | kakao.maps.services.PlacesSearchResultItem
      | IIFavoriteLocation
  ): void => {
    /** 쿼리변수 */
    const queryParam =
      "id" in locationInfo
        ? `id=${
            "kakaoMapId" in locationInfo
              ? locationInfo.kakaoMapId
              : locationInfo.id
          }`
        : `addressName=${encodeURIComponent(
            "addressName" in locationInfo
              ? locationInfo.addressName
              : locationInfo.address_name
          )}`;

    /** 즐겨찾기 삭제 url */
    const url = `/api/map/favorite-location-management?${queryParam}`;

    fetch(url, { method: "DELETE" })
      .then(res => {
        if (res.ok) return res.json();

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        console.log(data.msg);

        getFavoriteLocations(true);
      })
      .catch(err =>
        console.error(
          "/src/components/map/KakaoMap > KakaoMap() > removeFavoriteLocation :",
          err
        )
      );
  };

  /**
   * 즐겨찾기 여부 판별 함수
   * @param location 판별할 장소 정보
   * @returns 일치(true), 불일치(false)
   */
  const checkIsFavoriteLocation = (
    location: IAddress | kakao.maps.services.PlacesSearchResultItem
  ): boolean => {
    return map.favoriteLocations.some(favorite => {
      if ("id" in location && favorite.kakaoMapId)
        return favorite.kakaoMapId === location.id;

      return favorite.addressName === location.address_name;
    });
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

    if (idx === map.selectedLocationIdx)
      toggleSelectedOverlay(); // 선택한 Marker 재선택 시 Overlay 불가시화
    else setIsSelectedOverlayVisible(true); // 선택한 Marker Overlay 가시화

    dispatch(setSelectedLocationIdx(idx));
  };

  /** Event Modal 닫기 */
  const closeModal = (): void => {
    setIsFavoriteModalOpen(false);
  };

  /**
   * 즐겨찾기 마커의 '더보기' 클릭 시
   * @param selectedLocationData 선택한 즐겨찾기 정보
   */
  const selectFavoriteLocation = (
    selectedLocationData: IIFavoriteLocation
  ): void => {
    dispatch(showBackdrop());

    setIsFavoriteModalOpen(true);

    setSelectedFavoriteLocation(selectedLocationData);
  };

  /**
   * 마커 렌더링 함수
   * @param marker 마커 정보
   * @param idx 마커 순서
   * @returns MapMarker
   */
  const renderSearchedMarker = (
    marker: IAddress | kakao.maps.services.PlacesSearchResultItem,
    idx: number
  ): React.JSX.Element => {
    /** 현재 마커가 즐겨찾기에 등록되어 있는지 */
    const isFavoriteLocation = checkIsFavoriteLocation(marker);

    /** 마커 이미지 src */
    const imgSrc = isFavoriteLocation
      ? "/img/map/icon_finder_marker_favorite.png"
      : "/img/map/icon_finder_marker_default.png";

    return (
      <MapMarker
        key={idx}
        position={{ lat: Number(marker.y), lng: Number(marker.x) }}
        image={{
          src: imgSrc,
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
    );
  };

  /**
   * 선택된 위치 오버레이 렌더링 함수
   * @returns CustomOverlayMap
   */
  const renderSelectedOverlay = (): React.JSX.Element => {
    /** 현재 마커 정보 */
    const selectedLocationInfo:
      | IAddress
      | kakao.maps.services.PlacesSearchResultItem
      | IIFavoriteLocation =
      searchedMarkers.length > 0
        ? searchedMarkers[map.selectedLocationIdx]
        : map.favoriteLocations[map.selectedLocationIdx];

    /** 현재 마커가 즐겨찾기 인지 */
    const isFavoriteLocation: boolean =
      searchedMarkers.length > 0
        ? checkIsFavoriteLocation(
            selectedLocationInfo as
              | IAddress
              | kakao.maps.services.PlacesSearchResultItem
          )
        : true;

    return (
      <CustomOverlayMap
        position={{
          lat: Number(selectedLocationInfo.y),
          lng: Number(selectedLocationInfo.x),
        }}
      >
        <div style={{ position: "relative", bottom: 70 }}>
          <Modal
            className={styles.searchedOverlay}
            style={{
              width: "initial",
              padding: 10,
              paddingBottom: 5,
              flexDirection: "row",
              columnGap: 10,
              alignItems: "center",
            }}
          >
            <button
              type="button"
              style={{ position: "absolute", top: 0, right: 3 }}
              onClick={toggleSelectedOverlay}
            >
              {/* <Image src={IconClose} width={7} height={7} alt="X" /> */}
            </button>

            <h6>
              {(
                selectedLocationInfo as kakao.maps.services.PlacesSearchResultItem
              ).place_name ||
                (selectedLocationInfo as IAddress).address_name ||
                (selectedLocationInfo as IIFavoriteLocation).placeName ||
                (selectedLocationInfo as IIFavoriteLocation).addressName}
            </h6>

            <button
              type="button"
              onClick={() =>
                !isFavoriteLocation
                  ? addFavoriteLocation(
                      selectedLocationInfo as
                        | IAddress
                        | kakao.maps.services.PlacesSearchResultItem
                    )
                  : removeFavoriteLocation(selectedLocationInfo)
              }
            >
              {/* <Image
                src={!isFavoriteLocation ? IconHeartGray : IconHeart}
                width={12}
                height={12}
                alt={!isFavoriteLocation ? "♡" : "❤️"}
              /> */}
            </button>

            {isFavoriteLocation && (
              <button
                type="button"
                onClick={() =>
                  selectFavoriteLocation(
                    selectedLocationInfo as IIFavoriteLocation
                  )
                }
              >
                {/* <Image src={IconMore} width={12} height={12} alt="..." /> */}
              </button>
            )}
          </Modal>
        </div>
      </CustomOverlayMap>
    );
  };

  // 처음 실행 시
  useEffect(() => {
    getFavoriteLocations();
  }, []);

  // 사용자의 현 위치를 지도 중심으로 반영
  useEffect(() => {
    setCenter(currentLocation);

    dispatch(
      setMapCenter({ lat: currentLocation.lat, lng: currentLocation.lng })
    );
    dispatch(
      setLastCenter({ lat: currentLocation.lat, lng: currentLocation.lng })
    );
  }, [currentLocation]);

  // 검색 Marker 선택 시 해당 좌표로 이동
  useEffect(() => {
    if (map.selectedLocationIdx !== -1) {
      const { x, y } =
        searchedMarkers.length > 0
          ? searchedMarkers[map.selectedLocationIdx]
          : map.favoriteLocations[map.selectedLocationIdx];

      moveToLocation(Number(y), Number(x));
    }
  }, [map.selectedLocationIdx]);

  // 지도 중앙 좌표 이동 시
  useEffect(() => {
    /** 마지막 검색 좌표로부터 현재 지도 중앙 좌표까지 거리 */
    const distance = calculateDistance(map.mapCenter, map.lastCenter);
    console.log("마지막 검색 좌표로부터 거리 :", `${Math.round(distance)}m`);

    if (distance > RESEARCH_DISTANCE) setIsReSearchVisible(true);
    else setIsReSearchVisible(false);
  }, [map.mapCenter]);

  // Backdrop랑 EventModal 동조화
  useEffect(() => {
    if (!backdrop.isVisible) closeModal();
  }, [backdrop.isVisible]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Map
        ref={mapRef}
        center={center}
        style={{ width: "100%", height: "100%" }}
        level={3}
        onCenterChanged={onCenterChanged}
      >
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
              <CustomOverlayMap
                position={{
                  lat: currentLocation.lat,
                  lng: currentLocation.lng,
                }}
              >
                <div style={{ position: "relative", bottom: 70 }}>
                  <Modal
                    style={{ width: "initial", padding: 10, paddingBottom: 5 }}
                  >
                    <button
                      type="button"
                      style={{
                        background: "none",
                        padding: 0,
                        position: "absolute",
                        top: 0,
                        right: 3,
                        width: 7,
                        height: 7,
                      }}
                      onClick={toggleCurrentOverlay}
                    >
                      {/* <Image src={IconClose} width={7} height={7} alt="X" /> */}
                    </button>

                    <h6>현 위치</h6>
                  </Modal>
                </div>
              </CustomOverlayMap>
            )}
          </>
        )}

        {searchedMarkers.length > 0
          ? searchedMarkers.map(renderSearchedMarker)
          : map.favoriteLocations.length > 0 &&
            map.favoriteLocations.map((location, idx) => (
              <MapMarker
                key={idx}
                position={{ lat: Number(location.y), lng: Number(location.x) }}
                image={{
                  src: "/img/map/icon_favorite_marker_default.png",
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

        {(searchedMarkers.length > 0 || map.favoriteLocations.length > 0) &&
          map.selectedLocationIdx !== -1 &&
          isSelectedOverlayVisible &&
          renderSelectedOverlay()}
      </Map>

      {mapRef.current && !isLocationLoading ? (
        <>
          <SearchInput
            selectedResult={selectedLocation}
            checkIsFavoriteLocation={checkIsFavoriteLocation}
            isReSearchVisible={isReSearchVisible}
            setIsReSearchVisible={visible => setIsReSearchVisible(visible)}
          />

          <button
            type="button"
            onClick={clickCurrentLocation}
            className={styles.currentLocationBtn}
          >
            {/* <Image
              src={IconCurrentPosition}
              width={30}
              height={30}
              alt="현 위치로"
            /> */}
          </button>

          {isFavoriteModalOpen && selectedFavoriteLocation && (
            <EventModal
              closeModal={closeModal}
              locationData={selectedFavoriteLocation!}
            />
          )}
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        >
          {/* <Lottie animationData={LottieLoading} style={{ width: 50, height: 50 }} /> */}
        </div>
      )}
    </div>
  );
}
