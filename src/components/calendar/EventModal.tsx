"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { setScheduleCategories } from "@redux/slices/CalendarSlice";

import { IISchedule, ISchedule } from "@models/Schedule";
import { IIUser } from "@models/User";
import { IIScheduleCategory, IScheduleCategory } from "@models/ScheduleCategory";

import CSS from "./EventModal.module.css";

import { errMsg } from "@constants/msg";

import { convertDateII } from "@utils/index";

import Modal from "@components/common/Modal";
import MiniCalendarView from "@components/calendar/MiniCalendarView";
import { IConvertedSchedules } from "@components/calendar/CalendarView";

import IconPrevBlack from "@public/img/common/icon_less_than_black.svg";
import IconUpTriangle from "@public/img/common/icon_up_triangle_black.svg";
import IconDownTriangle from "@public/img/common/icon_down_triangle_black.svg";
import IconClose from "@public/img/common/icon_close_primary.svg";
import IconCheck from "@public/img/common/icon_check_primary.svg";
import IconPlus from "@public/img/common/icon_plus_primary.svg";
import IconExpand from "@public/img/common/icon_expand_primary.svg";
import IconCollapse from "@public/img/common/icon_collapse_primary.svg";
import IconEditWritingWhite from "@public/img/common/icon_edit_writing_white.svg";
import IconEditReadingWhite from "@public/img/common/icon_edit_reading_white.svg";
import IconEditWritingPrimary from "@public/img/common/icon_edit_writing_primary.svg";
import IconEditReadingPrimary from "@public/img/common/icon_edit_reading_primary.svg";
import IconDeleteOpenWhite from "@public/img/common/icon_delete_open_white.svg";
import IconDeleteCloseWhite from "@public/img/common/icon_delete_close_white.svg";
import IconDeleteOpenPrimary from "@public/img/common/icon_delete_open_primary.svg";
import IconDeleteClosePrimary from "@public/img/common/icon_delete_close_primary.svg";

interface IEventModalProps {
  closeModal: () => void;
  getSchedules: () => void;
  findMultipleScheduleByDate: (year: number, month: number, day: number) => IConvertedSchedules[];
  findScheduleByDate: (year: number, month: number, day: number) => IConvertedSchedules[];
  lastSelectedDate: Date;
  users: IIUser[];
}

/** 일정 수정 Input 제목 인터페이스 */
interface IEditScheduleTitle extends ISchedule {
  /** 카테고리 Input 제목 */
  categories: string;
  /** 반복 여부 Input 제목 */
  isRepeating: string;
}

