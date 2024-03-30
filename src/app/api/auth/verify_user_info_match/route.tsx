import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User from "@models/User";

/** E-mail 일치 여부 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // E-mail
    const { email } = await req.json();

    /** email과 일치하는 사용자 정보 */
    const user = await User.find({ email: email });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    // 일치하는 사용자가 있을 시 성공 메세지 반환
    return NextResponse.json({ msg: "E-mail is Available" }, { status: 200 });
  } catch (err) {
    console.error("Verify User Info Match POST :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
