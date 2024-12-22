import { NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@interfaces/index";

/** 심사 통과된 사용자 명단 가져오기 */
export async function GET() {
  try {
    // DB 연결
    await dbConnect();

    /** 심사 통과된 사용자 명단 */
    const user: IIUser[] | null = await User.find({ accessLevel: { $gte: 2 } });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (user.length === 0) return NextResponse.json({ msg: "사용자를 찾지 못했습니다." }, { status: 404 });

    // 심사 통과된 사용자 명단 반환
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/auth/getUsersWithHighAccessLevel > GET()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
