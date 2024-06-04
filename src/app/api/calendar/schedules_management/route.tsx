import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import Schedule, { IISchedule, IIISchedule } from "@models/Schedule";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { date, user, title, categories, content, isRepeating }: IISchedule = await req.json();

    let isSingleDate = true;

    if (date[0] !== date[1]) isSingleDate = false;

    const newSchedule: IIISchedule = new Schedule({
      date,
      isSingleDate,
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

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const { _id, date, user, title, categories, content, isRepeating }: IIISchedule = await req.json();

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      _id,
      {
        date,
        user,
        title,
        categories,
        content,
        isRepeating,
      },
      { new: true }
    );

    if (!updatedSchedule) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    return NextResponse.json({ msg: "Success" }, { status: 200 });
  } catch (err) {
    console.log("Schedule Management PUT :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const _id = req.nextUrl.searchParams.get("_id");

    await Schedule.findByIdAndDelete(_id);

    return NextResponse.json({ msg: "Success" }, { status: 200 });
  } catch (err) {
    console.log("Schedule Management DELETE :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
