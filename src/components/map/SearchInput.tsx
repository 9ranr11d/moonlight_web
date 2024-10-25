"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { resetSearchPlaces, setSearchedPlaces } from "@redux/slices/mapSlice";

import CSS from "./Map.module.css";

import Modal from "@components/common/Modal";

import IconClose from "@public/img/common/icon_close_black.svg";
import IconSearch from "@public/img/common/icon_search_white.svg";
import IconExpand from "@public/img/common/icon_greater_than_white.svg";
import IconCollapse from "@public/img/common/icon_less_than_white.svg";

interface ISearchInputProps {
  moveToLocation: (lat: number, lng: number) => void;
}

export default function SearchInput({ moveToLocation }: ISearchInputProps) {
  const dispatch = useDispatch();

  const mapReducer = useSelector((state: RootState) => state.mapReducer);

  const placesBoxRef = useRef<HTMLDivElement>(null);
  const placeRefs = useRef<HTMLLIElement[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalMsg, setModalMsg] = useState<string>("");
  const [panelBackground, setPanelBackground] = useState<string>("none");

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isSearchPanelVisible, setIsSearchPanelVisible] = useState<boolean>(false);

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleSearchQueryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") searchLocation();
  };

  const clickResetSearchPlaces = (): void => {
    setSearchQuery("");
    setIsSearchPanelVisible(false);

    dispatch(resetSearchPlaces());
  };

  const panelController = (): void => {
    setIsSearchPanelVisible(prev => !prev);
  };

  const moveActivePlace = (idx: number): void => {
    if (placesBoxRef.current && placeRefs.current[idx]) {
      const placesBoxRefHeight: number = placesBoxRef.current.clientHeight;
      const activePlaceHeight: number = placeRefs.current[idx].clientHeight;
      const activePlaceOffsetTop: number = placeRefs.current[idx].offsetTop;

      const scrollTop: number = activePlaceOffsetTop - placesBoxRefHeight / 2 + activePlaceHeight / 2;

      placesBoxRef.current.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  const searchLocation = (): void => {
    const places = new kakao.maps.services.Places();

    const options = {
      location: new kakao.maps.LatLng(mapReducer.mapCenter.lat, mapReducer.mapCenter.lng),
      radius: 10000,
    };

    places.keywordSearch(
      searchQuery,
      (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          setIsSearchPanelVisible(true);

          dispatch(setSearchedPlaces(data));
        } else {
          console.error("검색 실패했습니다 :", status);

          switch (status) {
            case kakao.maps.services.Status.ZERO_RESULT:
              setModalMsg("검색 결과가 없습니다.");

              break;
            case null:
              setModalMsg("검색어를 입력해주세요.");

              break;
            case kakao.maps.services.Status.ERROR:
            default:
              setModalMsg("검색에 실패했습니다.");

              break;
          }

          setIsModalVisible(true);

          setTimeout(() => {
            setIsModalVisible(false);

            setModalMsg("");
          }, 3000);
        }
      },
      options
    );
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (!isSearchPanelVisible) {
      timer = setTimeout(() => {
        setPanelBackground("none");
      }, 300);
    } else setPanelBackground("var(--background-color-iv)");

    return () => clearTimeout(timer);
  }, [isSearchPanelVisible]);

  useEffect(() => {
    if (mapReducer.activeMarkerIdx !== -1) moveActivePlace(mapReducer.activeMarkerIdx);
  }, [mapReducer.activeMarkerIdx]);

  return (
    <>
      <div
        className={`${CSS.searchBox} ${mapReducer.searchedPlaces.length > 0 && isSearchPanelVisible ? CSS.searched : undefined}`}
        style={{ background: panelBackground }}
      >
        <div className={CSS.searchInput}>
          <span>
            <input type="text" value={searchQuery} onChange={handleSearchQuery} onKeyDown={handleSearchQueryKeyDown} placeholder="검색할 장소나 주소 입력" />

            {mapReducer.searchedPlaces.length > 0 && (
              <button type="button" onClick={clickResetSearchPlaces}>
                <Image src={IconClose} width={15} height={15} alt="X" />
              </button>
            )}
          </span>

          <button type="button" onClick={searchLocation}>
            <Image src={IconSearch} width={15} height={15} alt="검색" />
          </button>
        </div>

        <div className={CSS.places} ref={placesBoxRef}>
          {mapReducer.searchedPlaces.length > 0 && (
            <ul>
              {mapReducer.searchedPlaces.map((place, idx) => (
                <li
                  key={idx}
                  ref={el => {
                    if (el) placeRefs.current[idx] = el;
                  }}
                >
                  <button
                    type="button"
                    className={mapReducer.activeMarkerIdx === idx ? CSS.activePlace : undefined}
                    onClick={() => moveToLocation(Number(place.y), Number(place.x))}
                  >
                    <ul>
                      <li>
                        <h6>{place.place_name}</h6>
                      </li>

                      <li>
                        <p className={CSS.category}>{place.category_group_name}</p>
                      </li>

                      <li>
                        <p>{place.address_name}</p>
                      </li>
                    </ul>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {mapReducer.searchedPlaces.length > 0 && (
          <div className={CSS.panelControlBox}>
            <button type="button" onClick={panelController}>
              <Image src={isSearchPanelVisible ? IconCollapse : IconExpand} width={15} height={15} alt=">"></Image>
            </button>
          </div>
        )}
      </div>

      {isModalVisible && (
        <Modal style={{ position: "absolute", top: "50%", left: "50%" }}>
          <h4>{modalMsg}</h4>
        </Modal>
      )}
    </>
  );
}
