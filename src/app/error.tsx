"use client";

import React from "react";

import Modal from "@components/common/Modal";

import { ERR_MSG } from "@constants/msg";

import ErrorBlock from "@components/common/ErrorBlock";

/** 오류 페이지 */
export default function Error() {
  return (
    <main>
      <Modal>
        <ErrorBlock
          content={<h6 style={{ whiteSpace: "pre-line" }}>{ERR_MSG}</h6>}
        />
      </Modal>
    </main>
  );
}
