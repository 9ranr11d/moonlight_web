"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { setSchedules } from "@redux/slices/calendarSlice";
import { hideBackdrop, showBackdrop } from "@redux/slices/backdropSlice";

import { IIUser } from "@interfaces/auth/index";
import { IIISchedule } from "@models/Schedule";

import CSS from "./CalendarView.module.css";

import { DAY_OF_WEEK, MONTH_DAYS, MONTH_NAMES } from "@constants/date";
import { ERR_MSG } from "@constants/msg";

import EventModal from "./EventModal";

import IconPrevBlack from "@public/img/common/icon_less_than_black.svg";
import IconPrevWhite from "@public/img/common/icon_less_than_white.svg";
import IconNextWhite from "@public/img/common/icon_greater_than_white.svg";
import IconNextBlack from "@public/img/common/icon_greater_than_black.svg";
import IconClose from "@public/img/common/icon_close_primary.svg";
import IconCheck from "@public/img/common/icon_check_primary.svg";

/** 일정 표시를 위한 시작 날짜, 종료 날짜를 변환한 일정 Interface */
export interface IConvertedSchedules extends IIISchedule {
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

export default function CalendarView() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 일정 */
  const calendar = useSelector((state: RootState) => state.calendarSlice);
  /** 사용자 정보 */
  const user = useSelector((state: RootState) => state.authSlice);
  /** Backdrop */
  const backdrop = useSelector((state: RootState) => state.backdropSlice);

  /** 오늘 날짜 */
  const today: Date = new Date();
  /** 현재 연도 */
  const currentYear: number = today.getFullYear();
  /** 현재 달 */
  const currentMonth: number = today.getMonth();
  /** 현재 일 */
  const currentDay: number = today.getDate();

  /** 연도, 월 선택 사이드 메뉴 가로 길이  */
  const siderbarWidth = 250;
  /** 시작 년도부터 최대 연도 */
  const MaximumSelectableYear = 12;

  /** 연도, 월 선택 사이드 메뉴 Ref */
  const siderbarRef = useRef<HTMLUListElement>(null);

  /** 사이드 메뉴 연도 Ref */
  // const yearRefs = useRef<HTMLLIElement[]>([]);

  /** 캘린더 Ref */
  const calendarRef = useRef<HTMLDivElement>(null);

  const [lastSelectedDate, setLastSelectedDay] = useState<Date>(today); // 마지막 선택 날짜

  const [year, setYear] = useState<number>(currentYear); // 선택된 연도
  const [month, setMonth] = useState<number>(currentMonth); // 선택된 달
  const [inputYear, setInputYear] = useState<number>(year); // 상단 연도 텍스트 입력 필드 값
  const [inputMonth, setInputMonth] = useState<number>(month); // 상단 달 텍스트 입력 필드 값
  const [calendarHeight, setCalendarHeight] = useState<number>(0); // 캘린더 높이

  const [isYear, setIsYear] = useState<boolean>(false); // 사이드 메뉴에서 연도 선택 상태인지
  const [isSiderbarOpen, setIsSiderbarOpen] = useState<boolean>(false); // 사이드 메뉴 가시 여부
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 일정 추가, 수정 ,삭제 모달 가시 여부
  const [isInputYearMonth, setIsInputYearMonth] = useState<boolean>(false); // 연도 텍스트 입력 필드 가시 여부

  const [users, setUsers] = useState<IIUser[]>([]); // 전체 사용자 목록

  const [convertedSchedules, setConvertedSchedules] = useState<
    IConvertedSchedules[]
  >([]); // 일정 표시를 위해 바꾼 하루짜리 일정들의 정보
  const [multipleSchedules, setMultipleSchedules] = useState<
    IConvertedSchedules[]
  >([]); // 일정 표시를 위해 바꾼 여러날짜리 일정들의 정보

  /** 시작 연도 */
  const startYear = year - MaximumSelectableYear / 2;
  /** 사이드 메뉴의 연도 목록 */
  const years: number[] = Array.from(
    { length: MaximumSelectableYear },
    (_, idx) => startYear + idx
  );

