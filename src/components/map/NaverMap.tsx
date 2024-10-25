"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import CSS from "./Map.module.css";

import useGeoloaction from "@hooks/useGeolocation";

import IconCurrentPosition from "@public/img/map/icon_current_position_black.svg";

export default function NaverMap() {
  const { currentLocation } = useGeoloaction();

  const mapRef = useRef<HTMLDivElement | null>(null);

  const [map, setMap] = useState<naver.maps.Map | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const moveToCurrentLocation = (): void => {
    if (map) {
      const newCenter = new naver.maps.LatLng(currentLocation.lat, currentLocation.lng);
      map.setCenter(newCenter);
    }
  };

  const searchLocation = (): void => {
    if (!map || !searchQuery) return;

    // naver.maps.Service.geocode({ query: searchQuery }, (status, response) => {
    //   if (status === naver.maps.Service.Status.ERROR) {
    //     alert("검색 결과가 없습니다.");

    //     return;
    //   }

    //   const result = response.v2.addresses[0];

    //   const newLocation = new naver.maps.LatLng(Number(result.y), Number(result.x));

    //   map.setCenter(newLocation);

    //   if (marker) marker.setPosition(newLocation);
    //   else {
    //     const newMarker = new naver.maps.Marker({
    //       position: newLocation,
    //       map: map,
    //     });

    //     setMarker(newMarker);
    //   }

    //   const infoWindow = new naver.maps.InfoWindow({
    //     content: `<div style="padding:10px;"><b>${searchQuery}</b><br/>${result.roadAddress}</div>`,
    //   });

    //   if (marker) infoWindow.open(map, marker);
    //   else infoWindow.open(map, newLocation);
    // });

    fetch("/api/map/naver_search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchQuery: searchQuery }),
    })
      .then(res => {
        if (res.ok) return res.json();

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        console.log("검색 결과 :", data);
      })
      .catch(err => console.error("/src/components/auth/SignIn > SignIn() > processSignIn()에서 오류가 발생했습니다. :", err));
  };

  useEffect(() => {
    const initMap = (): void => {
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
      mapScript.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`;
      document.head.appendChild(mapScript);
    }
  }, [currentLocation]);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "calc(100vh - 200px)", position: "relative" }}>
      <div className={CSS.searchInput}>
        <input type="text" value={searchQuery} onChange={handleSearchQuery} placeholder="검색할 장소나 주소 입력" />

        <button type="button" onClick={searchLocation}>
          검색
        </button>
      </div>

      <button type="button" onClick={moveToCurrentLocation} className={CSS.currentLocationBtn}>
        <Image src={IconCurrentPosition} width={30} height={30} alt="ㅇ" />
      </button>
    </div>
  );
}
