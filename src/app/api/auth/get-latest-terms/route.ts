import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    const result = await query(`
      SELECT
        t1.id,
        t1.type,
        t1.version,
        t1.is_required AS isRequired,
        t1.content,
        t1.created_at AS createdAt,
        t1.updated_at AS updatedAt
      FROM
        terms t1
      INNER JOIN (
        SELECT
          type, MAX(version) AS max_version
        FROM
          terms
        GROUP BY
          type
      ) t2
        ON
          t1.type = t2.type AND t1.version = t2.max_version
      ORDER BY
        t1.is_required DESC,
        t1.type;
    `);

    /** 약관 목록 */
    const terms = result.map((row: any) => ({
      ...row,
      isRequired: !!row.isRequired, // 0 -> false, 1 -> true
    }));

    return NextResponse.json({ terms }, { status: 200 });
  } catch (err) {
    console.error("auth/get-latest-terms > GET() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요.입니다." },
      { status: 500 }
    );
  }
}
