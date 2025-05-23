import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { query } from "@lib/dbConnect";

/** 비밀번호 변경 */
export async function PUT(req: NextRequest) {
  try {
    // 아이디, 비밀번호
    const {
      identification,
      password,
    }: { identification: string; password: string } = await req.json();

    // 아이디 또는 비밀번호가 없을 경우
    if (!identification || !password)
      return NextResponse.json(
        { msg: "아이디 또는 비밀번호를 입력해주세요." },
        { status: 400 }
      );

    /** 결과 */
    const result = await query(
      `
      SELECT
        password
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

    const [user] = result;

    /** 해싱된 비밀번호 */
    const hashedPw: string = await bcrypt.hash(password, 10);

    /** 해싱한 비밀번호 찾은 사용자의 비밀번호 일치 여부 */
    const isPasswordMatch: boolean = await bcrypt.compare(
      password,
      user.password
    );

    // 이전 비밀번호와 일치할 시
    if (isPasswordMatch)
      return NextResponse.json(
        { msg: "이전 비밀번호와 일치합니다." },
        { status: 400 }
      );

    /** 비밀번호 업데이트 */
    await query(
      `
      UPDATE users
      SET password = ?
      WHERE identification = ?
      `,
      [hashedPw, identification]
    );

    console.log(
      `auth/change-pw > PUT() : '${identification}'의 비밀번호가 성공적으로 바뀌었습니다.`
    );

    // 비밀번호 변경 성공 Message 반환
    return NextResponse.json(
      { msg: "비밀번호가 성공적으로 바뀌었습니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error("auth/change-pw > PUT() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
