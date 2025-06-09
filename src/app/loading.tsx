"use client";

import React from "react";

import { Modal } from "@/components/common/Modal";

import LunarLoader from "@/components/common/LunarLoader";

/** 로딩 페이지 */
export default function Loading() {
  return (
    <main>
      <Modal>
        <LunarLoader />
      </Modal>
    </main>
  );
}
