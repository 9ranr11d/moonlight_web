import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@models/User";

/** 회원가입 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // Identification, 별명, Password
    const { identification, nickname, password, email }: { identification: string; nickname: string; password: string; email: string } = await req.json();

    /** 해싱된 Password */
    const hashedPw: string = await bcrypt.hash(password, 10);

    /** 회원가입 할 사용자 정보  */
    const newUser: IIUser = new User({
      identification,
      password: hashedPw,
      nickname,
      email,
      accessLevel: 0,
    });

    // 사용자 정보 저장
    await newUser.save();

    // 회원가입 성공 메세지 반환
    return NextResponse.json({ msg: "Success" }, { status: 200 });
  } catch (err) {
    console.error("Error in /src/app/api/auth/sign_up > POST :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
