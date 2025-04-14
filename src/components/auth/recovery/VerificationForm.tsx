"use client";

import React, { useMemo, useState } from "react";

import CSS from "./VerificationForm.module.css";

import { ERR_MSG } from "@constants/msg";

import VerticalTabBtn from "@components/common/btn/VerticalTabBtn";
import ErrorBlock from "@components/common/ErrorBlock";

import EmailForm from "@components/auth/verification/EmailForm";
import PhoneNumberForm from "@components/auth/verification/PhoneNumberForm";

export default function VerificationForm() {
  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(0); // 선택된 Tab

  /** Input들 */
  const inputs = useMemo(() => [<EmailForm />, <PhoneNumberForm />], []);

  /** 선택된 Tab 변경 */
  const handleTab = (idx: number): void => {
    setSelectedTabIdx(idx);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "100px 3fr",
        columnGap: 15,
      }}
    >
      <VerticalTabBtn
        labelArr={[
          <p className={CSS.sideMenuLabel}>Email</p>,
          <p className={CSS.sideMenuLabel}>휴대전화</p>,
        ]}
        idx={selectedTabIdx}
        onChange={handleTab}
      />

      <div>
        {inputs[selectedTabIdx] ?? (
          <div style={{ marginBottom: 10 }}>
            <ErrorBlock
              content={<h6 style={{ whiteSpace: "pre-line" }}>{ERR_MSG}</h6>}
            />
          </div>
        )}
      </div>
    </div>
  );
}
