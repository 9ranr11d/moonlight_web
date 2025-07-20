"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

import styles from "./Profile.module.css";
import NicknameInput from "@/components/common/inputs/NicknameInput";
import EmailInput from "@/components/common/inputs/EmailInput";
import PhoneNumberInput from "@/components/common/inputs/PhoneNumberInput";
import StatusInput from "@/components/common/inputs/StatusInput";
import RadioBtns from "@/components/common/btns/RadioBtns";

import IconUndo from "@public/svgs/common/icon_undo.svg";
import IconSave from "@public/svgs/common/icon_check.svg";

interface ProfileEditFormProps {
  field: string;
  onCancel: () => void;
  onSave: (value: string) => void;
  currentValue: string;
}

export default function ProfileEditForm({
  field,
  onCancel,
  onSave,
  currentValue,
}: ProfileEditFormProps) {
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
    if (field === "gender") {
      onSave(gender);
    } else {
      onSave(value);
    }
  };

  const renderInput = () => {
    switch (field) {
      case "nickname":
        return <NicknameInput onChange={nickname => setValue(nickname)} />;
      case "email":
        return <EmailInput onChange={email => setValue(email)} />;
      case "phoneNumber":
        return <PhoneNumberInput onChange={phone => setValue(phone)} />;
      case "birthdate":
        return (
          <input
            type="date"
            value={value}
            onChange={e => setValue(e.target.value)}
            className={styles.editInput}
          />
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
        <div className={styles.editFormContent}>{renderInput()}</div>

        <div className={styles.editFormActions}>
          <button type="button" onClick={onCancel} className="iconBtn">
            <IconUndo width={16} height={16} />
          </button>
          <button type="button" onClick={handleSave} className="iconBtn">
            <IconSave width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
