"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import CSS from "./Calendar.module.css";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { setScheduleCategories, IIIScheduleCategory } from "@redux/slices/ScheduleCategoriesSlice";

import { IIUser } from "@models/User";
import { IISchedule, ISchedule } from "@models/Schedule";
import { IScheduleCategory } from "@models/ScheduleCategory";

import { convertDate } from "@utils/Utils";

import IconPrevWhite from "@public/img/common/icon_less_than_white.svg";
import IconNextWhite from "@public/img/common/icon_greater_than_white.svg";
import IconPrevBlack from "@public/img/common/icon_less_than_black.svg";
import IconNextBlack from "@public/img/common/icon_greater_than_black.svg";
import IconTriangle from "@public/img/common/icon_down_triangle_black.svg";
import IconPlus from "@public/img/common/icon_plus_white.svg";
import IconDelete from "@public/img/common/icon_delete_white.svg";
import IconEdit from "@public/img/common/icon_edit_white.svg";
import IconExpand from "@public/img/common/icon_expand_white.svg";
import IconCollapse from "@public/img/common/icon_collapse_white.svg";

interface IScheduleTitle extends ISchedule {
  categories: string;
  isRepeating: string;
}

export default function Calendar() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.authReducer);
  const scheduleCategories = useSelector((state: RootState) => state.scheduleCategoriesreducer);

  const today: Date = new Date();
  const currentYear: number = today.getFullYear();
  const currentMonth: number = today.getMonth();
  const currentDay: number = today.getDate();

  const monthNames: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const dayOfWeek: string[] = ["일", "월", "화", "수", "목", "금", "토"];

  const scheduleTitle: IScheduleTitle = {
    user: "사용자",
    title: "일정 이름",
    categories: "카테고리",
    content: "내용",
    isRepeating: "반복 여부",
  };

  const scheduleInitialState: IISchedule = {
    date: today,
    user: "",
    title: "",
    categories: [],
    content: "",
    isRepeating: false,
  };

  const categoryInitialState: IScheduleCategory = {
    title: "",
    color: "#000000",
    createdBy: user._id,
  };

  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [day, setDay] = useState<number>(currentDay);

  const [isYear, setIsYear] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isUserListOpen, setIsUserListOpen] = useState<boolean>(false);
  const [isCategoryListOpen, setIsCategoryListOpen] = useState<boolean>(false);
  const [isCreateCategory, setIsCreateCategory] = useState<boolean>(false);

  const [newCategory, setNewCategory] = useState<IScheduleCategory>(categoryInitialState);

  const [users, setUsers] = useState<IIUser[]>([]);

  const [categories, setCategories] = useState<IIIScheduleCategory[]>([]);

  const [newScheduleState, setNewScheduleState] = useState<IISchedule>({
    ...scheduleInitialState,
    user: user._id,
  });

  const years: number[] = Array.from({ length: 12 }, (_, idx) => year - 5 + idx);
  const monthDays: number[] = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const firstDayOfMonth: number = new Date(year, month, 1).getDay();

  const prevMonthDays: number = month - 1 < 0 ? monthDays[11] : monthDays[month - 1];

  const monthDaysWithPrevLastWeek: number = monthDays[month] + firstDayOfMonth;
  const totalDays: number = monthDaysWithPrevLastWeek + (7 - (monthDaysWithPrevLastWeek % 7));

  const isPopupStateEmpty = Object.values(newScheduleState).some((value) => value === "" || (Array.isArray(value) && value.length === 0));

  useEffect(() => {
    getUsers();
    getCategories();
  }, []);

  useEffect(() => {
    checkSelectedCategory();
  }, [scheduleCategories.values]);

  useEffect(() => {
    setNewScheduleState((prev) => ({
      ...scheduleInitialState,
      date: prev.date,
      user: prev.user,
    }));
  }, [newScheduleState.user]);

  useEffect(() => {
    setCategories(scheduleCategories.values.filter((category) => category.createdBy === newScheduleState.user));
  }, [scheduleCategories.values, newScheduleState.user]);

  useEffect(() => {
    setNewScheduleState((prev) => ({
      ...prev,
      date: new Date(year, month, day),
    }));
  }, [day]);

  const showPopupInput = (key: string, value: any): any => {
    switch (key) {
      case "user":
        return (
          <>
            <button type="button" onClick={toggleUserList} disabled={user.accessLevel < 3}>
              <span>{users.find((_user) => _user._id === value)?.nickname}</span>

              <Image src={IconTriangle} width={9} alt="▼" />
            </button>

            {isUserListOpen && (
              <ul>
                {users.map((_user, idx) => (
                  <li key={idx}>
                    <button type="button" onClick={() => selectUser(_user)}>
                      {_user.nickname}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        );
      case "title":
      case "content":
        return <input type="text" value={value} onChange={(e) => handlePopupText(key, e)} placeholder="입력해주세요." />;
      case "categories":
        return (
          <>
            <button type="button" onClick={toggleCategory}>
              {value.length > 0
                ? value.map((category: IIIScheduleCategory, idx: number) => <span key={idx}>{category.title}</span>)
                : "선택된 카테고리가 없습니다."}

              <Image src={IconTriangle} width={9} alt="▼" />
            </button>

            {isCategoryListOpen && (
              <ul>
                {categories.length > 0 &&
                  categories.map((category, idx) => (
                    <li key={idx}>
                      <button type="button" onClick={() => selectCategory(category)}>
                        {category.title}
                      </button>

                      <button type="button" onClick={() => console.log("Edit Category")}>
                        <Image src={IconEdit} height={12} alt="Edit" />
                      </button>

                      <button type="button" onClick={() => deleteCategory(category._id)}>
                        <Image src={IconDelete} height={12} alt="Delete" />
                      </button>
                    </li>
                  ))}

                {isCreateCategory && (
                  <li>
                    <input type="color" value={newCategory.color} onChange={handleCreateCategoryColor} />
                    <input type="text" value={newCategory.title} onChange={handleCreateCategoryTitle} placeholder="카테고리 이름" />

                    <button type="button" onClick={createCategory}>
                      <Image src={IconPlus} width={12} height={12} alt="+" />
                    </button>
                  </li>
                )}

                <li>
                  <button type="button" onClick={toggleCreateCategory}>
                    <Image src={!isCreateCategory ? IconExpand : IconCollapse} width={12} alt="▼" />
                  </button>
                </li>
              </ul>
            )}
          </>
        );
      case "isRepeating":
        return (
          <>
            <input type="radio" name="isRepeating" value="repeat" checked={newScheduleState.isRepeating} onChange={handleRepeating} />
            <input type="radio" name="isRepeating" value="noRepeat" checked={!newScheduleState.isRepeating} onChange={handleRepeating} />
          </>
        );
    }
  };

  const handleCreateCategoryTitle = (e: any) => {
    setNewCategory((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleCreateCategoryColor = (e: any) => {
    setNewCategory((prev) => ({
      ...prev,
      color: e.target.value,
    }));
  };

  const handlePopupText = (key: string, e: any) => {
    setNewScheduleState((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleRepeating = (e: any) => {
    setNewScheduleState((prev) => ({
      ...prev,
      isRepeating: e.target.value === "repeat" ? true : false,
    }));
  };

  const checkSelectedCategory = (): void => {
    const categoriesSet = new Set(scheduleCategories.values);
    const selectedCategory = newScheduleState.categories;

    const filteredSelectedCategory = selectedCategory.filter((category) => categoriesSet.has(category));

    setNewScheduleState((prev) => ({
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

        break;
      case "next":
        if (month < 11) setMonth((prev) => prev + 1);

        break;
    }
  };

  const selectYear = (year: number): void => {
    setYear(year);
  };

  const selectMonth = (idx: number): void => {
    setMonth(idx);
  };

  const selectDay = (_day: number): void => {
    setDay(_day);
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

  const toggleUserList = (): void => {
    setIsUserListOpen((prev) => !prev);
  };

  const selectUser = (_user: IIUser): void => {
    setNewScheduleState((prev) => ({
      ...prev,
      user: _user._id,
    }));

    setIsUserListOpen(false);
    setIsCategoryListOpen(false);
  };

  const toggleCategory = (): void => {
    setIsCreateCategory(false);
    setIsCategoryListOpen((prev) => !prev);
  };

  const selectCategory = (category: IIIScheduleCategory): void => {
    const prevCategories = newScheduleState.categories;

    const idx = prevCategories.findIndex((_category) => _category.title === category.title);

    if (idx !== -1) prevCategories.splice(idx, 1);
    else prevCategories.push(category);

    setNewScheduleState((prev) => ({
      ...prev,
      categories: prevCategories,
    }));
  };

  const toggleCreateCategory = (): void => {
    setIsCreateCategory((prev) => !prev);
  };

  const getUsers = () => {
    fetch("/api/auth/get_users_with_high_access_level")
      .then((res) => {
        if (res.ok) return res.json();

        alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((users) => setUsers(users))
      .catch((err) => console.error("Get Users :", err));
  };

  const getCategories = () => {
    fetch("/api/calendar/categories_management")
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((_categories) => dispatch(setScheduleCategories(_categories)))
      .catch((err) => console.error("Get Users :", err));
  };

  const deleteCategory = (_id: string) => {
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

  const createCategory = () => {
    setIsCreateCategory(false);

    if (categories.some((category) => category.title === newCategory.title)) return alert("이미 있는 카테고리입니다.");

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
        setNewCategory(categoryInitialState);

        alert("일정 카테고리 추가에 성공하였습니다.");
      })
      .catch((err) => console.error("Create Category :", err));
  };

  const createSchedule = (): void => {
    fetch("/api/calendar/schedule_management", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newScheduleState),
    })
      .then((res) => {
        if (res.ok) return res.json();

        alert("오류가 발생했습니다. 지속된다면 관리자에게 문의를 넣어주세요.");

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((data) => {
        console.log(data.msg);

        setNewScheduleState({
          ...scheduleInitialState,
          user: user._id,
        });
        setIsPopupVisible(false);
        setIsCategoryListOpen(false);

        alert("일정 추가에 성공하였습니다.");
      })
      .catch((err) => console.error("Create Schedule :", err));
  };

  return (
    <div className={CSS.calendar}>
      <div className={CSS.subBox}>
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

        <ul className={CSS.content}>
          {!isYear
            ? monthNames.map((monthName, idx) => (
                <li key={idx}>
                  <button type="button" onClick={() => selectMonth(idx)} className={idx === month ? CSS.selected : undefined}>
                    <h6>{monthName}</h6>
                  </button>
                </li>
              ))
            : years.map((_year, idx) => (
                <li key={idx}>
                  <button type="button" onClick={() => selectYear(_year)} className={year === _year ? CSS.selected : undefined}>
                    <h6>{_year}</h6>
                  </button>
                </li>
              ))}
        </ul>
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

        <div className={CSS.content}>
          <ul className={CSS.daysOfWeek}>
            {dayOfWeek.map((day, idx) => (
              <li key={idx}>
                <h6>{day}</h6>
              </li>
            ))}
          </ul>

          <ul className={CSS.days}>
            {Array.from({ length: totalDays }, (_, idx) => {
              const _day: number = idx + 1 - firstDayOfMonth;

              return (
                <li key={idx}>
                  {idx < firstDayOfMonth ? (
                    <span className={CSS.disabled}>{prevMonthDays - (firstDayOfMonth - (idx + 1))}</span>
                  ) : idx + 1 > monthDaysWithPrevLastWeek ? (
                    <span className={CSS.disabled}>{`${idx + 1 - monthDaysWithPrevLastWeek}`}</span>
                  ) : (
                    <button type="button" onClick={() => selectDay(_day)}>
                      <span className={year === currentYear && month === currentMonth && _day === currentDay ? CSS.today : undefined}>{_day}</span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {isPopupVisible && (
          <div className={CSS.popup}>
            <div className={CSS.header}>
              <h5>{convertDate(year, month + 1, day, "-")}</h5>
            </div>

            <ul className={CSS.content}>
              {Object.entries(newScheduleState).map(
                ([key, value], idx) =>
                  key !== "date" && (
                    <li key={idx}>
                      <ul>
                        <li>{`${scheduleTitle[key as keyof IScheduleTitle]}`}</li>
                        <li>{showPopupInput(key, value)}</li>
                      </ul>
                    </li>
                  )
              )}
            </ul>

            <button type="button" onClick={createSchedule} disabled={isPopupStateEmpty}>
              일정 추가
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
