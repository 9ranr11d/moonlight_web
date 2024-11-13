"use client";

import React from "react";

import Modal from "./Modal";

export default function ConfirmationModal({ ...props }) {
  return (
    <Modal>
      {props.children}

      <div style={{ display: "flex" }}>
        <button type="button">확인</button> <button type="button">취소</button>
      </div>
    </Modal>
  );
}
