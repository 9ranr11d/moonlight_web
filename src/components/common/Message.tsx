"use client";

import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/redux/store";

import { setResult } from "@/redux/slices/messageSlice";

import styles from "./Message.module.css";

import { Modal } from "@/components/common/Modal";

/** Message */
export default function Message() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** Message Redux */
  const message = useSelector((state: RootState) => state.messageSlice);

  const renderBtn = (): React.ReactNode => {
    switch (message.type) {
      case "ok-cancel":
        return (
          <div className={styles.btnContainer}>
            <button
              type="button"
              className="outlineBtn"
              onClick={() => dispatch(setResult("cancel"))}
            >
              <p>취소</p>
            </button>

            <button
              type="button"
              onClick={() => {
                console.log("여기 오냐");
                dispatch(setResult("ok"));
              }}
            >
              <p>확인</p>
            </button>
          </div>
        );

      case "ok":
      default:
        return (
          <div className={styles.btnContainer}>
            <button type="button" onClick={() => dispatch(setResult("ok"))}>
              <p>확인</p>
            </button>
          </div>
        );
    }
  };

  if (!message.isVisible) return null;

  return (
    <Modal>
      <h4 style={{ marginBottom: 10 }}>{message.title}</h4>

      <h6 style={{ marginBottom: 30 }}>{message.msg}</h6>

      {renderBtn()}
    </Modal>
  );
}
