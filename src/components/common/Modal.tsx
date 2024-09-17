"use client";

import React, { CSSProperties, ReactNode } from "react";

import CSS from "./Modal.module.css";

interface IModalProps {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export default function Modal({ className = "", style = {}, ...props }: IModalProps) {
  return (
    <div className={`${CSS.modal} ${className}`} style={style}>
      {props.children}
    </div>
  );
}
