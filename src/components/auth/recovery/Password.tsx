"use client";

import React, { useMemo, useState } from "react";

import { useSelector } from "react-redux";

import { RootState } from "@redux/store";

import ErrorBlock from "@components/common/ErrorBlock";
import DotAndBar from "@components/common/indicator/DotAndBar";

import IdCheckForm from "./IdCheckForm";
import VerificationForm from "./VerificationForm";

/** 비밀번호 자식 */
interface IPassword {
  /** 뒤로가기 */
  back: () => void;
}

/** 비밀번호 찾기 */
export default function Password({ back }: IPassword) {
  const { step: step } = useSelector((state: RootState) => state.recoverySlice); // ID/PW 찾기 관련 정보

  const [id, setId] = useState<string>(""); // 인증할 아이디

  /** 아이디 인증 */
  // const checkIdentification = (): void => {
  //   const data: { identification: string } = {
  //     identification: identification,
  //   };

  //   fetch("/api/auth/check-id", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data),
  //   })
  //     .then(res => {
  //       if (res.ok) return res.json();

  //       if (res.status === 404) alert("존재하지 않는 아이디입니다.");
  //       else alert(ERR_MSG);

  //       return res.json().then(data => Promise.reject(data.msg));
  //     })
  //     .then(data => {
  //       setIdentification(data.identification);
  //       setUserEmail(data.email);
  //       setIsAuth(true);
  //     })
  //     .catch(err =>
  //       console.error(
  //         "/src/components/auth/Recovery > Password() > checkIdentification() :",
  //         err
  //       )
  //     );
  // };

  /** 비밀번호 변경 */
  // const changePassword = (): void => {
  //   const data: { identification: string; password: string } = {
  //     identification: identification,
  //     password,
  //   };

  //   fetch("/api/auth/change-pw", {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data),
  //   })
  //     .then(res => {
  //       if (res.ok) return res.json();

  //       if (res.status === 404) alert("존재하지 않는 아이디입니다.");
  //       else alert(ERR_MSG);

  //       return res.json().then(data => Promise.reject(data.msg));
  //     })
  //     .then(data => {
  //       console.log(data.msg);

  //       alert("비밀번호가 성공적으로 바뀌었습니다.");

  //       back();
  //     })
  //     .catch(err =>
  //       console.error(
  //         "/src/components/auth/Recovery > Password() > changePassword() :",
  //         err
  //       )
  //     );
  // };

  /** Step별 컴포넌트 */
  const steps = useMemo(
    () => [
      <IdCheckForm saveId={(_id: string) => setId(_id)} />,
      <VerificationForm />,
    ],
    []
  );

  return (
    <div>
      {steps[step] ?? (
        <div style={{ marginBottom: 10 }}>
          <ErrorBlock />
        </div>
      )}

      {step < steps.length && (
        <div>
          <DotAndBar progress={step} maxValue={steps.length} />
        </div>
      )}
    </div>
  );
}
