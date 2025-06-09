"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  IAddress,
  resetSearchPlaces,
  setLastCenter,
  setSearchedAddress,
  setSearchedPlaces,
} from "@/redux/slices/mapSlice";

import styles from "./Map.module.css";

import { Modal } from "@/components/common/Modal";

import IconClose from "@public/img/common/icon_close_black.svg";
import IconSearch from "@public/img/common/icon_search_white.svg";
import IconExpand from "@public/img/common/icon_expand_white.svg";
import IconCollapse from "@public/img/common/icon_collapse_white.svg";
import IconHeart from "@public/img/common/icon_heart_primary.svg";
import IconHeartWhite from "@public/img/common/icon_heart_white.svg";

/** Search Input Interface */
interface ISearchInput {
  /** 검색 결과 목록 선택 시 */
  selectedResult: (idx: number) => void;
  /** 즐겨찾기 여부 판별 함수 */
  checkIsFavoriteLocation: (
    location: IAddress | kakao.maps.services.PlacesSearchResultItem
  ) => boolean;
  /** '현 위치에서 재검색' 버튼 가시 유무 선택 */
  setIsReSearchVisible: (visible: boolean) => void;

  /** '현 위치에서 재검색' 버튼 가시 유무 */
  isReSearchVisible: boolean;
}

/** 검색 결과 목록 Style */
interface IPanelStyle {
  /** Background */
  background: string;
  /** Box Shadow */
  boxShadow: string;
}

