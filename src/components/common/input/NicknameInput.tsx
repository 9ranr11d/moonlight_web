"use client";

import React, { useState } from "react";

import CSS from "@components/auth/signUp/SignUp.module.css";

export default function NicknameInput() {
  const [nickname, setNickName] = useState<string>(""); // 별명

  /** 별명 Input */
  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNickName(e.target.value);
  };

  return (
    <div className={CSS.wrapper}>
      <h6>별명</h6>

      <input
        type="text"
        value={nickname}
        onChange={handleNickname}
        placeholder="Nickname"
      />
    </div>
  );
}
