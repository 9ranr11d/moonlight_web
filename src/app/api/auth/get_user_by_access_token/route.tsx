import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@models/User";

import { verify } from "../../../../utils/jwtUtils";

interface VerificationResult {
  /** 유효한 Token인지 */
  ok: boolean;
  /** 유효하다면 사용자 Identification 반환 */
  userIdentification?: string;
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
     * 유효할 시 => UserIdentification 반환
     * 유효하지 않을 시 => Error Message 반환
     */
    const result: VerificationResult = verify(accessToken);

    // 유효하지 않을 시 404 Error와 Error Message 반환
    if (!result.ok) return NextResponse.json({ msg: result.msg }, { status: 400 });

    /** 유효할 시, 얻은 userIdentification랑 동일 한 사용자 정보 */
    const user: IIUser | null = await User.findOne({ identification: result.userIdentification });

    // 얻은 userId와 동일한 Identification를 가진 사용자 정보가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    // 찾은 사용자 정보와 Access Token 반환
    return NextResponse.json(
      {
        ...user.toObject(),
        accessToken: accessToken,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Get User By Access Token :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
