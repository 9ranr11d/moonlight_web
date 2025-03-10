import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

/** 동의된 약관 저장 */
export async function POST(req: NextRequest) {
  try {
    // 유저 id, 동의된 약관들
    const { userId, agreedTermIds } = await req.json();

    // 요청 데이터가 없을 경우
    if (!userId || !Array.isArray(agreedTermIds) || agreedTermIds.length === 0)
      return NextResponse.json(
        { error: "잘못된 요청 데이터입니다." },
        { status: 400 }
      );

    /** SQL문 */
    const sql = `
      INSERT INTO user_terms (user_id, term_id)
      VALUES ${agreedTermIds.map(() => "(?, ?)").join(", ")}
    `;

    /** 삽입할 정보 */
    const params = agreedTermIds.flatMap(termId => [userId, termId]);

    await query(sql, params);

    // 인증 코드 반환
    return NextResponse.json(
      { msg: `${userId}(이)가 동의한 약관 ${agreedTermIds}가 저장되었습니다.` },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
