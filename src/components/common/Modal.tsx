"use client";

import React from "react";

import { useDispatch } from "react-redux";
import { hideBackdrop } from "@/store/slices/backdropSlice";

import styles from "./Modal.module.css";

import CloseBtn from "@/components/common/btns/CloseBtn";

/** Modal Interface */
interface IModal {
  /** 닫기 */
  close?: () => void;

  /** 적용 될 'className' */
  className?: string;
  /** 적용 될 'style' */
  style?: React.CSSProperties;
  /** 적용 될 'Component'들 */
  children?: React.ReactNode;
  /** Ref */
  ref?: React.RefObject<HTMLDivElement | null>;
  /** 닫기 button 색상 */
  closeBtnFill?: string;
}

function Main({
  className = "",
  style = {},
  close,
  children,
  ref,
  closeBtnFill,
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
    <div ref={ref} className={`${styles.modal} ${className}`} style={style}>
      {close && (
        <CloseBtn
          onClick={clickClose}
          fill={closeBtnFill}
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

function Container({
  direction = "column",
  style,
  children,
}: {
  direction?: "column" | "row";
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={styles.container}
      style={{ display: "flex", flexDirection: direction, ...style }}
    >
      {children}
    </div>
  );
}

function Title({ children }: { children?: React.ReactNode }) {
  return <h4 style={{ color: "var(--gray-900)" }}>{children}</h4>;
}

function SubTitle({ children }: { children?: React.ReactNode }) {
  return <h6 style={{ color: "var(--gray-500)" }}>{children}</h6>;
}

export const Modal = Object.assign(Main, {
  Container,
  Title,
  SubTitle,
});
