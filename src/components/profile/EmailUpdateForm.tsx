"use client";

import EmailSender from "@components/auth/EmailSender";
import { errMsg } from "@constants/msg";
import React, { useState } from "react";

export default function EmailUpdateForm() {
  const [step, setStep] = useState<number>(0);

  const renderStep = (): JSX.Element => {
    switch (step) {
      case 0:
        return <EmailSender verified={(email) => console.log(email)} isAutoFocus={true} />;
      default:
        console.log("Current Step is :", step);

        return <p>{errMsg}</p>;
    }
  };

  return <div>{renderStep()}</div>;
}
