"use client";

import React from "react";

import { useDispatch } from "react-redux";
import { hideBackdrop } from "@/redux/slices/backdropSlice";

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
}

function Main({ className = "", style = {}, close, children }: IModal) {
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

function Button({
  children,
  className,
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      style={{
        borderRadius: 3,
        flex: 1,
        padding: "15px 20px",
        fontSize: 15,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export const Modal = Object.assign(Main, {
  Container,
  Title,
  SubTitle,
  Button,
});
