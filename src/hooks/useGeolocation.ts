import { useState, useEffect } from "react";

import { ILatLng } from "@interfaces/index";

import { DEFAULT_LAT, DEFAULT_LNG } from "@constants/index";

/** Geolocation Position 인터페이스 */
interface IGeolocationPosition {
  /** 좌표 정보 */
  coords: GeolocationCoordinates;
  /** 위취 정보를 얻은 시간 */
  timestamp: number;
}

/**
 * 현재 위치 가져오기
 * @returns currentLocation, locationLoading, getCurrentPosition
 */
export default function useGeoloaction() {
  // 현재 위치
  const [currentLocation, setCurrentLocation] = useState<ILatLng>({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  });

  const [locationLoading, setLocationLoading] = useState<boolean>(false); // 현재 위치 로드 여부

  /** 현재 위치 가져오기 */
  const getCurrentPosition = () => {
    setLocationLoading(true);

    /**
     * 현재 위치 가져오기
     * @param location Geolocation 좌표 정보
     */
    const success = (location: IGeolocationPosition) => {
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      console.log("현재 위치를 가져오는데 성공했습니다.");
      console.log("위도 :", lat, ", 경도 :", lng);

      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });

      setLocationLoading(false);
    };

    /** Error */
    const error = () => {
      console.log("현재 위치를 가져오는데 실패했습니다. 위도와 경도가 기본값으로 설정됩니다.");
      console.log("위도 :", DEFAULT_LAT, ", 경도 :", DEFAULT_LNG);

      setCurrentLocation({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });

      setLocationLoading(false);
    };

    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success, error);
    else {
      console.log("현재 사용 중인 브라우저가 Geolocation을 지원하지 않습니다.");

      setLocationLoading(false);
    }
  };

  // 현재 위치 가져오기
  useEffect(() => {
    getCurrentPosition();
  }, []);

  return { currentLocation, locationLoading, getCurrentPosition };
}
