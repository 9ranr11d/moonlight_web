"use client";

import React from "react";

import Image from "next/image";

import { useDispatch } from "react-redux";
import { createActiveLocation } from "@/store/slices/favoriteLocationSlice";

import { IIFavoriteLocationHistory } from "@/models/FavoriteLocationHistory";

import IconPlus from "@public/img/common/icon_plus_black.svg";

/** 방문 일지 목록 Interface */
interface IVisitHistories {
  /** 해당 장소 방문 일지 목록 */
  histories: IIFavoriteLocationHistory[];
}

/** 방문 일지 목록 */
export default function VisitHistories({ histories }: IVisitHistories) {
  console.log("방문 일지 :", histories);
  /** Dispatch */
  const dispatch = useDispatch();

  /** 방문 일지 만들기 */
  const createHistory = (): void => {
    dispatch(createActiveLocation());
  };

  return (
    <div>
      {histories.length === 0 ? (
        <p style={{ marginTop: 10, lineHeight: 1.5 }}>
          방문 일지가 없습니다.
          <br />
          방문 일지를 작성해주세요.
        </p>
      ) : (
        <p></p>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          type="button"
          onClick={createHistory}
          style={{ background: "none", padding: 0 }}
        >
          {/* <Image src={IconPlus} width={24} alt="+" /> */}
        </button>
      </div>
    </div>
  );
}
