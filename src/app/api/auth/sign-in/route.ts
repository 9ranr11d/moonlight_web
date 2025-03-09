import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@interfaces/auth/index";

import { refresh, sign } from "@utils/jwtUtils";

/** 로그인 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // 아이디, PassWord
    const {
      identification,
      password,
    }: { identification: string; password: string } = await req.json();

    /** Identification와 일차하는 사용자 정보 */
    const user: IIUser | null = await User.findOne({ identification });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (!user)
      return NextResponse.json(
        { msg: "사용자를 찾지 못했습니다." },
        { status: 404 }
      );

    /** 해싱한 비밀번호 찾은 사용자의 비밀번호 일치 여부 */
    const passwordMatch: boolean = await bcrypt.compare(
      password,
      user.password
    );

    // 비밀번호 사용자의 Password가 일치하지 않을 시 404 Error 반환
    if (!passwordMatch)
      return NextResponse.json(
        { msg: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );

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
        user: {
          ...user.toJSON(),
          isAuth: true,
          accessToken: accessToken,
        },
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; path=/; Max-Age=${maxAge}; Secure; SameSite=Strict;`,
        },
      }
    );
  } catch (err) {
    console.error(
      "/src/app/api/auth/sign-in > POST()에서 오류가 발생했습니다. :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요.입니다." },
      { status: 500 }
    );
  }
}
