import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import Schedule, { IIISchedule } from "@models/Schedule";

/**
 * 해당 달 +-1달 일정 정보 가져오기
 * @param year 연도
 * @param month 달
 */
export async function GET(req: NextRequest, { params }: { params: { year: string; month: string } }) {
  try {
    // DB 연결
    await dbConnect();

    // 연도, 달
    const { year, month }: { year: string; month: string } = params;

    /** 연도를 숫자로 변환 */
    const _year = parseInt(year);
    /** 달을 숫자로 변환 */
    const _month = parseInt(month);

    /** 시작 날짜 */
    const startDate = new Date(_year, _month - 1);
    /** 종료 날짜 */
    const endDate = new Date(_year, _month + 1);

    /** 조건: 시작 날짜와 종료 날짜 사아의 일정과 반복 설정 되어있는 일정 */
    const query = {
      $or: [
        {
          $and: [{ date: { $gte: startDate } }, { date: { $lte: endDate } }],
        },
        {
          isRepeating: true,
        },
      ],
    };

    /** 일정들 */
    const schedules: IIISchedule[] | null = await Schedule.find(query).populate("user").populate("categories");

    /** 일정들 반환 */
    return NextResponse.json(schedules, { status: 200 });
  } catch (err) {
    console.log("Schedule Management GET :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
