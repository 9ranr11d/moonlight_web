"use client";

import React from "react";

import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";

import CSS from "./ProfileModal.module.css";

import { processSignOut } from "@utils/index";

interface IProfileModal {
  closeModal: () => void;
}

export default function ProfileModal({ closeModal }: IProfileModal) {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.authReducer);

  const clickSignOut = () => {
    if (processSignOut("로그아웃 하시겠습니까?", dispatch)) closeModal();
  };

  return (
    <div className={CSS.option}>
      <h6>{user.nickname}님</h6>

      <ul>
        <li>
          <Link href={"/profile"}>
            <button type="button">정보</button>
          </Link>
        </li>
        <li>
          <button type="button" onClick={clickSignOut}>
            로그아웃
          </button>
        </li>
      </ul>
    </div>
  );
}
