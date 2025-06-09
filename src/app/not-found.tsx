"use client";

import React from "react";

import { Modal } from "@/components/common/Modal";

import IconNoEntry from "@public/svgs/common/icon_no_entry.svg";

/** 404 페이지 */
export default function NotFound() {
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

        <h3>잘못된 접근입니다.</h3>
      </Modal>
    </main>
  );
}