  /** 현재 달의 1일의 요일 */
  const firstDayOfMonth: number = new Date(year, month, 1).getDay();
  /** 이전 달 날짜 수 */
  const prevMonthDays: number =
    month - 1 < 0 ? MONTH_DAYS[11] : MONTH_DAYS[month - 1];
  /** 이전 달 마지막 주와 현재 달의 날짜를 합친 수 */
  const monthDaysWithPrevLastWeek: number = MONTH_DAYS[month] + firstDayOfMonth;
  /** 현재 달 마지막 주에 남은 날짜 수 */
  const fillRemainingDays: number = monthDaysWithPrevLastWeek % 7;
  /** 이전 달, 현재 달, 다음 달 날짜 총합 */
  const totalDays: number =
    fillRemainingDays === 0
      ? monthDaysWithPrevLastWeek
      : monthDaysWithPrevLastWeek + (7 - fillRemainingDays);

  /** 모든 사용자 목록 */
  const getUsers = (): void => {
    fetch("/api/auth/get-users-with-high-access-level")
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(users => setUsers(users))
      .catch(err =>
        console.error(
          "/src/components/calendar/CalendarView > CalendarView() > getUsers()에서 오류가 발생했습니다. :",
          err
        )
      );
  };

  /** 일정 가져오기 */
  const getSchedules = (): void => {
    fetch(
      `/api/calendar/schedules-management/${year}/${month}/${user._id}/${user.coupleCode}`
    )
      .then(res => {
        if (res.ok) return res.json();

        alert(ERR_MSG);

        return res.json().then(data => Promise.reject(data.msg));
      })
      .then(_schedules => dispatch(setSchedules(_schedules)))
      .catch(err =>
        console.error(
          "/src/components/calendar/CalendarView > CalendarView() > getSchedules()에서 오류가 발생했습니다. :",
          err
        )
      );
  };

