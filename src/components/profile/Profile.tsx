"use client";

import React, { useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

import styles from "./Profile.module.css";

import { formatDateII } from "@/utils";

import ProfileImage from "@/components/profile/ProfileImage";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

import IconPen from "@public/svgs/common/icon_pen.svg";

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth);

  const [editingField, setEditingField] = useState<string | null>(null);

  const getProviderText = (provider: string) => {
    switch (provider) {
      case "google":
        return "구글";
      case "naver":
        return "네이버";
      case "kakao":
        return "카카오";
      case "local":
        return "이메일";
      default:
        return provider;
    }
  };

  const getGenderText = (gender: string | null) => {
    switch (gender) {
      case "male":
        return "남성";
      case "female":
        return "여성";
      default:
        return "-";
    }
  };

  const getAccountStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "활성";
      case "dormant":
        return "휴면";
      case "deleted":
        return "삭제됨";
      default:
        return status;
    }
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const handleSaveEdit = (value: string) => {
    // TODO: API 호출하여 사용자 정보 업데이트
    console.log(`Saving ${editingField}:`, value);
    setEditingField(null);
  };

  const renderInfoItem = (
    label: string,
    value: string,
    isEditable: boolean = false,
    field?: string
  ) => {
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
        currentValue = user.gender || "";
      }

      return (
        <ProfileEditForm
          field={field!}
          currentValue={currentValue}
          onCancel={handleCancelEdit}
          onSave={handleSaveEdit}
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
                onClick={() => handleEdit(field!)}
                className="iconBtn"
              >
                <IconPen width={16} height={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h3>내 정보</h3>
        <p>계정 정보를 확인하고 관리할 수 있습니다.</p>
      </div>

      <div className={styles.contentWrapper}>
        {/* 프로필 섹션 */}
        <section>
          <div className={styles.profileCard}>
            <ProfileImage
              size={120}
              profileImgUrl={user.profileImgUrl || undefined}
              nickname={user.nickname || undefined}
              identification={user.identification}
            />

            <div className={styles.profileInfo}>
              <h2>{user.nickname || user.identification}</h2>
              <p className={styles.userId}>
                @{user.nickname}#{user.seq}
              </p>

              <div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>가입일</span>

                  <span className={styles.statValue}>
                    {formatDateII(new Date(user.createdAt || ""))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 기본 정보 섹션 */}
        <section>
          <div className={styles.sectionHeader}>
            <h3>기본 정보</h3>
          </div>

          <div>
            {renderInfoItem("아이디", user.identification)}
            {renderInfoItem(
              "별명",
              `${user.nickname}#${user.seq}` || "-",
              true,
              "nickname"
            )}
            {renderInfoItem("이메일", user.email || "-", true, "email")}
            {renderInfoItem(
              "휴대전화",
              user.phoneNumber || "-",
              true,
              "phoneNumber"
            )}
            {renderInfoItem(
              "생년월일",
              formatDateII(new Date(user.birthdate || "")),
              true,
              "birthdate"
            )}
            {renderInfoItem("성별", getGenderText(user.gender), true, "gender")}
          </div>
        </section>

        {/* 계정 정보 섹션 */}
        <section>
          <div className={styles.sectionHeader}>
            <h3>계정 정보</h3>
          </div>

          <div className={styles.infoGrid}>
            {renderInfoItem(
              "가입 방법",
              getProviderText(user.provider || "local")
            )}
            {renderInfoItem(
              "계정 상태",
              getAccountStatusText(user.accountStatus || "active")
            )}
            {renderInfoItem(
              "가입일",
              formatDateII(new Date(user.createdAt || ""))
            )}
            {renderInfoItem(
              "마지막 수정일",
              formatDateII(new Date(user.updatedAt || ""))
            )}
          </div>
        </section>

        {/* 액션 섹션 */}
        <section></section>
      </div>
    </div>
  );
}
