import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@models/User";

import { refreshVerify, sign } from "@utils/jwtUtils";

/** Refresh Token으로 Access Token 재발급 */
export async function GET(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    /** Cookie에 저장된 Refresh Token 정보 */
    const refreshToken: string | undefined = req.cookies.get("refreshToken")?.value;

    // Refresh Token이 없으면 404 Error 반환
    if (!refreshToken) return NextResponse.json({ msg: "Refresh Token가 없습니다." }, { status: 404 });

    // 유효한 Refresh Token가 아닐 시 400 Error 반환
    if (!refreshVerify(refreshToken)) return NextResponse.json({ msg: "Refresh Token가 유효하지 않습니다." }, { status: 400 });

    /** 유효할 시, Cookie의 Refresh Token과 동일한 refresh Token을 가진 사용자 정보 */
    const user: IIUser | null = await User.findOne({ refreshToken });

    // Cookie의 Refresh Token과 동일한 Refresh Token을 가진 사용자가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "사용자를 찾지 못했습니다." }, { status: 404 });

    /** 사용자의 Identification로 Access Token 재발급 */
    const accessToken: string = sign(user.identification);

    // Access Token을 반환
    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/auth/refreshAccessToken > GET()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