  /**
   * 연도 텍스트 입력 필드 관리
   * @param e 수정할 내용
   */
  const handleInputYear = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    if (value.length < 5) setInputYear(Number(value));
  };

  /**
   * 달 텍스트 입력 필드 관리
   * @param e 수정할 내용
   */
  const handleInputMonth = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    if (value.length < 4) setInputMonth(Number(value));
  };

  /**
   * 달 텍스트 입력 필드에서 'Enter' 클릭 시
   * @param e 클릭한 키
   */
  const handleInputMonthKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") selectInputYearMonth();
  };

  /** 사이드 메뉴 가시 상태 설정 */
  const toggleSiderbar = (): void => {
    setIsSiderbarOpen(prev => !prev);
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

  /** 연도, 달 텍스트 입력 필드 Toggle */
  const toggleInputYearMonth = (): void => {
    if (!isInputYearMonth) {
      setInputYear(year);
      setInputMonth(month + 1);
    }

    setIsInputYearMonth(prev => !prev);
  };

  /**
   * 연도 변경
   * @param direction 변경 방향
   */
  const changeYear = (direction: "prev" | "next"): void => {
    switch (direction) {
      // 이전 년도로 이동
      case "prev":
        setYear(prev => prev - 1);

        break;
      // 다음 년도로 이동
      case "next":
        setYear(prev => prev + 1);

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
        if (month > 0) setMonth(prev => prev - 1);
        // 1월이면 이전 연도 12월로 이동
        else {
          setYear(prev => prev - 1);
          setMonth(11);
        }

        break;
      // 다음 달로 이동
      case "next":
        if (month < 11) setMonth(prev => prev + 1);
        // 12월이면 다음 연도 1월로 이동
        else {
          setYear(prev => prev + 1);
          setMonth(0);
        }

        break;
    }
  };

  /**
   * 일정 중 해당 날짜가 포함된 시작 날짜와 종료 날짜가 다른 일정들 찾기
   * @param _year 연도
   * @param _month 달
   * @param _day 일
   * @returns 찾은 일정 목록
   */
  const findMultipleScheduleByDate = (
    _year: number,
    _month: number,
    _day: number
  ): IConvertedSchedules[] => {
    return multipleSchedules.filter(schedule => {
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
      }: {
        startYear: number;
        startMonth: number;
        startDay: number;
        endYear: number;
        endMonth: number;
        endDay: number;
      } = schedule;

      /** 시작 날짜 */
      const convertedStartDate: Date = new Date(
        startYear,
        startMonth,
        startDay
      );
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
  const findScheduleByDate = (
    _year: number,
    _month: number,
    _day: number
  ): IConvertedSchedules[] => {
    return convertedSchedules.filter(
      schedule =>
        schedule.isSingleDate &&
        ((schedule.startYear === _year &&
          schedule.startMonth === _month &&
          schedule.startDay === _day) ||
          (schedule.endYear === _year &&
            schedule.endMonth === _month &&
            schedule.endDay === _day))
    );
  };

  /** 일정 표시를 위한 일정들 정보 변환 */
  const convertSchedules = (): void => {
    /** 일정 표시를 위한 형식으로 변환하기 위한 임시 저장 */
    const tempSchedules: IConvertedSchedules[] = calendar.schedules.map(
      schedule => {
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
      }
    );

    setConvertedSchedules(tempSchedules);

    /** 시작 날짜와 종료 날짜가 다른 일정 목록 */
    const tempMultipleSchedules: IConvertedSchedules[] = tempSchedules.filter(
      schedule => schedule.isSingleDate === false
    );

    setMultipleSchedules(tempMultipleSchedules);
  };

  /**
   * 연도 선택
   * @param _year 선택한 연도
   * @param idx 선택한 연도 순번
   */
  // const selectYear = (_year: number, idx: number): void => {
  const selectYear = (_year: number): void => {
    setYear(_year);

    // moveSelectedYear(_year, idx);
  };

  // /**
  //  * 선택한 년도로 사이드 메뉴 스크롤 이동
  //  * @param _year 선택한 연도
  //  * @param idx 선택한 연도 순번
  //  */
  // const moveSelectedYear = (_year: number, idx: number): void => {
  //   // 사이드 메뉴 Ref가 존재하는 지
  //   if (siderbarRef.current && yearRefs.current[idx]) {
  //     /** 사이드 메뉴 높이 */
  //     const siderbarHeight: number = siderbarRef.current.clientHeight;
  //     /** 선택된 연도의 요소 높이 */
  //     const selectedYearHeight: number = yearRefs.current[idx].clientHeight;
  //     /** 선택된 연도의 y좌표 */
  //     const selectedYearOffsetTop: number = yearRefs.current[idx].offsetTop;

  //     /** 스크롤 위치 */
  //     const scrollTop: number = selectedYearOffsetTop - siderbarHeight / 2 + selectedYearHeight / 2;
  //     siderbarRef.current.scrollTo({ top: scrollTop, behavior: "smooth" });
  //   }
  // };

  /**
   * 달 선택
   * @param idx 선택한 달 순번
   */
  const selectMonth = (idx: number): void => {
    setMonth(idx);
  };

  /** 연도, 달 텍스트 입력 필드 '확인' 버튼 클릭 시 */
  const selectInputYearMonth = (): void => {
    if (inputMonth < 1 || inputMonth > 12) {
      alert("1~12월 사이로 작성해주세요.");
      return;
    }

    setYear(inputYear);
    setMonth(inputMonth - 1);

    toggleInputYearMonth();
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

    dispatch(showBackdrop());

    setIsModalVisible(true);
  };

  /** 일정 팝업 닫기 */
  const closeModal = (): void => {
    dispatch(hideBackdrop());

    setIsModalVisible(false);
  };

  /**
   * 시작 날짜와 종료 날짜가 다른 일정 렌더링
   * @param _year 연도
   * @param _month 달
   * @param _day 일
   * @returns 일정
   */
  const renderMultipleSchedules = (
    _year: number,
    _month: number,
    _day: number
  ): JSX.Element | null => {
    /** 렌더링할 날짜 */
    const date: Date = new Date(_year, _month, _day);

    /** 렌더링할 날짜에 있는 시작 날짜와 종료 날짜가 다른 일정들 */
    const matchingSchedule: IConvertedSchedules[] = findMultipleScheduleByDate(
      _year,
      _month,
      _day
    );

    return matchingSchedule.length > 0 ? (
      <>
        {matchingSchedule.map((schedule, idx) => (
          <p
            key={idx}
            className={`${CSS.schedule} ${CSS.multipleSchedules}`}
            style={{ background: schedule.categories[0].color }}
          >
            <span className={CSS.truncated}>
              {date.getTime() === new Date(schedule.date[0]).getTime() ||
              date.getTime() === new Date(schedule.date[1]).getTime()
                ? schedule.title
                : ""}
            </span>
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
  const renderSchedules = (
    _year: number,
    _month: number,
    _day: number
  ): JSX.Element | null => {
    /** 렌더링할 날짜에 있는 시작 날짜와 종료 날짜가 같은 일정들 */
    const schedules: IConvertedSchedules[] = findScheduleByDate(
      _year,
      _month,
      _day
    );

    return schedules.length > 0 ? (
      <>
        {schedules.map((schedule, idx) => (
          <p key={idx} className={CSS.schedule}>
            <span className={CSS.multiple}>
              {schedule.categories.slice(0, 2).map((category, _idx) => (
                <span
                  key={`${idx}-${_idx}`}
                  style={{ background: category.color }}
                ></span>
              ))}
              {schedule.categories.length > 2 && <span>...</span>}
            </span>

            <span className={CSS.truncated}>{schedule.title}</span>
          </p>
        ))}
      </>
    ) : null;
  };

  // 시작 시
  useEffect(() => {
    if (user.isAuth) getUsers();
  }, [user]);

  // 일정 목록의 변경이 있을 시
  useEffect(() => {
    convertSchedules();
  }, [calendar.schedules]);

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

  // // 사이드 메뉴 연도/달 선택 상태 변경 시
  // useEffect(() => {
  //   if (isYear) moveSelectedYear(year, year - startYear);
  // }, [isYear]);

  // 연도, 달 변경 시
  useEffect(() => {
    if (user.isAuth) getSchedules();
  }, [year, month, user]);

  // Backdrop랑 EventModal 동조화
  useEffect(() => {
    if (!backdrop.isVisible) closeModal();
  }, [backdrop.isVisible]);

  return (
    <div>
      <div
        className={CSS.calendar}
        style={{ right: isSiderbarOpen ? 0 : siderbarWidth / 2 }}
      >
        <div
          className={CSS.subBox}
          style={{ left: isSiderbarOpen ? 0 : siderbarWidth }}
        >
          <button
            type="button"
            onClick={toggleSiderbar}
            className={CSS.moreBtn}
          >
            {/* <Image
              src={isSiderbarOpen ? IconNextWhite : IconPrevWhite}
              width={30}
              alt={isSiderbarOpen ? ">" : "<"}
            /> */}
          </button>

          <div className={CSS.content} style={{ width: siderbarWidth }}>
            <ul className={CSS.header}>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    isYear ? changeYear("prev") : changeMonth("prev")
                  }
                >
                  {/* <Image src={IconPrevWhite} width={24} alt="Prev" /> */}
                </button>
              </li>

              <li>
                <ul className={CSS.yearMonthToggleBtn}>
                  <li>
                    <button
                      type="button"
                      onClick={() => toggleYearMonth("year")}
                      disabled={isYear}
                    >
                      <h5>{year}</h5>
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() => toggleYearMonth("month")}
                      disabled={!isYear}
                    >
                      <h5>{month + 1}</h5>
                    </button>
                  </li>
                </ul>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    isYear ? changeYear("next") : changeMonth("next")
                  }
                >
                  {/* <Image src={IconNextWhite} width={24} alt="Next" /> */}
                </button>
              </li>
            </ul>

            <ul
              className={CSS.content}
              style={{ height: calendarHeight, paddingRight: isYear ? 5 : 0 }}
              ref={siderbarRef}
            >
              {!isYear
                ? MONTH_NAMES.map((monthName, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => selectMonth(idx)}
                        className={idx === month ? CSS.selected : undefined}
                      >
                        <h6>{monthName}</h6>
                      </button>
                    </li>
                  ))
                : years.map((_year, idx) => (
                    // <li key={idx} ref={(el) => (yearRefs.current[idx] = el!)}>
                    <li key={idx}>
                      {/* <button type="button" onClick={() => selectYear(_year, idx)} className={year === _year ? CSS.selected : undefined}> */}
                      <button
                        type="button"
                        onClick={() => selectYear(_year)}
                        className={year === _year ? CSS.selected : undefined}
                      >
                        <h6>{_year}</h6>
                      </button>
                    </li>
                  ))}
            </ul>
          </div>
        </div>

        <div className={CSS.mainBox}>
          <ul
            className={CSS.header}
            style={isInputYearMonth ? { columnGap: 20 } : undefined}
          >
            {isInputYearMonth ? (
              <>
                <li className={CSS.inputYear}>
                  <input
                    type="number"
                    value={inputYear}
                    onChange={handleInputYear}
                    placeholder="연도"
                  />
                </li>

                <li className={CSS.inputMonth}>
                  <input
                    type="number"
                    value={inputMonth}
                    onChange={handleInputMonth}
                    onKeyDown={handleInputMonthKeyDown}
                    placeholder="월"
                  />
                </li>

                <li>
                  <button type="button" onClick={selectInputYearMonth}>
                    {/* <Image src={IconCheck} width={24} alt="√" /> */}
                  </button>
                </li>

                <li>
                  <button type="button" onClick={toggleInputYearMonth}>
                    {/* <Image src={IconClose} width={24} alt="X" /> */}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button type="button" onClick={() => changeMonth("prev")}>
                    {/* <Image src={IconPrevBlack} width={24} alt="Prev" /> */}
                  </button>
                </li>

                <li>
                  <button type="button" onClick={toggleInputYearMonth}>
                    <h3>{MONTH_NAMES[month]}</h3>
                  </button>
                </li>

                <li>
                  <button type="button" onClick={() => changeMonth("next")}>
                    {/* <Image src={IconNextBlack} width={24} alt="Next" /> */}
                  </button>
                </li>
              </>
            )}
          </ul>

          <div className={CSS.content} ref={calendarRef}>
            <ul className={CSS.daysOfWeek}>
              {DAY_OF_WEEK.map((day, idx) => (
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
                const isNextMonth: boolean =
                  idx + 1 > monthDaysWithPrevLastWeek;

                /** 표기할 날짜 */
                const day: number = isPrevMonth
                  ? prevMonthDays - (firstDayOfMonth - (idx + 1))
                  : isNextMonth
                  ? idx + 1 - monthDaysWithPrevLastWeek
                  : idx + 1 - firstDayOfMonth;

                /** 표기할 날짜의 달 */
                const _month: number = isPrevMonth
                  ? month - 1
                  : isNextMonth
                  ? month + 1
                  : month;

                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => selectDay(year, _month, day)}
                      className={CSS.content}
                    >
                      <span
                        className={`${
                          isPrevMonth
                            ? CSS.subDate
                            : isNextMonth
                            ? CSS.subDate
                            : year === currentYear &&
                              month === currentMonth &&
                              day === currentDay
                            ? CSS.today
                            : undefined
                        } ${CSS.day}`}
                      >
                        {day}
                      </span>

                      {(multipleSchedules.length > 0 ||
                        convertedSchedules.length > 0) && (
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

          {isModalVisible && (
            <EventModal
              closeModal={closeModal}
              findMultipleScheduleByDate={(_year, _month, _day) =>
                findMultipleScheduleByDate(_year, _month, _day)
              }
              findScheduleByDate={(_year, _month, _day) =>
                findScheduleByDate(_year, _month, _day)
              }
              users={users}
              getSchedules={getSchedules}
              lastSelectedDate={lastSelectedDate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
