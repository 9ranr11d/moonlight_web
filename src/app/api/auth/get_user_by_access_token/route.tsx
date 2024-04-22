import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IUser } from "@models/User";

import { verify } from "@utils/JwtUtils";

interface VerificationResult {
  /** 유효한 Token인지 */
  ok: boolean;
  /** 유효하다면 사용자 Id 반환 */
  userId?: string;
  /** 유효하지만 오류 메세지 반환 */
  msg?: string;
}

/** Access Token으로 사용자 정보 가져오기 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // Access Token
    const { accessToken }: { accessToken: string } = await req.json();

    /**
     * 유효한 Access Token인지 확인:
     * 유효할 시 => userId 반환
     * 유효하지 않을 시 => Error Message 반환
     */
    const result: VerificationResult = verify(accessToken);

    // 유효하지 않을 시 404 Error와 Error Message 반환
    if (!result.ok) return NextResponse.json({ msg: result.msg }, { status: 400 });

    /** 유효할 시, 얻은 userId랑 동일 한 사용자 정보 */
    const user: IUser | null = await User.findOne({ id: result.userId });

    // 얻은 userId와 동일한 id를 가진 사용자 정보가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    // 찾은 사용자 정보와 Access Token 반환
    return NextResponse.json(
      {
        _id: user._id,
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        accessLevel: user.accessLevel,
        accessToken: accessToken,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Get User By Access Token POST :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
