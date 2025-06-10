"use client";

import React, { ReactNode } from "react";

import { Modal } from "@/components/common/Modal";

interface IConfimationModal {
  children: ReactNode;
}

export default function ConfirmationModal({ children }: IConfimationModal) {
  return (
    <Modal>
      {children}

      <div style={{ display: "flex" }}>
        <button type="button">확인</button> <button type="button">취소</button>
      </div>
    </Modal>
  );
}
