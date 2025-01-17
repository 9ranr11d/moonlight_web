import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import mongoose from "mongoose";

import Schedule, { IIISchedule } from "@models/Schedule";
import User from "@interfaces/auth/index";
import {
  IIScheduleCategory,
  ScheduleCategorySchema,
} from "@models/ScheduleCategory";

interface IParams {
  year: string;
  month: string;
  id: string;
  coupleCode: string;
}

/**
 * 해당 달 +-1달 일정 정보 가져오기
 * @param year 연도
 * @param month 달
 * @param id 사용자 Id
 * @param coupleCode 커플 코드
 */
export async function GET(req: NextRequest, { params }: { params: IParams }) {
  try {
    // DB 연결
    await dbConnect();

    // 연도, 달
    const { year, month, id, coupleCode }: IParams = params;

    /** 연도를 숫자로 변환 */
    const _year = parseInt(year);
    /** 달을 숫자로 변환 */
    const _month = parseInt(month);

    /** 시작 날짜 */
    const startDate = new Date(_year, _month - 1);
    /** 종료 날짜 */
    const endDate = new Date(_year, _month + 1);

    // 사용자, 일정 카테고리 모델 미리 등록
    mongoose.models.ScheduleCategory ||
      mongoose.model<IIScheduleCategory>(
        "ScheduleCategory",
        ScheduleCategorySchema
      );

    // 커플 코드가 일치하는 사용자 목록
    const usersWithCoupleCode = await User.find({ coupleCode: coupleCode })
      .select("_id")
      .lean();

    // 사용자의 _id 배열
    const userIds = usersWithCoupleCode.map(user => user._id);

    /** 조건: 시작 날짜와 종료 날짜 사아의 일정과 반복 설정 되어있는 일정 */
    const query = {
      $or: [
        {
          $and: [
            { date: { $exists: true, $type: "array" } },
            { date: { $elemMatch: { $gte: startDate } } },
            { date: { $elemMatch: { $lte: endDate } } },
          ],
        },
        {
          isRepeating: true,
        },
      ],
      user: { $in: [...userIds, id] },
    };

    /** 일정들 */
    const schedules: IIISchedule[] | null = await Schedule.find(query)
      .populate("user")
      .populate("categories");

    /** 일정들 반환 */
    return NextResponse.json(schedules, { status: 200 });
  } catch (err) {
    console.error(
      "/src/app/api/calendar/schedulesManagement/[year]/[month] > GET()에서 오류가 발생했습니다. :",
      err
    );

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
