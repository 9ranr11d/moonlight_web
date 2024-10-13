"use client";

import React, { useEffect, useState } from "react";

import CSS from "./ProfileEdit.module.css";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { hideBackdrop, showBackdrop } from "@redux/slices/BackdropSlice";

import Lottie from "lottie-react";

import { IUser } from "@models/User";

import { ERR_MSG } from "@constants/msg";

import { getUser } from "@utils/index";

import Modal from "@components/common/Modal";
import Password from "@components/auth/Password";
import EmailUpdateForm from "./EmailUpdateForm";

import LottieLoading from "@public/json/loading_round_black.json";

/** 사용자 정보 수정 자식들 */
interface IProfileEditProps {
  /** 메뉴 변경 */
  changePage: (code: string) => void;
}

/** 사용자 정보 속성 */
interface IEditableFields {
  id: string;
  name: string;
  type: string;
}

/** 사용자 정보 수정 */
export default function ProfileEdit({ changePage }: IProfileEditProps) {
  /** 사용자 정보 속성들 */
  const editableFields: IEditableFields[] = [
    { id: "identification", name: "아이디", type: "readOnly" },
    { id: "email", name: "E-mail", type: "requiresVerification" },
    { id: "nickname", name: "닉네임", type: "editable" },
    { id: "password", name: "비밀번호", type: "hidden" },
    { id: "coupleCode", name: "커플 코드", type: "requiresVerification" },
  ];

  /** Dispatch */
  const dispatch = useDispatch();

  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authReducer);

  const [userData, setUserData] = useState<IUser>(user || {}); // 현재 사용자 정보

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 사용자 정보 수정 Modal 가시 유무

  const [disabledBtn, setDisabledBtn] = useState<{ [key in keyof IUser]?: boolean }>({}); // 비활성화 할 버튼들

  const [renderModalType, setRenderModalType] = useState<string>(""); // 사용자 정보 수정 모달에 렌더할 컴포넌트

  // 모든 사용자 정보 속성 수정상태 비활성화
  useEffect(() => {
    const initialDisabledState: { [key in keyof IUser]?: boolean } = {};

    editableFields.forEach(field => {
      const key = field.id as keyof IUser;

      initialDisabledState[key] = true;
    });

    setDisabledBtn(initialDisabledState);
  }, []);

  // 사용자 정보가 수정된 상태인지 파악
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

  /**
   * 사용자 정보 속성 렌더링
   * @returns 사용자 정보 속성
   */
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

  /**
   * 사용자 정보 수정 Modal 렌더링
   * @returns Modal 내용물
   */
  const renderModal = (): JSX.Element => {
    switch (renderModalType) {
      // E-mail 수정
      case "email":
        return <EmailUpdateForm verifyEmailSuccess={email => verifyEmailSuccess(email)} />;
      // 비밀번호 변경
      case "password":
        return <Password back={() => alert("취소되었습니다")} identification={user.identification} inputEmail={user.email} />;
      // Error Message
      default:
        return <p>{ERR_MSG}</p>;
    }
  };

  /**
   * 사용자 정보 속성 관리
   * @param e event
   * @param key 사용자 정보 속성
   */
  const handleField = (e: any, key: keyof IUser): void => {
    const { value } = e.target;

    setUserData(prev => ({ ...prev, [key]: value }));

    setDisabledBtn(prev => ({
      ...prev,
      [key]: value === user[key]?.toString(),
    }));
  };

  /**
   * 각 사용자 정보 속성에서 '변경하기' 버튼 클릭 시
   * @param field
   */
  const confirmUpdate = (field: IEditableFields): void => {
    switch (field.id) {
      // E-mail, 비밀번호: Modal 활성화
      case "email":
      case "password":
        setRenderModalType(field.id);

        dispatch(showBackdrop());

        setIsModalVisible(true);

        break;
      // 별명
      case "nickname":
        updateUserInfo({ nickname: userData.nickname });

        break;
      // '커플 코드 관리' 메뉴로 이동
      case "coupleCode":
        changePage("code");

        break;
      // Error Message 띄우기
      default:
        alert(ERR_MSG);

        break;
    }
  };

  /** Modal 닫기 */
  const closeModal = (): void => {
    setIsModalVisible(false);

    setRenderModalType("");
  };

  /**
   * E-mail 인증 성공 시
   * @param email 인증 성공한 E-mail
   */
  const verifyEmailSuccess = (email: string) => {
    dispatch(hideBackdrop());

    closeModal();

    updateUserInfo({ email: email });
  };

  /**
   * 사용자 정보 수정
   * @param userInfo 수정할 정보
   */
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
      .catch(err => console.error("/src/components/profile/ProfileEdit > ProfileEdit() => updateEmail()에서 오류가 발생했습니다. :", err));
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
