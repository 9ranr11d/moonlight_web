import { NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@models/User";

export async function GET() {
  try {
    // DB 연결
    await dbConnect();

    const user: IIUser[] | null = await User.find({ accessLevel: { $gte: 2 } });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (user.length === 0) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    console.log(user);

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("Get User With Access Level 2 :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
