"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import CSS from "./NaverMap.module.css";

import useGeoloaction from "@hook/useGeolocation";

import IconCurrentPosition from "@public/img/map/icon_current_position.svg";

export default function NaverMap() {
  const { currentLocation } = useGeoloaction();

  const mapRef = useRef<HTMLDivElement | null>(null);

  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useEffect(() => {
    const initMap = () => {
      const mapOptions = {
        center: new naver.maps.LatLng(currentLocation.lat, currentLocation.lng),
        logoControl: false,
        scaleControl: false,
        zoom: 17,
      };

      if (mapRef.current) {
        const naverMap = new naver.maps.Map(mapRef.current, mapOptions);
        setMap(naverMap);
      }
    };

    if (window.naver && window.naver.maps) initMap();
    else {
      const mapScript = document.createElement("script");
      mapScript.onload = () => initMap();
      mapScript.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
      document.head.appendChild(mapScript);
    }
  }, [currentLocation]);

  const handleMoveToCurrentLocation = () => {
    if (map) {
      const newCenter = new naver.maps.LatLng(currentLocation.lat, currentLocation.lng);
      map.setCenter(newCenter);
    }
  };

  return (
    <div ref={mapRef} style={{ width: "100%", height: "calc(100vh - 200px)", position: "relative" }}>
      <button type="button" onClick={handleMoveToCurrentLocation} className={CSS.currentLocationBtn}>
        <Image src={IconCurrentPosition} width={30} height={30} alt="ㅇ" />
      </button>
    </div>
  );
}
