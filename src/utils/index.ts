export * from "./CookieUtils";
export * from "./jwtUtils";
export * from "./auth";
export * from "./date";

import { ILatLng } from "@/interfaces";

import { ERR_MSG } from "@/constants";

/** 숫자 범위 생성 함수 */
export const generateRange = (length: number, start = 1, suffix = "") =>
  Array.from({ length }, (_, i) => `${start + i}${suffix}`);

/**
 * 클립보드로 복사
 * @param text 복사할 문자열
 */
export const copyClipBoard = (text: string): void => {
  if (text.length > 0) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("클립보드에 복사되었습니다.");
      })
      .catch(err => {
        console.error("/src/utils/index > copyClipBoard() :", err);

        alert(ERR_MSG);
      });
  }
};

// 하버사인 공식을 사용해 두 좌표 간의 거리 계산 함수
export const calculateDistance = (coord1: ILatLng, coord2: ILatLng): number => {
  const R: number = 6371e3; // 지구 반지름 (미터)
  const φ1: number = (coord1.lat * Math.PI) / 180;
  const φ2: number = (coord2.lat * Math.PI) / 180;
  const Δφ: number = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ: number = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a: number =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 거리 (미터)
};
