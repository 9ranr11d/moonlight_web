"use client";

import React from "react";

import Modal from "@components/common/Modal";

import ErrorBlock from "@components/common/ErrorBlock";

/** 오류 페이지 */
export default function Error() {
  return (
    <main>
      <Modal>
        <ErrorBlock />
      </Modal>
    </main>
  );
}