export default function EventModal({ closeModal, findMultipleScheduleByDate, findScheduleByDate, users, getSchedules, lastSelectedDate }: IEventModalProps) {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 현재 사용자 */
  const user = useSelector((state: RootState) => state.authReducer);
  /** 일정 */
  const calendar = useSelector((state: RootState) => state.calendarReducer);

  const today: Date = new Date();

  /** 일정 수정 Input 제목 */
  const editScheduleTitle: IEditScheduleTitle = {
    user: "사용자",
    title: "일정 이름",
    categories: "카테고리",
    content: "내용",
    isRepeating: "반복 여부",
  };

  /** 일정 수정 기본 값 */
  const editScheduleInitialState: IISchedule = {
    date: [today, today],
    isSingleDate: false,
    user: "",
    title: "",
    categories: [],
    content: "",
    isRepeating: false,
  };

  /** 새 카테고리 기본 값 */
  const newCategoryInitialState: IScheduleCategory = {
    title: "",
    color: "#000000",
    createdBy: user._id,
  };

  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(""); // 선택된 일정 Identification

  const [isEditSchedule, setIsEditSchedule] = useState<boolean>(false); // 일정 수정 상태인지
  const [isCreateSchedule, setIsCreateSchedule] = useState<boolean>(false); // 일정 생성 상태인지
  const [isStartMiniCalendarOpen, setIsStartMiniCalendarOpen] = useState<boolean>(false); // 일정 수정 시, 시작 날짜 선택 캘린더 가시 유무
  const [isEndMiniCalendarOpen, setIsEndMiniCalendarOpen] = useState<boolean>(false); // 일정 수정 시, 종료 날짜 선택 캘린더 가시 유무
  const [isUserListOpen, setIsUserListOpen] = useState<boolean>(false); // 일정 수정 시, 사용자 선택 드롭다운 메뉴 가시 유무
  const [isCategoryListOpen, setIsCategoryListOpen] = useState<boolean>(false); // 일정 수정 시, 카테고리 드롭다운 메뉴 가시 유무
  const [isCreateCategory, setIsCreateCategory] = useState<boolean>(false); // 일정 수정 시, 카테고리 생성 여부
  const [isEditSchduleHover, setIsEditScheduleHover] = useState<boolean>(false); // 일정 수정 버튼 Hover 여부
  const [isDeleteScheduleHover, setIsDeleteScheduleHover] = useState<boolean>(false); // 일정 삭제 버튼 Hover 여부

  const [isEditCategoryHovers, setIsEditCategoryHovers] = useState<boolean[]>([]); // 카테고리 수정 버튼 Hover 여부
  const [isDeleteCategoryHovers, setIsDeleteCategoryHovers] = useState<boolean[]>([]); // 카테고리 삭제 버튼 위에 Hover 여부

  // 수정할 일정 정보
  const [editSchedule, setEditSchedule] = useState<IISchedule>({
    ...editScheduleInitialState,
    user: user._id,
  });

  const [newCategory, setNewCategory] = useState<IScheduleCategory>(newCategoryInitialState); // 생성할 카테고리 내용

  const [userCategories, setUserCategories] = useState<IIScheduleCategory[]>([]); // 현재 사용자의 카테고리들
  const [editCategories, setEditCategories] = useState<IIScheduleCategory[]>([]); // 수정할 일정 정보

  /** 수정 일정, 시작 날짜 */
  const editScheduleStateStartDate: Date = editSchedule.date[0];
  /** 수정 일정, 종료 날짜 */
  const editScheduleStateEndDate: Date = editSchedule.date[1];

  /** 일정 수정 시, 빈 값이 있는지 */
  const isModalStateEmpty: boolean = Object.values(editSchedule).some((value) => value === "" || (Array.isArray(value) && value.length === 0));

  /** 수정 상태인 카테고리 수정 아이콘 */
  const renderSelectedEditCategoryIcon = (idx: number): any => {
    return isEditCategoryHovers[idx] ? IconEditWritingWhite : IconEditReadingWhite;
  };
  /** 수정 상태가 아닌 카테고리 수정 아이콘 */
  const renderUnSelectedEditCategoryIcon = (idx: number): any => {
    return isEditCategoryHovers[idx] ? IconEditWritingPrimary : IconEditReadingPrimary;
  };

  /** 수정 상태인 카테고리 삭제 아이콘 */
  const renderSelectedDeleteCategoryIcon = (idx: number): any => {
    return isDeleteCategoryHovers[idx] ? IconDeleteOpenWhite : IconDeleteCloseWhite;
  };
  /** 수정 상태가 아닌 카테고리 삭제 아이콘 */
  const renderUnSelectedDeleteCategoryIcon = (idx: number): any => {
    return isDeleteCategoryHovers[idx] ? IconDeleteOpenPrimary : IconDeleteClosePrimary;
  };

  // 시작 시
  useEffect(() => {
    getCategories();
  }, []);

  // 카테고리 변경 시
  useEffect(() => {
    checkSelectedCategory();
  }, [calendar.categories]);

  // 캘린더의 카테고리, 사용자 변경 시
  useEffect(() => {
    setUserCategories(calendar.categories.filter((category) => category.createdBy === editSchedule.user)); // 현재 사용자의 카테고리 목록
  }, [calendar.categories, editSchedule.user]);

  // 일정 팝업 수정 상태 변경 시
  useEffect(() => {
    // 팝업 수정 상태가 꺼졌을 시
    if (!isEditSchedule) {
      setEditSchedule({
        ...editScheduleInitialState,
        user: user._id,
        date: [lastSelectedDate, lastSelectedDate],
      });

      setNewCategory(newCategoryInitialState);

      setIsUserListOpen(false);
      setIsCategoryListOpen(false);
      setIsCreateCategory(false);
      setIsStartMiniCalendarOpen(false);
      setIsEndMiniCalendarOpen(false);
    }
  }, [isEditSchedule]);

  useEffect(() => {
    // 일정 팝업 수정 상태 날짜 수정
    setEditSchedule((prev) => ({
      ...prev,
      date: [lastSelectedDate, lastSelectedDate],
    }));

    setIsEditSchedule(false);
  }, [lastSelectedDate]);

  /** 조회한 날짜의 팝업 속 일정 렌더링 */
  const renderModalSchedules = (): JSX.Element => {
    /** 선택한 날짜 */
    const selectedDate = new Date(editScheduleStateStartDate);

    /** 선택한 날짜의 연도 */
    const _year: number = selectedDate.getFullYear();
    /** 선택한 날짜의 달 */
    const _month: number = selectedDate.getMonth();
    /** 선택한 날짜의 일 */
    const _day: number = selectedDate.getDate();

    /** 선택한 날짜의 시작 날짜와 종료 날짜가 다른 일정들 */
    const modalMultipleSchedules: IConvertedSchedules[] = findMultipleScheduleByDate(_year, _month, _day);
    /** 선택한 날짜의 시작 날짜와 종료 날짜가 같은 일정들 */
    const schedules: IConvertedSchedules[] = findScheduleByDate(_year, _month, _day);
    /** 선택한 날짜의 모든 일정들 */
    const totalSchedules: IConvertedSchedules[] = [...modalMultipleSchedules, ...schedules];

    return totalSchedules.length > 0 ? (
      <ul className={CSS.schedules}>
        {totalSchedules.map((schedule, idx) => (
          <li key={idx}>
            <button type="button" onClick={() => selectedSchedule(schedule)} disabled={user.accessLevel !== 3 && (schedule.user as IIUser)._id !== user._id}>
              <span className={CSS.multiple}>
                {schedule.categories.slice(0, 2).map((category, _idx) => (
                  <span key={_idx} className={CSS.categoriesColor} style={{ background: category.color }}></span>
                ))}
                {schedule.categories.length > 2 && <span>...</span>}
              </span>

              <span className={CSS.truncated}>{schedule.title}</span>

              <span className={CSS.truncated}>{(schedule.user as IIUser).nickname}</span>
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p>일정이 없습니다.</p>
    );
  };

  /**
   * 일정 팝업 수정 상태 시, 사용할 Input 렌더링
   * @param key 제목
   * @param value 해당 내용
   * @returns Input
   */
  const renderModalInputs = (key: string, value: any): JSX.Element | null => {
    switch (key) {
      // 사용자
      case "user":
        return (
          <>
            <button type="button" onClick={toggleUserList} disabled={user.accessLevel < 3} style={isUserListOpen ? { borderRadius: "5px 5px 0 0" } : undefined}>
              <span>{users.find((_user) => _user._id === value)?.nickname}</span>

              {user.accessLevel >= 3 && <Image src={isUserListOpen ? IconUpTriangle : IconDownTriangle} width={9} alt={isUserListOpen ? "▲" : "▼"} />}
            </button>

            {isUserListOpen && (
              <ul className={CSS.user}>
                {users.map((_user, idx) => (
                  <li key={idx}>
                    <button type="button" onClick={() => selectUser(_user)}>
                      <span className={CSS.truncated}>{_user.nickname}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        );
      // 일정 제목
      case "title":
        return <input type="text" value={value} onChange={(e) => handleModalText(key, e)} placeholder="입력해주세요." />;
      // 일정 내용
      case "content":
        return <textarea value={value} onChange={(e) => handleModalText(key, e)} placeholder="입력해주세요." style={{ height: 100 }} />;
      // 카테고리
      case "categories":
        return (
          <>
            <button type="button" onClick={toggleCategory} style={isCategoryListOpen ? { borderRadius: "5px 5px 0 0" } : undefined}>
              <span className={`${CSS.selectedCategories} ${CSS.multiple}`}>
                {value.length > 0
                  ? value.map((category: IIScheduleCategory, idx: number) => <span key={idx}>{category.title}</span>)
                  : "선택된 카테고리가 없습니다."}
              </span>

              <Image src={isCategoryListOpen ? IconUpTriangle : IconDownTriangle} width={9} alt={isCategoryListOpen ? "▲" : "▼"} />
            </button>

            {isCategoryListOpen && (
              <ul className={CSS.categories}>
                {userCategories.length > 0 &&
                  userCategories.map((category, idx) =>
                    editCategories.some((_category) => _category._id === category._id) ? (
                      <li key={idx} className={CSS.edit}>
                        <input type="color" value={category.color} onChange={(e) => handleEditCategoryColorTitle(e, "color", String(category._id))} />

                        <input type="text" value={category.title} onChange={(e) => handleEditCategoryColorTitle(e, "title", String(category._id))} />

                        <button type="button" onClick={() => updateCategory(category)}>
                          <Image src={IconCheck} width={16} alt="√" />
                        </button>

                        <button type="button" onClick={() => toggleEditCategory(category)}>
                          <Image src={IconClose} width={16} alt="X" />
                        </button>
                      </li>
                    ) : (
                      renderCategories(category, idx)
                    )
                  )}

                {isCreateCategory && (
                  <li className={`${CSS.edit} ${CSS.createCategory}`} style={{ bottom: 24 }}>
                    <input type="color" value={newCategory.color} onChange={handleCreateCategoryColor} />

                    <input type="text" value={newCategory.title} onChange={handleCreateCategoryTitle} placeholder="카테고리 이름" />

                    <button type="button" onClick={createCategory}>
                      <Image src={IconPlus} width={12} alt="+" />
                    </button>
                  </li>
                )}

                <li className={CSS.createCategory}>
                  <button type="button" onClick={toggleCreateCategory} style={{ borderRadius: 0 }}>
                    <Image src={!isCreateCategory ? IconExpand : IconCollapse} width={12} alt={!isCreateCategory ? "▼" : "▲"} />
                  </button>
                </li>
              </ul>
            )}
          </>
        );
      // 일정 반복 여부
      case "isRepeating":
        return (
          <>
            <input type="radio" id="repeating" name="isRepeating" value="repeating" checked={editSchedule.isRepeating} onChange={handleRepeating} />
            <label htmlFor="repeating" className={editSchedule.isRepeating ? CSS.repeating : undefined}>
              반복
            </label>

            <input type="radio" id="nonrepeating" name="isRepeating" value="nonrepeating" checked={!editSchedule.isRepeating} onChange={handleRepeating} />
            <label htmlFor="nonrepeating" className={!editSchedule.isRepeating ? CSS.repeating : undefined}>
              반복 안함
            </label>
          </>
        );
      default:
        return null;
    }
  };

  /**
   * 일정 수정 팝업에서 카테고리들 렌더링
   * @param category 카테고리
   * @param idx 카테고리 순번
   * @returns 카테고리
   */
  const renderCategories = (category: IIScheduleCategory, idx: number): JSX.Element => {
    /** 선택된 카테고리인지 */
    const isSelected: IIScheduleCategory | undefined = editSchedule.categories.find((_category) => _category._id === category._id);

    return (
      <li key={idx} className={isSelected ? `${CSS.selectedList} ${CSS.list}` : CSS.list}>
        <button type="button" onClick={() => selectCategory(category)} className={CSS.truncated}>
          <span>{category.title}</span>
        </button>

        <button
          type="button"
          onClick={() => (isSelected ? alert("수정하려면 선택을 해제해주세요.") : toggleEditCategory(category))}
          onMouseOver={() => hoverEditCategory(true, idx)}
          onMouseOut={() => hoverEditCategory(false, idx)}
        >
          <Image src={isSelected ? renderSelectedEditCategoryIcon(idx) : renderUnSelectedEditCategoryIcon(idx)} width={16} alt="Edit" />
        </button>

        <button
          type="button"
          onClick={() => deleteCategory(String(category._id))}
          onMouseOver={() => hoverDeleteCategory(true, idx)}
          onMouseOut={() => hoverDeleteCategory(false, idx)}
        >
          <Image src={isSelected ? renderSelectedDeleteCategoryIcon(idx) : renderUnSelectedDeleteCategoryIcon(idx)} width={16} alt="Delete" />
        </button>
      </li>
    );
  };

  /** 현재 선택된 카테고리에서 변경 사항 적용 */
  const checkSelectedCategory = (): void => {
    /** 카테고리들의 _id로 중복 제거 */
    const categoriesSet: Set<string> = new Set(calendar.categories.map((category) => String(category._id)));
    /** 선택된 카테고리들 */
    const selectedCategory: IIScheduleCategory[] = editSchedule.categories;
    /** 선택된 카테고리에서 변경 사항 적용 */
    const filteredSelectedCategory: IIScheduleCategory[] = selectedCategory.filter((category) => categoriesSet.has(String(category._id)));

    setEditSchedule((prev) => ({
      ...prev,
      categories: filteredSelectedCategory,
    }));
  };

  /**
   * 카테고리 삭제 버튼 Hover 여부 관리
   * @param isHover Hover 여부
   */
  const hoverDeleteCategory = (isHover: boolean, idx: number): void => {
    /** 이전 '카테고리 삭제 버튼' Hover 목록 */
    const prevIsDeleteCategoryHovers = [...isDeleteCategoryHovers];
    prevIsDeleteCategoryHovers[idx] = isHover;

    setIsDeleteCategoryHovers(prevIsDeleteCategoryHovers);
  };

  /**
   * 일정 팝업 수정 상태 시, 일정 제목, 일정 내용 Input 입력
   * @param key 수정할 Input
   * @param e 수정할 내용
   */
  const handleModalText = (key: string, e: any): void => {
    setEditSchedule((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  /**
   * 일정 팝업 수정 시, 카테고리 수정 시, 내용 수정
   * @param e 입력 받은 값
   * @param key color: 색상, title: 카테고리 이름
   * @param _id 수정 시, 카테고리 _id
   */
  const handleEditCategoryColorTitle = (e: any, key: "color" | "title", _id: string): void => {
    /** 수정을 위한 임시 저장 */
    const tempCategories: IIScheduleCategory[] = [...userCategories];

    /** 변경할 카테고리의 순번 */
    const categoryIdx: number = userCategories.findIndex((category) => category._id === _id);

    // 수정할 카테고리 찾았을 시
    if (categoryIdx !== -1) {
      /** 수정할 카테고리 내용 */
      const updatedCategory: IIScheduleCategory = {
        ...userCategories[categoryIdx],
        [key]: e.target.value,
      } as IIScheduleCategory;

      // 해당 카테고리 정보 덮어쓰기
      tempCategories[categoryIdx] = updatedCategory;

      setUserCategories(tempCategories);
    }
  };

  /**
   * 생성할 카테고리 색상 입력
   * @param e 색상
   */
  const handleCreateCategoryColor = (e: any): void => {
    setNewCategory((prev) => ({
      ...prev,
      color: e.target.value,
    }));
  };

  /**
   * 생성할 카테고리 제목 입력
   * @param e 카테고리 제목
   */
  const handleCreateCategoryTitle = (e: any): void => {
    setNewCategory((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  /**
   * 일정 팝업 수정 상태 시, 반복 여부 설정
   * @param e 반복 여부
   */
  const handleRepeating = (e: any): void => {
    setEditSchedule((prev) => ({
      ...prev,
      isRepeating: e.target.value === "repeating" ? true : false,
    }));
  };

  /**
   * 일정 삭제 버튼 Hover 여부 관리
   * @param isHover Hover 여부
   */
  const hoverDeleteSchedule = (isHover: boolean): void => {
    setIsDeleteScheduleHover(isHover);
  };

  /**
   * 일정 수정 버튼 Hover 여부 관리
   * @param isHover Hover 여부
   */
  const hoverEditSchedule = (isHover: boolean): void => {
    setIsEditScheduleHover(isHover);
  };

  /**
   * 카테고리 수정 버튼 Hover 여부 관리
   * @param isHover Hover 여부
   */
  const hoverEditCategory = (isHover: boolean, idx: number): void => {
    /** 이전 '카테고리 수정 버튼' Hover 목록 */
    const prevIsEditCategoryHovers = [...isEditCategoryHovers];
    prevIsEditCategoryHovers[idx] = isHover;

    setIsEditCategoryHovers(prevIsEditCategoryHovers);
  };

  /** 카테고리 생성 Toggle */
  const toggleCreateCategory = (): void => {
    setIsCreateCategory((prev) => !prev);
  };

  /**
   * 미니 캘린더 달 변경
   * @param isStart '일정 시작 날짜 선택 캘런더'로 사용되고 있는지
   * @param direction 달 변경 방향
   */
  const changeMiniMonth = (isStart: boolean, direction: "prev" | "next"): void => {
    /** 변경되기 전 날짜 */
    const date = isStart ? editScheduleStateStartDate : editScheduleStateEndDate;

    /** 변경될 연도 */
    let _year = date.getFullYear();
    /** 변결될 달 */
    let _month = date.getMonth();

    switch (direction) {
      // 이전 달로 변경
      case "prev":
        // 기존 달이 1월이 아닐 시
        if (_month > 0) _month--;
        // 기존 달이 1월일 시
        else {
          _year--;
          _month = 11;
        }

        break;
      // 다음 달로 변경
      case "next":
        // 기존 달이 12월이 아닐 시
        if (_month < 11) _month++;
        // 기존 달이 12월일 시
        else {
          _year++;
          _month = 0;
        }

        break;
    }

    // 변경 될 날짜
    const newDate = new Date(_year, _month, 1);

    // 바뀔 날짜가 '일정 시작 날짜 선택 캘린더'일 시
    if (isStart)
      setEditSchedule((prev) => ({
        ...prev,
        date: [newDate, prev.date[1]],
      }));
    // 바뀔 날짜가 '일정 종료 날짜 선택 캘린더'일 시
    else
      setEditSchedule((prev) => ({
        ...prev,
        date: [prev.date[0], newDate],
      }));
  };

  /** 일정 생성 Toggle */
  const toggleCreateSchedule = (): void => {
    // 초기화
    if (!isEditSchedule) setIsCreateSchedule(true);
    setIsEditSchedule((prev) => !prev);
  };

  /** 일정 시작 날짜 선택 캘런더 Toggle */
  const toggleStartDate = (): void => {
    // '일정 시작 날짜 선택 캘린더'가 켜지면 '일정 종료 날짜 선택 캘린더'는 종료
    if (!isStartMiniCalendarOpen) setIsEndMiniCalendarOpen(false);

    setIsStartMiniCalendarOpen((prev) => !prev);
  };

  /** 일정 종료 날짜 선택 캘린더 Toggle */
  const toggleEndDate = (): void => {
    // '일정 종료 날짜 선택 캘린더'가 켜지면 '일정 시작 날짤 선택 캘런더'는 종료
    if (!isEndMiniCalendarOpen) setIsStartMiniCalendarOpen(false);

    setIsEndMiniCalendarOpen((prev) => !prev);
  };

  /** 일정 팝업 수정 상태, 사용자 목록 드롭다운 메뉴 가시 Toggle */
  const toggleUserList = (): void => {
    setIsUserListOpen((prev) => !prev);
  };

  /** 카테고리 선택 드롭다운 메뉴 Toggle */
  const toggleCategory = (): void => {
    setIsCreateCategory(false);
    setIsCategoryListOpen((prev) => !prev);
  };

  /**
   * 카테고리 정보 수정 상태 Toggle
   * @param category 카테고리
   */
  const toggleEditCategory = (category: IIScheduleCategory): void => {
    /** 현재 사용자의 카테고리들 임시 저장 */
    const tempCategories: IIScheduleCategory[] = [...userCategories];
    /** 수정 중인 카테고리들 임시 저장 */
    const tempEditCategories: IIScheduleCategory[] = [...editCategories];

    /** 수정 전 카테고리 순번 */
    const categoryIdx: number = tempCategories.findIndex((_category) => _category._id === category._id);
    /** 수정 중인 카테고리 순번 */
    const existingIdx: number = tempEditCategories.findIndex((_category) => _category._id === category._id);

    // 수정 중인 카테고리일 시
    if (existingIdx !== -1) {
      /** 수정 전 카테고리 정보 */
      const rollbackCategory: IIScheduleCategory = {
        ...tempEditCategories[existingIdx],
      } as IIScheduleCategory;

      // 수정 전 카테고리 정보로 덮어쓰기
      tempCategories[categoryIdx] = rollbackCategory;

      setUserCategories(tempCategories);

      // 수정 중인 카테고리 목록에서 제거
      tempEditCategories.splice(existingIdx, 1);
    }
    // 수정 중이 아닐 시 수정 중인 카테고리 목록에 추가
    else tempEditCategories.push(category);

    setEditCategories(tempEditCategories);
  };

  /**
   * 미니 캘린더에서 날짜 선택 시
   * @param isStart '일정 시작 날짜 선택 캘런더'로 사용되고 있는지
   * @param date 선택된 날짜
   */
  const selectMiniDay = (isStart: boolean, date: Date): void => {
    // '일정 시작 날짜 선택 캘린더'일 시
    if (isStart)
      setEditSchedule((prev) => ({
        ...prev,
        date: [date, prev.date[1]],
      }));
    // '일정 종료 날짜 선택 캘린더'일 시
    else
      setEditSchedule((prev) => ({
        ...prev,
        date: [prev.date[0], date],
      }));

    setIsStartMiniCalendarOpen(false);
    setIsEndMiniCalendarOpen(false);
  };

  /**
   * 일정 선택
   * @param schedule 선택한 일정
   */
  const selectedSchedule = (schedule: IConvertedSchedules): void => {
    setSelectedScheduleId(String(schedule._id));

    /** 일정 시작 날짜 */
    const startDate = new Date(schedule.startYear, schedule.startMonth, schedule.startDay);
    /** 일정 종료 날짜 */
    const endDate = new Date(schedule.endYear, schedule.endMonth, schedule.endDay);

    // 일정 팝업 수정 상태 날짜 수정
    setEditSchedule({
      ...schedule,
      user: String((schedule.user as IIUser)._id),
      date: [startDate, endDate],
    });

    // 카테고리 생성 상태 초기화
    setNewCategory((prev) => ({
      ...prev,
      createdBy: String((schedule.user as IIUser)._id),
    }));

    setIsCreateSchedule(false);
    setIsEditSchedule(true);
  };

  /**
   * 일정 팝업 수정 상태에서 사용자 선택
   * @param _user 선택한 사용자
   */
  const selectUser = (_user: IIUser): void => {
    // 일정 팝업이 생성 상태일 시
    if (isCreateSchedule)
      setEditSchedule((prev) => ({
        ...editScheduleInitialState,
        date: prev.date,
        user: String(_user._id),
      }));
    // 일정 팝업이 수정 상태일 시
    else
      setEditSchedule((prev) => ({
        ...prev,
        user: String(_user._id),
        categories: [],
      }));

    // 카테고리 생성 Input 초기화
    setNewCategory({
      ...newCategoryInitialState,
      createdBy: String(_user._id),
    });

    setIsUserListOpen(false);
    setIsCategoryListOpen(false);
    setEditCategories([]);
  };

  /**
   * 카테고리 선택
   * @param category 카테고리
   */
  const selectCategory = (category: IIScheduleCategory): void => {
    /** 카테고리 수정을 위한 기존 카테고리들 임시 저장 */
    const tempCategories: IIScheduleCategory[] = editSchedule.categories;

    /** 선택된 카테고리 순번 */
    const selectedIdx: number = tempCategories.findIndex((_category) => _category.title === category.title);

    /** 새로운 카테고리들 */
    let newCategories: IIScheduleCategory[] = [];

    // 선택된 카테고리면 선택 해제
    if (selectedIdx !== -1) newCategories = tempCategories.filter((_, idx) => idx !== selectedIdx);
    // 선택 안된 카테고리면 선택
    else newCategories = [...tempCategories, category];

    setEditSchedule((prev) => ({
      ...prev,
      categories: newCategories,
    }));
  };

  const getSchedulesCover = () => {
    setIsCategoryListOpen(false);
    setIsEditSchedule(false);

    getSchedules();
  };

  /**
   * 카테고리 정보 갱신
   * @param category 업데이트할 카테고리
   */
  const updateCategory = (category: IIScheduleCategory): void => {
    fetch("/api/calendar/categories_management", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        toggleEditCategory(data);

        getCategories();
      })
      .catch((err) => console.error("Error in /src/components/calendar/EventModal > EventModal() > updateCategory() :", err));
  };

  /** 카테고리 생성 */
  const createCategory = (): void => {
    setIsCreateCategory(false);

    // 카테고리 이름 중복 허용 X
    if (userCategories.some((category) => category.title === newCategory.title)) {
      alert("이미 있는 카테고리입니다.");
      return;
    }

    fetch("/api/calendar/categories_management", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    })
      .then((res) => {
        if (res.ok) return res.json();

        alert(errMsg);

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        getCategories();
        setNewCategory(newCategoryInitialState);

        alert("일정 카테고리 추가에 성공하였습니다.");
      })
      .catch((err) => console.error("Error in /src/components/calendar/EventModal > EventModal() > createCategory() :", err));
  };

  /** 카테고리 삭제 */
  const deleteCategory = (_id: string): void => {
    fetch(`/api/calendar/categories_management?_id=${_id}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        getCategories();
      })
      .catch((err) => console.error("Error in /src/components/calendar/EventModal > EventModal() > deleteCategory() :", err));
  };

  /** 모든 카테고리 목록 가져오기 */
  const getCategories = (): void => {
    fetch("/api/calendar/categories_management")
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((_categories) => dispatch(setScheduleCategories(_categories)))
      .catch((err) => console.error("Error in /src/components/calendar/EventModal > EventModal() > getCategories() :", err));
  };

  /** 일정 생성 */
  const createSchedule = (): void => {
    fetch("/api/calendar/schedules_management", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editSchedule),
    })
      .then((res) => {
        if (res.ok) return res.json();

        alert(errMsg);

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        setEditSchedule((prev) => ({
          ...editScheduleInitialState,
          date: prev.date,
          user: user._id,
        }));

        getSchedulesCover();

        alert("일정 추가에 성공하였습니다.");
      })
      .catch((err) => console.error("Error in /src/components/calendar/EventModal > EventModal() > createSchedule() :", err));
  };

  /** 일정 정보 갱신 */
  const updateSchedule = (): void => {
    fetch("/api/calendar/schedules_management", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editSchedule),
    })
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        getSchedulesCover();
      })
      .catch((err) => console.error("Error in /src/components/calendar/EventModal > EventModal() > updateSchedule() :", err));
  };

  /** 일정 삭제 */
  const deleteSchedule = (): void => {
    fetch(`/api/calendar/schedules_management?_id=${selectedScheduleId}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        getSchedulesCover();
      })
      .catch((err) => console.error("Error in /src/components/calendar/EventModal > EventModal() > deleteSchedule() :", err));
  };

  return (
    <Modal className={CSS.modal}>
      <div className={CSS.header}>
        {isEditSchedule && (
          <button type="button" onClick={toggleCreateSchedule}>
            <Image src={IconPrevBlack} width={12} alt="<" />
          </button>
        )}

        <h5>
          {!isEditSchedule || isCreateSchedule ? (
            convertDateII(editScheduleStateStartDate, "-")
          ) : (
            <span>
              <button
                type="button"
                onClick={toggleStartDate}
                className={CSS.startDate}
                style={isStartMiniCalendarOpen ? { borderRadius: "5px 5px 0 0", borderBottom: "3px solid #FFF" } : undefined}
              >
                <span>{convertDateII(editScheduleStateStartDate, "-")}</span>

                <Image src={isStartMiniCalendarOpen ? IconUpTriangle : IconDownTriangle} width={13} alt={isStartMiniCalendarOpen ? "▲" : "▼"} />
              </button>

              {isStartMiniCalendarOpen && (
                <MiniCalendarView
                  changeMonth={(direction) => changeMiniMonth(true, direction)}
                  selectDay={(day) => selectMiniDay(true, day)}
                  isStart={true}
                  currentDate={today}
                  startDate={editScheduleStateStartDate}
                  endDate={editScheduleStateEndDate}
                />
              )}
            </span>
          )}

          {isEditSchedule && (
            <>
              &nbsp;~&nbsp;
              <span>
                <button
                  type="button"
                  onClick={toggleEndDate}
                  style={isEndMiniCalendarOpen ? { borderRadius: "5px 5px 0 0", borderBottom: "1px solid #FFF" } : undefined}
                >
                  <span>{convertDateII(editScheduleStateEndDate, "-")}</span>

                  <Image src={isEndMiniCalendarOpen ? IconUpTriangle : IconDownTriangle} width={9} alt={isEndMiniCalendarOpen ? "▲" : "▼"} />
                </button>
                {isEndMiniCalendarOpen && (
                  <MiniCalendarView
                    changeMonth={(direction) => changeMiniMonth(false, direction)}
                    selectDay={(day) => selectMiniDay(false, day)}
                    isStart={false}
                    currentDate={today}
                    startDate={editScheduleStateStartDate}
                    endDate={editScheduleStateEndDate}
                  />
                )}
              </span>
            </>
          )}
        </h5>

        <div style={{ height: "100%" }}>
          <button type="button" onClick={closeModal}>
            <Image src={IconClose} width={12} alt="X" />
          </button>
        </div>
      </div>

      <div className={CSS.content}>
        {!isEditSchedule ? (
          renderModalSchedules()
        ) : (
          <>
            <ul>
              {Object.entries(editSchedule).map(([key, value], idx) => {
                const isKeyInScheduleModalTitle: boolean = key in editScheduleTitle;

                if (!isKeyInScheduleModalTitle) return null;

                return (
                  <li key={idx}>
                    <ul>
                      <li>{`${editScheduleTitle[key as keyof IEditScheduleTitle]}`}</li>
                      <li>{renderModalInputs(key, value)}</li>
                    </ul>
                  </li>
                );
              })}
            </ul>

            <div className={CSS.btnBox} style={{ justifyContent: isCreateSchedule ? "center" : "space-between" }}>
              <button
                type="button"
                onClick={isCreateSchedule ? createSchedule : updateSchedule}
                disabled={isModalStateEmpty}
                onMouseOver={() => hoverEditSchedule(true)}
                onMouseOut={() => hoverEditSchedule(false)}
              >
                <Image
                  src={isCreateSchedule ? IconPlus : isEditSchduleHover ? IconEditWritingPrimary : IconEditReadingPrimary}
                  width={24}
                  alt={isCreateSchedule ? "+" : "Update"}
                />
              </button>

              {!isCreateSchedule && (
                <button type="button" onClick={deleteSchedule} onMouseOver={() => hoverDeleteSchedule(true)} onMouseOut={() => hoverDeleteSchedule(false)}>
                  <Image src={isDeleteScheduleHover ? IconDeleteOpenPrimary : IconDeleteClosePrimary} width={24} alt="Delete" />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {!isEditSchedule && (
        <button type="button" onClick={toggleCreateSchedule}>
          <Image src={IconPlus} width={24} alt="+" />
        </button>
      )}
    </Modal>
  );
}
