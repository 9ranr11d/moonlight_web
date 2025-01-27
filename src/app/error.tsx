"use client";

import React from "react";

import Modal from "@components/common/Modal";

import { ERR_MSG } from "@constants/msg";

import IconNoEntry from "@public/svgs/common/icon_no_entry.svg";

/** 에러 페이지 */
export default function Error() {
  return (
    <main>
      <Modal>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <IconNoEntry width={200} height={200} fill={"var(--err-color)"} />
        </div>

        <h3>{ERR_MSG}</h3>
      </Modal>
    </main>
  );
}
