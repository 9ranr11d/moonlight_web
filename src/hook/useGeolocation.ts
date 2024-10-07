import { useState, useEffect } from "react";

/** 현재 위치 인터페이스 */
interface ICurrentLocation {
  /** 위도 */
  lat: number;
  /** 경도 */
  lng: number;
}

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
  const [currentLocation, setCurrentLocation] = useState<ICurrentLocation>({
    lat: 35.8655,
    lng: 128.5934,
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
      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      setLocationLoading(false);
    };

    /** Error */
    const error = () => {
      setCurrentLocation({ lat: 37.5666103, lng: 126.9783882 });
      setLocationLoading(false);
    };

    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success, error);
  };

  // 현재 위치 가져오기
  useEffect(() => {
    getCurrentPosition();
  }, []);

  return { currentLocation, locationLoading, getCurrentPosition };
}
