import { NextRequest, NextResponse } from "next/server";

import { query } from "@/lib/dbConnect";

import { refreshVerify, sign } from "@/utils";

/** Refresh Token으로 Access Token 재발급 */
export async function GET(req: NextRequest) {
  try {
    /** Cookie에 저장된 Refresh Token 정보 */
    const refreshToken: string | undefined =
      req.cookies.get("refreshToken")?.value;

    // Refresh Token이 없으면 404 Error 반환
    if (!refreshToken)
      return NextResponse.json(
        { msg: "Refresh Token가 없습니다." },
        { status: 404 }
      );

    // 유효한 Refresh Token가 아닐 시 400 Error 반환
    if (!refreshVerify(refreshToken))
      return NextResponse.json(
        { msg: "Refresh Token가 유효하지 않습니다." },
        { status: 400 }
      );

    /** 결과값 */
    const result = await query(
      `
      SELECT
        *
      FROM
        users
      WHERE
        refresh_token = ?
      `,
      [refreshToken]
    );

    // Cookie의 Refresh Token과 동일한 Refresh Token을 가진 사용자가 없을 시 404 Error 반환
    if (result.length === 0) {
      console.log(
        "auth/refresh-access-token > GET() :",
        `${refreshToken}(와)과 일치하는 사용자가 없습니다.`
      );

      return NextResponse.json(
        { msg: "사용자를 찾지 못했습니다." },
        { status: 404 }
      );
    }

    const [user] = result; // 사용자 정보

    /** 사용자의 Identification로 Access Token 재발급 */
    const accessToken: string = sign(user.identification);

    // Access Token을 반환
    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (err) {
    console.error("auth/refresh-access-token > GET() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
