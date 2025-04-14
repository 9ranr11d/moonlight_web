import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { query } from "@lib/dbConnect";

import { refresh, sign } from "@utils/jwtUtils";

/** 로그인 */
export async function POST(req: NextRequest) {
  try {
    // 아이디, 비밀번호
    const {
      identification,
      password,
    }: { identification: string; password: string } = await req.json();

    if (!identification || !password)
      return NextResponse.json(
        { msg: "아이디 또는 비밀번호를 입력해주세요." },
        { status: 400 }
      );

    /** 아이디 일차하는 사용자 정보 */
    const result = await query(
      `
      SELECT
        *
      FROM
        users
      WHERE
        identification = ?
      `,
      [identification]
    );

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (result.length === 0)
      return NextResponse.json(
        { msg: "사용자를 찾지 못했습니다." },
        { status: 404 }
      );

    const [user] = result; // 사용자 정보

    console.log(
      "auth/sign-in > GET() :",
      `'${identification}'(으)로 로그인 성공했습니다`
    );

    /** 해싱한 비밀번호 찾은 사용자의 비밀번호 일치 여부 */
    const passwordMatch: boolean = await bcrypt.compare(
      password,
      user.password
    );

    // 비밀번호 사용자의 비밀번호가 일치하지 않을 시 404 Error 반환
    if (!passwordMatch)
      return NextResponse.json(
        { msg: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );

    /** 사용자 아이디로 발급받은 Access Token */
    const accessToken: string = sign(user.identification);
    /** 사용자 아이디로 발급받은 Refresh Token */
    const refreshToken: string = refresh(user.identification);

    // 발급받은 Refresh Token을 DB 속 사용자 정보에 저장
    await query(
      `
      UPDATE
        users
      SET
        refresh_token = ?
      WHERE
        identification = ?
      `,
      [refreshToken, user.identification]
    );

    /** Refresh Token을 저장할 쿠키의 수명 (현재 14일) */
    const maxAge: number = 14 * 24 * 60 * 60;

    // 찾은 사용자 정보와 Access Token (Refresh Token을 쿠키에 저장 후 Header에 담아) 반환
    return NextResponse.json(
      {
        user: {
          accessToken: accessToken,
          accessLevel: user.access_level,
          accountStatus: user.account_status,
          birthdate: user.birthdate,
          createdAt: user.created_at,
          email: user.email,
          gender: user.gender,
          identification: user.identification,
          isAuth: true,
          nickname: user.nickname,
          phoneNumber: user.phone_number,
          platform: user.platform,
          profileImgUrl: user.profile_img_url,
          provider: user.provider,
          seq: user.seq,
          updatedAt: user.updated_at,
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
    console.error("auth/sign-in > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
