import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@models/User";

import { refresh, sign } from "@utils/JwtUtils";

/** 로그인 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // Identification, PassWord
    const { identification, password }: { identification: string; password: string } = await req.json();

    /** Identification와 일차하는 사용자 정보 */
    const user: IIUser | null = await User.findOne({ identification });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    /** 해싱한 Password 찾은 사용자의 Password 일치 여부 */
    const passwordMatch: boolean = await bcrypt.compare(password, user.password);

    // Password 사용자의 Password가 일치하지 않을 시 404 Error 반환
    if (!passwordMatch) return NextResponse.json({ msg: "Incorrect Password" }, { status: 401 });

    /** 사용자 Identification로 발급받은 Access Token */
    const accessToken: string = sign(user.identification);
    /** 사용자 Identification로 발급받은 Refresh Token */
    const refreshToken: string = refresh(user.identification);

    // 발급받은 Refresh Token을 DB 속 사용자 정보에 저장
    await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });

    /** Refresh Token을 저장할 쿠키의 수명 (현재 14일) */
    const maxAge: number = 14 * 24 * 60 * 60;

    // 찾은 사용자 정보와 Access Token (Refresh Token을 쿠키에 저장 후 Header에 담아) 반환
    return NextResponse.json(
      {
        user,
        isAuth: true,
        accessToken: accessToken,
      },
      {
        status: 200,
        headers: { "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; path=/; Max-Age=${maxAge}; Secure; SameSite=Strict;` },
      }
    );
  } catch (err) {
    console.error("Sign In :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
