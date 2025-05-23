import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

/** 아이디로 사용자 정보 검색 */
export async function GET(req: NextRequest) {
  try {
    /** 아이디 */
    const id: string | null = req.nextUrl.searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { msg: "아이디를 입력해주세요." },
        { status: 400 }
      );

    /** 검색 결과 */
    const result = await query(
      `
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
    `,
      [id]
    );

    if (result.length === 0)
      return NextResponse.json(
        { msg: "사용자 정보가 없습니다." },
        { status: 404 }
      );

    const [user] = result; // 사용자 정보

    console.log(
      "auth/social-sign-in > GET() :",
      `'${id}'(으)로 소셜 로그인 성공했습니다`
    );

    return NextResponse.json(
      {
        user: {
          ...user,
          createdAt: new Date(user.createdAt).toISOString(),
          updatedAt: new Date(user.updatedAt).toISOString(),
        },
        msg: "소셜 로그인을 성공했습니다.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("auth/social-sign-in > GET() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
