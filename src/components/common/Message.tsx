"use client";

import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/store";

import { setResult } from "@/store/slices/messageSlice";

import { Modal } from "@/components/common/Modal";
import CloseBtn from "@/components/common/btns/CloseBtn";

/** Message */
export default function Message() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** Message Redux */
  const message = useSelector((state: RootState) => state.message);

  const getModalStyle = () => {
    switch (message.type) {
      case "warn":
        return {
          backgroundColor: "var(--warn-light-color)",
          color: "var(--warn-color)",
        };
      case "err":
        return {
          backgroundColor: "var(--err-light-color)",
          color: "var(--err-color)",
        };
      default:
        return {};
    }
  };

  const getButtonStyle = () => {
    switch (message.type) {
      case "warn":
        return {
          background: "var(--warn-color)",
          border: "1px solid var(--warn-color)",
        };
      case "err":
        return {
          background: "var(--err-color)",
          border: "1px solid var(--err-color)",
        };
      default:
        return {};
    }
  };

  const renderBtn = (): React.ReactNode => {
    switch (message.returnType) {
      case "ok-cancel":
        return (
          <div style={{ display: "flex", columnGap: 10 }}>
            <button
              type="button"
              className="outlineBtn"
              style={{
                border: `1px solid ${message.type === "warn" ? "var(--warn-color)" : message.type === "err" ? "var(--err-color)" : "var(--black-600a)"}`,
                color:
                  message.type === "warn"
                    ? "var(--warn-color)"
                    : message.type === "err"
                      ? "var(--err-color)"
                      : "var(--black-600a)",
                flex: 1,
              }}
              onClick={() => dispatch(setResult("cancel"))}
            >
              <p>취소</p>
            </button>

            <button
              type="button"
              style={{ ...getButtonStyle(), flex: 1 }}
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
        return (
          <div>
            <button
              type="button"
              style={{ ...getButtonStyle(), width: "100%" }}
              onClick={() => dispatch(setResult("ok"))}
            >
              <p>확인</p>
            </button>
          </div>
        );
      default:
        return (
          <CloseBtn
            onClick={() => dispatch(setResult("ok"))}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
            fill={
              message.type === "warn"
                ? "var(--warn-color)"
                : message.type === "err"
                  ? "var(--err-color)"
                  : "var(--black-600a)"
            }
            hoverFill={
              message.type === "warn"
                ? "var(--warn-dark-color)"
                : message.type === "err"
                  ? "var(--err-dark-color)"
                  : "var(--black-900a)"
            }
          />
        );
    }
  };

  if (!message.isVisible) return null;

  return (
    <Modal
      style={{
        left: "calc(50% - 3px)",
        ...getModalStyle(),
      }}
    >
      {message.title && <h6 style={{ marginBottom: 10 }}>{message.title}</h6>}

      <p style={{ marginBottom: message.returnType === "none" ? 0 : 30 }}>
        {message.msg}
      </p>

      {renderBtn()}
    </Modal>
  );
}
