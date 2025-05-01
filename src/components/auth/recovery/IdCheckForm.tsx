"use client";

import React, { useState } from "react";

import { useDispatch } from "react-redux";

import { AppDispatch } from "@redux/store";

import { incrementRecoveryStep } from "@redux/slices/recoverySlice";

import CSS from "./Recovery.module.css";

import { validateIdentification } from "@utils/index";

import StatusInput from "@components/common/input/StatusInput";
import NextBtn from "@components/common/btn/NextBtn";

/** 아이디 확인 Form Interface */
interface IIdCheckForm {
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
        placeholder="찾으시려는 아이디를 입력해 주세요."
      />

      <div className={CSS.okBtnBox}>
        <NextBtn onClick={clickNext} disabled={!validateIdentification(id)} />
      </div>
    </div>
  );
}
