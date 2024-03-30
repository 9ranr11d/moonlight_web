import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import dbConnect from "@lib/dbConnect";

import User from "@models/User";

/** 회원가입 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // Identification, 별명, Password
    const { id, nickname, pw, email } = await req.json();

    /** 해싱된 pw */
    const hashedPw = await bcrypt.hash(pw, 10);

    /** 회원가입 할 사용자 정보  */
    const newUser = new User({
      id,
      pw: hashedPw,
      nickname,
      email,
      accessLevel: 0,
    });

    // 사용자 정보 저장
    await newUser.save();

    // 200 반환
    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error("Sign Up POST: ", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
