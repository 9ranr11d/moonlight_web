"use client";

import React, { CSSProperties, ReactNode } from "react";

import Image from "next/image";

import { useDispatch } from "react-redux";
import { hideBackdrop } from "@redux/slices/BackdropSlice";

import CSS from "./Modal.module.css";

import IconClose from "@public/img/common/icon_close_black.svg";

/** Modal 자식들 */
interface IModalProps {
  /** 적용 될 'className' */
  className?: string;
  /** 적용 될 'style' */
  style?: CSSProperties;
  /** 적용 될 'Component'들 */
  children: ReactNode;

  /** 닫기 */
  close?: () => void;
}

/** Modal */
export default function Modal({ className = "", style = {}, close, ...props }: IModalProps) {
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
    <div className={`${CSS.modal} ${className}`} style={style}>
      {close && (
        <button type="button" onClick={clickClose} style={{ position: "absolute", top: 10, right: 10, background: "none", padding: 0 }}>
          <Image src={IconClose} width={20} height={20} alt="X" />
        </button>
      )}

      {props.children}
    </div>
  );
}
