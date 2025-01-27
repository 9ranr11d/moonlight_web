"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import {
  agreeToAllTermsAction,
  getLatestTermsAction,
  setTermAgreementAction,
} from "@actions/authAction";

import { ITerm } from "@interfaces/auth";

import LunarLoader from "@components/common/LunarLoader";
import CheckBox from "@components/common/CheckBox";
import ExpandCollapseBtn from "@components/common/ExpandCollapseBtn";

/** 약관 체크 박스 인터페이스 */
interface ITermInput {
  term: ITerm;
  isAgreed: boolean;
}

/** 약관 체크 박스 */
function TermInput({ term, isAgreed }: ITermInput) {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const [isChecked, setIsChecked] = useState<boolean>(false); // 동의 여부
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false); // 약관 내용 가시 여부

  /** 동의 여부 toggle */
  const toggleCheck = () => {
    // 동의 여부를 termsSlice에 저장
    dispatch(setTermAgreementAction(term));

    setIsChecked(prev => !prev);
  };

  /** 약관 내용 가시 여부 toggle */
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
          <CheckBox onClick={toggleCheck} size={12} isChecked={isChecked} />

          <p>
            ({term.isRequired ? "필수" : "선택"}) {term.type}
          </p>
        </div>

        <ExpandCollapseBtn
          onClick={toggleContentVisible}
          size={18}
          isExpanded={isContentVisible}
        />
      </div>

      {isContentVisible && (
        <div
          style={{
            background: "var(--gray-100)",
            // borderRadius: "0 0 8px 8px",
            padding: 10,
          }}
        >
          <p
            style={{
              width: "100%",
              height: 150,
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

/** 약관 동의 페이지 */
export default function TermsViewer() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** termsSlice */
  const terms = useSelector((state: RootState) => state.termsReducer);

  const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false); // 전체 동의 여부

  /** 전체 동의 여부 toggle */
  const toggleAllChecked = () => {
    // 전체 동의 시
    if (!isCheckedAll) dispatch(agreeToAllTermsAction());

    setIsCheckedAll(prev => !prev);
  };

  // 렌더 시
  useEffect(() => {
    // 최신 약관 가져오기
    dispatch(getLatestTermsAction());
  }, []);

  // termsSlice의 동의된 약관 목록 변경 시
  useEffect(() => {
    /** type 기준으로 정렬된 latestTerms */
    const sortedLatestTerms = [...terms.latestTerms].sort((a, b) =>
      a.type.localeCompare(b.type)
    );
    /** type 기준으로 정렬된 agreedTerms */
    const sortedAgreedTerms = [...terms.agreedTerms].sort((a, b) =>
      a.type.localeCompare(b.type)
    );

    // 약관 목록이 없거나, 동의된 약관 목록이 없을 시
    if (terms.latestTerms.length === 0 || terms.agreedTerms.length === 0)
      return;

    // 정렬된 배열을 비교
    if (JSON.stringify(sortedLatestTerms) === JSON.stringify(sortedAgreedTerms))
      setIsCheckedAll(true);
    else setIsCheckedAll(false);
  }, [terms.agreedTerms]);

  return (
    <>
      {terms.isLoaded ? (
        <LunarLoader />
      ) : (
        <>
          <div>
            {terms.latestTerms.map((term, idx) => (
              <TermInput
                key={idx}
                term={term}
                isAgreed={terms.agreedTerms.some(
                  agreedTerm => agreedTerm.type === term.type
                )}
              />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", columnGap: 5 }}>
            <CheckBox
              onClick={toggleAllChecked}
              size={12}
              isChecked={isCheckedAll}
            />

            <span>약관 전체동의</span>
          </div>
        </>
      )}
    </>
  );
}
