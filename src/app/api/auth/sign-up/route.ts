import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { query } from "@lib/dbConnect";

import { IIUser } from "@interfaces/auth";

/** 회원가입 */
export async function POST(req: NextRequest) {
  try {
    // 회원가입 정보
    const {
      identification,
      password,
      email,
      phoneNumber,
      birthdate,
      gender,
      nickname,
      seq,
    }: IIUser = await req.json();

    /** 해싱된 비밀번호 */
    const hashedPw: string = await bcrypt.hash(password, 10);

    /** SQL문 */
    const sql = `
      INSERT INTO
        users (
          identification,
          password,
          email,
          phone_number,
          birthdate,
          gender,
          nickname,
          seq,
          platform,
          provider
        ) 
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    /** 삽입할 정보 */
    const params = [
      identification,
      hashedPw,
      email || null,
      phoneNumber || null,
      birthdate,
      gender,
      nickname,
      seq,
      "web",
      "local",
    ];

    /** 결과 */
    const result = await query(sql, params);

    // 회원가입 성공 메세지 반환
    return NextResponse.json(
      { msg: `회원가입 성공 : ${result}` },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "/src/app/api/auth/sign-up > POST()에서 오류가 발생했습니다. :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
