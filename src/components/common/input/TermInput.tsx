"use client";

import React, { useEffect, useState } from "react";

import { ITerm } from "@interfaces/auth";

import CheckBoxBtn from "@components/common/btn/CheckBoxBtn";
import ExpandCollapseBtn from "@components/common/btn/ExpandCollapseBtn";

/** 약관 체크 박스 인터페이스 */
interface ITermInput {
  /** 체크 변경 여부 */
  onChange?: (checkedTerm: ITerm) => void;

  /** 약관 */
  term: ITerm;
  /** 동의 여부 */
  isAgreed: boolean;
}

/** 약관 체크 박스 */
export default function TermInput({ onChange, term, isAgreed }: ITermInput) {
  const [isChecked, setIsChecked] = useState<boolean>(false); // 동의 여부
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false); // 약관 내용 가시 여부

  /** 동의 여부 Toggle */
  const toggleCheck = (): void => {
    // 동의 여부 상위 컴포넌트로 전송
    onChange?.(term);

    setIsChecked(prev => !prev);
  };

  /** 약관 내용 가시 여부 Toggle */
  const toggleContentVisible = (): void => {
    setIsContentVisible(prev => !prev);
  };

  // termsSlice에 저장된 체크 여부 반영
  useEffect(() => {
    setIsChecked(isAgreed);
  }, [isAgreed]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
          borderBottom: "1px solid var(--gray-300)",
          background: isChecked ? "var(--gray-50)" : undefined,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: 10,
          }}
        >
          <CheckBoxBtn onClick={toggleCheck} size={12} isChecked={isChecked} />

          <p>
            ({term.isRequired ? "필수" : "선택"}) {term.type}
          </p>
        </div>

        <ExpandCollapseBtn
          isExpanded={isContentVisible}
          onClick={toggleContentVisible}
          size={12}
          fill={"var(--gray-500)"}
        />
      </div>

      {isContentVisible && (
        <div
          style={{
            background: "var(--gray-100)",
            padding: 10,
          }}
        >
          <p
            style={{
              width: "100%",
              maxHeight: 150,
              overflowY: "scroll",
            }}
          >
            {term.content}
          </p>
        </div>
      )}
    </div>
  );
}
