"use client";

import React, { useEffect, useMemo, useState } from "react";

import CSS from "./Recovery.module.css";

import Identification from "./Identification";
import Password from "./Password";
import TitleHeader from "@components/common/TitleHeader";

import HorizontalTabBtn from "@components/common/btn/HorizontalTabBtn";
import ErrorBlock from "@components/common/ErrorBlock";

import { ERR_MSG } from "@constants/msg";

import IconHome from "@public/svgs/common/icon_home.svg";

/** Recovery 자식 */
interface IRecoveryProps {
  /** 뒤로가기 */
  back: () => void;
}

/** ID/PW 찾기 */
export default function Recovery({ back }: IRecoveryProps) {
  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(0); // 선택된 Tab

  /** Input들 */
  const inputs = useMemo(
    () => [<Identification />, <Password back={back} />],
    []
  );

  /** 선택된 Tab 변경 */
  const handleTab = (idx: number): void => {
    setSelectedTabIdx(idx);
  };

  /** 뒤로가기 */
  const clickBack = () => {
    back();
  };

  return (
    <>
      <div className={CSS.recoveryBox}>
        <TitleHeader
          back={clickBack}
          title="ID / PW 찾기"
          style={{ marginBottom: 20 }}
          rightIcon={
            <button
              type="button"
              onClick={back}
              style={{ padding: 0, background: "none" }}
            >
              <IconHome width={24} height={24} fill={"black"} />
            </button>
          }
        />

        <HorizontalTabBtn
          labelArr={["아이디", "비밀번호"]}
          idx={selectedTabIdx}
          onChange={handleTab}
        />

        <div style={{ marginTop: 20 }}>
          {inputs[selectedTabIdx] ?? (
            <div style={{ marginBottom: 10 }}>
              <ErrorBlock
                content={<h6 style={{ whiteSpace: "pre-line" }}>{ERR_MSG}</h6>}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
