"use client";

import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { hideBackdrop } from "@redux/slices/Backdrop";

import CSS from "./Backdrop.module.css";

export default function Backdrop() {
  const dispatch = useDispatch();

  const backdrop = useSelector((state: RootState) => state.backdropReducer);

  const closeBackdrop = () => {
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
