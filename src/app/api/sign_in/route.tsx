import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import dbConnect from "@config/dbConnect";

import User from "@models/User";

import { refresh, sign } from "@utils/jwtUtils";

/** 로그인 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // Identification, PassWord
    const { id, pw } = await req.json();

    /** id와 일차하는 사용자 정보 */
    const user = await User.findOne({ id: id });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ err: "User Not Found" }, { status: 404 });

    /** 해싱한 pw와 찾은 사용자의 pw 일치 여부 */
    const pwMatch = await bcrypt.compare(pw, user.pw);

    // pw와 사용자의 pw가 일치하지 않을 시 404 Error 반환
    if (!pwMatch) return NextResponse.json({ err: "Incorrect Password" }, { status: 401 });

    /** 사용자 id로 발급받은 Access Token */
    const accessToken = sign(user.id);
    /** 사용자 id로 발급받은 Refresh Token */
    const refreshToken = refresh(user.id);

    // 발급받은 Refresh Token을 DB 속 사용자 정보에 저장
    await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken });

    /** Refresh Token을 저장할 쿠키의 수명 (현재 14일) */
    const maxAge = 14 * 24 * 60 * 60;

    // 찾은 사용자 정보와 Access Token (Refresh Token을 쿠키에 저장 후 Header에 담아) 반환
    return NextResponse.json(
      {
        user,
        accessToken: accessToken,
      },
      {
        status: 200,
        headers: { "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; path=/; Max-Age=${maxAge}; Secure; SameSite=Strict;` },
      }
    );
  } catch (err) {
    console.error("User GET :", err);

    return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
  }
}
