"use client";

import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

import { IIFavoriteLocation } from "@models/FavoriteLocation";
import { IIFavoriteLocationHistory } from "@models/FavoriteLocationHistory";

import { ERR_MSG } from "@constants/msg";

import Modal from "@components/common/Modal";

import VisitHistories from "./VisitHistories";
import VisitHistoryEditor from "./VisitHistoryEditor";

/** 즐겨찾기 방문 일지 모달 자식들 */
interface IEventModalProps {
  /** 닫기 */
  closeModal: () => void;

  /** 선택한 즐겨찾기 정보 */
  locationData: IIFavoriteLocation;
}

/** 즐겨찾기 방문 일지 모달 */
export default function EventModal({ closeModal, locationData }: IEventModalProps) {
  console.log("선택한 즐겨찾기 장소 정보 :", locationData);

  /** 즐겨찾기 Reducer */
  const favoriteLocation = useSelector((state: RootState) => state.favoriteLocationReducer);

  const [histories, setHistories] = useState<IIFavoriteLocationHistory[]>([]); // 방문 일지들

  /**
   * 해당 장소 방문 일지들 가져오기
   * @param _id 해당 장소 _id
   */
  const getHistories = (_id: string): void => {
    fetch(`/api/map/favoriteLocationHistoryManagement?_id=${_id}`)
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => setHistories(data))
      .catch(err => console.error("/src/components/map/EventModal > getLocationDetails() :", err));
  };

  const renderContent = (): React.JSX.Element => {
    switch (favoriteLocation.operationMode) {
      case "create":
      case "edit":
        return <VisitHistoryEditor />;
      case "none":
      default:
        return <VisitHistories histories={histories} />;
    }
  };

  // 해당 장소 변경 시 방문 일지들 가져오기
  useEffect(() => {
    if (locationData._id) getHistories(locationData._id as string);
  }, [locationData]);

  return (
    <Modal close={closeModal} style={{ padding: 10 }}>
      <h6>
        {locationData.placeName || locationData.addressName}&nbsp;
        <span style={{ color: "var(--placeholder-color)", fontSize: 16 }}>방문 일지</span>
      </h6>
      {renderContent()}
    </Modal>
  );
}
