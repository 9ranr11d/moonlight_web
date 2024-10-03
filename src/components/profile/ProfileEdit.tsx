"use client";

import React, { useEffect, useState } from "react";

import CSS from "./ProfileEdit.module.css";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { hideBackdrop, showBackdrop } from "@redux/slices/Backdrop";

import Lottie from "lottie-react";

import { IUser } from "@models/User";

import { ERR_MSG } from "@constants/msg";

import { getUser } from "@utils/index";

import Modal from "@components/common/Modal";
import Password from "@components/auth/Password";
import EmailUpdateForm from "./EmailUpdateForm";

import LottieLoading from "@public/json/loading_round_black.json";

interface IProfileEditProps {
  changePage: (code: string) => void;
}

interface IEditableFields {
  id: string;
  name: string;
  type: string;
}

/** 사용자 정보 수정 */
export default function ProfileEdit({ changePage }: IProfileEditProps) {
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

  const [disabledBtn, setDisabledBtn] = useState<{ [key in keyof IUser]?: boolean }>({});

  const [renderModalType, setRenderModalType] = useState<string>("");

  useEffect(() => {
    const initialDisabledState: { [key in keyof IUser]?: boolean } = {};

    editableFields.forEach(field => {
      const key = field.id as keyof IUser;
      initialDisabledState[key] = true;
    });

    setDisabledBtn(initialDisabledState);
  }, []);

  useEffect(() => {
    if (user.isAuth) {
      setUserData(user);

      const newDisabledBtn: { [key in keyof IUser]?: boolean } = {};

      editableFields.forEach(field => {
        const key = field.id as keyof IUser;

        newDisabledBtn[key] = userData[key] === user[key];
      });

      setDisabledBtn(newDisabledBtn);
    }
  }, [user]);

  const renderFields = (): JSX.Element[] => {
    return editableFields.map(field => {
      const key = field.id as keyof IUser;

      return (
        <div key={field.id}>
          <h6>{field.name}</h6>

          {field.type === "readOnly" ? (
            <div className={CSS.content}>
              <p>{userData[key]?.toString()}</p>
            </div>
          ) : field.type === "requiresVerification" ? (
            <div className={CSS.content}>
              <p>{userData[key]?.toString()}</p>

              <button type="button" onClick={() => confirmUpdate(field)}>
                변경하기
              </button>
            </div>
          ) : field.type === "hidden" ? (
            <div className={CSS.content} style={{ display: "initial" }}>
              <button type="button" onClick={() => confirmUpdate(field)}>
                변경하기
              </button>
            </div>
          ) : (
            <div className={CSS.content}>
              <input type="text" value={userData[key]?.toString() || ""} onChange={e => handleField(e, key)} />

              <button type="button" onClick={() => confirmUpdate(field)} disabled={disabledBtn[key]}>
                변경하기
              </button>
            </div>
          )}
        </div>
      );
    });
  };

  const renderModal = (): JSX.Element => {
    switch (renderModalType) {
      case "email":
        return <EmailUpdateForm verifyEmailSuccess={email => verifyEmailSuccess(email)} />;
      case "password":
        return <Password back={() => alert("취소되었습니다")} identification={user.identification} inputEmail={user.email} />;
      default:
        return <p>{ERR_MSG}</p>;
    }
  };

  const handleField = (e: any, key: keyof IUser): void => {
    const { value } = e.target;

    setUserData(prev => ({ ...prev, [key]: value }));

    setDisabledBtn(prev => ({
      ...prev,
      [key]: value === user[key]?.toString(),
    }));
  };

  const confirmUpdate = (field: IEditableFields): void => {
    switch (field.id) {
      case "email":
      case "password":
        setRenderModalType(field.id);

        dispatch(showBackdrop());

        setIsModalVisible(true);

        break;
      case "nickname":
        updateUserInfo({ nickname: userData.nickname });

        break;
      case "coupleCode":
        changePage("code");

        break;
      default:
        alert(ERR_MSG);

        break;
    }
  };

  const closeModal = (): void => {
    setIsModalVisible(false);

    setRenderModalType("");
  };

  const verifyEmailSuccess = (email: string) => {
    dispatch(hideBackdrop());

    closeModal();

    updateUserInfo({ email: email });
  };

  const updateUserInfo = (userInfo: { email?: string; nickname?: string }) => {
    const data: { _id: string; email?: string; nickname?: string } = { _id: user._id, ...userInfo };

    fetch("/api/auth/change_user_info", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.ok) return res.json();

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(data => {
        console.log(data.msg);

        alert("사용자 정보가 성공적으로 바뀌었습니다.");

        getUser(user.accessToken, dispatch);
      })
      .catch(err => console.error("Error in /src/components/profile/ProfileEdit > ProfileEdit() => updateEmail() :", err));
  };

  return (
    <>
      {user.isAuth ? (
        <div className={CSS.container}>
          <h3 className={CSS.title}>사용자 정보 수정</h3>

          {user.isAuth && <div className={`${CSS.desc} ${CSS.profileInfo}`}>{renderFields()}</div>}

          {isModalVisible && (
            <Modal close={closeModal}>
              <div className={CSS.modal}>{renderModal()}</div>
            </Modal>
          )}
        </div>
      ) : (
        <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Lottie animationData={LottieLoading} style={{ width: 30, height: 30 }} />
        </div>
      )}
    </>
  );
}
