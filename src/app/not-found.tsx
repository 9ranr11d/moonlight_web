"use client";

import React from "react";

import Image from "next/image";

import Modal from "@components/common/Modal";

import IconNoEntry from "@public/img/common/icon_no_entry_primary.svg";

export default function NotFound() {
  return (
    <main>
      <Modal>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
          <Image src={IconNoEntry} width={200} height={200} alt="X" />
        </div>

        <h3>도메인 주소가 잘못되었습니다.</h3>
      </Modal>
    </main>
  );
}