/** 검색창 */
export default function SearchInput({
  selectedResult,
  checkIsFavoriteLocation,
  isReSearchVisible = false,
  setIsReSearchVisible,
}: ISearchInput) {
  /** Dispatch */
  const dispatch = useDispatch();

  /** 지도 Reducer */
  const map = useSelector((state: RootState) => state.mapSlice);

  /** 검색 결과들의 Box Ref */
  const resultsRef = useRef<HTMLDivElement>(null);
  /** 검색 결과들 Ref */
  const resultRefs = useRef<HTMLLIElement[]>([]);

  // 검색 결과 목록 Style
  const [panelStyle, setPanelStyle] = useState<IPanelStyle>({
    background: "none",
    boxShadow: "none",
  });

  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색어
  const [modalMsg, setModalMsg] = useState<string>(""); // 알림 Modal에 띄울 Message

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 알림 Modal 가시 여부
  const [isSearchPanelVisible, setIsSearchPanelVisible] =
    useState<boolean>(false); // 검색 결과 목록 가시 여부

  /** 검색 결과가 있는 지 */
  const isSearchResultsAvailable =
    map.searchedPlaces.length > 0 || map.searchedAddress.length > 0;

  /**
   * 주소 형식 변환
   * @param addressType 주소 타입
   * @returns 지명 | 도로명 | 지번 주소 | 도로명 주소 | 알 수 없음
   */
  const formatAddressType = (addressType: IAddress["address_type"]): string => {
    switch (addressType) {
      case "REGION":
        return "지명";
      case "ROAD":
        return "도로명";
      case "REGION_ADDR":
        return "지번 주소";
      case "ROAD_ADDR":
        return "도로명 주소";
      default:
        return "알 수 없음";
    }
  };

  /** 검색창 검색어 관리 */
  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  /** 검색창 '키' 누름 시 */
  const handleSearchQueryKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter") searchAddress();
  };

  /**
   * 검색어 초기화
   * @param isSearchPanelVisible 패널의 가시 여부
   */
  const clickResetSearchPlaces = (isSearchPanelVisible = false): void => {
    setSearchQuery("");
    setIsSearchPanelVisible(isSearchPanelVisible);

    dispatch(resetSearchPlaces());
  };

  /** 검색 결과 목록 Toggle */
  const togglePanelVisible = (): void => {
    setIsSearchPanelVisible(prev => !prev);
  };

  /** '즐겨찾기 보기' 버튼 클릭 시 */
  const clickFavoriteBtn = (): void => {
    clickResetSearchPlaces(true);
  };

  /**
   * 선택한 검색 결과로 스크롤
   * @param idx 스크롤 할 검색 결과 순서
   */
  const scrollToSelectedResult = (idx: number): void => {
    if (resultsRef.current && resultRefs.current[idx]) {
      /** 검색 결과들 Box 높이 */
      const resultsRefHeight: number = resultsRef.current.clientHeight;
      /** 선택한 검색 결과의 높이 */
      const selectedResultHeight: number = resultRefs.current[idx].clientHeight;
      /** 선택한 검색 결과의 위쪽 좌표 */
      const selectedResultOffsetTop: number = resultRefs.current[idx].offsetTop;

      /** 스크롤할 거리 */
      const scrollTop: number =
        selectedResultOffsetTop -
        resultsRefHeight / 2 +
        selectedResultHeight / 2;

      resultsRef.current.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  /** 주소 검색 */
  const searchAddress = (): void => {
    setIsReSearchVisible(false);

    dispatch(setLastCenter(map.mapCenter));

    const geocoder: kakao.maps.services.Geocoder =
      new kakao.maps.services.Geocoder();

    geocoder.addressSearch(searchQuery, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setIsSearchPanelVisible(true);

        dispatch(setSearchedAddress(result));
      } else {
        console.error("주소 검색에 실패했습니다 :", status);
        console.error("키워드 검색을 시작합니다.");

        // 주소로 검색되지 않을 시 '키워드'로 검색
        searchPlace();
      }
    });
  };

  /** 키워드 검색 */
  const searchPlace = (): void => {
    const places: kakao.maps.services.Places = new kakao.maps.services.Places();

    /** 검색 옵션 */
    const options: { location: kakao.maps.LatLng; radius: number } = {
      location: new kakao.maps.LatLng(map.mapCenter.lat, map.mapCenter.lng), // 현 위치를 기준으로
      radius: 10000, // 반경(1당 1m)
    };

    places.keywordSearch(
      searchQuery,
      (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          setIsSearchPanelVisible(true);

          dispatch(setSearchedPlaces(data));
        } else {
          console.error("장소 검색에 실패했습니다 :", status);

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

          // 오류 코드 알림 Modal로 잠깐 띄우기
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

  // 검색 결과 목록을 열고 닫을 시 Style 변경
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (!isSearchPanelVisible) {
      timer = setTimeout(() => {
        setPanelStyle({
          background: "none",
          boxShadow: "none",
        });
      }, 300);
    } else
      setPanelStyle({
        background: "var(--search-input-background-color)",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
      });

    return () => clearTimeout(timer);
  }, [isSearchPanelVisible]);

  // Marker 클릭으로 'selectedIdx' 변경 시 해당 검색 결과로 목록 스크롤
  useEffect(() => {
    if (map.selectedLocationIdx !== -1) {
      const result =
        map.searchedAddress.length > 0
          ? map.searchedAddress
          : map.searchedPlaces.length > 0
          ? map.searchedPlaces
          : map.favoriteLocations;

      console.log("선택한 정보 :", result[map.selectedLocationIdx]);

      scrollToSelectedResult(map.selectedLocationIdx);
    }
  }, [map.selectedLocationIdx]);

  return (
    <>
      <div
        className={`${styles.searchBox} ${
          (isSearchResultsAvailable || map.favoriteLocations.length > 0) &&
          isSearchPanelVisible
            ? styles.searched
            : undefined
        }`}
        style={panelStyle}
      >
        <div className={styles.searchInput}>
          <span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQuery}
              onKeyDown={handleSearchQueryKeyDown}
              placeholder="검색할 장소나 주소 입력"
            />

            {isSearchResultsAvailable && (
              <button type="button" onClick={() => clickResetSearchPlaces()}>
                {/* <Image src={IconClose} width={15} height={15} alt="X" /> */}
              </button>
            )}
          </span>

          <button type="button" onClick={searchAddress}>
            {/* <Image src={IconSearch} width={15} height={15} alt="검색" /> */}
          </button>
        </div>

        <div className={styles.results} ref={resultsRef}>
          {isSearchResultsAvailable ? (
            <ul>
              {map.searchedAddress.map((address, idx) => (
                <li
                  key={idx}
                  ref={el => {
                    if (el) resultRefs.current[idx] = el;
                  }}
                >
                  <button
                    type="button"
                    className={
                      map.selectedLocationIdx === idx
                        ? styles.selectedResult
                        : undefined
                    }
                    onClick={() => selectedResult(idx)}
                  >
                    <ul>
                      <li>
                        <h6>{address.address_name}</h6>
                      </li>

                      <li>
                        <p className={styles.category}>
                          {formatAddressType(address.address_type)}
                        </p>
                      </li>

                      <li>
                        {address.address
                          ? address.address.address_name
                          : address.road_address.address_name}
                      </li>
                    </ul>

                    {checkIsFavoriteLocation(address) && (
                      <div className={styles.favoriteLocations}>
                        {/* <Image src={map.selectedLocationIdx === idx ? IconHeartWhite : IconHeart} width={10} height={10} alt="❤️" /> */}
                      </div>
                    )}
                  </button>
                </li>
              ))}

              {map.searchedPlaces.map((place, idx) => (
                <li
                  key={idx}
                  ref={el => {
                    if (el) resultRefs.current[idx] = el;
                  }}
                >
                  <button
                    type="button"
                    className={
                      map.selectedLocationIdx === idx
                        ? styles.selectedResult
                        : undefined
                    }
                    onClick={() => selectedResult(idx)}
                  >
                    <ul>
                      <li>
                        <h6>{place.place_name}</h6>
                      </li>

                      <li>
                        <p className={styles.category}>
                          {place.category_group_name}
                        </p>
                      </li>

                      <li>
                        <p>{place.address_name}</p>
                      </li>
                    </ul>

                    {checkIsFavoriteLocation(place) && (
                      <div className={styles.favoriteLocations}>
                        {/* <Image src={map.selectedLocationIdx === idx ? IconHeartWhite : IconHeart} width={10} height={10} alt="❤️" /> */}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            map.favoriteLocations.length > 0 && (
              <ul>
                {map.favoriteLocations.map((location, idx) => (
                  <li
                    key={idx}
                    ref={el => {
                      if (el) resultRefs.current[idx] = el;
                    }}
                  >
                    <button
                      type="button"
                      className={
                        map.selectedLocationIdx === idx
                          ? styles.selectedResult
                          : undefined
                      }
                      onClick={() => selectedResult(idx)}
                    >
                      <ul>
                        <li>
                          <h6>{location.placeName || location.addressName}</h6>
                        </li>

                        {location.placeName && (
                          <li>
                            <p>{location.addressName}</p>
                          </li>
                        )}
                      </ul>

                      <div className={styles.favoriteLocations}>
                        {/* <Image src={map.selectedLocationIdx === idx ? IconHeartWhite : IconHeart} width={10} height={10} alt="❤️" /> */}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>

        <div className={styles.panelController}>
          <button
            type="button"
            onClick={togglePanelVisible}
            style={!isSearchPanelVisible ? { borderRadius: 5 } : undefined}
          >
            {/* <Image src={isSearchPanelVisible ? IconCollapse : IconExpand} width={15} height={15} alt={isSearchPanelVisible ? "▲" : "▼"}></Image> */}
          </button>
        </div>

        <div className={styles.panelController} style={{ right: -55 }}>
          {!isSearchPanelVisible && map.favoriteLocations.length > 0 && (
            <button
              type="button"
              onClick={clickFavoriteBtn}
              style={{ borderRadius: 5 }}
            >
              {/* <Image src={IconHeartWhite} width={15} height={15} alt="❤️" /> */}
            </button>
          )}
        </div>
      </div>

      {isModalVisible && (
        <Modal style={{ position: "absolute", top: "50%", left: "50%" }}>
          <h4>{modalMsg}</h4>
        </Modal>
      )}

      {isReSearchVisible && isSearchResultsAvailable && (
        <button
          type="button"
          onClick={searchAddress}
          className={styles.reSearchBtn}
        >
          현 위치에서 재검색
        </button>
      )}
    </>
  );
}
