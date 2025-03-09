import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    const { nickname }: { nickname: string } = await req.json();

    if (!nickname)
      return NextResponse.json(
        { msg: "별명을 입력해주세요." },
        { status: 400 }
      );

    const sql = `SELECT COALESCE(MAX(seq), -1) + 1 AS nextSeq FROM users WHERE nickname = ?`;
    const result = await query(sql, [nickname]);

    return NextResponse.json({ seq: result[0]?.nextSeq ?? 0 }, { status: 200 });
  } catch (err) {
    console.error(
      "/src/app/api/auth/get-next-nickname-seq > POST()에서 오류가 발생했습니다. :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
