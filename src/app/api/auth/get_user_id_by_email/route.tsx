import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User from "@models/User";

/** 해당 email을 가진 사용자 id 가져오기 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // E-mail
    const { email } = await req.json();

    /** email과 일차하는 사용자 정보 */
    const user = await User.findOne({ email: email });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    /** 일치하는 사용자의 블러 처리된 id(끝에서부터 2자리 '*') */
    const modifiedId = `${user.id.slice(0, -2)}**`;

    // 블러 처리한 사용자 id 반환
    return NextResponse.json({ id: modifiedId }, { status: 200 });
  } catch (err) {
    console.error("Get User Id POST :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
