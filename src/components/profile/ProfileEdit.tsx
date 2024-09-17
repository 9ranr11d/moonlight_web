"use client";

import React, { useEffect, useState } from "react";

import CSS from "./ProfileEdit.module.css";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { showBackdrop } from "@redux/slices/Backdrop";

import Lottie from "lottie-react";

import { IUser } from "@models/User";

import { errMsg } from "@constants/msg";

import LottieLoading from "@public/json/loading_round_black_1.json";

import Modal from "@components/common/Modal";

import EmailUpdateForm from "./EmailUpdateForm";

interface IEditableFields {
  id: string;
  name: string;
  type: string;
}

/** 사용자 정보 수정 */
export default function ProfileEdit() {
  const editableFields: IEditableFields[] = [
    { id: "identification", name: "아이디", type: "readOnly" },
    { id: "email", name: "E-mail", type: "requiresVerification" },
    { id: "nickname", name: "닉네임", type: "editable" },
    { id: "password", name: "비밀번호", type: "hidden" },
    { id: "coupleCode", name: "커플 코드", type: "requiresVerification" },
  ];

  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.authReducer);

  const [userData, setUserData] = useState<IUser>(user || {});

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [renderModalType, setRenderModalType] = useState<string>("");

  useEffect(() => {
    if (user.isAuth) setUserData(user);
  }, [user]);

  const renderFields = (): JSX.Element[] => {
    return editableFields.map((field) => {
      const key = field.id as keyof IUser;

      return (
        <div key={field.id}>
          <p>{field.name}</p>

          {field.type === "readOnly" ? (
            <p>{userData[key]?.toString()}</p>
          ) : field.type === "requiresVerification" ? (
            <div>
              <p>{userData[key]?.toString()}</p>
              <button type="button" onClick={() => goToVerification(field)}>
                변경하기
              </button>
            </div>
          ) : field.type === "hidden" ? (
            <button type="button" onClick={() => goToVerification(field)}>
              변경하기
            </button>
          ) : (
            <input name={field.id} type="text" value={userData[key]?.toString() || ""} onChange={handleField} />
          )}
        </div>
      );
    });
  };

  const renderModal = (): JSX.Element => {
    switch (renderModalType) {
      case "email":
        return <EmailUpdateForm />;
      default:
        return <p>{errMsg}</p>;
    }
  };

  const handleField = (e: any): void => {
    const { name, value } = e.target;

    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const goToVerification = (field: IEditableFields): void => {
    switch (field.id) {
      case "email":
      case "password":
        setRenderModalType(field.id);

        dispatch(showBackdrop());

        setIsModalVisible(true);
        break;
      case "coupleCode":
        break;
      default:
        alert(errMsg);
        break;
    }
  };

  return (
    <>
      {user.isAuth ? (
        <div className={CSS.container}>
          <h3 className={CSS.title}>사용자 정보 수정</h3>

          <div className={CSS.desc}>{user.isAuth && renderFields()}</div>

          {isModalVisible && <Modal>{renderModal()}</Modal>}
        </div>
      ) : (
        <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Lottie animationData={LottieLoading} style={{ width: 30 }} />
        </div>
      )}
    </>
  );
}
