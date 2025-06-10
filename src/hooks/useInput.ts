"use client";

import { ChangeEvent, useState } from "react";

/**
 * 입력 값 관리 훅
 * @param initialValue 초기 값
 * @returns 입력 값과 변경 함수
 */
export const useInput = <T extends string | number>(initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue); // 입력 값

  /**
   * 입력 값 변경 함수
   * @param e 입력 이벤트
   */
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const tempValue = e.target.value;

    setValue(
      typeof initialValue === "number"
        ? (Number(tempValue) as T)
        : (tempValue as T)
    );
  };

  return { value, onChange };
};
