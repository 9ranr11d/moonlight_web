"use client";

import React, { useState, useEffect } from "react";

import styles from "./Profile.module.css";
import NicknameInput from "@/components/common/inputs/NicknameInput";
import EmailInput from "@/components/common/inputs/EmailInput";
import PhoneNumberInput from "@/components/common/inputs/PhoneNumberInput";
import RadioBtns from "@/components/common/btns/RadioBtns";

import IconSave from "@public/svgs/common/icon_check.svg";
import IconXCircle from "@public/svgs/common/icon_x_circle.svg";
import CalendarInput from "@/components/common/inputs/CalendarInput";
import { formatDateII } from "@/utils";

interface EditInputProps {
  field: string;
  onCancel: () => void;
  onSave: (value: string) => void;
  currentValue: string;
}

export default function EditInput({
  field,
  onCancel,
  onSave,
  currentValue,
}: EditInputProps) {
  const [value, setValue] = useState(currentValue);
  const [gender, setGender] = useState(currentValue);

  // currentValue가 변경될 때마다 상태 업데이트
  useEffect(() => {
    setValue(currentValue);
    if (field === "gender") {
      setGender(currentValue);
    }
  }, [currentValue, field]);

  const getFieldLabel = () => {
    switch (field) {
      case "nickname":
        return "별명";
      case "email":
        return "이메일";
      case "phoneNumber":
        return "휴대전화";
      case "birthdate":
        return "생년월일";
      case "gender":
        return "성별";
      default:
        return field;
    }
  };

  const handleSave = () => {
    if (field === "gender") onSave(gender);
    else onSave(value);
  };

  const renderInput = () => {
    switch (field) {
      case "nickname":
        return (
          <NicknameInput
            defaultValue={value}
            onChange={nickname => setValue(nickname)}
          />
        );
      case "email":
        return (
          <div style={{ paddingRight: 40 }}>
            <EmailInput
              defaultValue={value}
              onChange={email => setValue(email)}
            />
          </div>
        );
      case "phoneNumber":
        return (
          <PhoneNumberInput
            defaultValue={value}
            onChange={phone => setValue(phone)}
          />
        );
      case "birthdate":
        return (
          <CalendarInput style={{ width: "100%" }}>
            {formatDateII(new Date(value))}
          </CalendarInput>
        );
      case "gender":
        return (
          <RadioBtns
            list={["남성", "여성"]}
            idx={gender === "male" ? 0 : gender === "female" ? 1 : 0}
            onChange={idx => setGender(idx === 0 ? "male" : "female")}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            className={styles.editInput}
          />
        );
    }
  };

  return (
    <div className={styles.editForm}>
      <div className={styles.editFormHeader}>
        <label>{getFieldLabel()}</label>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <div className={styles.editFormContent}>
          {renderInput()}

          <button
            type="button"
            onClick={onCancel}
            className="iconBtn"
            style={{
              position: "absolute",
              right: 5,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <IconXCircle width={16} height={16} />
          </button>
        </div>

        <button type="button" onClick={handleSave} className="iconBtn">
          <IconSave width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
