"use client";

import React from "react";

import { useDispatch } from "react-redux";
import { hideBackdrop } from "@redux/slices/backdropSlice";

import styles from "./Modal.module.css";
import CloseBtn from "./btn/CloseBtn";

/** Modal Interface */
interface IModal {
  /** 닫기 */
  close?: () => void;

  /** 적용 될 'className' */
  className?: string;
  /** 적용 될 'style' */
  style?: React.CSSProperties;
  /** 적용 될 'Component'들 */
  children: React.ReactNode;
}

/** Modal */
export default function Modal({
  className = "",
  style = {},
  close,
  children,
}: IModal) {
  /** Dispatch */
  const dispatch = useDispatch();

  /** '닫기' 클릭 시 */
  const clickClose = (): void => {
    if (close) {
      dispatch(hideBackdrop());

      close();
    }
  };

  return (
    <div className={`${styles.modal} ${className}`} style={style}>
      {close && (
        <CloseBtn
          onClick={clickClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        />
      )}

      {children}
    </div>
  );
}
