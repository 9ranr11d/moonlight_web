import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

import { verify } from "@utils/jwtUtils";

/** Access Token으로 사용자 정보 가져오기 Interface */
interface IAccessTokenValid {
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
    const isAccessTokenValid: IAccessTokenValid = verify(accessToken);

    // 유효하지 않을 시 404 Error와 Error Message 반환
    if (!isAccessTokenValid.ok) {
      console.log(
        "auth/get-user-by-access-token > POST() :",
        isAccessTokenValid.msg
      );

      return NextResponse.json(
        { msg: "유효하지 않은 Access Token입니다." },
        { status: 400 }
      );
    }

    /** 유효할 시, 얻은 userIdentification랑 동일 한 사용자 정보 */
    const result = await query(
      `
      SELECT
        *
      FROM
        users
      WHERE
        identification = ?
      `,
      [isAccessTokenValid.userIdentification]
    );

    // 얻은 userId와 동일한 Identification를 가진 사용자 정보가 없을 시 404 Error 반환
    if (result.length === 0) {
      console.log(
        "auth/get-user-by-access-token > POST() :",
        `${accessToken}(와)과 일치하는 사용자가 없습니다.`
      );

      return NextResponse.json(
        { msg: "사용자를 찾지 못했습니다." },
        { status: 404 }
      );
    }

    // 사용자 정보
    const [user] = result;

    // 찾은 사용자 정보와 Access Token 반환
    return NextResponse.json(
      {
        user: {
          accessToken: accessToken,
          accessLevel: user.access_level,
          accountStatus: user.account_status,
          birthdate: user.birthdate,
          createdAt: user.created_at,
          email: user.email,
          gender: user.gender,
          identification: user.identification,
          isAuth: true,
          nickname: user.nickname,
          phoneNumber: user.phone_number,
          platform: user.platform,
          profileImgUrl: user.profile_img_url,
          provider: user.provider,
          seq: user.seq,
          updatedAt: user.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("auth/get-user-by-access-token > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
