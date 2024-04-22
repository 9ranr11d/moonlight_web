import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import dbConnect from "@lib/dbConnect";

import User, { IUser } from "@models/User";

/** 비밀번호 변경 */
export async function PUT(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // Identification, PassWord
    const { id, pw }: { id: string; pw: string } = await req.json();

    /** id와 일차하는 사용자 정보 */
    const user: IUser | null = await User.findOne({ id });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    /** 해싱된 pw */
    const hashedPw: string = await bcrypt.hash(pw, 10);

    // DB 속 사용자의 비밀번호 변경
    await User.findByIdAndUpdate(user._id, { pw: hashedPw }, { new: true });

    // 비밀번호 성공 메세지 반환
    return NextResponse.json({ msg: "Password Has Been Successfully Changeed" }, { status: 200 });
  } catch (err) {
    console.error("Change Pw :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
