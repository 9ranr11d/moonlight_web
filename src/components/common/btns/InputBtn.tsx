"use client";

import React from "react";

import styles from "./InputBtn.module.css";

interface IInputBtn {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function InputBtn({ children, onClick, style }: IInputBtn) {
  return (
    <button
      type="button"
      className={styles.inputBtn}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}
