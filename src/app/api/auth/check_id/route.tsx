import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IUser } from "@models/User";

/** 해당 id를 가진 사용자가 존재하는 확인 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // Identification
    const { id }: { id: string } = await req.json();

    /** id와 일차하는 사용자 정보 */
    const user: IUser | null = await User.findOne({ id });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    // 일차하는 사용자의 id, email 반환
    return NextResponse.json({ id: user.id, email: user.email }, { status: 200 });
  } catch (err) {
    console.error("Check Id :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
