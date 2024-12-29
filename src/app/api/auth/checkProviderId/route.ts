import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

/** nextauth로 로그인 시도 시 provider_id로 가입 유무 확인 */
export async function POST(req: NextRequest) {
  try {
    // provider_id
    const { providerId }: { providerId: string } = await req.json();

    /** SQL 쿼리문 */
    const sql = `SELECT * FROM users WHERE provider_id = ?`;
    /** 색인 결과 */
    const result = await query(sql, [providerId]);

    // 색인 결과가 없을 시
    if (result.length === 0) return NextResponse.json({ msg: "사용자를 찾을 수 없습니다." }, { status: 404 });

    // 색인 결과가 있을 시
    return NextResponse.json({ user: result[0] }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/auth/checkProviderId > POST()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
