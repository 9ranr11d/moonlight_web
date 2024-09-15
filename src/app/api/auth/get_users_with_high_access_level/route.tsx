import { NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@models/User";

/** 심사 통과된 사용자 명단 가져오기 */
export async function GET() {
  try {
    // DB 연결
    await dbConnect();

    /** 심사 통과된 사용자 명단 */
    const user: IIUser[] | null = await User.find({ accessLevel: { $gte: 2 } });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (user.length === 0) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    // 심사 통과된 사용자 명단 반환
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("Error in /src/app/api/auth/get_users_with_high_access_level > GET() :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
