"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import {
  agreeToAllTermsAction,
  getLatestTermsAction,
  incrementStepAction,
  resetIdentificationAction,
  resetPasswordAction,
  setTermAgreementAction,
} from "@actions/authAction";

import CSS from "@components/auth/signUp/SignUp.module.css";

import LunarLoader from "@components/common/LunarLoader";
import CheckBoxBtn from "@components/common/btn/CheckBoxBtn";

import TermInput from "@components/common/input/TermInput";
import NextBtn from "@components/common/btn/NextBtn";
import { ITerm } from "@interfaces/auth";

/** 약관 동의 Form*/
export default function TermsForm() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 약관 정보 */
  const signUp = useSelector((state: RootState) => state.signUpSlice);

  const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false); // 전체 동의 여부
  const [isConfirmActive, setIsConfirmActive] = useState<boolean>(false); // 다음 버튼 활성화 여부

  /** 약관 동의 여부 변경 시 */
  const onTermCheckboxChange = (term: ITerm): void => {
    dispatch(setTermAgreementAction(term));
  };

  /** 전체 약관 동의 여부 확인 */
  const checkAllTermsAgreed = (): boolean => {
    return signUp.term.latestTerms.every(latestTerm =>
      signUp.term.agreedTerms.some(
        agreedTerm => agreedTerm.type === latestTerm.type
      )
    );
  };

  /** 모든 필수 약관을 동의 했는 지 여부 */
  const checkRequiredTermsAgreed = (): boolean => {
    /** 필수 동의 약관들 */
    const requiredTerms = signUp.term.latestTerms.filter(
      term => term.isRequired
    );

    return requiredTerms.every(requiredTerm =>
      signUp.term.agreedTerms.some(
        agreedTerm => agreedTerm.type === requiredTerm.type
      )
    );
  };

  /** 전체 동의 여부 Toggle */
  const toggleAllChecked = () => {
    // 전체 동의 시
    if (!isCheckedAll) dispatch(agreeToAllTermsAction());

    setIsCheckedAll(prev => !prev);
  };

  /** 다음 버튼 클릭 시 */
  const clickConfirmBtn = (): void => {
    dispatch(resetIdentificationAction());
    dispatch(resetPasswordAction());

    dispatch(incrementStepAction());
  };

  // 렌더 시
  useEffect(() => {
    // 최신 약관 가져오기
    dispatch(getLatestTermsAction());
  }, []);

  // termsSlice의 동의된 약관 목록 변경 시
  useEffect(() => {
    setIsCheckedAll(checkAllTermsAgreed());
    setIsConfirmActive(checkRequiredTermsAgreed());
  }, [signUp.term.agreedTerms]);

  return (
    <>
      {signUp.term.isLoaded ? (
        <div style={{ marginBottom: 10 }}>
          <LunarLoader />
        </div>
      ) : (
        <>
          <div>
            {signUp.term.latestTerms.map((term, idx) => (
              <TermInput
                key={idx}
                onChange={onTermCheckboxChange}
                term={term}
                isAgreed={signUp.term.agreedTerms.some(
                  agreedTerm => agreedTerm.type === term.type
                )}
              />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", columnGap: 5 }}>
            <CheckBoxBtn
              onClick={toggleAllChecked}
              size={12}
              isChecked={isCheckedAll}
            />

            <span>약관 전체동의</span>
          </div>

          <div className={CSS.okBtnBox}>
            <NextBtn onClick={clickConfirmBtn} disabled={!isConfirmActive} />
          </div>
        </>
      )}
    </>
  );
}
