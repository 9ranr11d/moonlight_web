import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import Schedule, { IISchedule, IIISchedule } from "@models/Schedule";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { date, user, title, categories, content, isRepeating }: IISchedule = await req.json();

    const newSchedule: IIISchedule = new Schedule({
      date,
      user,
      title,
      categories,
      content,
      isRepeating,
    });

    await newSchedule.save();

    return NextResponse.json({ msg: "Success" }, { status: 200 });
  } catch (err) {
    console.log("Schedule Management POST :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
