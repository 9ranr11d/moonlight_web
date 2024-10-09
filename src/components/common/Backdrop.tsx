"use client";

import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { hideBackdrop } from "@redux/slices/BackdropSlice";

import CSS from "./Backdrop.module.css";

/** Modal 배경 화면 */
export default function Backdrop() {
  /** Dispatch */
  const dispatch = useDispatch();

  /** 배경 화면 Reducer */
  const backdrop = useSelector((state: RootState) => state.backdropReducer);

  /** 배경 화면 클릭 시 */
  const closeBackdrop = (): void => {
    dispatch(hideBackdrop());
  };

  return (
    <>
      {backdrop.isVisible && (
        <div className={CSS.backdrop}>
          <button type="button" onClick={closeBackdrop} />
        </div>
      )}
    </>
  );
}
