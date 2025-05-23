import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

/** 아이디 중복 여부 확인 */
export async function POST(req: NextRequest) {
  try {
    // 아이디
    const { identification }: { identification: string } = await req.json();

    if (!identification)
      return NextResponse.json(
        { msg: "아이디를 입력해주세요." },
        { status: 400 }
      );

    /** 검색 결과 */
    const result = await query(
      `
      SELECT 
        identification
      FROM
        users
      WHERE
        identification = ?
      `,
      [identification]
    );

    // 해당 아이디를 가진 사용자가 있을 시 409 Error 반환
    if (result.length > 0) {
      console.log(
        "auth/check-duplicate-id > POST() :",
        `'${identification}'(은)는 이미 사용 중인 아이디입니다.`
      );

      return NextResponse.json(
        { msg: "해당 아이디는 이미 사용 중인 아이디입니다." },
        { status: 409 }
      );
    }

    console.log(
      "auth/check-duplicate-id > POST() :",
      `'${identification}'(은)는 사용 가능합니다.`
    );

    // 해당 아이디를 가진 사용자가 없을 시 '사용 가능' Message 반환
    return NextResponse.json(
      { msg: "해당 아이디는 사용 가능합니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error("auth/check-duplicate-id > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
