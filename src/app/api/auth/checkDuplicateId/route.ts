import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

/** Identification 중복 여부 확인 */
export async function POST(req: NextRequest) {
  try {
    // Identification
    const { identification }: { identification: string } = await req.json();

    /** SQL 쿼리문 */
    const sql = "SELECT identification FROM users WHERE identification = ?";

    /** 검색 결과 */
    const result = await query(sql, [identification]);

    // 해당 Identification를 가진 사용자가 있을 시 409 Error 반환
    if (Array.isArray(result) && result.length > 0) {
      return NextResponse.json(
        { msg: "이미 존재하는 Identification입니다." },
        { status: 409 }
      );
    }

    // 해당 Identification를 가진 사용자가 없을 시 '사용 가능' 메세지 반환
    return NextResponse.json(
      { msg: "해당 Identification는 사용 가능합니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "/src/app/api/auth/checkDuplicateId > POST()에서 오류가 발생했습니다. :",
      err
    );

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
