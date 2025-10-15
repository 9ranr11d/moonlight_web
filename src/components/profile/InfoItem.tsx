"use client";

import React from "react";

import styles from "./Profile.module.css";
import EditInput from "@/components/profile/EditInput";

import IconPen from "@public/svgs/common/icon_pen.svg";

interface InfoItemProps {
  label: string;
  value: string;
  isEditable?: boolean;
  field?: string;
  editingField: string | null;
  onEdit: (field: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (value: string) => void;
  currentUser: any;
}

export default function InfoItem({
  label,
  value,
  isEditable = false,
  field,
  editingField,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  currentUser,
}: InfoItemProps) {
  if (editingField === field) {
    let currentValue = value;

    // 필드별로 초기값 형식 조정
    if (field === "birthdate") {
      // 날짜 형식을 YYYY-MM-DD로 변환
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        currentValue = date.toISOString().split("T")[0];
      }
    } else if (field === "gender") {
      // 성별은 원본 값 사용 (male/female)
      currentValue = currentUser.gender || "";
    }

    return (
      <EditInput
        field={field!}
        currentValue={currentValue}
        onCancel={onCancelEdit}
        onSave={onSaveEdit}
      />
    );
  }

  return (
    <div className={styles.infoCard}>
      <div className={styles.infoItem}>
        <label>{label}</label>

        <div className={styles.infoValueContainer}>
          <span>{value}</span>

          {isEditable && (
            <button
              type="button"
              onClick={() => onEdit(field!)}
              className="iconBtn"
            >
              <IconPen width={16} height={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
