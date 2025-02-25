import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

/** identification으로 사용자 정보 검색 */
export async function GET(req: NextRequest) {
  try {
    /** identification */
    const id: string | null = req.nextUrl.searchParams.get("id");

    /** SQL 쿼리문 */
    const sql = `
      SELECT
        u.identification, 
        u.profile_img_url AS profileImgUrl, 
        u.nickname, 
        u.phone_number AS phoneNumber, 
        u.email, 
        u.platform, 
        u.access_level AS accessLevel, 
        u.provider, 
        u.account_status AS accountStatus, 
        u.created_at AS createdAt, 
        u.updated_at AS updatedAt, 
        c.couple_code AS coupleCode
      FROM
        users u
      LEFT JOIN 
        couple_code_users cu
        ON
          u.identification = cu.user_id
      LEFT JOIN 
        couple_codes c
        ON
          cu.couple_code = c.couple_code
      WHERE
        identification = ?
    `;

    /** 검색 결과 */
    const result = await query(sql, [id]);

    if (result.length === 0)
      return NextResponse.json(
        { msg: "사용자 정보가 없습니다." },
        { status: 404 }
      );

    /** 사용자 정보 */
    const user = result[0];

    return NextResponse.json(
      {
        user: {
          ...user,
          createdAt: new Date(user.createdAt).toISOString(),
          updatedAt: new Date(user.updatedAt).toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "/src/app/api/suth/social-sign-in > POST()에서 오류가 발생했습니다. :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요.입니다." },
      { status: 500 }
    );
  }
}
