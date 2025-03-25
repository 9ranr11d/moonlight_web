import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

/** Email 중복 검사 */
export async function POST(req: NextRequest) {
  try {
    // Email
    const { email } = await req.json();

    // Email이 없을 경우
    if (!email)
      return NextResponse.json(
        { msg: "Email을 입력해주세요." },
        { status: 400 }
      );

    /** SQL문 */
    const sql = "SELECT COUNT(*) AS count FROM users WHERE email = ?";

    /** 결과 */
    const result = await query(sql, [email]);

    /** 중복 여부 */
    const isDuplicate = result[0]?.count > 0;

    // 중복 시
    if (isDuplicate)
      return NextResponse.json(
        { msg: `${email}은 이미 사용 중인 Email입니다.` },
        { status: 409 }
      );

    // Email 중복 여부 반환
    return NextResponse.json(
      { msg: `${email}는 사용가능한 Email입니다.` },
      { status: 200 }
    );
  } catch (err) {
    console.error("/src/app/api/auth/check_email > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
