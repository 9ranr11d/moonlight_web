"use client";

import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";

/** 속성 입력 필드 제목 인터페이스 */
interface ILabels {
  visitedAt: string;
  rating: string;
  comment: string;
  isPrviate: string;
}

/** 속성 값 타입 */
type TypeInputValue = string | number | boolean;

/** 방문 일지 작성/수정 */
export default function VisitHistoryEditor() {
  const labels: ILabels = { visitedAt: "방문 날짜", rating: "평점", comment: "평가", isPrviate: "나만 보기" };

  /** Dispatch */
  const dispatch = useDispatch();

  /** 즐겨찾기 정보 Reducer */
  const favoriteLocation = useSelector((state: RootState) => state.favoriteLocationReducer);

  /** 렌더할 Input 컴포넌트 */
  const inputRenderers: Record<string, (value: TypeInputValue) => React.JSX.Element | null> = {};

  /**
   * 속성 필드 렌더링
   * @param key key 값
   * @param value 속성 값
   * @returns Input
   */
  const renderInputs = (key: string, value: TypeInputValue): React.JSX.Element | null => {
    const renderer = inputRenderers[key];

    return renderer ? renderer(value) : null;
  };

  return (
    <div>
      <ul>
        {Object.entries(favoriteLocation.activeLocation).map(([key, value], idx) => {
          const isKeyInLabels: boolean = key in labels;

          if (!isKeyInLabels) return null;

          return (
            <li key={idx}>
              <ul>
                <li>{`${labels[key as keyof ILabels]}`}</li>
                <li>{renderInputs(key, value)}</li>
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
