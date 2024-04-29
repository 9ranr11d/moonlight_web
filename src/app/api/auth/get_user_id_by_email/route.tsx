import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@models/User";

/** 해당 E-mail을 가진 사용자 Identification 가져오기 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // E-mail
    const { email }: { email: string } = await req.json();

    /** E-mail과 일차하는 사용자 정보 */
    const user: IIUser | null = await User.findOne({ email });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    /** 일치하는 사용자의 블러 처리된 Identification(끝에서부터 2자리 '*') */
    const modifiedId: string = `${user.identification.slice(0, -2)}**`;

    // 블러 처리한 사용자 Identification 반환
    return NextResponse.json({ identification: modifiedId }, { status: 200 });
  } catch (err) {
    console.error("Get User Id :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
