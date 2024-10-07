"use client";

import React from "react";

import Image from "next/image";

import Modal from "@components/common/Modal";

import IconNoEntry from "@public/img/common/icon_no_entry_primary.svg";

/** 404 페이지 */
export default function NotFound() {
  return (
    <main>
      <Modal>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
          <Image src={IconNoEntry} width={200} height={200} alt="X" />
        </div>

        <h3>잘못된 접근입니다.</h3>
      </Modal>
    </main>
  );
}
