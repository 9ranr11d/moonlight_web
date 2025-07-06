"use client";

import React, { useState } from "react";

import { useDispatch } from "react-redux";

import { AppDispatch } from "@/store";

import { incrementRecoveryStep } from "@/store/slices/recoverySlice";

import { validateIdentification } from "@/utils";

import StatusInput from "@/components/common/inputs/StatusInput";
import NextBtn from "@/components/common/btns/NextBtn";

/** 아이디 확인 Form Interface */
interface IIdCheckForm {
  /** 아이디 저장 */
  saveId: (id: string) => void;
}

/** 아이디 확인 Form */
export default function IdCheckForm({ saveId }: IIdCheckForm) {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const [id, setId] = useState<string>(""); // 아이디

  /** 다음 버튼 클릭 시 */
  const clickNext = (): void => {
    saveId(id);

    dispatch(incrementRecoveryStep());
  };

  return (
    <div>
      <h6 style={{ textAlign: "left", marginBottom: 3 }}>아이디</h6>

      <StatusInput
        type="text"
        value={id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setId(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") clickNext();
        }}
        placeholder="찾으시려는 아이디를 입력해 주세요."
      />

      <div className="okBtnBox">
        <NextBtn onClick={clickNext} disabled={!validateIdentification(id)} />
      </div>
    </div>
  );
}
