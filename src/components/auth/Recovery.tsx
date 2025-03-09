"use client";

import React, { useState } from "react";

import Image from "next/image";

import CSS from "./Recovery.module.css";

import Identification from "./Identification";
import Password from "./Password";

import IconBack from "@public/img/common/icon_less_than_black.svg";

/** Recovery 자식 */
interface IRecoveryProps {
  /** 뒤로가기 */
  back: () => void;
}

/** ID/PW 찾기 */
export default function Recovery({ back }: IRecoveryProps) {
  const [isIdRecovery, setIsIdRecovery] = useState<boolean>(true); // 아이디 찾기 인지 여부

  /** 뒤로가기 */
  const goBack = () => {
    back();
  };

  /** 아이디 찾기 클릭 */
  const identificationRecovery = () => {
    setIsIdRecovery(true);
  };

  /** 비밀번호 찾기 클릭 */
  const passwordRecovery = () => {
    setIsIdRecovery(false);
  };

  return (
    <>
      <div className={CSS.recoveryBox}>
        <div className={CSS.header}>
          <button type="button" onClick={goBack}>
            {/* <Image src={IconBack} width={24} height={24} alt="◀" /> */}
          </button>

          <h3>ID / PW 찾기</h3>
        </div>

        <div className={CSS.tapBox}>
          <button
            type="button"
            onClick={identificationRecovery}
            disabled={isIdRecovery}
          >
            아이디
          </button>

          <button
            type="button"
            onClick={passwordRecovery}
            disabled={!isIdRecovery}
          >
            비밀번호
          </button>
        </div>

        <div className={CSS.content} style={{ paddingBottom: 20 }}>
          {isIdRecovery ? <Identification /> : <Password back={goBack} />}
        </div>
      </div>
    </>
  );
}
