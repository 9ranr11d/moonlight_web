"use client";

import React, { useEffect, useState } from "react";

import { validateNickname } from "@/utils";

import StatusInput from "@/components/common/inputs/StatusInput";

/** 별명 Input Interface */
interface INicknameInput {
  onChange?: (nickname: string) => void;
}

/** 별명 Input */
export default function NicknameInput({ onChange }: INicknameInput) {
  const [nickname, setNickName] = useState<string>(""); // 별명

  /** 별명 Input */
  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNickName(e.target.value);
  };

  // 별명 변경 시
  useEffect(() => {
    onChange?.(nickname);
  }, [nickname]);

  return (
    <StatusInput
      type="text"
      value={nickname}
      onChange={handleNickname}
      placeholder="영문, 한글, 숫자, '_', '.'을 이용해서 만들어주세요."
      msg={
        nickname && !validateNickname(nickname) ? "형식이 잘못됐습니다." : null
      }
      isErr={!validateNickname(nickname)}
    />
  );
}
