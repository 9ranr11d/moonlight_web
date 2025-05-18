"use client";

import React from "react";

import Image from "next/image";

import { useDispatch } from "react-redux";
import { hideBackdrop } from "@redux/slices/backdropSlice";

import styles from "./Modal.module.css";

import IconClose from "@public/img/common/icon_close_black.svg";

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
        <button
          type="button"
          onClick={clickClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "none",
            padding: 0,
          }}
        >
          {/* <Image src={IconClose} width={20} height={20} alt="X" /> */}
        </button>
      )}

      {children}
    </div>
  );
}
