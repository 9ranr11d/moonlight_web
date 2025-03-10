"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import {
  setProfileAction,
  setProfileSeqAction,
  signUpAction,
} from "@actions/authAction";

import CSS from "@components/auth/signUp/SignUp.module.css";

import { validateNickname } from "@utils/index";

import DropdownDateBtn from "@components/common/btn/DropdownDateBtn";
import RadioBtn from "@components/common/btn/RadioBtn";
import NextBtn from "@components/common/btn/NextBtn";
import NicknameInput from "@components/common/input/NicknameInput";
import LunarLoader from "@components/common/LunarLoader";

import IconMale from "@public/svgs/common/icon_male.svg";
import IconFemale from "@public/svgs/common/icon_female.svg";

/** 사용자 정보 Form */
export default function ProfileForm() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const signUp = useSelector((state: RootState) => state.signUpSlice);

  const [birthdate, setBirthdate] = useState<string>(""); // 생년월일
  const [nickname, setNickName] = useState<string>(""); // 별명

  const [selectedGenderIdx, setSelectedGenderIdx] = useState<number>(0); // 선택된 성별 순서

  const [isConfirmActive, setIsConfirmActive] = useState<boolean>(false); // 다음 버튼 활성화 여부

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

  /** 다음 버튼 클릭 시 */
  const clickConfirmBtn = (): void => {
    dispatch(
      setProfileAction({
        birthdate,
        gender: genders[selectedGenderIdx].value,
        nickname,
      })
    );

    dispatch(setProfileSeqAction({ nickname }));
  };

  // 별명 입력 시
  useEffect(() => {
    if (validateNickname(nickname)) setIsConfirmActive(true);
    else setIsConfirmActive(false);
  }, [nickname]);

  // 별명 식별자가 설정 시
  useEffect(() => {
    // 별명 식별자 발급 시
    if (signUp.profile.seq) {
      dispatch(
        signUpAction({
          identification: signUp.identification.identification,
          password: signUp.password.password,
          email: signUp.verification.email,
          phoneNumber: signUp.verification.phoneNumber,
          birthdate: signUp.profile.birthdate,
          gender: signUp.profile.gender,
          nickname: signUp.profile.nickname,
          seq: signUp.profile.seq,
        })
      );
    }
  }, [signUp.profile.seq]);

  return (
    <>
      {!signUp.profile.nickname ? (
        <>
          <div>
            <h6 className={CSS.label}>생년월일</h6>

            <DropdownDateBtn onChange={setBirthdate} />
          </div>
          <div>
            <h6 className={CSS.label}>성별</h6>

            <RadioBtn list={genderBtns} onChange={setSelectedGenderIdx} />
          </div>
          <div>
            <h6 className={CSS.label}>별명</h6>

            <NicknameInput onChange={setNickName} />
          </div>
          <div className={CSS.okBtnBox}>
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
