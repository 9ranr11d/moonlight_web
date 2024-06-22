"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import CSS from "./Calendar.module.css";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { setSchedules, setScheduleCategories } from "@redux/slices/CalendarSlice";

import { IIUser } from "@models/User";
import { ISchedule, IISchedule, IIISchedule } from "@models/Schedule";
import { IScheduleCategory, IIScheduleCategory } from "@models/ScheduleCategory";

import { convertDateII } from "@utils/utils";

import IconPrevWhite from "@public/img/common/icon_less_than_white.svg";
import IconNextWhite from "@public/img/common/icon_greater_than_white.svg";
import IconPrevBlack from "@public/img/common/icon_less_than_black.svg";
import IconNextBlack from "@public/img/common/icon_greater_than_black.svg";
import IconUpTriangle from "@public/img/common/icon_up_triangle_black.svg";
import IconDownTriangle from "@public/img/common/icon_down_triangle_black.svg";
import IconClose from "@public/img/common/icon_close_main.svg";
import IconCheck from "@public/img/common/icon_check_main.svg";
import IconEditMain from "@public/img/common/icon_edit_main.svg";
import IconEditWhite from "@public/img/common/icon_edit_white.svg";
import IconDeleteMain from "@public/img/common/icon_delete_main.svg";
import IconDeleteWhite from "@public/img/common/icon_delete_white.svg";
import IconExpand from "@public/img/common/icon_expand_main.svg";
import IconCollapse from "@public/img/common/icon_collapse_main.svg";
import IconPlus from "@public/img/common/icon_plus_main.svg";

import MiniCalendar from "./MiniCalendar";

/** 일정 수정 Input 제목 인터페이스 */
interface IEditScheduleTitle extends ISchedule {
  /** 카테고리 Input 제목 */
  categories: string;
  /** 반복 여부 Input 제목 */
  isRepeating: string;
}

/** 일정 표시를 위한 시작 날짜, 종료 날짜를 변환한 일정 인터페이스 */
interface IConvertedSchedules extends IIISchedule {
  /** 시작 연도 */
  startYear: number;
  /** 시작 달 */
  startMonth: number;
  /** 시작 일 */
  startDay: number;
  /** 종료 연도 */
  endYear: number;
  /** 종료 달 */
  endMonth: number;
  /** 종료 일 */
  endDay: number;
}

