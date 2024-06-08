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
import IconPrevGray from "@public/img/common/icon_less_than_gray.svg";
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

interface IEditScheduleTitle extends ISchedule {
  categories: string;
  isRepeating: string;
}

interface IConvertedSchedules extends IIISchedule {
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
}

export default function Calendar() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.authReducer);
  const calendar = useSelector((state: RootState) => state.calendarReducer);

  const today: Date = new Date();
  const currentYear: number = today.getFullYear();
  const currentMonth: number = today.getMonth();
  const currentDay: number = today.getDate();

  const monthNames: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const dayOfWeek: string[] = ["일", "월", "화", "수", "목", "금", "토"];

  const siderbarWidth = 250;
  const startYear = 2023;
  const MaximumSelectableYear = 100;

  const editScheduleTitle: IEditScheduleTitle = {
    user: "사용자",
    title: "일정 이름",
    categories: "카테고리",
    content: "내용",
    isRepeating: "반복 여부",
  };

  const editScheduleInitialState: IISchedule = {
    date: [today, today],
    isSingleDate: false,
    user: "",
    title: "",
    categories: [],
    content: "",
    isRepeating: false,
  };

  const newCategoryInitialState: IScheduleCategory = {
    title: "",
    color: "#000000",
    createdBy: user._id,
  };

  const siderbarRef = useRef<HTMLUListElement>(null);

  const yearRefs = useRef<HTMLLIElement[]>([]);

  const calendarRef = useRef<HTMLDivElement>(null);

  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [calendarHeight, setCalendarHeight] = useState<number>(0);

  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");

  const [isYear, setIsYear] = useState<boolean>(false);
  const [isSiderbarOpen, setIsSiderbarOpen] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isUserListOpen, setIsUserListOpen] = useState<boolean>(false);
  const [isCategoryListOpen, setIsCategoryListOpen] = useState<boolean>(false);
  const [isCreateCategory, setIsCreateCategory] = useState<boolean>(false);
  const [isEditSchedule, setIsEditSchedule] = useState<boolean>(false);
  const [isMiniCalendarOpen, setIsEndDateListOpen] = useState<boolean>(false);
  const [isCreateSchedule, setIsCreateSchedule] = useState<boolean>(false);

  const [editCategories, setEditCategories] = useState<IIScheduleCategory[]>([]);
  const [userCategories, setUserCategories] = useState<IIScheduleCategory[]>([]);

  const [newCategory, setNewCategory] = useState<IScheduleCategory>(newCategoryInitialState);

  const [users, setUsers] = useState<IIUser[]>([]);

  const [convertedSchedules, setConvertedSchedules] = useState<IConvertedSchedules[]>([]);
  const [multipleSchedules, setMultipleSchedules] = useState<IConvertedSchedules[]>([]);

  const [editScheduleState, setEditScheduleState] = useState<IISchedule>({
    ...editScheduleInitialState,
    user: user._id,
  });

  const years: number[] = Array.from({ length: MaximumSelectableYear }, (_, idx) => startYear + idx);
  const monthDays: number[] = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const firstDayOfMonth: number = new Date(year, month, 1).getDay();
  const prevMonthDays: number = month - 1 < 0 ? monthDays[11] : monthDays[month - 1];
  const monthDaysWithPrevLastWeek: number = monthDays[month] + firstDayOfMonth;
  const fillRemainingDays: number = monthDaysWithPrevLastWeek % 7;
  const totalDays: number = fillRemainingDays === 0 ? monthDaysWithPrevLastWeek : monthDaysWithPrevLastWeek + (7 - fillRemainingDays);

  const editScheduleStateStartDate: Date = editScheduleState.date[0];
  const editScheduleStateStartMonth: number = editScheduleStateStartDate.getMonth();

  const editScheduleStateEndDate: Date = editScheduleState.date[1];
  const editScheduleStateEndYear: number = editScheduleStateEndDate.getFullYear();
  const editScheduleStateEndMonth: number = editScheduleStateEndDate.getMonth();

  const miniFirstDayOfMonth: number = new Date(editScheduleStateEndYear, editScheduleStateEndMonth, 1).getDay();
  const miniPrevMonthDays: number = editScheduleStateEndMonth - 1 < 0 ? monthDays[11] : monthDays[editScheduleStateEndMonth - 1];
  const miniMonthDaysWithPrevLastWeek: number = monthDays[editScheduleStateEndMonth] + miniFirstDayOfMonth;
  const miniFillRemainingDays: number = miniMonthDaysWithPrevLastWeek % 7;
  const miniTotalDays: number = miniFillRemainingDays === 0 ? miniMonthDaysWithPrevLastWeek : miniMonthDaysWithPrevLastWeek + (7 - miniFillRemainingDays);

  const isPopupStateEmpty: boolean = Object.values(editScheduleState).some((value) => value === "" || (Array.isArray(value) && value.length === 0));

  const activeMultipleSchedules: string[] = [];

  useEffect(() => {
    getUsers();
    getSchedules();
    getCategories();
  }, []);

  useEffect(() => {
    convertSchedules();
  }, [calendar.schedules]);

  useEffect(() => {
    checkSelectedCategory();
  }, [calendar.categories]);

  useEffect(() => {
    setUserCategories(calendar.categories.filter((category) => category.createdBy === editScheduleState.user));
  }, [calendar.categories, editScheduleState.user]);

  useEffect(() => {
    if (calendarRef.current) {
      const updatedCalendarHeight = () => {
        setCalendarHeight(calendarRef.current?.offsetHeight || 0);
      };

      updatedCalendarHeight();

      const observer = new MutationObserver(updatedCalendarHeight);
      observer.observe(calendarRef.current, { childList: true, subtree: true });
    }
  }, [calendarRef]);

  useEffect(() => {
    if (isYear) moveSelectedYear(year, year - startYear);
  }, [isYear]);

  useEffect(() => {
    getSchedules();
  }, [year, month]);

  useEffect(() => {
    if (!isEditSchedule) {
      setEditScheduleState((prev) => ({
        ...editScheduleInitialState,
        user: user._id,
        date: [prev.date[0], prev.date[0]],
      }));

      setNewCategory(newCategoryInitialState);

      setIsUserListOpen(false);
      setIsCategoryListOpen(false);
      setIsCreateCategory(false);
    }
  }, [isEditSchedule]);

  useEffect(() => {
    const body = document.body;

    if (isPopupVisible) body.style.overflow = "hidden";
    else body.style.overflow = "auto";

    return () => {
      body.style.overflow = "auto";
    };
  }, [isPopupVisible]);

  const renderMultipleSchedules = (_year: number, _month: number, day: number): JSX.Element | null => {
    const matchingSchedule = multipleSchedules.find((schedule) => {
      const { startYear, startMonth, startDay, endYear, endMonth, endDay } = schedule;

      const date = new Date(_year, _month - 1, day);

      const convertedStartDate = new Date(startYear, startMonth, startDay);
      const convertedEndDate = new Date(endYear, endMonth, endDay);

      return new Date(convertedStartDate) <= date && date <= new Date(convertedEndDate);
    });

    console.log(`${_year}-${_month}-${day}`, matchingSchedule);

    return multipleSchedules.length > 0 ? <span></span> : null;
  };

  const renderSchedules = (_year: number, _month: number, day: number): JSX.Element | null => {
    const schedules = findScheduleByDate(_year, _month, day);

    return schedules.length > 0 ? (
      <span className={CSS.scheduleCovers}>
        {schedules.map((schedule, idx) =>
          idx < 2 ? (
            <p key={idx} className={CSS.schedules}>
              <span className={CSS.multiple}>
                {schedule.categories.map((category, _idx) =>
                  _idx < 2 ? <span key={`${idx}-${_idx}`} style={{ background: category.color }}></span> : _idx < 3 && "..."
                )}
              </span>

              <span className={CSS.truncated}>{schedule.title}</span>
            </p>
          ) : (
            idx < 3 && <p key={idx}>...</p>
          )
        )}
      </span>
    ) : null;
  };

  const renderPopupSchedules = (): JSX.Element => {
    const selectedDate = new Date(editScheduleStateStartDate);

    const schedules = findScheduleByDate(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    return schedules.length > 0 ? (
      <ul className={CSS.schedules}>
        {schedules.map((schedule, idx) => (
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

  const renderCategories = (category: IIScheduleCategory, idx: number): JSX.Element => {
    const isSelected = editScheduleState.categories.find((_category) => _category._id === category._id);

    return (
      <li key={idx} className={isSelected ? `${CSS.selectedList} ${CSS.list}` : CSS.list}>
        <button type="button" onClick={() => selectCategory(category)} className={CSS.truncated}>
          <span>{category.title}</span>
        </button>

        <button type="button" onClick={() => toggleEditCategory(category)}>
          <Image src={isSelected ? IconEditWhite : IconEditMain} height={12} alt="Edit" />
        </button>

        <button type="button" onClick={() => deleteCategory(category._id)}>
          <Image src={isSelected ? IconDeleteWhite : IconDeleteMain} height={12} alt="Delete" />
        </button>
      </li>
    );
  };

  const renderPopupInputs = (key: string, value: any): JSX.Element | null => {
    switch (key) {
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
      case "title":
        return <input type="text" value={value} onChange={(e) => handlePopupText(key, e)} placeholder="입력해주세요." />;
      case "content":
        return <textarea value={value} onChange={(e) => handlePopupText(key, e)} placeholder="입력해주세요." style={{ height: 100 }} />;
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
      case "isRepeating":
        return (
          <>
            <input type="radio" id="repeating" name="isRepeating" value="repeating" checked={editScheduleState.isRepeating} onChange={handleRepeating} />
            <label htmlFor="repeating" className={editScheduleState.isRepeating ? CSS.repeating : undefined}>
              반복
            </label>

            <input type="radio" id="nonrepeating" name="isRepeating" value="nonrepeating" checked={!editScheduleState.isRepeating} onChange={handleRepeating} />
            <label htmlFor="nonrepeating" className={!editScheduleState.isRepeating ? CSS.repeating : undefined}>
              반복 안함
            </label>
          </>
        );
      default:
        return null;
    }
  };

  const handleEditCategoryColorTitle = (e: any, key: "color" | "title", _id: string): void => {
    const tempCategories: IIScheduleCategory[] = [...userCategories];

    const categoryIdx: number = userCategories.findIndex((category) => category._id === _id);

    if (categoryIdx !== -1) {
      const updatedCategory: IIScheduleCategory = {
        ...userCategories[categoryIdx],
        [key]: e.target.value,
      } as IIScheduleCategory;

      tempCategories[categoryIdx] = updatedCategory;

      setUserCategories(tempCategories);
    }
  };

  const handleCreateCategoryColor = (e: any): void => {
    setNewCategory((prev) => ({
      ...prev,
      color: e.target.value,
    }));
  };

  const handleCreateCategoryTitle = (e: any): void => {
    setNewCategory((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handlePopupText = (key: string, e: any): void => {
    setEditScheduleState((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleRepeating = (e: any): void => {
    setEditScheduleState((prev) => ({
      ...prev,
      isRepeating: e.target.value === "repeating" ? true : false,
    }));
  };

  const findScheduleByDate = (_year: number, _month: number, day: number): IConvertedSchedules[] => {
    return convertedSchedules.filter(
      (schedule) =>
        schedule.isSingleDate &&
        ((schedule.startYear === _year && schedule.startMonth === _month && schedule.startDay === day) ||
          (schedule.endYear === _year && schedule.endMonth === _month && schedule.endDay === day))
    );
  };

  const toggleSiderbar = (): void => {
    setIsSiderbarOpen((prev) => !prev);
  };

  const convertSchedules = (): void => {
    const tempSchedules: IConvertedSchedules[] = calendar.schedules.map((schedule) => {
      const startDate = new Date(schedule.date[0]);
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

    const tempMultipleSchedules: IConvertedSchedules[] = tempSchedules.filter((schedule) => schedule.isSingleDate === false);

    setMultipleSchedules(tempMultipleSchedules);
  };

  const checkSelectedCategory = (): void => {
    const categoriesSet: Set<string> = new Set(calendar.categories.map((category) => category._id));
    const selectedCategory: IIScheduleCategory[] = editScheduleState.categories;

    const filteredSelectedCategory: IIScheduleCategory[] = selectedCategory.filter((category) => categoriesSet.has(category._id));

    setEditScheduleState((prev) => ({
      ...prev,
      categories: filteredSelectedCategory,
    }));
  };

  const changeYear = (direction: string): void => {
    switch (direction) {
      case "prev":
        setYear((prev) => prev - 1);

        break;
      case "next":
        setYear((prev) => prev + 1);

        break;
    }
  };

  const changeMonth = (direction: string): void => {
    switch (direction) {
      case "prev":
        if (month > 0) setMonth((prev) => prev - 1);
        else {
          setYear((prev) => prev - 1);
          setMonth(11);
        }

        break;
      case "next":
        if (month < 11) setMonth((prev) => prev + 1);
        else {
          setYear((prev) => prev + 1);
          setMonth(0);
        }

        break;
    }
  };

  const selectYear = (_year: number, idx: number): void => {
    setYear(_year);

    moveSelectedYear(_year, idx);
  };

  const moveSelectedYear = (_year: number, idx: number): void => {
    if (siderbarRef.current && yearRefs.current[idx]) {
      const siderbarHeight: number = siderbarRef.current.clientHeight;
      const selectedYearHeight: number = yearRefs.current[idx].clientHeight;
      const selectedYearOffsetTop: number = yearRefs.current[idx].offsetTop;

      const scrollTop: number = selectedYearOffsetTop - siderbarHeight / 2 + selectedYearHeight / 2;
      siderbarRef.current.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  const selectMonth = (idx: number): void => {
    setMonth(idx);
  };

  const selectDay = (_year: number, _month: number, day: number): void => {
    const selectedDay = new Date(_year, _month, day);

    setEditScheduleState((prev) => ({
      ...prev,
      date: [selectedDay, selectedDay],
    }));

    setIsEditSchedule(false);
    setIsPopupVisible(true);
  };

  const toggleYearMonth = (type: string): void => {
    switch (type) {
      case "year":
        setIsYear(true);

        break;
      case "month":
        setIsYear(false);

        break;
    }
  };

  const closePopup = (): void => {
    setIsPopupVisible(false);
  };

  const selectedSchedule = (schedule: IConvertedSchedules): void => {
    setSelectedScheduleId(schedule._id);

    const startDate = new Date(schedule.startYear, schedule.startMonth, schedule.startDay);
    const endDate = new Date(schedule.endYear, schedule.endMonth, schedule.endDay);

    setEditScheduleState({
      ...schedule,
      user: (schedule.user as IIUser)._id,
      date: [startDate, endDate],
    });

    setNewCategory((prev) => ({
      ...prev,
      createdBy: (schedule.user as IIUser)._id,
    }));

    setIsCreateSchedule(false);
    setIsEditSchedule(true);
  };

  const toggleUserList = (): void => {
    setIsUserListOpen((prev) => !prev);
  };

  const selectUser = (_user: IIUser): void => {
    if (isCreateSchedule) {
      setEditScheduleState((prev) => ({
        ...editScheduleInitialState,
        date: prev.date,
        user: _user._id,
      }));
    } else {
      setEditScheduleState((prev) => ({
        ...prev,
        user: _user._id,
        categories: [],
      }));
    }

    setNewCategory({
      ...newCategoryInitialState,
      createdBy: _user._id,
    });

    setIsUserListOpen(false);
    setIsCategoryListOpen(false);
    setEditCategories([]);
  };

  const toggleCategory = (): void => {
    setIsCreateCategory(false);
    setEditCategories([]);
    setIsCategoryListOpen((prev) => !prev);
  };

  const selectCategory = (category: IIScheduleCategory): void => {
    const tempCategories: IIScheduleCategory[] = editScheduleState.categories;

    const selectedIdx: number = tempCategories.findIndex((_category) => _category.title === category.title);

    let newCategories: IIScheduleCategory[] = [];

    if (selectedIdx !== -1) newCategories = tempCategories.filter((_category, idx) => idx !== selectedIdx);
    else newCategories = [...tempCategories, category];

    setEditScheduleState((prev) => ({
      ...prev,
      categories: newCategories,
    }));
  };

  const toggleEditCategory = (category: IIScheduleCategory): void => {
    const tempCategories: IIScheduleCategory[] = [...userCategories];
    const tempEditCategories: IIScheduleCategory[] = [...editCategories];

    const categoryIdx: number = tempCategories.findIndex((_category) => _category._id === category._id);
    const existingIdx: number = tempEditCategories.findIndex((_category) => _category._id === category._id);

    if (existingIdx !== -1) {
      const rollbackCategory: IIScheduleCategory = {
        ...tempEditCategories[existingIdx],
      } as IIScheduleCategory;

      tempCategories[categoryIdx] = rollbackCategory;

      setUserCategories(tempCategories);

      tempEditCategories.splice(existingIdx, 1);
    } else tempEditCategories.push(category);

    setEditCategories(tempEditCategories);
  };

  const toggleCreateCategory = (): void => {
    setIsCreateCategory((prev) => !prev);
  };

  const toggleCreateSchedule = (): void => {
    if (!isEditSchedule) setIsCreateSchedule(true);
    setIsEditSchedule((prev) => !prev);
  };

  const toggleDateMode = (): void => {
    setIsEndDateListOpen((prev) => !prev);
  };

  const changeMiniMonth = (direction: string): void => {
    const endDate = editScheduleStateEndDate;

    let endYear = endDate.getFullYear();
    let endMonth = endDate.getMonth();

    switch (direction) {
      case "prev":
        if (endMonth > 0) endMonth--;
        else {
          endYear--;
          endMonth = 11;
        }

        break;
      case "next":
        if (endMonth < 11) endMonth++;
        else {
          endYear++;
          endMonth = 0;
        }

        break;
    }

    const newEndDate = new Date(endYear, endMonth, 1);

    setEditScheduleState((prev) => ({
      ...prev,
      date: [prev.date[0], newEndDate],
    }));
  };

  const selectMiniDay = (date: Date) => {
    setEditScheduleState((prev) => ({
      ...prev,
      date: [prev.date[0], date],
    }));

    setIsEndDateListOpen(false);
  };

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

  const getCategories = (): void => {
    fetch("/api/calendar/categories_management")
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((_categories) => dispatch(setScheduleCategories(_categories)))
      .catch((err) => console.error("Get Categories :", err));
  };

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

  const createCategory = (): void => {
    setIsCreateCategory(false);

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

  const createSchedule = (): void => {
    fetch("/api/calendar/schedules_management", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editScheduleState),
    })
      .then((res) => {
        if (res.ok) return res.json();

        alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        setEditScheduleState((prev) => ({
          ...editScheduleInitialState,
          date: prev.date,
          user: user._id,
        }));

        getSchedules();

        alert("일정 추가에 성공하였습니다.");
      })
      .catch((err) => console.error("Create Schedule :", err));
  };

  const updateSchedule = (): void => {
    fetch("/api/calendar/schedules_management", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editScheduleState),
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
                const isPrevMonth = idx < firstDayOfMonth;
                const isNextMonth = idx + 1 > monthDaysWithPrevLastWeek;

                const day: number = isPrevMonth
                  ? prevMonthDays - (firstDayOfMonth - (idx + 1))
                  : isNextMonth
                  ? idx + 1 - monthDaysWithPrevLastWeek
                  : idx + 1 - firstDayOfMonth;

                const _month = isPrevMonth ? month - 1 : isNextMonth ? month + 1 : month;

                return (
                  <li key={idx}>
                    <button type="button" onClick={() => selectDay(year, _month, day)} className={CSS.content}>
                      <span
                        className={
                          isPrevMonth
                            ? CSS.subDate
                            : isNextMonth
                            ? CSS.subDate
                            : year === currentYear && month === currentMonth && day === currentDay
                            ? CSS.today
                            : undefined
                        }
                      >
                        {day}
                      </span>

                      {renderMultipleSchedules(year, _month, day)}

                      {renderSchedules(year, _month, day)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {isPopupVisible && (
            <div className={CSS.popup}>
              {isMiniCalendarOpen && (
                <div className={CSS.popupBackground}>
                  <button type="button" onClick={toggleDateMode}></button>
                </div>
              )}

              <div className={CSS.header}>
                {isEditSchedule && (
                  <button type="button" onClick={toggleCreateSchedule}>
                    <Image src={IconPrevBlack} width={12} alt="<" />
                  </button>
                )}

                <h5>
                  {convertDateII(editScheduleStateStartDate, "-")}

                  {isEditSchedule && (
                    <>
                      &nbsp;~&nbsp;
                      <button type="button" onClick={toggleDateMode}>
                        <span>{convertDateII(editScheduleStateEndDate, "-")}</span>

                        <Image src={isMiniCalendarOpen ? IconUpTriangle : IconDownTriangle} width={9} alt={isMiniCalendarOpen ? "▲" : "▼"} />
                      </button>
                      {isMiniCalendarOpen && (
                        <div className={CSS.miniCalendar}>
                          <ul className={CSS.header}>
                            <li>
                              <button
                                type="button"
                                onClick={() => changeMiniMonth("prev")}
                                disabled={!(editScheduleStateStartMonth < editScheduleStateEndMonth)}
                              >
                                <Image src={editScheduleStateStartMonth < editScheduleStateEndMonth ? IconPrevBlack : IconPrevGray} height={15} alt="Prev" />
                              </button>
                            </li>

                            <li>
                              <h5>{monthNames[editScheduleStateEndMonth]}</h5>
                            </li>

                            <li>
                              <button type="button" onClick={() => changeMiniMonth("next")}>
                                <Image src={IconNextBlack} height={15} alt="Next" />
                              </button>
                            </li>
                          </ul>

                          <div className={CSS.content}>
                            <ul className={CSS.daysOfWeek}>
                              {dayOfWeek.map((day, idx) => (
                                <li key={idx}>
                                  <h6>{day}</h6>
                                </li>
                              ))}
                            </ul>

                            <ul className={CSS.days}>
                              {Array.from({ length: miniTotalDays }, (_, idx) => {
                                const isPrevMonth = idx < miniFirstDayOfMonth;
                                const isNextMonth = idx + 1 > miniMonthDaysWithPrevLastWeek;

                                const day: number = isPrevMonth
                                  ? miniPrevMonthDays - (miniFirstDayOfMonth - (idx + 1))
                                  : isNextMonth
                                  ? idx + 1 - miniMonthDaysWithPrevLastWeek
                                  : idx + 1 - miniFirstDayOfMonth;

                                const _month = isPrevMonth
                                  ? editScheduleStateEndMonth - 1
                                  : isNextMonth
                                  ? editScheduleStateEndMonth + 1
                                  : editScheduleStateEndMonth;

                                const thisDate = new Date(editScheduleStateEndYear, _month, day);

                                const isPrevDate = editScheduleStateStartDate > thisDate;

                                return (
                                  <li key={idx}>
                                    <button
                                      type="button"
                                      onClick={() => selectMiniDay(thisDate)}
                                      className={isPrevDate ? `${CSS.content} ${CSS.disabled}` : CSS.content}
                                      disabled={isPrevDate}
                                    >
                                      <span
                                        className={
                                          isPrevDate
                                            ? CSS.subDate
                                            : isPrevMonth
                                            ? CSS.subDate
                                            : isNextMonth
                                            ? CSS.subDate
                                            : editScheduleStateEndYear === currentYear && editScheduleStateEndMonth === currentMonth && day === currentDay
                                            ? CSS.today
                                            : undefined
                                        }
                                      >
                                        {day}
                                      </span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </h5>

                <button type="button" onClick={closePopup}>
                  <Image src={IconClose} width={12} height={12} alt="X" />
                </button>
              </div>

              <div className={CSS.content}>
                {!isEditSchedule ? (
                  renderPopupSchedules()
                ) : (
                  <>
                    <ul>
                      {Object.entries(editScheduleState).map(([key, value], idx) => {
                        const isKeyInSchedulePopupTitle = key in editScheduleTitle;

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
