"use client";

import React, { CSSProperties, ReactNode } from "react";

import Image from "next/image";

import { useDispatch } from "react-redux";
import { hideBackdrop } from "@redux/slices/Backdrop";

import CSS from "./Modal.module.css";

import IconClose from "@public/img/common/icon_close_primary.svg";

interface IModalProps {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;

  close: () => void;
}

export default function Modal({ className = "", style = {}, close, ...props }: IModalProps) {
  const dispatch = useDispatch();

  const clickClose = () => {
    dispatch(hideBackdrop());

    close();
  };

  return (
    <div className={`${CSS.modal} ${className}`} style={style}>
      <button type="button" onClick={clickClose} style={{ position: "absolute", top: 10, right: 10, background: "none", padding: 0 }}>
        <Image src={IconClose} width={20} height={20} alt="X" />
      </button>
      {props.children}
    </div>
  );
}