/** 캘린더 */
export default function Calendar() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 현재 사용자 */
  const user = useSelector((state: RootState) => state.authReducer);
  /** 일정 */
  const calendar = useSelector((state: RootState) => state.calendarReducer);

  /** 오늘 날짜 */
  const today: Date = new Date();
  /** 현재 연도 */
  const currentYear: number = today.getFullYear();
  /** 현재 달 */
  const currentMonth: number = today.getMonth();
  /** 현재 일 */
  const currentDay: number = today.getDate();

  /** 달 이름 */
  const monthNames: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  /** 요일 이름 */
  const dayOfWeek: string[] = ["일", "월", "화", "수", "목", "금", "토"];

  /** 연도, 월 선택 사이드 메뉴 가로 길이  */
  const siderbarWidth = 250;
  /** 시작 연도 */
  const startYear = 2023;
  /** 시작 년도부터 최대 연도 */
  const MaximumSelectableYear = 100;

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

  /** 연도, 월 선택 사이드 메뉴 Ref */
  const siderbarRef = useRef<HTMLUListElement>(null);

  /** 사이드 메뉴 연도 Ref */
  const yearRefs = useRef<HTMLLIElement[]>([]);

  /** 캘린더 Ref */
  const calendarRef = useRef<HTMLDivElement>(null);

  const [lastSelectedDay, setLastSelectedDay] = useState<Date>(today); // 마지막 선택 날짜

  const [year, setYear] = useState<number>(currentYear); // 선택된 연도
  const [month, setMonth] = useState<number>(currentMonth); // 선택된 달
  const [calendarHeight, setCalendarHeight] = useState<number>(0); // 캘린더 높이

  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(""); // 선택된 일정 Identification

  const [isYear, setIsYear] = useState<boolean>(false); // 사이드 메뉴에서 연도 선택 상태인지
  const [isSiderbarOpen, setIsSiderbarOpen] = useState<boolean>(false); // 사이드 메뉴 가시 유무
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false); // 일정 추가, 수정 ,삭제 팝업 가시 유무
  const [isUserListOpen, setIsUserListOpen] = useState<boolean>(false); // 일정 수정 시, 사용자 선택 드롭다운 메뉴 가시 유무
  const [isCategoryListOpen, setIsCategoryListOpen] = useState<boolean>(false); // 일정 수정 시, 카테고리 드롭다운 메뉴 가시 유무
  const [isCreateCategory, setIsCreateCategory] = useState<boolean>(false); // 일정 수정 시, 카테고리 생성 여부
  const [isEditSchedule, setIsEditSchedule] = useState<boolean>(false); // 일정 수정 상태인지
  const [isStartMiniCalendarOpen, setIsStartMiniCalendarOpen] = useState<boolean>(false); // 일정 수정 시, 시작 날짜 선택 캘린더 가시 유무
  const [isEndMiniCalendarOpen, setIsEndMiniCalendarOpen] = useState<boolean>(false); // 일정 수정 시, 종료 날짜 선택 캘린더 가시 유무
  const [isCreateSchedule, setIsCreateSchedule] = useState<boolean>(false); // 일정 생성 상태인지

  const [editCategories, setEditCategories] = useState<IIScheduleCategory[]>([]); // 수정할 일정 정보
  const [userCategories, setUserCategories] = useState<IIScheduleCategory[]>([]); // 현재 사용자의 카테고리들

  const [newCategory, setNewCategory] = useState<IScheduleCategory>(newCategoryInitialState); // 생성할 카테고리 내용

  const [users, setUsers] = useState<IIUser[]>([]); // 전체 사용자 목록

  const [convertedSchedules, setConvertedSchedules] = useState<IConvertedSchedules[]>([]); // 일정 표시를 위해 바꾼 하루짜리 일정들의 정보
  const [multipleSchedules, setMultipleSchedules] = useState<IConvertedSchedules[]>([]); // 일정 표시를 위해 바꾼 여러날짜리 일정들의 정보

  // 수정할 일정 정보
  const [editSchedule, setEditSchedule] = useState<IISchedule>({
    ...editScheduleInitialState,
    user: user._id,
  });

  /** 사이드 메뉴의 연도 목록 */
  const years: number[] = Array.from({ length: MaximumSelectableYear }, (_, idx) => startYear + idx);
  /** 사이드 메뉴의 월 목록 */
  const monthDays: number[] = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  /** 현재 달의 1일의 요일 */
  const firstDayOfMonth: number = new Date(year, month, 1).getDay();
  /** 이전 달 날짜 수 */
  const prevMonthDays: number = month - 1 < 0 ? monthDays[11] : monthDays[month - 1];
  /** 이전 달 마지막 주와 현재 달의 날짜를 합친 수 */
  const monthDaysWithPrevLastWeek: number = monthDays[month] + firstDayOfMonth;
  /** 현재 달 마지막 주에 남은 날짜 수 */
  const fillRemainingDays: number = monthDaysWithPrevLastWeek % 7;
  /** 이전 달, 현재 달, 다음 달 날짜 총합 */
  const totalDays: number = fillRemainingDays === 0 ? monthDaysWithPrevLastWeek : monthDaysWithPrevLastWeek + (7 - fillRemainingDays);

  /** 수정 일정, 시작 날짜 */
  const editScheduleStateStartDate: Date = editSchedule.date[0];
  /** 수정 일정, 종료 날짜 */
  const editScheduleStateEndDate: Date = editSchedule.date[1];

  /** 일정 수정 시, 빈 값이 있는지 */
  const isPopupStateEmpty: boolean = Object.values(editSchedule).some((value) => value === "" || (Array.isArray(value) && value.length === 0));

  // 시작 시
  useEffect(() => {
    getUsers();
    getCategories();
  }, []);

  // 일정 목록의 변경이 있을 시
  useEffect(() => {
    convertSchedules();
  }, [calendar.schedules]);

  // 카테고리 변경 시
  useEffect(() => {
    checkSelectedCategory();
  }, [calendar.categories]);

  // 캘린더의 카테고리, 사용자 변경 시
  useEffect(() => {
    setUserCategories(calendar.categories.filter((category) => category.createdBy === editSchedule.user)); // 현재 사용자의 카테고리 목록
  }, [calendar.categories, editSchedule.user]);

  /** 캘린더 변경 시 */
  useEffect(() => {
    if (calendarRef.current) {
      /** 캘린더 높이 변경 */
      const updatedCalendarHeight = () => {
        setCalendarHeight(calendarRef.current?.offsetHeight || 0);
      };

      updatedCalendarHeight();

      /** 캘린더 내용물 변경 감지센서 */
      const observer = new MutationObserver(updatedCalendarHeight);
      observer.observe(calendarRef.current, { childList: true, subtree: true });
    }
  }, [calendarRef]);

  // 사이드 메뉴 연도/달 선택 상태 변경 시
  useEffect(() => {
    if (isYear) moveSelectedYear(year, year - startYear);
  }, [isYear]);

  // 연도, 달 변경 시
  useEffect(() => {
    getSchedules();
  }, [year, month]);

  // 일정 팝업 수정 상태 변경 시
  useEffect(() => {
    // 팝업 수정 상태가 꺼졌을 시
    if (!isEditSchedule) {
      setEditSchedule({
        ...editScheduleInitialState,
        user: user._id,
        date: [lastSelectedDay, lastSelectedDay],
      });

      setNewCategory(newCategoryInitialState);

      setIsUserListOpen(false);
      setIsCategoryListOpen(false);
      setIsCreateCategory(false);
      setIsStartMiniCalendarOpen(false);
      setIsEndMiniCalendarOpen(false);
    }
  }, [isEditSchedule]);

  // 팝업 가시 상태 변경 시
  useEffect(() => {
    /** <body> */
    const body: HTMLElement = document.body;

    // 팝업 켜질 시 스크롤 방지를 위해
    if (isPopupVisible) body.style.overflow = "hidden";
    else body.style.overflow = "auto";

    return () => {
      body.style.overflow = "auto";
    };
  }, [isPopupVisible]);

  /**
   * 시작 날짜와 종료 날짜가 다른 일정 렌더링
   * @param _year 연도
   * @param _month 달
   * @param _day 일
   * @returns 일정
   */
  const renderMultipleSchedules = (_year: number, _month: number, _day: number): JSX.Element | null => {
    /** 렌더링할 날짜 */
    const date: Date = new Date(_year, _month, _day);

    /** 렌더링할 날짜에 있는 시작 날짜와 종료 날짜가 다른 일정들 */
    const matchingSchedule: IConvertedSchedules[] = findMultipleScheduleByDate(_year, _month, _day);

    return matchingSchedule.length > 0 ? (
      <>
        {matchingSchedule.map((schedule, idx) => (
          <p key={idx} className={`${CSS.schedules} ${CSS.multipleSchedules}`} style={{ background: schedule.categories[0].color }}>
            {date.getTime() === new Date(schedule.date[0]).getTime() || date.getTime() === new Date(schedule.date[1]).getTime() ? schedule.title : ""}
          </p>
        ))}
      </>
    ) : null;
  };

  /**
   * 시작 날짜와 종료 날짜가 같은 일정 렌더링
   * @param _year 연도
   * @param _month 달
   * @param _day 일
   * @returns 일정
   */
  const renderSchedules = (_year: number, _month: number, _day: number): JSX.Element | null => {
    /** 렌더링할 날짜에 있는 시작 날짜와 종료 날짜가 같은 일정들 */
    const schedules: IConvertedSchedules[] = findScheduleByDate(_year, _month, _day);

    return schedules.length > 0 ? (
      <>
        {schedules.map((schedule, idx) => (
          <p key={idx} className={CSS.schedules}>
            <span className={CSS.multiple}>
              {schedule.categories.map((category, _idx) =>
                _idx < 2 ? <span key={`${idx}-${_idx}`} style={{ background: category.color }}></span> : _idx < 3 && "..."
              )}
            </span>

            <span className={CSS.truncated}>{schedule.title}</span>
          </p>
        ))}
      </>
    ) : null;
  };

  /** 조회한 날짜의 팝업 속 일정 렌더링 */
  const renderPopupSchedules = (): JSX.Element => {
    /** 선택한 날짜 */
    const selectedDate = new Date(editScheduleStateStartDate);

    /** 선택한 날짜의 연도 */
    const _year: number = selectedDate.getFullYear();
    /** 선택한 날짜의 달 */
    const _month: number = selectedDate.getMonth();
    /** 선택한 날짜의 일 */
    const _day: number = selectedDate.getDate();

    /** 선택한 날짜의 시작 날짜와 종료 날짜가 다른 일정들 */
    const multipleSchedules: IConvertedSchedules[] = findMultipleScheduleByDate(_year, _month, _day);
    /** 선택한 날짜의 시작 날짜와 종료 날짜가 같은 일정들 */
    const schedules: IConvertedSchedules[] = findScheduleByDate(_year, _month, _day);
    /** 선택한 날짜의 모든 일정들 */
    const totalSchedules: IConvertedSchedules[] = [...multipleSchedules, ...schedules];

    return totalSchedules.length > 0 ? (
      <ul className={CSS.schedules}>
        {totalSchedules.map((schedule, idx) => (
          <li key={idx}>
            <button type="button" onClick={() => selectedSchedule(schedule)} disabled={user.accessLevel !== 3 && (schedule.user as IIUser)._id !== user._id}>
              <span className={CSS.multiple}>
                {schedule.categories.map((category, _idx) =>
                  _idx < 2 ? <span key={_idx} className={CSS.categoriesColor} style={{ background: category.color }}></span> : _idx < 3 && "..."
                )}
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

        <button type="button" onClick={() => (isSelected ? alert("수정하려면 선택을 해제해주세요.") : toggleEditCategory(category))}>
          <Image src={isSelected ? IconEditWhite : IconEditMain} height={12} alt="Edit" />
        </button>

        <button type="button" onClick={() => deleteCategory(category._id)}>
          <Image src={isSelected ? IconDeleteWhite : IconDeleteMain} height={12} alt="Delete" />
        </button>
      </li>
    );
  };

  /**
   * 일정 팝업 수정 상태 시, 사용할 Input 렌더링
   * @param key 제목
   * @param value 해당 내용
   * @returns Input
   */
  const renderPopupInputs = (key: string, value: any): JSX.Element | null => {
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
        return <input type="text" value={value} onChange={(e) => handlePopupText(key, e)} placeholder="입력해주세요." />;
      // 일정 내용
      case "content":
        return <textarea value={value} onChange={(e) => handlePopupText(key, e)} placeholder="입력해주세요." style={{ height: 100 }} />;
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
                        <input type="color" value={category.color} onChange={(e) => handleEditCategoryColorTitle(e, "color", category._id)} />

                        <input type="text" value={category.title} onChange={(e) => handleEditCategoryColorTitle(e, "title", category._id)} />

                        <button type="button" onClick={() => updateCategory(category)}>
                          <Image src={IconCheck} height={12} alt="√" />
                        </button>

                        <button type="button" onClick={() => toggleEditCategory(category)}>
                          <Image src={IconClose} height={12} alt="X" />
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
                      <Image src={IconPlus} width={12} height={12} alt="+" />
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
   * 일정 팝업 수정 상태 시, 일정 제목, 일정 내용 Input 입력
   * @param key 수정할 Input
   * @param e 수정할 내용
   */
  const handlePopupText = (key: string, e: any): void => {
    setEditSchedule((prev) => ({
      ...prev,
      [key]: e.target.value,
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
   * 일정 중 해당 날짜가 포함된 시작 날짜와 종료 날짜가 다른 일정들 찾기
   * @param _year 연도
   * @param _month 달
   * @param _day 일
   * @returns 찾은 일정 목록
   */
  const findMultipleScheduleByDate = (_year: number, _month: number, _day: number): IConvertedSchedules[] => {
    return multipleSchedules.filter((schedule) => {
      /** 찾으려는 날짜 */
      const date: Date = new Date(_year, _month, _day);

      /** 일정들의 시작 날짜와 종료 날짜들 */
      const {
        startYear,
        startMonth,
        startDay,
        endYear,
        endMonth,
        endDay,
      }: { startYear: number; startMonth: number; startDay: number; endYear: number; endMonth: number; endDay: number } = schedule;

      /** 시작 날짜 */
      const convertedStartDate: Date = new Date(startYear, startMonth, startDay);
      /** 종료 날짜 */
      const convertedEndDate: Date = new Date(endYear, endMonth, endDay);

      return convertedStartDate <= date && date <= convertedEndDate;
    });
  };

  /**
   * 일정 중 해당 날짜의 시작 날짜와 종료 날짜가 같은 일정
   * @param _year 연도
   * @param _month 달
   * @param _day 일
   * @returns 찾은 일정 목록
   */
  const findScheduleByDate = (_year: number, _month: number, _day: number): IConvertedSchedules[] => {
    return convertedSchedules.filter(
      (schedule) =>
        schedule.isSingleDate &&
        ((schedule.startYear === _year && schedule.startMonth === _month && schedule.startDay === _day) ||
          (schedule.endYear === _year && schedule.endMonth === _month && schedule.endDay === _day))
    );
  };

  /** 사이드 메뉴 가시 상태 설정 */
  const toggleSiderbar = (): void => {
    setIsSiderbarOpen((prev) => !prev);
  };

  /** 일정 표시를 위한 일정들 정보 변환 */
  const convertSchedules = (): void => {
    /** 일정 표시를 위한 형식으로 변환하기 위한 임시 저장 */
    const tempSchedules: IConvertedSchedules[] = calendar.schedules.map((schedule) => {
      /** 시작 날짜 */
      const startDate = new Date(schedule.date[0]);
      /** 종료 날짜 */
      const endDate = new Date(schedule.date[1]);

      return {
        ...schedule,
        startYear: year,
        startMonth: startDate.getMonth(),
        startDay: startDate.getDate(),
        endYear: year,
        endMonth: endDate.getMonth(),
        endDay: endDate.getDate(),
      } as IConvertedSchedules;
    });

    setConvertedSchedules(tempSchedules);

    /** 시작 날짜와 종료 날짜가 다른 일정 목록 */
    const tempMultipleSchedules: IConvertedSchedules[] = tempSchedules.filter((schedule) => schedule.isSingleDate === false);

    setMultipleSchedules(tempMultipleSchedules);
  };

  /** 현재 선택된 카테고리에서 변경 사항 적용 */
  const checkSelectedCategory = (): void => {
    /** 카테고리들의 _id로 중복 제거 */
    const categoriesSet: Set<string> = new Set(calendar.categories.map((category) => category._id));
    /** 선택된 카테고리들 */
    const selectedCategory: IIScheduleCategory[] = editSchedule.categories;
    /** 선택된 카테고리에서 변경 사항 적용 */
    const filteredSelectedCategory: IIScheduleCategory[] = selectedCategory.filter((category) => categoriesSet.has(category._id));

    setEditSchedule((prev) => ({
      ...prev,
      categories: filteredSelectedCategory,
    }));
  };

  /**
   * 연도 변경
   * @param direction 변경 방향
   */
  const changeYear = (direction: "prev" | "next"): void => {
    switch (direction) {
      // 이전 년도로 이동
      case "prev":
        setYear((prev) => prev - 1);

        break;
      // 다음 년도로 이동
      case "next":
        setYear((prev) => prev + 1);

        break;
    }
  };

  /**
   * 달 변경
   * @param direction 변경 방향
   */
  const changeMonth = (direction: "prev" | "next"): void => {
    switch (direction) {
      // 이전 달로 이동
      case "prev":
        if (month > 0) setMonth((prev) => prev - 1);
        // 1월이면 이전 연도 12월로 이동
        else {
          setYear((prev) => prev - 1);
          setMonth(11);
        }

        break;
      // 다음 달로 이동
      case "next":
        if (month < 11) setMonth((prev) => prev + 1);
        // 12월이면 다음 연도 1월로 이동
        else {
          setYear((prev) => prev + 1);
          setMonth(0);
        }

        break;
    }
  };

  /**
   * 연도 선택
   * @param _year 선택한 연도
   * @param idx 선택한 연도 순번
   */
  const selectYear = (_year: number, idx: number): void => {
    setYear(_year);

    moveSelectedYear(_year, idx);
  };

  /**
   * 선택한 년도로 사이드 메뉴 스크롤 이동
   * @param _year 선택한 연도
   * @param idx 선택한 연도 순번
   */
  const moveSelectedYear = (_year: number, idx: number): void => {
    // 사이드 메뉴 Ref가 존재하는 지
    if (siderbarRef.current && yearRefs.current[idx]) {
      /** 사이드 메뉴 높이 */
      const siderbarHeight: number = siderbarRef.current.clientHeight;
      /** 선택된 연도의 요소 높이 */
      const selectedYearHeight: number = yearRefs.current[idx].clientHeight;
      /** 선택된 연도의 y좌표 */
      const selectedYearOffsetTop: number = yearRefs.current[idx].offsetTop;

      /** 스크롤 위치 */
      const scrollTop: number = selectedYearOffsetTop - siderbarHeight / 2 + selectedYearHeight / 2;
      siderbarRef.current.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  /**
   * 달 선택
   * @param idx 선택한 달 순번
   */
  const selectMonth = (idx: number): void => {
    setMonth(idx);
  };

  /**
   * 날짜 선택
   * @param _year 선택 연도
   * @param _month 선택 달
   * @param _day 선택 일
   */
  const selectDay = (_year: number, _month: number, _day: number): void => {
    const selectedDay: Date = new Date(_year, _month, _day);

    setLastSelectedDay(selectedDay);

    // 일정 팝업 수정 상태 날짜 수정
    setEditSchedule((prev) => ({
      ...prev,
      date: [selectedDay, selectedDay],
    }));

    setIsEditSchedule(false);
    setIsPopupVisible(true);
  };

  /**
   * 사이드 메뉴 연도와 달 Toggle
   * @param type
   */
  const toggleYearMonth = (type: string): void => {
    switch (type) {
      // 연도 선택 상태
      case "year":
        setIsYear(true);

        break;
      // 달 선택 상태
      case "month":
        setIsYear(false);

        break;
    }
  };

  /** 일정 팝업 닫기 */
  const closePopup = (): void => {
    setIsPopupVisible(false);
  };

  /**
   * 일정 선택
   * @param schedule 선택한 일정
   */
  const selectedSchedule = (schedule: IConvertedSchedules): void => {
    setSelectedScheduleId(schedule._id);

    /** 일정 시작 날짜 */
    const startDate = new Date(schedule.startYear, schedule.startMonth, schedule.startDay);
    /** 일정 종료 날짜 */
    const endDate = new Date(schedule.endYear, schedule.endMonth, schedule.endDay);

    // 일정 팝업 수정 상태 날짜 수정
    setEditSchedule({
      ...schedule,
      user: (schedule.user as IIUser)._id,
      date: [startDate, endDate],
    });

    // 카테고리 생성 상태 초기화
    setNewCategory((prev) => ({
      ...prev,
      createdBy: (schedule.user as IIUser)._id,
    }));

    setIsCreateSchedule(false);
    setIsEditSchedule(true);
  };

  /** 일정 팝업 수정 상태, 사용자 목록 드롭다운 메뉴 가시 Toggle */
  const toggleUserList = (): void => {
    setIsUserListOpen((prev) => !prev);
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
        user: _user._id,
      }));
    // 일정 팝업이 수정 상태일 시
    else
      setEditSchedule((prev) => ({
        ...prev,
        user: _user._id,
        categories: [],
      }));

    // 카테고리 생성 Input 초기화
    setNewCategory({
      ...newCategoryInitialState,
      createdBy: _user._id,
    });

    setIsUserListOpen(false);
    setIsCategoryListOpen(false);
    setEditCategories([]);
  };

  /** 카테고리 선택 드롭다운 메뉴 Toggle */
  const toggleCategory = (): void => {
    setIsCreateCategory(false);
    setIsCategoryListOpen((prev) => !prev);
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

  /** 카테고리 생성 Toggle */
  const toggleCreateCategory = (): void => {
    setIsCreateCategory((prev) => !prev);
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

  /**
   * 미니 캘린더에서 날짜 선택 시
   * @param isStart '일정 시작 날짜 선택 캘런더'로 사용되고 있는지
   * @param date 선택된 날짜
   */
  const selectMiniDay = (isStart: boolean, date: Date) => {
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

    setIsEndMiniCalendarOpen(false);
  };

  /** 모든 사용자 목록 */
  const getUsers = (): void => {
    fetch("/api/auth/get_users_with_high_access_level")
      .then((res) => {
        if (res.ok) return res.json();

        alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((users) => setUsers(users))
      .catch((err) => console.error("Get Users :", err));
  };

  /** 일정 가져오기 */
  const getSchedules = (): void => {
    setIsCategoryListOpen(false);
    setIsEditSchedule(false);

    fetch(`/api/calendar/schedules_management/${year}/${month}`)
      .then((res) => {
        if (res.ok) return res.json();

        alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((_schedules) => dispatch(setSchedules(_schedules)))
      .catch((err) => console.error("Get Categories :", err));
  };

  /** 모든 카테고리 목록 가져오기 */
  const getCategories = (): void => {
    fetch("/api/calendar/categories_management")
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((_categories) => dispatch(setScheduleCategories(_categories)))
      .catch((err) => console.error("Get Categories :", err));
  };

  /** 카테고리 정보 갱신 */
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
      .catch((err) => console.error("Update Category :", err));
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
      .catch((err) => console.error("Delete Duplicate :", err));
  };

  /** 카테고리 생성 */
  const createCategory = (): void => {
    setIsCreateCategory(false);

    // 카테고리 이름 중복 허용 X
    if (userCategories.some((category) => category.title === newCategory.title)) return alert("이미 있는 카테고리입니다.");

    fetch("/api/calendar/categories_management", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    })
      .then((res) => {
        if (res.ok) return res.json();

        alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        getCategories();
        setNewCategory(newCategoryInitialState);

        alert("일정 카테고리 추가에 성공하였습니다.");
      })
      .catch((err) => console.error("Create Category :", err));
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

        alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        setEditSchedule((prev) => ({
          ...editScheduleInitialState,
          date: prev.date,
          user: user._id,
        }));

        getSchedules();

        alert("일정 추가에 성공하였습니다.");
      })
      .catch((err) => console.error("Create Schedule :", err));
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

        getSchedules();
      })
      .catch((err) => console.error("Update Category :", err));
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

        getSchedules();
      })
      .catch((err) => console.error("Delete Duplicate :", err));
  };

  return (
    <>
      {isPopupVisible && <button type="button" onClick={closePopup} className={CSS.popupBackground}></button>}

      <div className={CSS.calendar} style={{ right: isSiderbarOpen ? 0 : siderbarWidth / 2 }}>
        <div className={CSS.subBox} style={{ left: isSiderbarOpen ? 0 : siderbarWidth }}>
          <button type="button" onClick={toggleSiderbar} className={CSS.moreBtn}>
            <Image src={isSiderbarOpen ? IconNextWhite : IconPrevWhite} height={30} alt={isSiderbarOpen ? ">" : "<"} />
          </button>

          <div className={CSS.content} style={{ width: siderbarWidth }}>
            <ul className={CSS.header}>
              <li>
                <button type="button" onClick={() => (isYear ? changeYear("prev") : changeMonth("prev"))}>
                  <Image src={IconPrevWhite} width={24} height={24} alt="Prev" />
                </button>
              </li>

              <li>
                <ul className={CSS.yearMonthToggleBtn}>
                  <li>
                    <button type="button" onClick={() => toggleYearMonth("year")} disabled={isYear}>
                      <h5>{year}</h5>
                    </button>
                  </li>

                  <li>
                    <button type="button" onClick={() => toggleYearMonth("month")} disabled={!isYear}>
                      <h5>{month + 1}</h5>
                    </button>
                  </li>
                </ul>
              </li>

              <li>
                <button type="button" onClick={() => (isYear ? changeYear("next") : changeMonth("next"))}>
                  <Image src={IconNextWhite} width={24} height={24} alt="Next" />
                </button>
              </li>
            </ul>

            <ul className={CSS.content} style={{ height: calendarHeight, paddingRight: isYear ? 5 : 0 }} ref={siderbarRef}>
              {!isYear
                ? monthNames.map((monthName, idx) => (
                    <li key={idx}>
                      <button type="button" onClick={() => selectMonth(idx)} className={idx === month ? CSS.selected : undefined}>
                        <h6>{monthName}</h6>
                      </button>
                    </li>
                  ))
                : years.map((_year, idx) => (
                    <li key={idx} ref={(el) => (yearRefs.current[idx] = el!)}>
                      <button type="button" onClick={() => selectYear(_year, idx)} className={year === _year ? CSS.selected : undefined}>
                        <h6>{_year}</h6>
                      </button>
                    </li>
                  ))}
            </ul>
          </div>
        </div>

        <div className={CSS.mainBox}>
          <ul className={CSS.header}>
            <li>
              <button type="button" onClick={() => changeMonth("prev")}>
                <Image src={IconPrevBlack} width={24} height={24} alt="Prev" />
              </button>
            </li>

            <li>
              <h3>{monthNames[month]}</h3>
            </li>

            <li>
              <button type="button" onClick={() => changeMonth("next")}>
                <Image src={IconNextBlack} width={24} height={24} alt="Next" />
              </button>
            </li>
          </ul>

          <div className={CSS.content} ref={calendarRef}>
            <ul className={CSS.daysOfWeek}>
              {dayOfWeek.map((day, idx) => (
                <li key={idx}>
                  <h6>{day}</h6>
                </li>
              ))}
            </ul>

            <ul className={CSS.days}>
              {Array.from({ length: totalDays }, (_, idx) => {
                /** 이전 달의 날짜인지 */
                const isPrevMonth: boolean = idx < firstDayOfMonth;
                /** 다음 달의 날짜인지 */
                const isNextMonth: boolean = idx + 1 > monthDaysWithPrevLastWeek;

                /** 표기할 날짜 */
                const day: number = isPrevMonth
                  ? prevMonthDays - (firstDayOfMonth - (idx + 1))
                  : isNextMonth
                  ? idx + 1 - monthDaysWithPrevLastWeek
                  : idx + 1 - firstDayOfMonth;

                /** 표기할 날짜의 달 */
                const _month: number = isPrevMonth ? month - 1 : isNextMonth ? month + 1 : month;

                return (
                  <li key={idx}>
                    <button type="button" onClick={() => selectDay(year, _month, day)} className={CSS.content}>
                      <span
                        className={`${
                          isPrevMonth
                            ? CSS.subDate
                            : isNextMonth
                            ? CSS.subDate
                            : year === currentYear && month === currentMonth && day === currentDay
                            ? CSS.today
                            : undefined
                        } ${CSS.day}`}
                      >
                        {day}
                      </span>

                      {(multipleSchedules.length > 0 || convertedSchedules.length > 0) && (
                        <span className={CSS.scheduleCovers}>
                          {renderMultipleSchedules(year, _month, day)}
                          {renderSchedules(year, _month, day)}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {isPopupVisible && (
            <div className={CSS.popup}>
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
                        <MiniCalendar
                          changeMonth={(direction) => changeMiniMonth(true, direction)}
                          selectDay={(day) => selectMiniDay(true, day)}
                          isStart={true}
                          currentDate={today}
                          startDate={editScheduleStateStartDate}
                          endDate={editScheduleStateEndDate}
                          monthNames={monthNames}
                          dayOfWeek={dayOfWeek}
                          monthDays={monthDays}
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
                          <MiniCalendar
                            changeMonth={(direction) => changeMiniMonth(false, direction)}
                            selectDay={(day) => selectMiniDay(false, day)}
                            isStart={false}
                            currentDate={today}
                            startDate={editScheduleStateStartDate}
                            endDate={editScheduleStateEndDate}
                            monthNames={monthNames}
                            dayOfWeek={dayOfWeek}
                            monthDays={monthDays}
                          />
                        )}
                      </span>
                    </>
                  )}
                </h5>

                <div style={{ height: "100%" }}>
                  <button type="button" onClick={closePopup}>
                    <Image src={IconClose} width={12} height={12} alt="X" />
                  </button>
                </div>
              </div>

              <div className={CSS.content}>
                {!isEditSchedule ? (
                  renderPopupSchedules()
                ) : (
                  <>
                    <ul>
                      {Object.entries(editSchedule).map(([key, value], idx) => {
                        const isKeyInSchedulePopupTitle: boolean = key in editScheduleTitle;

                        if (!isKeyInSchedulePopupTitle) return null;

                        return (
                          <li key={idx}>
                            <ul>
                              <li>{`${editScheduleTitle[key as keyof IEditScheduleTitle]}`}</li>
                              <li>{renderPopupInputs(key, value)}</li>
                            </ul>
                          </li>
                        );
                      })}
                    </ul>

                    <div className={CSS.btnBox} style={{ justifyContent: isCreateSchedule ? "center" : "space-between" }}>
                      <button type="button" onClick={isCreateSchedule ? createSchedule : updateSchedule} disabled={isPopupStateEmpty}>
                        <Image src={isCreateSchedule ? IconPlus : IconEditMain} height={24} alt={isCreateSchedule ? "+" : "Update"} />
                      </button>

                      {!isCreateSchedule && (
                        <button type="button" onClick={deleteSchedule}>
                          <Image src={IconDeleteMain} height={24} alt="Delete" />
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
