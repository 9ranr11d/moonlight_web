import { NextRequest, NextResponse } from "next/server";

import { IUserAgreedTerms } from "@interfaces/auth";

import { query } from "@lib/dbConnect";

/** 동의된 약관 저장 */
export async function POST(req: NextRequest) {
  try {
    // 유저 아이디, 동의된 약관들
    const { userId, agreedTermIds }: IUserAgreedTerms = await req.json();

    // 요청 데이터가 없을 경우
    if (!userId || !Array.isArray(agreedTermIds) || agreedTermIds.length === 0)
      return NextResponse.json(
        { msg: "잘못된 요청 데이터입니다." },
        { status: 400 }
      );

    await query(
      `
      INSERT INTO
        user_terms (
          user_id,
          term_id
        )
      VALUES
        ${agreedTermIds.map(() => "(?, ?)").join(", ")}
      `,
      agreedTermIds.flatMap(termId => [userId, termId])
    );

    console.log(
      `auth/save-user-terms > POST() : '${userId}'(이)가 동의한 약관 ${agreedTermIds}(이)가 저장되었습니다.`
    );

    // 성공 Message 반환
    return NextResponse.json(
      { msg: "동의한 약관들이 저장되었습니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error("auth/save-user-terms > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
