import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@models/User";

/** 비밀번호 변경 */
export async function PUT(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // Identification, PassWord
    const { identification, password }: { identification: string; password: string } = await req.json();

    /** Identification와 일차하는 사용자 정보 */
    const user: IIUser | null = await User.findOne({ identification });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "사용자를 찾지 못했습니다." }, { status: 404 });

    /** 해싱된 Password */
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // DB 속 사용자의 비밀번호 변경
    await User.findByIdAndUpdate(user._id, { password: hashedPassword }, { new: true });

    // Password 변경 성공 메세지 반환
    return NextResponse.json({ msg: "비밀번호가 성공적으로 바뀌었습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/auth/changePw > PUT()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
