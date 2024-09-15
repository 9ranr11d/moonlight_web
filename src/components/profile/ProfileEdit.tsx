import React from "react";

import CSS from "./ProfileEdit.module.css";

/** 사용자 정보 수정 */
export default function ProfileEdit() {
  return (
    <div className={CSS.container}>
      <h3 className={CSS.title}>사용자 정보 수정</h3>

      <div className={CSS.desc}></div>
    </div>
  );
}
