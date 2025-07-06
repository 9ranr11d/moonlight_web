"use client";

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { signOut as socialSignOut } from "next-auth/react";

import { AppDispatch, RootState } from "@/store";

import { signOutAction } from "@/actions/authAction";

import { setMessage, setResult } from "@/store/slices/messageSlice";

export default function useSignOut() {
  const dispatch = useDispatch<AppDispatch>();

  const provider = useSelector((state: RootState) => state.auth.provider);
  const result = useSelector((state: RootState) => state.message.result);

  const triggerSignOut = () => {
    // 메시지 모달 띄우기
    dispatch(
      setMessage({
        title: "로그아웃",
        msg: "정말 로그아웃하시겠습니까?",
        type: "warn",
        returnType: "ok-cancel",
      })
    );
  };

  // 사용자가 확인 눌렀을 때 처리
  useEffect(() => {
    if (result !== "ok") return;

    // 초기화 (중복 방지)
    dispatch(setResult(null));

    if (provider === "local") {
      dispatch(signOutAction());
    } else {
      socialSignOut();
    }
  }, [result, provider, dispatch]);

  return triggerSignOut;
}
