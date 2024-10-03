"use client";

import React from "react";

import Image from "next/image";

import Modal from "@components/common/Modal";

import IconNoEntry from "@public/img/common/icon_no_entry_primary.svg";
import { ERR_MSG } from "@constants/msg";

export default function Error() {
  return (
    <main>
      <Modal>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
          <Image src={IconNoEntry} width={200} height={200} alt="X" />
        </div>

        <h3>{ERR_MSG}</h3>
      </Modal>
    </main>
  );
}
