import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import ScheduleCategory, { IScheduleCategory, IIScheduleCategory } from "@models/ScheduleCategory";

export async function GET() {
  try {
    await dbConnect();

    const categories: IIScheduleCategory[] | null = await ScheduleCategory.find();

    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.error("Categories Management GET :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { title, color, createdBy }: IScheduleCategory = await req.json();

    const newScheduleCategory: IIScheduleCategory = new ScheduleCategory({
      title,
      color,
      createdBy,
    });

    await newScheduleCategory.save();

    return NextResponse.json({ msg: "Success" }, { status: 200 });
  } catch (err) {
    console.error("Categories Management POST :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const _id = req.nextUrl.searchParams.get("_id");

    await ScheduleCategory.findByIdAndDelete(_id);

    return NextResponse.json({ msg: "Success" }, { status: 200 });
  } catch (err) {
    console.error("Categories Mamagement DELETE :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
