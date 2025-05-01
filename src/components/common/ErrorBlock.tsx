"use client";

import React from "react";

import { ERR_MSG } from "@constants/msg";

import IconNoEntry from "@public/svgs/common/icon_no_entry.svg";

/** 오류 Interface */
interface IErrorBlock {
  /** 추가적 내용 */
  content?: React.JSX.Element;
}

/** 오류 */
export default function ErrorBlock({ content }: IErrorBlock) {
  return (
    <div>
      <div
        style={{
          height: 100,
          display: "flex",
          justifyContent: "center",
          marginBottom: 30,
        }}
      >
        <IconNoEntry width={100} height={100} fill={"var(--err-color)"} />
      </div>

      {content || <h6 style={{ whiteSpace: "pre-line" }}>{ERR_MSG}</h6>}
    </div>
  );
}
