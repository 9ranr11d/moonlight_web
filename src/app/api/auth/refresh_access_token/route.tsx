import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IUser } from "@models/User";

import { refreshVerify, sign } from "@utils/JwtUtils";

/** Refresh Token으로 Access Token 재발급 */
export async function GET(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    /** Cookie에 저장된 Refresh Token 정보 */
    const refreshToken: string | undefined = req.cookies.get("refreshToken")?.value;

    // Refresh Token이 없으면 404 Error 반환
    if (!refreshToken) return NextResponse.json({ msg: "Refresh Token Not Founnd" }, { status: 404 });

    // 유효한 Refresh Token가 아닐 시 400 Error 반환
    if (!refreshVerify(refreshToken)) return NextResponse.json({ msg: "Invalid Refresh Token" }, { status: 400 });

    /** 유효할 시, Cookie의 Refresh Token과 동일한 refresh Token을 가진 사용자 정보 */
    const user: IUser | null = await User.findOne({ refreshToken });

    // Cookie의 Refresh Token과 동일한 Refresh Token을 가진 사용자가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    /** 사용자의 id로 Access Token 재발급 */
    const accessToken: string = sign(user.id);

    // Access Token을 반환
    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (err) {
    console.error("Refresh Access Token GET :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
