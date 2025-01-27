"use client";

import React from "react";

import IconBack from "@public/svgs/common/icon_less_than.svg";

interface ITitleHeader {
  back: () => void;
}

export default function TitleHeader({ back }: ITitleHeader) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "24px 1fr 24px",
        columnGap: 10,
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <button
        type="button"
        onClick={back}
        style={{
          background: "none",
          padding: 0,
        }}
      >
        <IconBack width={24} height={24} fill={"black"} />
      </button>

      <h3 style={{ flex: 1 }}>회원가입</h3>
    </div>
  );
}
