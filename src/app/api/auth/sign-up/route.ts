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
    }: IIUser = await req.json();

    // 파라미터가 없을 경우
    if (
      !identification ||
      !password ||
      !email ||
      !phoneNumber ||
      !birthdate ||
      !gender ||
      !nickname
    )
      return NextResponse.json(
        { msg: "회원가입에 필요한 정보를 확인해주세요." },
        { status: 400 }
      );

    /** 해싱된 비밀번호 */
    const hashedPw: string = await bcrypt.hash(password, 10);

    // 트랜잭션 시작
    await query("START TRANSACTION");

    /** 현재 nickname의 최대 seq 값 가져오기 (행 잠금) */
    const seqResult = await query(
      `
      SELECT
        COALESCE(MAX(seq), -1) + 1 AS nextSeq
      FROM
        users
      WHERE
        nickname = ? FOR UPDATE
      `,
      [nickname]
    );

    /** 별명 식별자 */
    const seq: number = seqResult[0]?.nextSeq ?? 0;

    // 사용자 등록
    await query(
      `
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
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      `,
      [
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
      ]
    );

    console.log(
      "auth/sign-up > POST() :",
      `'${identification}'(이)가 가입했습니다.`
    );

    // 회원가입 성공 Message 반환
    return NextResponse.json(
      { msg: "회원가입 성공했습니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error("auth/sign-up > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
