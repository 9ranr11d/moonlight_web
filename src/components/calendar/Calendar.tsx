"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import CSS from "./Calendar.module.css";

import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

import { IUser } from "@models/User";

import { convertDate } from "@utils/Util";

import IconPrevWhite from "@public/img/common/icon_less_than_white.svg";
import IconNextWhite from "@public/img/common/icon_greater_than_white.svg";
import IconPrevBlack from "@public/img/common/icon_less_than_black.svg";
import IconNextBlack from "@public/img/common/icon_greater_than_black.svg";
import IconTriangle from "@public/img/common/icon_down_triangle_black.svg";

interface PopupState {
  user: string;
  title: string;
  content: string;
  color: string;
}

interface PopupStateValue extends PopupState {
  category: string[];
  isRepeating: boolean;
}

interface PopupStateTitle extends PopupState {
  category: string;
  isRepeating: string;
}

export default function Calendar() {
  const user = useSelector((state: RootState) => state.authReducer);

  const today: Date = new Date();
  const currentYear: number = today.getFullYear();
  const currentMonth: number = today.getMonth();
  const currentDay: number = today.getDate();

  const monthNames: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const dayOfWeek: string[] = ["일", "월", "화", "수", "목", "금", "토"];

  const popupStateTitle: PopupStateTitle = {
    user: "사용자",
    title: "일정 이름",
    category: "카테고리",
    content: "내용",
    isRepeating: "반복 여부",
    color: "색상",
  };

  const popupInitialState: PopupStateValue = {
    user: user._id,
    title: "",
    category: [],
    content: "",
    isRepeating: false,
    color: "#000000",
  };

  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [day, setDay] = useState<number>(currentDay);

  const [isYear, setIsYear] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isUserListOpen, setIsUserListOpen] = useState<boolean>(false);

  const [users, setUsers] = useState<IUser[]>([]);

  const [popupState, setPopupState] = useState<PopupState>(popupInitialState);

  const years: number[] = Array.from({ length: 12 }, (_, idx) => year - 5 + idx);
  const monthDays: number[] = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const firstDayOfMonth: number = new Date(year, month, 1).getDay();

  const prevMonthDays: number = month - 1 < 0 ? monthDays[11] : monthDays[month - 1];

  const monthDaysWithPrevLastWeek: number = monthDays[month] + firstDayOfMonth;
  const totalDays: number = monthDaysWithPrevLastWeek + (7 - (monthDaysWithPrevLastWeek % 7));

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    fetch("/api/auth/get_users_with_access_level_2")
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data.msg));
      })
      .then((users) => setUsers(users));
  };

  const handleYear = (direction: string): void => {
    switch (direction) {
      case "prev":
        setYear((prev) => prev - 1);

        break;
      case "next":
        setYear((prev) => prev + 1);

        break;
    }
  };

  const switchYearMonth = (type: string): void => {
    switch (type) {
      case "year":
        setIsYear(true);

        break;
      case "month":
        setIsYear(false);

        break;
    }
  };

  const selectedMonth = (idx: number): void => {
    setMonth(idx);
  };

  const selectedYear = (year: number): void => {
    setYear(year);
  };

  const handleMonth = (direction: string): void => {
    switch (direction) {
      case "prev":
        if (month > 0) setMonth((prev) => prev - 1);

        break;
      case "next":
        if (month < 11) setMonth((prev) => prev + 1);

        break;
    }
  };

  const selectDay = (_day: number): void => {
    setDay(_day);
    setIsPopupVisible(true);
  };

  const showPopupInput = (key: string, value: any): any => {
    switch (key) {
      case "user":
        return (
          <>
            <button type="button" onClick={handleUser}>
              <span>{users.find((user) => user._id === value)?.nickname}</span>

              <Image src={IconTriangle} width={9} alt="▼" />
            </button>

            {isUserListOpen && (
              <ul>
                {users.map((user, idx) => (
                  <li key={idx}>
                    <button type="button" onClick={() => selectUser(user)}>
                      {user.nickname}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        );
      case "title":
      case "content":
        return <input type="text" value={value} onChange={(e) => handlePopupText(key, e.target.value)} placeholder="입력해주세요." />;
      case "category":
        return (
          <>
            <button type="button" onClick={handleUser}></button>

            {isUserListOpen && (
              <ul>
                {users.map((user, idx) => (
                  <li key={idx}>
                    <button type="button" onClick={() => selectUser(user)}>
                      {user.nickname}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        );
    }
  };

  const handlePopupText = (key: string, value: string) => {
    setPopupState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  console.log(popupState);

  const handleUser = (): void => {
    setIsUserListOpen(true);
  };

  const selectUser = (user: IUser): void => {
    setPopupState((prev) => ({
      ...prev,
      user: user._id,
    }));

    setIsUserListOpen(false);
  };

  return (
    <div className={CSS.calendar}>
      <div className={CSS.subBox}>
        <ul className={CSS.header}>
          <li>
            <button type="button" onClick={() => (isYear ? handleYear("prev") : handleMonth("prev"))}>
              <Image src={IconPrevWhite} width={24} height={24} alt="Prev" />
            </button>
          </li>

          <li>
            <ul className={CSS.yearMonthToggleBtn}>
              <li>
                <button type="button" onClick={() => switchYearMonth("year")} disabled={isYear}>
                  <h5>{year}</h5>
                </button>
              </li>

              <li>
                <button type="button" onClick={() => switchYearMonth("month")} disabled={!isYear}>
                  <h5>{month + 1}</h5>
                </button>
              </li>
            </ul>
          </li>

          <li>
            <button type="button" onClick={() => (isYear ? handleYear("next") : handleMonth("next"))}>
              <Image src={IconNextWhite} width={24} height={24} alt="Next" />
            </button>
          </li>
        </ul>

        <ul className={CSS.content}>
          {!isYear
            ? monthNames.map((monthName, idx) => (
                <li key={idx}>
                  <button type="button" onClick={() => selectedMonth(idx)} className={idx === month ? CSS.selected : undefined}>
                    <h6>{monthName}</h6>
                  </button>
                </li>
              ))
            : years.map((_year, idx) => (
                <li key={idx}>
                  <button type="button" onClick={() => selectedYear(_year)} className={year === _year ? CSS.selected : undefined}>
                    <h6>{_year}</h6>
                  </button>
                </li>
              ))}
        </ul>
      </div>

      <div className={CSS.mainBox}>
        <ul className={CSS.header}>
          <li>
            <button type="button" onClick={() => handleMonth("prev")}>
              <Image src={IconPrevBlack} width={24} height={24} alt="Prev" />
            </button>
          </li>

          <li>
            <h3>{monthNames[month]}</h3>
          </li>

          <li>
            <button type="button" onClick={() => handleMonth("next")}>
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
              {Object.entries(popupState).map(([key, value], idx) => (
                <li key={idx}>
                  <ul>
                    <li>{popupStateTitle[key as keyof PopupStateTitle]}</li>
                    <li>{showPopupInput(key, value)}</li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
