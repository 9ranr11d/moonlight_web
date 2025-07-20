"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setResult } from "@/store/slices/messageSlice";
import { Modal } from "@/components/common/Modal";
import IconBell from "@public/svgs/common/icon_bell.svg";

/** Modal 크기 */
interface IModalDimensions {
  width: number;
  height: number;
}

/** Message 스타일 타입 */
type MessageStyleType = {
  backgroundColor?: string;
  color?: string;
  background?: string;
  border?: string;
};

/** Message */
export default function Message() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** Message Redux */
  const message = useSelector((state: RootState) => state.message);

  /** Ref */
  const ref = useRef<HTMLDivElement | null>(null);

  const [modalDimensions, setModalDimensions] = useState<IModalDimensions>({
    width: 0,
    height: 0,
  });

  /** 메시지 타입별 스타일 매핑 */
  const messageStyles: Record<string, MessageStyleType> = {
    warn: {
      backgroundColor: "var(--warn-light-color)",
      color: "var(--warn-color)",
    },
    err: {
      backgroundColor: "var(--err-light-color)",
      color: "var(--err-color)",
    },
  };

  /** 버튼 타입별 스타일 매핑 */
  const buttonStyles: Record<string, MessageStyleType> = {
    warn: {
      background: "var(--warn-color)",
      border: "1px solid var(--warn-color)",
    },
    err: {
      background: "var(--err-color)",
      border: "1px solid var(--err-color)",
    },
  };

  /** 모달 스타일 가져오기 */
  const getModalStyle = (): MessageStyleType => {
    return messageStyles[message.type] || {};
  };

  /** 버튼 스타일 가져오기 */
  const getButtonStyle = (): MessageStyleType => {
    return buttonStyles[message.type] || {};
  };

  /** 아이콘 색상 가져오기 */
  const getIconColor = (): string => {
    switch (message.type) {
      case "warn":
        return "var(--warn-color)";
      case "err":
        return "var(--err-color)";
      default:
        return "var(--gray-800)";
    }
  };

  /** 모달 위치 계산 */
  const getModalPosition = () => {
    const { pos } = message;
    const { width, height } = modalDimensions;

    const positions = {
      topLeft: {
        top: height / 2,
        left: width / 2,
      },
      topRight: {
        top: height / 2,
        left: `calc(100% - ${width / 2}px)`,
      },
      bottomLeft: {
        top: `calc(100% - ${height / 2}px)`,
        left: width / 2,
      },
      bottomRight: {
        top: `calc(100% - ${height / 2}px)`,
        left: `calc(100% - ${width / 2}px)`,
      },
      center: {
        top: "50%",
        left: "calc(50% - 3px)",
      },
    };

    return positions[pos || "center"];
  };

  /** 확인 버튼 클릭 핸들러 */
  const handleOkClick = () => {
    dispatch(setResult("ok"));
  };

  /** 취소 버튼 클릭 핸들러 */
  const handleCancelClick = () => {
    dispatch(setResult("cancel"));
  };

  /** 확인 Button 렌더링 */
  const renderButtons = (): React.ReactNode => {
    const buttonStyle = getButtonStyle();
    const iconColor = getIconColor();

    switch (message.returnType) {
      case "ok-cancel":
        return (
          <div style={{ display: "flex", columnGap: 10 }}>
            <button
              type="button"
              className="outlineBtn"
              style={{
                border: `1px solid ${iconColor}`,
                color: iconColor,
                flex: 1,
              }}
              onClick={handleCancelClick}
            >
              <p>취소</p>
            </button>

            <button
              type="button"
              style={{ ...buttonStyle, flex: 1 }}
              onClick={handleOkClick}
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
              style={{ ...buttonStyle, width: "100%" }}
              onClick={handleOkClick}
            >
              <p>확인</p>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  /** 제목 렌더링 */
  const renderTitle = (): React.ReactNode => {
    if (!message.title) return null;

    const iconColor = getIconColor();
    const isCenter = message.pos === "center";

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCenter ? "center" : "flex-start",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <IconBell width={16} height={16} fill={iconColor} />
        <h6>{message.title}</h6>
        <div style={{ width: 16 }} />
      </div>
    );
  };

  useEffect(() => {
    if (ref.current) {
      setModalDimensions({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      });
    }
  }, [ref.current?.clientWidth, ref.current?.clientHeight, message.isVisible]);

  if (!message.isVisible) return null;

  const modalPosition = getModalPosition();
  const iconColor = getIconColor();

  return (
    <Modal
      ref={ref}
      style={{
        width: 300,
        display: "flow",
        ...modalPosition,
        padding: message.pos === "center" ? "10px 40px 20px" : "10px 20px 20px",
        ...getModalStyle(),
      }}
      close={handleOkClick}
      closeBtnFill={iconColor}
    >
      {renderTitle()}

      <p
        style={{
          marginBottom: message.returnType === "none" ? 0 : 30,
          textAlign: message.pos ? "left" : "center",
        }}
      >
        {message.msg}
      </p>

      {renderButtons()}
    </Modal>
  );
}
