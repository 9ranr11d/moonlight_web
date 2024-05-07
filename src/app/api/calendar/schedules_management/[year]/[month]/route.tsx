import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import ScheduleCategory from "@models/ScheduleCategory";
import Schedule, { IIISchedule } from "@models/Schedule";

export async function GET(req: NextRequest, { params }: { params: { year: string; month: string } }) {
  try {
    await dbConnect();

    const { year, month } = params;

    const _year = parseInt(year);
    const _month = parseInt(month);

    const query = {
      $or: [
        {
          $and: [{ date: { $gte: new Date(_year, _month - 1) } }, { date: { $lt: new Date(_year, _month + 2) } }],
        },
        {
          isRepeating: true,
        },
      ],
    };

    const schedules: IIISchedule[] | null = await Schedule.find(query).populate("user").populate("categories");

    return NextResponse.json(schedules, { status: 200 });
  } catch (err) {
    console.log("Schedule Management GET :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
