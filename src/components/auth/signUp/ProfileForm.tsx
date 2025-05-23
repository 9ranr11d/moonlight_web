"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import { saveUserTermsAction, signUpAction } from "@actions/authAction";

import styles from "@components/auth/signUp/SignUp.module.css";

import { validateNickname } from "@utils/index";

import DropdownDateBtn from "@components/common/btn/DropdownDateBtn";
import RadioBtns from "@components/common/btn/RadioBtns";
import NextBtn from "@components/common/btn/NextBtn";
import NicknameInput from "@components/common/input/NicknameInput";
import LunarLoader from "@components/common/LunarLoader";

import IconMale from "@public/svgs/common/icon_male.svg";
import IconFemale from "@public/svgs/common/icon_female.svg";

/** 사용자 정보 Form */
export default function ProfileForm() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 회원가입 정보 */
  const signUp = useSelector((state: RootState) => state.signUpSlice);
  /** 본인인증 정보 */
  const verification = useSelector(
    (state: RootState) => state.verificationSlice
  );

  const [birthdate, setBirthdate] = useState<string>(""); // 생년월일
  const [nickname, setNickName] = useState<string>(""); // 별명

  const [selectedGenderIdx, setSelectedGenderIdx] = useState<number>(0); // 선택된 성별 순서

  const [isConfirmActive, setIsConfirmActive] = useState<boolean>(false); // 다음 버튼 활성화 여부
  const [isLoaded, setIsLoaded] = useState<boolean>(false); // 로딩 여부

  /** 성별들 */
  const genders: {
    icon: React.ReactNode;
    label: string;
    value: "male" | "female";
  }[] = [
    {
      icon: <IconMale width={14} height={14} fill={"#A7C7E7"} />,
      label: "남성",
      value: "male",
    },
    {
      icon: <IconFemale width={14} height={14} fill={"#F4C2C2"} />,
      label: "여성",
      value: "female",
    },
  ];

  /** 성별 버튼들 */
  const genderBtns = genders.map((item, idx) => {
    /** 선택 여부 */
    const isSelected = selectedGenderIdx === idx;

    return (
      <div
        key={idx}
        style={{
          display: "flex",
          justifyContent: "space-between",
          columnGap: 5,
        }}
      >
        {React.cloneElement(item.icon as React.ReactElement, {
          ...(isSelected && { fill: "var(--primary-color)" }),
        })}

        <span
          style={{
            fontFamily: isSelected ? "pretendard_bold" : "pretendard",
          }}
        >
          {item.label}
        </span>

        <div style={{ width: 14 }} />
      </div>
    );
  });

  /** 완료 버튼 클릭 시 */
  const clickConfirmBtn = (): void => {
    setIsLoaded(true);

    dispatch(
      signUpAction({
        identification: signUp.identification.identification,
        password: signUp.password.password,
        email: verification.email,
        phoneNumber: verification.phoneNumber,
        birthdate,
        gender: genders[selectedGenderIdx].value,
        nickname,
      })
    );
  };

  // 별명 입력 시
  useEffect(() => {
    if (validateNickname(nickname)) setIsConfirmActive(true);
    else setIsConfirmActive(false);
  }, [nickname]);

  // 회원가입 완료 시
  useEffect(() => {
    if (signUp.isCompleted) {
      dispatch(
        saveUserTermsAction({
          userId: signUp.identification.identification,
          agreedTermIds: signUp.term.agreedTerms.map(term => term.id),
        })
      );
    }
  }, [signUp.isCompleted]);

  return (
    <>
      {!isLoaded ? (
        <>
          <div>
            <h6 className={styles.label}>생년월일</h6>

            <DropdownDateBtn onChange={setBirthdate} />
          </div>
          <div>
            <h6 className={styles.label}>성별</h6>

            <RadioBtns list={genderBtns} onChange={setSelectedGenderIdx} />
          </div>
          <div>
            <h6 className={styles.label}>별명</h6>

            <NicknameInput onChange={setNickName} />
          </div>
          <div className="okBtnBox">
            <NextBtn
              onClick={clickConfirmBtn}
              disabled={!isConfirmActive}
              label="완료"
            />
          </div>
        </>
      ) : (
        <LunarLoader
          style={{ marginBottom: 20 }}
          msg={
            <span>
              회원가입 중입니다.
              <br />
              잠시만 기다려주세요
            </span>
          }
        />
      )}
    </>
  );
}
