import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

import { verify } from "@utils/jwtUtils";

/** Access Token으로 사용자 정보 가져오기 Interface */
interface VerificationResult {
  /** 유효한 Token인지 */
  ok: boolean;
  /** 유효하다면 사용자 아이디 반환 */
  userIdentification?: string;
  /** 유효하지만 오류 Message 반환 */
  msg?: string;
}

/** Access Token으로 사용자 정보 가져오기 */
export async function POST(req: NextRequest) {
  try {
    // Access Token
    const { accessToken }: { accessToken: string } = await req.json();

    // Access Token이 없을 시 404 Error 반환
    if (!accessToken)
      return NextResponse.json(
        { msg: "Access Token이 없습니다." },
        { status: 404 }
      );

    /**
     * 유효한 Access Token인지 확인:
     * 유효할 시 => UserIdentification 반환
     * 유효하지 않을 시 => Error Message 반환
     */
    const result: VerificationResult = verify(accessToken);

    // 유효하지 않을 시 404 Error와 Error Message 반환
    if (!result.ok)
      return NextResponse.json({ msg: result.msg }, { status: 400 });

    /** 유효할 시, 얻은 userIdentification랑 동일 한 사용자 정보 */
    const user = await query(`SELECT * FROM users WHERE identification = ?`, [
      result.userIdentification,
    ]);

    // 얻은 userId와 동일한 Identification를 가진 사용자 정보가 없을 시 404 Error 반환
    if (Array.isArray(user) && user.length === 0)
      return NextResponse.json(
        { msg: "사용자를 찾지 못했습니다." },
        { status: 404 }
      );

    // 찾은 사용자 정보와 Access Token 반환
    return NextResponse.json(
      {
        user: {
          accessToken: accessToken,
          accessLevel: user[0].access_level,
          accountStatus: user[0].account_status,
          birthdate: user[0].birthdate,
          createdAt: user[0].created_at,
          email: user[0].email,
          gender: user[0].gender,
          identification: user[0].identification,
          isAuth: true,
          nickname: user[0].nickname,
          phoneNumber: user[0].phone_number,
          platform: user[0].platform,
          profileImgUrl: user[0].profile_img_url,
          provider: user[0].provider,
          seq: user[0].seq,
          updatedAt: user[0].updated_at,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("/src/app/api/auth/get-user-by-access-token > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요.입니다." },
      { status: 500 }
    );
  }
}
