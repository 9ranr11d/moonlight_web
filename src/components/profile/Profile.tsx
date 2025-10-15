"use client";

import React, { useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

import styles from "./Profile.module.css";

import { formatDateII } from "@/utils";

import ProfileImage from "@/components/profile/ProfileImage";
import InfoItem from "@/components/profile/InfoItem";

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth);

  const [editingField, setEditingField] = useState<string | null>(null);

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
            <InfoItem
              label="아이디"
              value={user.identification}
              editingField={editingField}
              onEdit={handleEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              currentUser={user}
            />
            <InfoItem
              label="별명"
              value={`${user.nickname}#${user.seq}` || "-"}
              isEditable={true}
              field="nickname"
              editingField={editingField}
              onEdit={handleEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              currentUser={user}
            />
            <InfoItem
              label="이메일"
              value={user.email || "-"}
              isEditable={true}
              field="email"
              editingField={editingField}
              onEdit={handleEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              currentUser={user}
            />
            <InfoItem
              label="휴대전화"
              value={user.phoneNumber || "-"}
              isEditable={true}
              field="phoneNumber"
              editingField={editingField}
              onEdit={handleEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              currentUser={user}
            />
            <InfoItem
              label="생년월일"
              value={formatDateII(new Date(user.birthdate || ""))}
              isEditable={true}
              field="birthdate"
              editingField={editingField}
              onEdit={handleEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              currentUser={user}
            />
            <InfoItem
              label="성별"
              value={getGenderText(user.gender)}
              isEditable={true}
              field="gender"
              editingField={editingField}
              onEdit={handleEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              currentUser={user}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
